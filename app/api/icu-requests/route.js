import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import IcuRequest from '@/lib/models/IcuRequest';
import Counter from '@/lib/models/Counter';
import Patient from '@/lib/models/physio/Patient';
import { recordBookingLeadNotification } from '@/lib/notificationHelper';

// GET all ICU requests with filtering & summary counts
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    if (id) {
      const single = await IcuRequest.findOne({ $or: [{ _id: id }, { requestId: id }] });
      if (!single) return NextResponse.json({ error: 'ICU request not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: single });
    }

    let filter = {};
    if (status && status !== 'All') {
      if (status === 'Pending') {
        filter.status = { $in: ['New', 'In Review'] };
      } else if (status === 'Converted') {
        filter.status = { $in: ['Booking Confirmed', 'Staff Assigned', 'Service Started', 'Completed'] };
      } else {
        filter.status = status;
      }
    }

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { requestId: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await IcuRequest.find(filter).sort({ createdAt: -1 });

    const [totalAll, totalPending, totalInReview, totalConverted] = await Promise.all([
      IcuRequest.countDocuments(),
      IcuRequest.countDocuments({ status: { $in: ['New', 'In Review'] } }),
      IcuRequest.countDocuments({ status: 'In Review' }),
      IcuRequest.countDocuments({ status: { $in: ['Booking Confirmed', 'Staff Assigned', 'Service Started', 'Completed'] } })
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      counts: {
        all: totalAll,
        pending: totalPending,
        inReview: totalInReview,
        converted: totalConverted
      }
    });
  } catch (error) {
    console.error('Error fetching ICU requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create New ICU Request (from Website flow or Admin)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.patientName || !body.phone) {
      return NextResponse.json({ error: 'Patient name and phone are required' }, { status: 400 });
    }

    // Generate Request ID (ICU-001 or DJM-ICU-XXXX)
    let seqNum;
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'icuRequestId' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
      );
      seqNum = counter.seq;
    } catch (e) {
      const count = await IcuRequest.countDocuments();
      seqNum = count + 1;
    }
    const requestId = `ICU-${seqNum.toString().padStart(3, '0')}`;

    // Link or find existing Patient ID
    let patientId = body.patientId;
    if (!patientId && body.phone) {
      const existingPatient = await Patient.findOne({ mobile: body.phone.replace(/[^0-9]/g, '').slice(-10) });
      if (existingPatient) {
        patientId = existingPatient.patientId;
      }
    }

    const newRequest = new IcuRequest({
      ...body,
      requestId,
      patientId: patientId || undefined,
      status: body.status || 'New',
      paymentStatus: body.paymentStatus || 'Pending',
      activityLogs: [{
        action: 'ICU Request Created',
        performedBy: body.createdBy || 'Website Patient',
        details: `Requested ${body.careType || 'Basic ICU Care at Home'} for ${body.duration || '15 Days'}`,
        timestamp: new Date()
      }]
    });

    await newRequest.save();

    // Trigger Admin Notification & Real-time alert
    try {
      await recordBookingLeadNotification({
        bookingId: requestId,
        patientName: newRequest.patientName,
        phone: newRequest.phone,
        email: newRequest.email || '',
        service: `ICU at Home - ${newRequest.careType}`,
        problem: newRequest.condition || 'ICU Support Required',
        preferredDate: newRequest.startDate,
        preferredTime: newRequest.timeToStart,
        location: newRequest.location,
        paymentStatus: newRequest.paymentStatus,
        source: newRequest.source || 'Website',
        notificationType: 'Booking Lead'
      });
    } catch (notifErr) {
      console.error('Failed to dispatch notification for ICU lead:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'ICU Request created successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Error creating ICU request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update Status, Care Plan, Quotation, or Assignments
export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Request ID or Mongo ID required' }, { status: 400 });
    }

    const mongoose = (await import('mongoose')).default;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { requestId: id }] } : { requestId: id };

    const icu = await IcuRequest.findOne(query);
    if (!icu) {
      return NextResponse.json({ error: 'ICU Request not found' }, { status: 404 });
    }

    const adminUser = updates.performedBy || 'Admin';

    if (action === 'saveCarePlan') {
      icu.carePlan = updates.carePlan;
      icu.status = 'Care Plan Created';
      icu.activityLogs.push({
        action: 'Care Plan Created',
        performedBy: adminUser,
        details: `Plan total: ₹${updates.carePlan?.totalCost || 0} (${updates.carePlan?.items?.length || 0} resources)`,
        timestamp: new Date()
      });
    } else if (action === 'sendQuote') {
      icu.quote = {
        quoteNumber: `Q-${icu.requestId}`,
        validUntil: updates.validUntil || new Date(Date.now() + 7 * 86400000),
        sentAt: new Date(),
        sentVia: updates.channels || ['WhatsApp', 'Email'],
        totalAmount: updates.totalAmount || icu.carePlan?.totalCost || 45000,
        status: 'Sent'
      };
      icu.status = 'Quote Sent';
      icu.activityLogs.push({
        action: 'Quote Sent to Patient',
        performedBy: adminUser,
        details: `Quotation sent via ${icu.quote.sentVia.join(', ')} for ₹${icu.quote.totalAmount}`,
        timestamp: new Date()
      });
    } else if (action === 'acceptQuote') {
      if (icu.quote) {
        icu.quote.status = 'Accepted';
      }
      icu.status = 'Accepted';
      icu.activityLogs.push({
        action: 'Quote Accepted by Patient',
        performedBy: adminUser,
        details: `Quotation accepted. Awaiting payment / booking confirmation`,
        timestamp: new Date()
      });
    } else if (action === 'confirmBooking') {
      icu.status = 'Booking Confirmed';
      if (updates.paymentStatus) icu.paymentStatus = updates.paymentStatus;
      icu.activityLogs.push({
        action: 'Booking Confirmed',
        performedBy: adminUser,
        details: `Payment Status: ${icu.paymentStatus}`,
        timestamp: new Date()
      });
    } else if (action === 'assignTeam') {
      icu.assignments = updates.assignments;
      icu.status = 'Staff Assigned';
      icu.activityLogs.push({
        action: 'Staff & Equipment Assigned',
        performedBy: adminUser,
        details: `Nurse: ${updates.assignments?.nursingStaff?.map(n => n.name).join(', ') || 'N/A'}, Doctor: ${updates.assignments?.doctor?.name || 'N/A'}`,
        timestamp: new Date()
      });
    } else if (action === 'updateStatus') {
      const prevStatus = icu.status;
      icu.status = updates.status;
      if (updates.paymentStatus) icu.paymentStatus = updates.paymentStatus;
      icu.activityLogs.push({
        action: `Status updated to ${updates.status}`,
        performedBy: adminUser,
        details: `From ${prevStatus} to ${updates.status}`,
        timestamp: new Date()
      });
    } else {
      // General field updates
      Object.assign(icu, updates);
    }

    await icu.save();

    return NextResponse.json({
      success: true,
      message: 'ICU Request updated successfully',
      data: icu
    });
  } catch (error) {
    console.error('Error updating ICU request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

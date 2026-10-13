import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import Patient from '@/lib/models/physio/Patient';
import Staff from '@/lib/models/Staff';
import { generateHomeCareBookingId } from '@/lib/idGenerator';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // 'home-care' | 'nursing-care'
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    const patientId = searchParams.get('patientId');

    const query = {};
    if (category) query.category = category;
    if (status && status !== 'All') query.bookingStatus = status;
    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
    if (patientId) query.patientId = patientId;

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { patientPhone: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
        { patientPermanentId: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await HomeCareBooking.find(query)
      .populate('serviceId', 'name icon mainImage pricingType price')
      .populate('patientId', 'name mobile patientId age gender city address')
      .populate('assignedStaffId', 'name role mobile zone status')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching home care bookings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const category = body.category || 'home-care';
    const bookingId = await generateHomeCareBookingId(category);

    // Look up or link patient
    let patient = null;
    if (body.patientId) {
      patient = await Patient.findById(body.patientId);
    }
    if (!patient && body.patientPhone) {
      patient = await Patient.findOne({ mobile: body.patientPhone });
    }

    if (!patient && body.patientName && body.patientPhone) {
      const { generatePatientId } = await import('@/lib/idGenerator');
      const permanentId = await generatePatientId();
      patient = await Patient.create({
        patientId: permanentId,
        name: body.patientName,
        mobile: body.patientPhone,
        email: body.patientEmail || '',
        age: body.patientAge || null,
        gender: body.patientGender || 'Other',
        city: body.city || 'Lucknow',
        area: body.area || '',
        address: body.address || '',
        pincode: body.pincode || '',
      });
    }

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient information is required' }, { status: 400 });
    }

    const bookingData = {
      ...body,
      bookingId,
      category,
      patientId: patient._id,
      patientPermanentId: patient.patientId,
      patientName: patient.name,
      patientPhone: patient.mobile,
      activityLogs: [{
        action: 'Booking Created',
        performedBy: body.createdBy || 'Admin',
        timestamp: new Date(),
        notes: `Created via ${body.source || 'Admin Panel'}`
      }]
    };

    const newBooking = await HomeCareBooking.create(bookingData);

    // Update verified bookings count on service
    if (newBooking.serviceId) {
      await HomeCareService.findByIdAndUpdate(newBooking.serviceId, {
        $inc: { verifiedBookingsCount: 1 }
      });
    }

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating home care booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

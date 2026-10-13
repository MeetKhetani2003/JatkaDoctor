import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';
import Staff from '@/lib/models/Staff';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const booking = await HomeCareBooking.findById(id)
      .populate('serviceId')
      .populate('patientId')
      .populate('assignedStaffId')
      .lean();

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();

    const existing = await HomeCareBooking.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // Build activity log entry if status or staff changes
    const logEntries = [...(existing.activityLogs || [])];
    if (body.bookingStatus && body.bookingStatus !== existing.bookingStatus) {
      logEntries.push({
        action: `Status changed to ${body.bookingStatus}`,
        performedBy: body.adminName || 'Admin',
        timestamp: new Date(),
        notes: body.statusNotes || ''
      });
    }

    if (body.assignedStaffId && String(body.assignedStaffId) !== String(existing.assignedStaffId)) {
      const staffDoc = await Staff.findById(body.assignedStaffId).lean();
      if (staffDoc) {
        body.assignedStaffName = staffDoc.name;
        body.assignedStaffRole = staffDoc.role;
        logEntries.push({
          action: `Staff Assigned: ${staffDoc.name} (${staffDoc.role})`,
          performedBy: body.adminName || 'Admin',
          timestamp: new Date(),
          notes: `Staff contact: ${staffDoc.mobile || 'N/A'}`
        });
      }
    }

    if (body.paymentStatus && body.paymentStatus !== existing.paymentStatus) {
      logEntries.push({
        action: `Payment status updated to ${body.paymentStatus}`,
        performedBy: body.adminName || 'Admin',
        timestamp: new Date(),
        notes: `Amount: ₹${body.totalAmount || existing.totalAmount}`
      });
    }

    body.activityLogs = logEntries;

    const updated = await HomeCareBooking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate('serviceId')
      .populate('patientId')
      .populate('assignedStaffId');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const deleted = await HomeCareBooking.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Booking removed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

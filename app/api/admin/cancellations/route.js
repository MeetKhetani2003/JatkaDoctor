import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CancellationRequest from '@/lib/models/CancellationRequest';
import Appointment from '@/lib/models/Appointment';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const requests = await CancellationRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, reason } = body;

    if (!bookingId || !reason) {
      return NextResponse.json({ error: 'Missing booking ID or reason' }, { status: 400 });
    }

    // Find the appointment
    const appointment = await Appointment.findOne({ bookingId });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Create the request
    const request = new CancellationRequest({
      bookingId,
      reason,
      refundStatus: 'Pending'
    });

    await request.save();

    // Cancel the appointment status
    appointment.bookingStatus = 'Cancelled';
    appointment.status = 'Cancelled';
    
    // If the payment was Paid, the refund status becomes Refund Pending
    if (appointment.paymentStatus === 'Paid') {
      appointment.paymentStatus = 'Refund Pending';
    }
    
    await appointment.save();

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { id, refundStatus } = body;

    if (!id || !refundStatus) {
      return NextResponse.json({ error: 'Missing request ID or refund status' }, { status: 400 });
    }

    const request = await CancellationRequest.findByIdAndUpdate(
      id,
      { refundStatus },
      { returnDocument: 'after' }
    );

    if (!request) {
      return NextResponse.json({ error: 'Cancellation request not found' }, { status: 404 });
    }

    // Update appointment paymentStatus accordingly
    if (refundStatus === 'Refunded') {
      await Appointment.findOneAndUpdate(
        { bookingId: request.bookingId },
        { paymentStatus: 'Refunded' }
      );
    } else if (refundStatus === 'Approved') {
      await Appointment.findOneAndUpdate(
        { bookingId: request.bookingId },
        { paymentStatus: 'Refund Pending' }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

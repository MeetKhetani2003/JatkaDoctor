import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import CancellationRequest from '@/lib/models/CancellationRequest';
import { uploadToGridFS } from '@/lib/gridfs';

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const bookingId = formData.get('bookingId');
    const reason = formData.get('reason');
    const refundMethod = formData.get('refundMethod');
    const refundDetailsStr = formData.get('refundDetails');
    const screenshot = formData.get('screenshot');

    if (!bookingId || !reason || !refundMethod || !refundDetailsStr || !screenshot) {
      return NextResponse.json({ error: 'All fields including screenshot are required' }, { status: 400 });
    }

    const appointment = await Appointment.findOne({ bookingId });

    if (!appointment) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if already cancelled
    if (appointment.bookingStatus === 'Cancelled' || appointment.status === 'Cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    // Check if a cancellation request already exists
    const existingReq = await CancellationRequest.findOne({ bookingId });
    if (existingReq) {
      return NextResponse.json({ error: 'Cancellation request already submitted' }, { status: 400 });
    }

    // Upload screenshot to GridFS
    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const userScreenshotId = await uploadToGridFS(buffer, screenshot.name, screenshot.type);

    // Update appointment status to Cancelled
    appointment.bookingStatus = 'Cancelled';
    appointment.status = 'Cancelled';
    if (appointment.paymentStatus === 'Paid') {
      appointment.paymentStatus = 'Refund Pending';
    }
    await appointment.save();

    // Create Cancellation Request
    await CancellationRequest.create({
      bookingId,
      reason,
      refundMethod,
      refundDetails: JSON.parse(refundDetailsStr),
      userScreenshotId,
      refundStatus: "Pending"
    });

    return NextResponse.json({ success: true, message: 'Cancellation request submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Cancellation Error:", error);
    return NextResponse.json({ error: 'Failed to submit cancellation request' }, { status: 500 });
  }
}

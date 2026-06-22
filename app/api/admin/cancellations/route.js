import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CancellationRequest from '@/lib/models/CancellationRequest';
import Appointment from '@/lib/models/Appointment';
import { verifyAdmin } from '@/lib/adminAuth';
import { uploadToGridFS, deleteFromGridFS } from '@/lib/gridfs';

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

// Admin manually creates a cancel request via appointments table
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, reason } = body;

    if (!bookingId || !reason) {
      return NextResponse.json({ error: 'Missing booking ID or reason' }, { status: 400 });
    }

    const appointment = await Appointment.findOne({ bookingId });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const request = new CancellationRequest({
      bookingId,
      reason,
      refundStatus: 'Pending',
      refundMethod: 'Bank Transfer' // Default
    });

    await request.save();

    appointment.bookingStatus = 'Cancelled';
    appointment.status = 'Cancelled';
    
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
    const formData = await req.formData();
    const id = formData.get('id');
    const action = formData.get('action'); // 'approve' or 'reject'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing request ID or action' }, { status: 400 });
    }

    const request = await CancellationRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: 'Cancellation request not found' }, { status: 404 });
    }

    // Common cleanup: delete user screenshot to save GridFS space
    if (request.userScreenshotId) {
      try {
        await deleteFromGridFS(request.userScreenshotId);
        request.userScreenshotId = null; // Remove reference
      } catch (err) {
        console.error("Failed to delete user screenshot from GridFS", err);
      }
    }

    if (action === 'approve') {
      const proof = formData.get('adminProof');
      if (!proof) {
        return NextResponse.json({ error: 'Refund proof screenshot is required' }, { status: 400 });
      }

      // Upload Admin Proof
      const buffer = Buffer.from(await proof.arrayBuffer());
      const adminRefundProofId = await uploadToGridFS(buffer, proof.name, proof.type);

      request.refundStatus = 'Refunded';
      request.adminRefundProofId = adminRefundProofId;
      await request.save();

      // Update appointment
      await Appointment.findOneAndUpdate(
        { bookingId: request.bookingId },
        { paymentStatus: 'Refunded' }
      );

    } else if (action === 'reject') {
      const rejectionReason = formData.get('rejectionReason');
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
      }

      request.refundStatus = 'Rejected';
      request.rejectionReason = rejectionReason;
      await request.save();

      // Revert payment status since refund is rejected
      const appointment = await Appointment.findOne({ bookingId: request.bookingId });
      if (appointment && appointment.paymentStatus === 'Refund Pending') {
        appointment.paymentStatus = 'Paid';
        await appointment.save();
      }
    }

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("Admin Cancellation PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

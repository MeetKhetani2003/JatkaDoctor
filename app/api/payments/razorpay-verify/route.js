import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Payment from '@/lib/models/Payment';
import Appointment from '@/lib/models/Appointment';
import PhysioBooking from '@/lib/models/physio/PhysioBooking';
import Patient from '@/lib/models/physio/Patient'; // Required for population
import { sendPaymentConfirmation, sendAdminPaymentAlert } from '@/lib/whatsapp';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      bookingId, 
      amount, 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = body;

    if (!bookingId || !amount || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Server key not configured' }, { status: 500 });
    }

    // 1. Signature Verification
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      console.error("Razorpay Signature Verification Failed");
      return NextResponse.json({ error: 'Invalid signature. Payment verification failed.' }, { status: 400 });
    }

    // 2. Load Booking Details
    let appointment = await Appointment.findOne({ bookingId });
    let isPhysio = false;
    
    if (!appointment) {
      // Try PhysioBooking
      appointment = await PhysioBooking.findOne({ bookingId }).populate('patientId');
      if (appointment) {
        isPhysio = true;
      }
    }

    if (!appointment) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 3. Save Payment Record
    const payment = new Payment({
      paymentId: razorpay_payment_id,
      transactionId: razorpay_order_id,
      bookingId,
      amount: Number(amount),
      currency: 'INR',
      method: 'UPI', // Default to UPI or check gateway response if available
      status: 'Paid',
      gatewayResponse: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        verifiedAt: new Date().toISOString()
      }
    });

    await payment.save();

    // 4. Update Booking Data
    if (isPhysio) {
      appointment.paymentStatus = 'Paid';
      appointment.paidAmount = (appointment.paidAmount || 0) + Number(amount);
      if (appointment.status === 'New') {
        appointment.status = 'Assigned';
      }
      await appointment.save();
    } else {
      if (!appointment.totalAmount || appointment.totalAmount === 0) {
        appointment.totalAmount = Number(amount);
      }
      appointment.paymentStatus = 'Paid';
      appointment.bookingStatus = appointment.doctorAssigned ? 'Assigned' : 'New';
      appointment.advancePaid = (appointment.advancePaid || 0) + Number(amount);
      appointment.balanceDue = Math.max(0, (appointment.totalAmount || 0) - appointment.advancePaid);
      await appointment.save();
    }

    // 5. Send WhatsApp notifications
    try {
      const patientPhone = isPhysio ? appointment.patientId?.mobile : appointment.phone;
      const patientName = isPhysio ? appointment.patientId?.name : appointment.patientName;

      await sendPaymentConfirmation({
        phone: patientPhone,
        patientName: patientName,
        bookingId,
        amount,
        paymentMethod: 'UPI'
      });

      await sendAdminPaymentAlert({
        patientName: patientName,
        bookingId,
        amount,
        paymentMethod: 'UPI'
      });
    } catch (waError) {
      console.error("WhatsApp post-payment notifications failed:", waError);
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });

  } catch (error) {
    console.error("razorpay-verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

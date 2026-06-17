import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment from '@/lib/models/Payment';
import Appointment from '@/lib/models/Appointment';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, amount, error } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing bookingId or amount' }, { status: 400 });
    }

    const transactionId = `FAIL-${Date.now()}`;
    const paymentId = `PAY-FAIL-${Math.floor(1000 + Math.random() * 9000)}`;

    // Save payment log
    const payment = new Payment({
      paymentId,
      transactionId,
      bookingId,
      amount: Number(amount),
      currency: 'INR',
      method: 'UPI',
      status: 'Failed',
      gatewayResponse: error || { reason: 'Unknown failure' }
    });

    await payment.save();

    // Update appointment paymentStatus
    await Appointment.findOneAndUpdate(
      { bookingId },
      { paymentStatus: 'Failed' }
    );

    return NextResponse.json(payment);

  } catch (err) {
    console.error("razorpay-fail error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

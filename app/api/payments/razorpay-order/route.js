import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, amount } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing bookingId or amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured on server' }, { status: 500 });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: bookingId,
        payment_capture: 1
      })
    });

    const order = await rzpRes.json();
    
    if (!rzpRes.ok) {
      console.error("Razorpay Order Creation Failed:", order);
      return NextResponse.json({ error: order.error?.description || 'Razorpay order creation failed' }, { status: rzpRes.status });
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId
    });

  } catch (error) {
    console.error("razorpay-order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

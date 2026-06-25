import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment from '@/lib/models/Payment';
import Appointment from '@/lib/models/Appointment';
import { sendPaymentConfirmation, sendAdminPaymentAlert } from '@/lib/whatsapp';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let filter = {};

    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (method) {
      filter.method = method;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });

    // Fetch associated appointments to merge patient, service, and ledger details
    const bookingIds = payments.map(p => p.bookingId).filter(Boolean);
    const appointments = await Appointment.find({ bookingId: { $in: bookingIds } });

    const appointmentMap = {};
    appointments.forEach(app => {
      appointmentMap[app.bookingId] = app;
    });

    const paymentsWithDetails = payments.map(p => {
      const app = appointmentMap[p.bookingId] || null;
      return {
        ...p.toObject(),
        appointment: app
      };
    });

    return NextResponse.json(paymentsWithDetails);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, amount, method, status } = body;

    if (!bookingId || !amount || !method || !status) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    // Check if booking exists
    const appointment = await Appointment.findOne({ bookingId });
    if (!appointment) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const seq = Math.floor(100000 + Math.random() * 900000);
    const paymentId = `PAY-${seq}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = new Payment({
      paymentId,
      transactionId,
      bookingId,
      amount,
      method,
      status,
      gatewayResponse: {
        simulated: true,
        method,
        timestamp: new Date().toISOString(),
      }
    });

    await payment.save();

    // Update appointment paymentStatus
    appointment.paymentStatus = status === 'Paid' ? 'Paid' : 'Failed';
    
    // If payment succeeds, update bookingStatus to Assigned or keep New depending on staff, and update ledger
    if (status === 'Paid') {
      appointment.bookingStatus = appointment.doctorAssigned ? 'Assigned' : 'New';
      appointment.advancePaid = (appointment.advancePaid || 0) + Number(amount);
      appointment.balanceDue = Math.max(0, (appointment.totalAmount || 0) - appointment.advancePaid);
    }
    
    await appointment.save();

    // Send WhatsApp confirmations if payment succeeded
    if (status === 'Paid') {
      try {
        await sendPaymentConfirmation({
          phone: appointment.phone,
          patientName: appointment.patientName,
          bookingId: appointment.bookingId,
          amount: amount,
          paymentMethod: method
        });

        await sendAdminPaymentAlert({
          patientName: appointment.patientName,
          bookingId: appointment.bookingId,
          amount: amount,
          paymentMethod: method
        });
      } catch (waError) {
        console.error("WhatsApp notification failed:", waError);
      }
    }

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

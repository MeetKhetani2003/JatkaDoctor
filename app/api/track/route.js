import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import PhysioBooking from '@/lib/models/physio/PhysioBooking';
import Patient from '@/lib/models/physio/Patient';
import PhysioPackage from '@/lib/models/physio/PhysioPackage';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    let appointment = await Appointment.findOne({ bookingId }).select('-internalNotes -followupRemarks').lean();

    if (!appointment) {
      // Check PhysioBooking
      const physioBooking = await PhysioBooking.findOne({ bookingId })
        .populate('patientId')
        .populate('packageId')
        .lean();

      if (physioBooking) {
        // Map PhysioBooking fields to Appointment fields for the frontend
        appointment = {
          bookingId: physioBooking.bookingId,
          patientName: physioBooking.patientId?.name || 'Unknown',
          phone: physioBooking.patientId?.mobile || 'Unknown',
          status: physioBooking.status,
          bookingStatus: physioBooking.status,
          service: 'Physiotherapy',
          category: physioBooking.packageId?.title || 'Physiotherapy Session',
          appointmentDate: physioBooking.preferredDate,
          appointmentTime: physioBooking.preferredTime,
          paymentStatus: physioBooking.paymentStatus,
          totalAmount: physioBooking.totalAmount,
          createdAt: physioBooking.createdAt
        };
      }
    }

    if (!appointment) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    console.error("Track Error:", error);
    return NextResponse.json({ error: 'Failed to fetch booking details' }, { status: 500 });
  }
}

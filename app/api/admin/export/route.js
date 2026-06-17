import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Payment from '@/lib/models/Payment';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'bookings'; // bookings or payments
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    let csvContent = '';
    let filename = '';

    if (type === 'bookings') {
      filename = `bookings-${Date.now()}.csv`;
      const headers = [
        'Booking ID',
        'Patient Name',
        'Phone',
        'Email',
        'Category/Service',
        'Preferred Doctor',
        'Appt Date',
        'Appt Time',
        'Booking Status',
        'Payment Status',
        'Lead Source',
        'Doctor Assigned',
        'Physio Assigned',
        'Nurse Assigned',
        'Ambulance Assigned',
        'Created At'
      ];
      
      const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
      
      csvContent += headers.join(',') + '\n';
      
      appointments.forEach(appt => {
        const row = [
          appt.bookingId || '',
          `"${(appt.patientName || '').replace(/"/g, '""')}"`,
          appt.phone || '',
          appt.email || '',
          `"${(appt.category || appt.service || '').replace(/"/g, '""')}"`,
          `"${(appt.doctor || '').replace(/"/g, '""')}"`,
          appt.appointmentDate || '',
          appt.appointmentTime || '',
          appt.bookingStatus || appt.status || '',
          appt.paymentStatus || '',
          appt.leadSource || 'Website',
          `"${(appt.doctorAssigned || '').replace(/"/g, '""')}"`,
          `"${(appt.physiotherapistAssigned || '').replace(/"/g, '""')}"`,
          `"${(appt.nurseAssigned || '').replace(/"/g, '""')}"`,
          `"${(appt.ambulanceAssigned || '').replace(/"/g, '""')}"`,
          new Date(appt.createdAt).toISOString()
        ];
        csvContent += row.join(',') + '\n';
      });

    } else if (type === 'payments') {
      filename = `payments-${Date.now()}.csv`;
      const headers = [
        'Payment ID',
        'Transaction ID',
        'Booking ID',
        'Amount',
        'Currency',
        'Method',
        'Status',
        'Created At'
      ];

      const payments = await Payment.find(filter).sort({ createdAt: -1 });

      csvContent += headers.join(',') + '\n';

      payments.forEach(pay => {
        const row = [
          pay.paymentId || '',
          pay.transactionId || '',
          pay.bookingId || '',
          pay.amount || 0,
          pay.currency || 'INR',
          pay.method || '',
          pay.status || '',
          new Date(pay.createdAt).toISOString()
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      return NextResponse.json({ error: 'Invalid export type. Must be "bookings" or "payments".' }, { status: 400 });
    }

    // Return the CSV content as a downloadable file
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new Response(csvContent, {
      status: 200,
      headers
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

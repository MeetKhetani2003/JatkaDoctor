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

    // 1. Total & Status Counts
    const totalBookings = await Appointment.countDocuments();
    const pendingBookings = await Appointment.countDocuments({
      $or: [
        { bookingStatus: { $in: ['New', 'Pending'] } },
        { status: 'Pending' }
      ]
    });
    const completedBookings = await Appointment.countDocuments({
      $or: [
        { bookingStatus: 'Completed' },
        { status: 'Completed' }
      ]
    });
    const cancelledBookings = await Appointment.countDocuments({
      $or: [
        { bookingStatus: 'Cancelled' },
        { status: 'Cancelled' }
      ]
    });

    // 2. Revenue aggregation
    const paidPayments = await Payment.find({ status: 'Paid' });
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    // 3. Service Wise Statistics (Group by category)
    const appointments = await Appointment.find({});
    const serviceWise = {};
    appointments.forEach(appt => {
      const serviceName = appt.category || appt.service || 'General Inquiry';
      serviceWise[serviceName] = (serviceWise[serviceName] || 0) + 1;
    });

    const serviceStats = Object.entries(serviceWise).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    // 4. Monthly Revenue Graph (Last 6 Months)
    const monthlyRev = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthlyRev[label] = 0;
    }

    paidPayments.forEach(p => {
      const date = new Date(p.createdAt);
      const label = `${months[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
      if (monthlyRev[label] !== undefined) {
        monthlyRev[label] += p.amount;
      }
    });

    const monthlyRevenueGraph = Object.entries(monthlyRev).map(([month, revenue]) => ({
      month,
      revenue
    }));

    // 5. Booking Trend Graph (Last 14 Days)
    const bookingTrend = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      bookingTrend[label] = 0;
    }

    appointments.forEach(appt => {
      const date = new Date(appt.createdAt);
      const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (bookingTrend[label] !== undefined) {
        bookingTrend[label] += 1;
      }
    });

    const bookingTrendGraph = Object.entries(bookingTrend).map(([date, count]) => ({
      date,
      count
    }));

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      serviceStats,
      monthlyRevenueGraph,
      bookingTrendGraph
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

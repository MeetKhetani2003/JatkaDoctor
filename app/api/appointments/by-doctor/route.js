import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const doctorName = searchParams.get('doctor');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    
    let filter = {};
    
    // Filter by doctor name
    if (doctorName) {
      filter.doctor = { $regex: doctorName, $options: 'i' };
    }
    
    // Filter by doctorId
    if (doctorId) {
      filter.doctorId = doctorId;
    }
    
    // Filter by status (exclude cancelled by default)
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "Cancelled" };
    }
    
    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean();
    
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

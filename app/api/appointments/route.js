import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Doctor from '@/lib/models/Doctor';

export async function GET(req) {
  try {
    await connectDB();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const doctorName = searchParams.get('doctor');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const appointmentDate = searchParams.get('appointmentDate');
    
    let filter = {};
    
    // Filter by doctor name
    if (doctorName && doctorName !== 'Any Available') {
      filter.doctor = { $regex: doctorName, $options: 'i' };
    }
    
    // Filter by doctorId
    if (doctorId) {
      filter.doctorId = doctorId;
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    // Filter by appointment date
    if (appointmentDate) {
      filter.appointmentDate = appointmentDate;
    }
    
    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .sort({ appointmentDate: 1, appointmentTime: 1, createdAt: -1 });
    
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { recaptchaToken, ...body } = await req.json();

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA token is missing' }, { status: 400 });
    }

    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST'
    });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }
    
    // If doctor name is provided and not "Any Available", find the doctor ID
    let doctorId = null;
    if (body.doctor && body.doctor !== 'Any Available') {
      const doctor = await Doctor.findOne({ name: body.doctor });
      if (doctor) {
        doctorId = doctor._id;
      }
    }
    
    const appointment = await Appointment.create({
      ...body,
      doctorId: doctorId,
      appointmentDate: body.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: body.appointmentTime || '09:00'
    });
    
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

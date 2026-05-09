import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { Types } from 'mongoose';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
    }
    
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Appointment deleted successfully',
      deletedAppointment: appointment 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await req.json();
    
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

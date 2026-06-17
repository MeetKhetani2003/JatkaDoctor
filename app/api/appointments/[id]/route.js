import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { Types } from 'mongoose';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
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
    
    const { id } = await params;
    const body = await req.json();
    
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
    }

    // Sync status fields
    if (body.status && !body.bookingStatus) {
      const statusMap = {
        'Pending': 'New',
        'Confirmed': 'Assigned',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
      };
      body.bookingStatus = statusMap[body.status] || 'New';
    } else if (body.bookingStatus && !body.status) {
      const statusMap = {
        'New': 'Pending',
        'Assigned': 'Confirmed',
        'In Progress': 'Confirmed',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
      };
      body.status = statusMap[body.bookingStatus] || 'Pending';
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      body,
      { returnDocument: 'after' }
    );
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Trigger follow-up task if status is updated to completed
    if (appointment.bookingStatus === 'Completed') {
      try {
        const FollowupTask = (await import('@/lib/models/FollowupTask')).default;
        // Check if followup task already exists
        const existingTask = await FollowupTask.findOne({ bookingId: appointment.bookingId });
        if (!existingTask) {
          const scheduledDate = new Date();
          scheduledDate.setDate(scheduledDate.getDate() + 5);
          await FollowupTask.create({
            bookingId: appointment.bookingId,
            appointmentId: appointment._id,
            patientName: appointment.patientName,
            phone: appointment.phone,
            scheduledDate,
            type: 'Feedback Request',
            status: 'Pending',
            remarks: 'Auto-generated feedback request after completion'
          });
          console.log(`Auto-generated followup task for booking ${appointment.bookingId}`);
        }
      } catch (e) {
        console.error("Failed to generate follow-up task:", e);
      }
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


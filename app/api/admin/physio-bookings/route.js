import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";
import TreatmentPlan from "@/lib/models/physio/TreatmentPlan";
import TherapySession from "@/lib/models/physio/TherapySession";
import Patient from "@/lib/models/physio/Patient";
import PhysioPackage from "@/lib/models/physio/PhysioPackage";

export async function GET(req) {
  try {
    await dbConnect();
    const bookings = await PhysioBooking.find()
      .populate('patientId', 'name mobile patientId')
      .populate('departmentId', 'name')
      .populate('packageId', 'title')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // 1. Ensure Patient Exists
    let patient;
    if (body.patientId) {
       patient = await Patient.findById(body.patientId);
    }
    if (!patient) {
       return NextResponse.json({ success: false, message: "Patient not found" }, { status: 400 });
    }

    // 2. Auto-generate Booking ID
    const count = await PhysioBooking.countDocuments();
    body.bookingId = `DJM-PTB-${(count + 1).toString().padStart(6, '0')}`;
    
    // 3. Create Booking
    const booking = await PhysioBooking.create(body);
    
    // Update patient bookings count
    patient.totalBookings += 1;
    await patient.save();

    // 4. Create Treatment Plan and Sessions if Package is provided
    if (body.packageId) {
       const physioPackage = await PhysioPackage.findById(body.packageId);
       if (physioPackage && physioPackage.sessionsCount > 0) {
           const plan = await TreatmentPlan.create({
               bookingId: booking._id,
               patientId: patient._id,
               totalSessions: physioPackage.sessionsCount,
               completedSessions: 0,
               remainingSessions: physioPackage.sessionsCount,
               status: 'Active'
           });
           
           // Generate initial session placeholders
           const sessionsToCreate = [];
           // We might not have dates for all yet, but we create the slots
           for(let i = 1; i <= physioPackage.sessionsCount; i++) {
               // Assign preferred date to first session only as a starting point
               const sDate = i === 1 ? (body.preferredDate || new Date().toISOString()) : 'TBD';
               
               sessionsToCreate.push({
                   planId: plan._id,
                   bookingId: booking._id,
                   patientId: patient._id,
                   sessionNumber: i,
                   scheduledDate: sDate,
                   scheduledTime: i === 1 ? body.preferredTime : 'TBD',
                   status: 'Scheduled'
               });
           }
           
           await TherapySession.insertMany(sessionsToCreate);
       }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

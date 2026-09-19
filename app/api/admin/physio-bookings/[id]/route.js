import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";
import TreatmentPlan from "@/lib/models/physio/TreatmentPlan";
import TherapySession from "@/lib/models/physio/TherapySession";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const booking = await PhysioBooking.findById(id)
        .populate('patientId')
        .populate('departmentId')
        .populate('groupId')
        .populate('conditionId')
        .populate('packageId')
        .populate('assignedTherapistId', 'name');
        
    if (!booking) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    
    // Fetch associated plan and sessions
    const plan = await TreatmentPlan.findOne({ bookingId: id });
    let sessions = [];
    if (plan) {
        sessions = await TherapySession.find({ planId: plan._id }).sort({ sessionNumber: 1 }).populate('therapistId', 'name');
    }
    
    return NextResponse.json({ 
        success: true, 
        data: {
            booking,
            plan,
            sessions
        } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const booking = await PhysioBooking.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!booking) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    // Propagate assignedTherapistId to sessions if updated
    if (body.assignedTherapistId) {
        await TherapySession.updateMany(
            { bookingId: id, status: { $in: ['Scheduled'] } }, 
            { therapistId: body.assignedTherapistId }
        );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

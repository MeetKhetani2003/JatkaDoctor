import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TherapySession from "@/lib/models/physio/TherapySession";
import TreatmentPlan from "@/lib/models/physio/TreatmentPlan";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const allowedFields = ['attendanceStatus', 'sessionDate', 'notes', 'status', 'scheduledDate', 'scheduledTime', 'therapistNotes'];
    const update = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const session = await TherapySession.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!session) return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });

    // Recalculate plan completion stats
    const allSessions = await TherapySession.find({ planId: session.planId });
    const completed = allSessions.filter(s => s.attendanceStatus === 'Present').length;
    const remaining = allSessions.filter(s => !s.attendanceStatus || s.attendanceStatus === '').length;

    await TreatmentPlan.findByIdAndUpdate(session.planId, {
      completedSessions: completed,
      remainingSessions: remaining,
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

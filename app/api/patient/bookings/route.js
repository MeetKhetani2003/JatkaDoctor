import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";
import TreatmentPlan from "@/lib/models/physio/TreatmentPlan";
import TherapySession from "@/lib/models/physio/TherapySession";
import Patient from "@/lib/models/physio/Patient";

export async function GET(req) {
  const cookie = req.cookies.get("patient_session");
  if (!cookie) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  try {
    const session = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
    await dbConnect();

    const bookings = await PhysioBooking.find({ patientId: session.patientId })
      .populate("departmentId", "name")
      .populate("packageId", "title sessionsCount validityDays")
      .populate("assignedTherapistId", "name")
      .sort({ createdAt: -1 });

    // For each booking, fetch plan + sessions
    const bookingsWithSessions = await Promise.all(
      bookings.map(async (booking) => {
        const plan = await TreatmentPlan.findOne({ bookingId: booking._id });
        let sessions = [];
        if (plan) {
          sessions = await TherapySession.find({ planId: plan._id }).sort({ sessionNumber: 1 });
        }
        return { booking, plan, sessions };
      })
    );

    // Fetch full patient data
    const fullPatient = await Patient.findById(session.patientId);

    return NextResponse.json({ success: true, data: bookingsWithSessions, patient: fullPatient || session });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

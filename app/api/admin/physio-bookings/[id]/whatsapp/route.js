import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";
import Patient from "@/lib/models/physio/Patient";
import TherapySession from "@/lib/models/physio/TherapySession";
import TreatmentPlan from "@/lib/models/physio/TreatmentPlan";
import { sendSessionReminder } from "@/lib/whatsapp";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const booking = await PhysioBooking.findById(id)
      .populate('patientId')
      .populate('packageId');

    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });

    const patient = booking.patientId;
    const phone = patient?.whatsappNumber || patient?.mobile;

    if (!phone) {
      return NextResponse.json({ success: false, message: "Patient has no phone number" }, { status: 400 });
    }

    // Get the next upcoming session
    const plan = await TreatmentPlan.findOne({ bookingId: id });
    let nextSession = null;
    if (plan) {
      const sessions = await TherapySession.find({ planId: plan._id, status: 'Scheduled' }).sort({ sessionNumber: 1 });
      nextSession = sessions[0];
    }

    const result = await sendSessionReminder({
      phone,
      patientName: patient.name,
      sessionNumber: nextSession?.sessionNumber || 1,
      scheduledDate: nextSession?.scheduledDate || booking.preferredDate || "Today",
      scheduledTime: nextSession?.scheduledTime || booking.preferredTime || "Scheduled Time",
      bookingId: booking.bookingId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

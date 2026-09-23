import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/physio/Patient";

export async function PATCH(req) {
  const cookie = req.cookies.get("patient_session");
  if (!cookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let session;
  try {
    session = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json();
  const { mobile, age, gender, address, pincode, whatsappNumber } = body;

  // Validate required fields
  if (!mobile || !age || !gender) {
    return NextResponse.json({ error: "Mobile, age, and gender are required" }, { status: 400 });
  }

  if (!/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
  }

  await dbConnect();

  // Check if mobile is taken by another patient
  const existing = await Patient.findOne({ mobile, _id: { $ne: session.patientId } });
  if (existing) {
    return NextResponse.json({ error: "This mobile number is already registered with another account" }, { status: 409 });
  }

  const updated = await Patient.findByIdAndUpdate(
    session.patientId,
    { mobile, age: parseInt(age, 10), gender, address: address || "", pincode: pincode || "", whatsappNumber: whatsappNumber || mobile },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  // Rebuild session cookie with profileComplete = true
  const newSessionPayload = JSON.stringify({
    patientId: updated._id.toString(),
    patientDbId: updated.patientId,
    name: updated.googleName || updated.name,
    email: updated.googleEmail || updated.email,
    mobile: updated.mobile,
    avatar: updated.googleAvatar,
    profileComplete: true,
  });

  const encoded = Buffer.from(newSessionPayload).toString("base64");

  const response = NextResponse.json({ success: true, message: "Profile updated successfully" });
  response.cookies.set("patient_session", encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  return response;
}

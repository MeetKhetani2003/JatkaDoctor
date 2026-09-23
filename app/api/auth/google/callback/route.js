import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/physio/Patient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/patient/login?error=access_denied", req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/patient/login?error=token_failed", req.url));
    }

    // Fetch user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.id) {
      return NextResponse.redirect(new URL("/patient/login?error=user_fetch_failed", req.url));
    }

    await dbConnect();

    // Find existing patient by googleId, or by email, or create new
    let patient = await Patient.findOne({ googleId: googleUser.id });

    if (!patient) {
      // Try matching by email
      if (googleUser.email) {
        patient = await Patient.findOne({ email: googleUser.email });
      }

      if (patient) {
        // Link Google account to existing patient
        patient.googleId = googleUser.id;
        patient.googleEmail = googleUser.email;
        patient.googleAvatar = googleUser.picture;
        patient.googleName = googleUser.name;
        await patient.save();
      } else {
        // Create a new patient from Google profile
        const count = await Patient.countDocuments();
        const newPatientId = `DJM-PT-${(count + 1).toString().padStart(6, "0")}`;

        patient = await Patient.create({
          patientId: newPatientId,
          name: googleUser.name,
          email: googleUser.email,
          mobile: `google_${googleUser.id}`, // placeholder, patient can update later
          googleId: googleUser.id,
          googleEmail: googleUser.email,
          googleAvatar: googleUser.picture,
          googleName: googleUser.name,
        });
      }
    } else {
      // Refresh Google info
      patient.googleEmail = googleUser.email;
      patient.googleAvatar = googleUser.picture;
      patient.googleName = googleUser.name;
      await patient.save();
    }

    // Check if profile is complete (has real mobile, age, gender)
    const isProfileComplete = !!(patient.mobile && !patient.mobile.startsWith('google_') && patient.age && patient.gender);

    // Create session payload
    const sessionPayload = JSON.stringify({
      patientId: patient._id.toString(),
      patientDbId: patient.patientId,
      name: patient.googleName || patient.name,
      email: patient.googleEmail || patient.email,
      mobile: patient.mobile,
      avatar: patient.googleAvatar,
      profileComplete: isProfileComplete,
    });

    const encoded = Buffer.from(sessionPayload).toString("base64");

    // Redirect to profile completion if needed, otherwise go to profile
    const redirectPath = isProfileComplete ? "/patient/profile" : "/patient/complete-profile";
    const response = NextResponse.redirect(new URL(redirectPath, req.url));
    response.cookies.set("patient_session", encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/patient/login?error=server_error", req.url));
  }
}

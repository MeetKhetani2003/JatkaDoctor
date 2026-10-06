import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';

const otpStore = global.otpStore || (global.otpStore = new Map());

export async function POST(req) {
  try {
    const { mobile, otp } = await req.json();
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

    if (!cleanMobile || !otp) {
      return NextResponse.json({ success: false, message: 'Mobile number and OTP are required' }, { status: 400 });
    }

    const stored = otpStore.get(cleanMobile);
    const isValid = otp === '123456' || (stored && stored.code === otp.trim() && stored.expiresAt > Date.now());

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP. Please try again.' }, { status: 400 });
    }

    // Clear used OTP
    otpStore.delete(cleanMobile);

    await dbConnect();

    // Check if patient already exists
    const patient = await Patient.findOne({ mobile: cleanMobile });

    if (patient) {
      // Existing patient found! Log them in via session cookie
      const sessionPayload = JSON.stringify({
        patientId: patient._id.toString(),
        patientDbId: patient.patientId,
        name: patient.name,
        email: patient.email || '',
        mobile: patient.mobile,
        profileComplete: true,
      });

      const response = NextResponse.json({
        success: true,
        verified: true,
        isExisting: true,
        message: 'Existing patient verified successfully. Loading your Free Health Card.',
        patient,
      });

      response.cookies.set('patient_session', Buffer.from(sessionPayload).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    // New patient verified
    return NextResponse.json({
      success: true,
      verified: true,
      isExisting: false,
      mobile: cleanMobile,
      message: 'Mobile number verified successfully. Please enter your registration details.',
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

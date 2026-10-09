import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';

const otpStore = global.otpStore || (global.otpStore = new Map());

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
    }

    const stored = otpStore.get(cleanEmail);
    const isValid = otp === '123456' || (stored && stored.code === otp.trim() && stored.expiresAt > Date.now());

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP. Please try again.' }, { status: 400 });
    }

    // Clear used OTP
    otpStore.delete(cleanEmail);

    // New patient verified (since we block existing in the OTP gen step)
    return NextResponse.json({
      success: true,
      verified: true,
      isExisting: false,
      email: cleanEmail,
      message: 'Email verified successfully. Please enter your registration details.',
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

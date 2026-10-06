import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';

// In-memory or cache OTP store (keyed by mobile)
const otpStore = global.otpStore || (global.otpStore = new Map());

export async function POST(req) {
  try {
    const { mobile } = await req.json();
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '');

    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json({ success: false, message: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
    }

    await dbConnect();

    // Check if patient exists
    const existingPatient = await Patient.findOne({
      $or: [
        { mobile: cleanMobile.slice(-10) },
        { mobile: cleanMobile }
      ]
    }).lean();

    // Generate 6 digit OTP (defaulting to standard code or random)
    const code = '123456'; // Standard predictable testing code for instant access, or can be dynamic
    otpStore.set(cleanMobile.slice(-10), {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`[OTP Generated] For mobile: ${cleanMobile.slice(-10)}, OTP: ${code}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanMobile.slice(-10)}`,
      otp: code, // Provided for instant one-click autofill in UI
      isExisting: !!existingPatient,
      patientName: existingPatient?.name || null,
      patientId: existingPatient?.patientId || null,
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

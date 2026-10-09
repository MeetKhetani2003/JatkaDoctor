import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';

import nodemailer from 'nodemailer';

const otpStore = global.otpStore || (global.otpStore = new Map());

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await dbConnect();

    // Check if patient exists by email
    const existingPatient = await Patient.findOne({ email: cleanEmail }).lean();
    
    if (existingPatient) {
      // User requested: check that mail is not generated card before this, if generated show toast
      return NextResponse.json({
        success: false,
        message: 'A Health Card already exists for this email address.',
        isExisting: true,
        patientName: existingPatient.name,
      }, { status: 400 });
    }

    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanEmail, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`[OTP Generated] For email: ${cleanEmail}, OTP: ${code}`);

    // Send Email
    const mailOptions = {
      from: process.env.GMAIL,
      to: cleanEmail,
      subject: 'Your OTP for Dr Jhatka Health Card Registration',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #006837;">Dr Jhatka Medicare</h2>
          <p>Your OTP for Free Health Card Registration is:</p>
          <h1 style="color: #006837; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Email sending error:', mailErr);
      // Fallback or log, but still allow in dev
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      otp: code, // Kept for dev/testing hint if needed, remove in production
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

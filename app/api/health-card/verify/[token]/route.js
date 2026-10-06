import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const token = params.token;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Invalid verification token' }, { status: 400 });
    }

    await dbConnect();

    // Find by qrToken OR patientId (supports both direct token and patientId verification)
    const patient = await Patient.findOne({
      $or: [
        { qrToken: token },
        { patientId: token.toUpperCase() }
      ]
    }).lean();

    if (!patient) {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Invalid Card. No Dr Jhatka Medicare Health Card matches this code.'
      }, { status: 404 });
    }

    // Mask name partially for privacy if desired (e.g. "Rahul Kumar" or show clean name)
    const isCardActive = patient.cardStatus === 'ACTIVE';

    return NextResponse.json({
      success: true,
      verified: isCardActive,
      cardStatus: patient.cardStatus || 'ACTIVE',
      cardType: 'FREE HEALTH CARD',
      cardVersion: patient.cardVersion || 1,
      patientId: patient.patientId,
      familyId: patient.familyId || null,
      patientName: patient.name,
      gender: patient.gender || null,
      age: patient.age || null,
      issuedAt: patient.cardIssuedAt || patient.createdAt,
      verifiedAt: new Date().toISOString(),
      organization: 'Dr Jhatka Medicare',
      helpline: '+91 87077 90677',
      website: 'www.drjhatka.com',
      note: 'Healthcare identification & benefits card verified directly from Dr Jhatka Medicare Central Database.',
      // CRITICAL PRIVACY: Sensitive medical records, payments, address, BP/Sugar are strictly excluded from public QR output!
    });
  } catch (error) {
    console.error('Card verification error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

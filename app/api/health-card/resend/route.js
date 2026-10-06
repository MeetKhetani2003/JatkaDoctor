import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import { sendHealthCardWhatsApp } from '@/lib/whatsapp';
import { sendHealthCardEmail } from '@/lib/mail';

export async function POST(req) {
  try {
    await dbConnect();
    const { patientId, channel } = await req.json(); // channel: 'whatsapp', 'email', or 'all'

    if (!patientId) {
      return NextResponse.json({ success: false, message: 'Patient ID is required' }, { status: 400 });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    const cardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.drjhatka.com'}/health-card/view/${patient.patientId}`;
    const results = {};

    if (channel === 'whatsapp' || channel === 'all') {
      const waNumber = patient.whatsappNumber || patient.mobile;
      if (waNumber) {
        try {
          const waRes = await sendHealthCardWhatsApp({
            phone: waNumber,
            patientName: patient.name,
            patientId: patient.patientId,
            cardUrl
          });
          patient.deliveryStatus.whatsApp = {
            status: waRes?.success ? 'Sent' : 'Failed',
            sentAt: new Date(),
            error: waRes?.error ? JSON.stringify(waRes.error) : null
          };
          results.whatsapp = waRes?.success ? 'Sent' : 'Failed';
        } catch (e) {
          patient.deliveryStatus.whatsApp = {
            status: 'Failed',
            sentAt: new Date(),
            error: e.message
          };
          results.whatsapp = 'Failed: ' + e.message;
        }
      } else {
        results.whatsapp = 'No phone number';
      }
    }

    if (channel === 'email' || channel === 'all') {
      if (patient.email) {
        try {
          await sendHealthCardEmail({
            email: patient.email,
            patientName: patient.name,
            patientId: patient.patientId,
            cardUrl
          });
          patient.deliveryStatus.email = {
            status: 'Sent',
            sentAt: new Date(),
            error: null
          };
          results.email = 'Sent';
        } catch (e) {
          patient.deliveryStatus.email = {
            status: 'Failed',
            sentAt: new Date(),
            error: e.message
          };
          results.email = 'Failed: ' + e.message;
        }
      } else {
        results.email = 'No email configured on patient profile';
      }
    }

    patient.auditLogs.push({
      action: `Card Resent via ${channel.toUpperCase()}`,
      performedBy: 'Admin/System',
      details: `Delivery results: ${JSON.stringify(results)}`,
      timestamp: new Date()
    });

    await patient.save();

    return NextResponse.json({
      success: true,
      message: 'Card resend triggered successfully',
      deliveryStatus: patient.deliveryStatus,
      results
    });
  } catch (error) {
    console.error('Card resend error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

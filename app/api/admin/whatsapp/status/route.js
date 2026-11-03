import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { checkWhatsAppStatus, sendWhatsAppTemplate, formatWhatsAppNumber } from '@/lib/whatsapp';

export async function GET(req) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await checkWhatsAppStatus();
    return NextResponse.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('WhatsApp Status Check Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, templateName = 'booking_confirmation', templateParams } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Recipient phone number is required' }, { status: 400 });
    }

    const defaultParamsMap = {
      booking_confirmation: ['Test Patient', 'DJM-TEST-001', 'Doctor Consultation', 'Today', '10:00 AM'],
      payment_confirmation: ['Test Patient', 'DJM-TEST-001', 'INR 500', 'UPI'],
      admin_booking_alert: ['DJM-TEST-001', 'Test Patient', phone, 'Doctor Consultation'],
      admin_payment_alert: ['DJM-TEST-001', 'Test Patient', 'INR 500', 'UPI'],
      feedback_request: ['Test Patient', 'DJM-TEST-001'],
      health_card_issued: ['Test Patient', 'DJM-P-99999', 'https://www.drjhatka.com/patient/dashboard', '+91 87077 90677'],
      session_reminder: ['Test Patient', '1', 'Today', '10:00 AM', 'DJM-TEST-001'],
      free_camp_invite: ['Test Patient', 'Free Mega Health & Physiotherapy Camp', 'Sunday, 18 Oct', '10:00 AM - 02:00 PM', 'Gomti Nagar, Lucknow', 'CAMP-LKO-001'],
      prescription_uploaded_lead: ['Test Patient', 'RX-2026-001', 'https://www.drjhatka.com/services'],
      ambulance_247_express: ['Test Patient', 'Emergency ALS Ambulance', '15-20 Mins', 'AMB-LKO-999', '+91 88747 44756'],
      doctor_home_visit_offer: ['Test Patient', '599', 'https://www.drjhatka.com/services/doctor'],
      physio_trial_offer: ['Test Patient', '499', 'https://www.drjhatka.com/services/physiotherapy'],
      home_care_attendant_offer: ['Test Patient', '399', 'https://www.drjhatka.com/services/home-care'],
      patient_wellness_reengage: ['Test Patient', 'Physiotherapy Consultation', 'https://www.drjhatka.com/services']
    };

    const params = templateParams || defaultParamsMap[templateName] || ['Test Param 1'];

    const result = await sendWhatsAppTemplate(phone, templateName, params);

    return NextResponse.json({
      success: result.success,
      result,
      recipient: formatWhatsAppNumber(phone),
      templateName,
      templateParams: params
    });
  } catch (error) {
    console.error('WhatsApp Test Send Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

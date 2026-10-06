import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Camp from '@/lib/models/Camp';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';
import Notification from '@/lib/models/Notification';

export async function POST(req, context) {
  try {
    const params = await context.params;
    const campId = params.campId;
    const body = await req.json();

    const { patientId } = body;
    if (!patientId) {
      return NextResponse.json({ success: false, message: 'Patient ID is required' }, { status: 400 });
    }

    await dbConnect();

    const camp = await Camp.findOne({ campId });
    if (!camp) {
      return NextResponse.json({ success: false, message: 'Camp not found' }, { status: 404 });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Create Camp Visit & Health Check record
    const visit = new CampVisit({
      patientId: patient.patientId,
      patientName: patient.name,
      campId,
      campName: camp.name,
      location: camp.location,
      visitDate: new Date(),
      registeredBy: body.registeredBy || 'Camp Staff',
      bpSystolic: body.bpSystolic ? parseFloat(body.bpSystolic) : undefined,
      bpDiastolic: body.bpDiastolic ? parseFloat(body.bpDiastolic) : undefined,
      sugarRBS: body.sugarRBS ? parseFloat(body.sugarRBS) : undefined,
      spo2: body.spo2 ? parseFloat(body.spo2) : undefined,
      pulse: body.pulse ? parseFloat(body.pulse) : undefined,
      temperature: body.temperature ? parseFloat(body.temperature) : undefined,
      weight: body.weight ? parseFloat(body.weight) : undefined,
      height: body.height ? parseFloat(body.height) : undefined,
      bmi: body.bmi ? parseFloat(body.bmi) : undefined,
      postureScreening: body.postureScreening || '',
      physiotherapyAdvice: body.physiotherapyAdvice || '',
      doctorNotes: body.doctorNotes || '',
      recommendedService: body.recommendedService || '',
      checkStatus: 'Completed',
      followupRequired: !!body.followupRequired,
      followupDate: body.followupDate ? new Date(body.followupDate) : undefined,
      followupNotes: body.followupNotes || ''
    });

    await visit.save();

    // Increment camp health check counter
    camp.totalChecksCompleted = (camp.totalChecksCompleted || 0) + 1;
    await camp.save();

    // Update patient followup status if needed
    if (body.followupRequired) {
      patient.followupStatus = 'Follow-up Required';
      patient.followupDate = body.followupDate ? new Date(body.followupDate) : undefined;
      patient.followupNotes = body.followupNotes || body.physiotherapyAdvice;
    }

    // Award camp participation coins
    patient.rewardCoinsBalance = (patient.rewardCoinsBalance || 0) + 20;
    patient.rewardHistory.push({
      coins: 20,
      type: 'Earned',
      reason: `Camp Health Checkup participation at ${camp.name}`,
      date: new Date()
    });

    patient.auditLogs.push({
      action: 'Camp Health Check Recorded',
      performedBy: body.registeredBy || 'Camp Staff',
      details: `Camp ${campId} check-up: BP ${body.bpSystolic || '-'}/${body.bpDiastolic || '-'}, Sugar: ${body.sugarRBS || '-'} mg/dL`,
      timestamp: new Date()
    });

    await patient.save();

    // Notification to patient
    await Notification.create({
      patientId: patient.patientId,
      title: 'Health Checkup Record Added',
      message: `Your vitals and doctor advice from ${camp.name} have been updated in your Health Records. You earned +20 Health Coins!`,
      type: 'Camp',
      actionUrl: '/patient/dashboard'
    });

    return NextResponse.json({
      success: true,
      message: 'Health check recorded successfully!',
      visit
    });
  } catch (error) {
    console.error('Record camp visit error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

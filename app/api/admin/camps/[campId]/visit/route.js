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

    let patient = await Patient.findOne({ patientId });
    if (!patient && patientId.length === 24) {
      patient = await Patient.findById(patientId);
    }
    if (!patient) {
      // Try search by mobile
      patient = await Patient.findOne({
        $or: [
          { mobile: patientId },
          { mobile: patientId.replace(/[^0-9]/g, '').slice(-10) }
        ]
      });
    }
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    const bpSystolicNum = body.bpSystolic ? parseFloat(body.bpSystolic) : undefined;
    const bpDiastolicNum = body.bpDiastolic ? parseFloat(body.bpDiastolic) : undefined;
    const sugarRBSNum = body.sugarRBS ? parseFloat(body.sugarRBS) : undefined;
    const spo2Num = body.spo2 ? parseFloat(body.spo2) : undefined;
    const pulseNum = body.pulse ? parseFloat(body.pulse) : undefined;
    const tempNum = body.temperature ? parseFloat(body.temperature) : undefined;
    const weightNum = body.weight ? parseFloat(body.weight) : undefined;
    const heightNum = body.height ? parseFloat(body.height) : undefined;
    let bmiNum = body.bmi ? parseFloat(body.bmi) : undefined;

    if (!bmiNum && weightNum && heightNum && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      bmiNum = parseFloat((weightNum / (heightInMeters * heightInMeters)).toFixed(1));
    }

    // Check if an existing camp registration/visit exists for this patient and camp
    let visit = await CampVisit.findOne({
      campId,
      $or: [
        { patientId: patient.patientId },
        { patientId: patient._id.toString() }
      ]
    });

    const isNewCheck = !visit || visit.checkStatus === 'Pending';

    if (visit) {
      // Update existing record with entered vitals
      visit.patientId = patient.patientId;
      visit.patientName = patient.name;
      visit.campName = camp.name;
      visit.location = camp.location;
      visit.visitDate = new Date();
      visit.registeredBy = body.registeredBy || 'Camp Medical Staff';
      visit.bpSystolic = bpSystolicNum ?? visit.bpSystolic;
      visit.bpDiastolic = bpDiastolicNum ?? visit.bpDiastolic;
      visit.sugarRBS = sugarRBSNum ?? visit.sugarRBS;
      visit.spo2 = spo2Num ?? visit.spo2;
      visit.pulse = pulseNum ?? visit.pulse;
      visit.temperature = tempNum ?? visit.temperature;
      visit.weight = weightNum ?? visit.weight;
      visit.height = heightNum ?? visit.height;
      visit.bmi = bmiNum ?? visit.bmi;
      visit.postureScreening = body.postureScreening || visit.postureScreening || '';
      visit.physiotherapyAdvice = body.physiotherapyAdvice || visit.physiotherapyAdvice || '';
      visit.doctorNotes = body.doctorNotes || (visit.doctorNotes === 'Online Camp Pre-Registration' ? '' : visit.doctorNotes) || '';
      visit.recommendedService = body.recommendedService || visit.recommendedService || '';
      visit.checkStatus = 'Completed';
      visit.followupRequired = !!body.followupRequired;
      if (body.followupDate) visit.followupDate = new Date(body.followupDate);
      if (body.followupNotes) visit.followupNotes = body.followupNotes;

      await visit.save();
    } else {
      // Create new completed Camp Visit record
      visit = new CampVisit({
        patientId: patient.patientId,
        patientName: patient.name,
        campId,
        campName: camp.name,
        location: camp.location,
        visitDate: new Date(),
        registeredBy: body.registeredBy || 'Camp Medical Staff',
        bpSystolic: bpSystolicNum,
        bpDiastolic: bpDiastolicNum,
        sugarRBS: sugarRBSNum,
        spo2: spo2Num,
        pulse: pulseNum,
        temperature: tempNum,
        weight: weightNum,
        height: heightNum,
        bmi: bmiNum,
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
    }

    // Increment camp health check counter if this was a new completion
    if (isNewCheck) {
      camp.totalChecksCompleted = (camp.totalChecksCompleted || 0) + 1;
      await camp.save();
    }

    // Update patient followup status if needed
    if (body.followupRequired) {
      patient.followupStatus = 'Follow-up Required';
      patient.followupDate = body.followupDate ? new Date(body.followupDate) : undefined;
      patient.followupNotes = body.followupNotes || body.physiotherapyAdvice;
    }

    // Award camp participation coins
    patient.rewardCoinsBalance = (patient.rewardCoinsBalance || 0) + 20;
    if (!Array.isArray(patient.rewardHistory)) patient.rewardHistory = [];
    patient.rewardHistory.push({
      coins: 20,
      type: 'Earned',
      reason: `Camp Health Checkup participation at ${camp.name}`,
      date: new Date()
    });

    if (!Array.isArray(patient.auditLogs)) patient.auditLogs = [];
    patient.auditLogs.push({
      action: 'Camp Health Check Recorded',
      performedBy: body.registeredBy || 'Camp Staff',
      details: `Camp ${campId} check-up: BP ${bpSystolicNum || '-'}/${bpDiastolicNum || '-'}, Sugar: ${sugarRBSNum || '-'} mg/dL, SpO2: ${spo2Num || '-'}%`,
      timestamp: new Date()
    });

    await patient.save();

    // Send real-time notification to patient
    try {
      await Notification.create({
        patientId: patient.patientId,
        title: 'Camp Health Checkup Completed',
        message: `Your vitals (BP: ${bpSystolicNum || '-'}/${bpDiastolicNum || '-'}, Sugar: ${sugarRBSNum || '-'} mg/dL) from ${camp.name} have been updated in your profile. You earned +20 Health Coins!`,
        type: 'Camp',
        actionUrl: '/patient/dashboard?tab=camps'
      });
    } catch (e) {
      console.warn('Camp notification creation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Camp health checkup recorded successfully',
      visit
    });
  } catch (error) {
    console.error('Record camp visit error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import Notification from '@/lib/models/Notification';

export async function POST(req) {
  try {
    await dbConnect();
    const { patientId, action, reason, performedBy } = await req.json();

    if (!patientId) {
      return NextResponse.json({ success: false, message: 'Patient ID is required' }, { status: 400 });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    const newStatus = action === 'reactivate' ? 'ACTIVE' : 'INACTIVE';
    patient.cardStatus = newStatus;

    if (newStatus === 'INACTIVE') {
      patient.cardDeactivatedAt = new Date();
      patient.cardDeactivationReason = reason || 'Admin Deactivated';
      
      patient.auditLogs.push({
        action: 'Health Card Deactivated',
        performedBy: performedBy || 'Admin',
        details: `Reason: ${reason || 'Card deactivated'}. Permanent Patient ID ${patientId} remains intact.`,
        timestamp: new Date()
      });

      await Notification.create({
        patientId,
        title: 'Health Card Deactivated',
        message: `Your Dr Jhatka Medicare Free Health Card has been temporarily marked INACTIVE. Reason: ${reason || 'Security review'}. Please contact support or clinic to reactivate.`,
        type: 'Card'
      });
    } else {
      patient.cardDeactivatedAt = null;
      patient.cardDeactivationReason = null;
      
      patient.auditLogs.push({
        action: 'Health Card Reactivated',
        performedBy: performedBy || 'Admin',
        details: `Card restored to ACTIVE status for Permanent Patient ID ${patientId}`,
        timestamp: new Date()
      });

      await Notification.create({
        patientId,
        title: 'Health Card Reactivated',
        message: `Your Dr Jhatka Medicare Free Health Card has been reactivated. Status: ACTIVE.`,
        type: 'Card'
      });
    }

    await patient.save();

    return NextResponse.json({
      success: true,
      message: `Health Card status successfully updated to ${newStatus}`,
      cardStatus: newStatus,
      patient
    });
  } catch (error) {
    console.error('Deactivate/reactivate error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

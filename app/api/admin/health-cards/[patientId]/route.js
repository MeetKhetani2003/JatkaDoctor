import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';
import Appointment from '@/lib/models/Appointment';
import PhysioBooking from '@/lib/models/physio/PhysioBooking';
import Payment from '@/lib/models/Payment';
import Family from '@/lib/models/Family';
import Notification from '@/lib/models/Notification';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const patientId = params.patientId;

    await dbConnect();
    const patient = await Patient.findOne({ patientId }).lean();
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // 1. Family members
    let family = null;
    let familyMembers = [];
    if (patient.familyId) {
      family = await Family.findOne({ familyId: patient.familyId }).lean();
      familyMembers = await Patient.find({ 
        familyId: patient.familyId, 
        patientId: { $ne: patientId } 
      }).lean();
    }

    // 2. Camp visits & health checks
    const campVisits = await CampVisit.find({ patientId }).sort({ visitDate: -1 }).lean();

    // 3. Appointments & Bookings
    const appointments = await Appointment.find({
      $or: [
        { phone: patient.mobile },
        { phone: `+91${patient.mobile}` }
      ]
    }).sort({ createdAt: -1 }).lean();

    const physioBookings = await PhysioBooking.find({
      $or: [
        { patientId: patient._id },
        { patientPhone: patient.mobile }
      ]
    })
    .populate('departmentId', 'name')
    .populate('conditionId', 'name')
    .sort({ createdAt: -1 })
    .lean();

    // 4. Payments
    const bookingIds = [
      ...appointments.map(a => a.bookingId).filter(Boolean),
      ...physioBookings.map(b => b.bookingId).filter(Boolean)
    ];

    const payments = await Payment.find({
      bookingId: { $in: bookingIds }
    }).sort({ createdAt: -1 }).lean();

    // 5. Notifications
    const notifications = await Notification.find({ patientId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      patient,
      family,
      familyMembers,
      campVisits,
      appointments,
      physioBookings,
      payments,
      notifications
    });
  } catch (error) {
    console.error('Fetch patient 360 error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    const params = await context.params;
    const patientId = params.patientId;
    const body = await req.json();

    await dbConnect();
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Follow-up status update
    if (body.followupStatus) {
      patient.followupStatus = body.followupStatus;
      if (body.followupNotes) patient.followupNotes = body.followupNotes;
      if (body.followupDate) patient.followupDate = new Date(body.followupDate);
      patient.auditLogs.push({
        action: `Follow-up Updated: ${body.followupStatus}`,
        performedBy: body.performedBy || 'Admin',
        details: body.followupNotes || 'Status updated',
        timestamp: new Date()
      });
    }

    // Senior citizen manual toggle
    if (body.isSeniorCitizen !== undefined) {
      patient.isSeniorCitizen = !!body.isSeniorCitizen;
      patient.seniorCitizenBenefitActive = !!body.seniorCitizenBenefitActive;
    }

    // Rewards adjustment
    if (body.rewardAdjustment) {
      const delta = parseInt(body.rewardAdjustment.coins, 10);
      if (!isNaN(delta)) {
        patient.rewardCoinsBalance = Math.max(0, (patient.rewardCoinsBalance || 0) + delta);
        patient.rewardHistory.push({
          coins: Math.abs(delta),
          type: delta >= 0 ? 'Earned' : 'Used',
          reason: body.rewardAdjustment.reason || 'Admin adjustment',
          date: new Date()
        });
      }
    }

    await patient.save();

    return NextResponse.json({
      success: true,
      message: 'Patient 360 profile updated successfully',
      patient
    });
  } catch (error) {
    console.error('Update patient 360 error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const patientId = params.patientId;

    await dbConnect();
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Completely remove the patient profile
    await Patient.deleteOne({ patientId });

    return NextResponse.json({ success: true, message: 'Patient Health Card completely deleted' });
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

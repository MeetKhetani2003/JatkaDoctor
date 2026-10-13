import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';
import Appointment from '@/lib/models/Appointment';
import PhysioBooking from '@/lib/models/physio/PhysioBooking';
import Payment from '@/lib/models/Payment';
import Family from '@/lib/models/Family';
import Notification from '@/lib/models/Notification';
import Prescription from '@/lib/models/Prescription';
import IcuRequest from '@/lib/models/IcuRequest';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const patientId = params.patientId;

    await dbConnect();
    let patient = await Patient.findOne({ patientId }).lean();
    if (!patient && patientId && patientId.length === 24) {
      patient = await Patient.findById(patientId).lean();
    }
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
        patientId: { $ne: patient.patientId } 
      }).lean();
    }

    // 2. Camp visits & health checks
    const campVisits = await CampVisit.find({ 
      $or: [
        { patientId: patient.patientId },
        { patientId: patientId }
      ]
    }).sort({ visitDate: -1 }).lean();

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

    // 3.1 Home Care & Nursing Care Bookings
    const homeCareBookings = await HomeCareBooking.find({
      $or: [
        { patientId: patient._id },
        { patientPermanentId: patient.patientId },
        { patientPhone: patient.mobile }
      ]
    }).sort({ createdAt: -1 }).lean();

    // 4. Payments
    const bookingIds = [
      ...appointments.map(a => a.bookingId).filter(Boolean),
      ...physioBookings.map(b => b.bookingId).filter(Boolean),
      ...homeCareBookings.map(h => h.bookingId).filter(Boolean)
    ];

    const payments = await Payment.find({
      bookingId: { $in: bookingIds }
    }).sort({ createdAt: -1 }).lean();

    // 5. Prescriptions
    const prescriptions = await Prescription.find({
      $or: [
        { patientId: patientId },
        { patientDbId: patient._id },
        { patientPhone: patient.mobile }
      ]
    }).sort({ createdAt: -1 }).lean();

    const formattedPrescriptions = prescriptions.map(p => ({
      ...p,
      fileUrl: `/api/prescriptions/${p.prescriptionId}/file`,
      downloadUrl: `/api/prescriptions/${p.prescriptionId}/file?download=1`
    }));

    // 6. Notifications
    const notifications = await Notification.find({ 
      $or: [
        { patientId: patient.patientId },
        { patientId: patientId }
      ]
    }).sort({ createdAt: -1 }).lean();

    // 7. ICU at Home Requests & Care Plans
    const icuRequests = await IcuRequest.find({
      $or: [
        { patientId: patient.patientId },
        { phone: patient.mobile },
        { phone: `+91${patient.mobile}` }
      ]
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      patient,
      family,
      familyMembers,
      campVisits,
      appointments,
      physioBookings,
      homeCareBookings,
      icuRequests,
      payments,
      prescriptions: formattedPrescriptions,
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

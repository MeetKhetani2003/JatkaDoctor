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
import { ensurePatientFamilyId } from '@/lib/idGenerator';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const rawId = params?.patientId || '';
    const patientId = decodeURIComponent(rawId).trim();

    await dbConnect();
    
    // Look up patient by patientId, or _id
    let patient = await Patient.findOne({ patientId }).lean();
    if (!patient && patientId.length === 24) {
      try {
        patient = await Patient.findById(patientId).lean();
      } catch {}
    }
    if (!patient) {
      // Fallback search case-insensitive or by mobile
      patient = await Patient.findOne({
        $or: [
          { patientId: { $regex: new RegExp(`^${patientId}$`, 'i') } },
          { mobile: patientId }
        ]
      }).lean();
    }

    if (!patient) {
      return NextResponse.json({ success: false, message: `Patient '${patientId}' not found` }, { status: 404 });
    }

    // Auto-ensure familyId is always present
    if (!patient.familyId) {
      try {
        const generatedFamilyId = await ensurePatientFamilyId(patient);
        if (generatedFamilyId) {
          patient.familyId = generatedFamilyId;
        }
      } catch (famErr) {
        console.error('Auto family creation warning:', famErr);
      }
    }

    // 1. Family members
    let family = null;
    let familyMembers = [];
    if (patient.familyId) {
      try {
        family = await Family.findOne({ familyId: patient.familyId }).lean();
        familyMembers = await Patient.find({ 
          familyId: patient.familyId, 
          patientId: { $ne: patient.patientId } 
        }).lean();
      } catch (e) {
        console.error('Error fetching family:', e);
      }
    }

    // 2. Camp visits & health checks
    let campVisits = [];
    try {
      const campQueries = [{ patientId: patient.patientId }];
      if (patientId) campQueries.push({ patientId: patientId });
      if (patient._id) campQueries.push({ patientId: patient._id.toString() });

      const rawCampVisits = await CampVisit.find({ $or: campQueries })
        .sort({ visitDate: -1, createdAt: -1 })
        .lean();

      // Deduplicate camp visits by campId, prioritizing completed visits with vitals
      const campVisitMap = new Map();
      for (const cv of rawCampVisits) {
        const key = cv.campId || cv._id.toString();
        if (!campVisitMap.has(key)) {
          campVisitMap.set(key, cv);
        } else {
          const existing = campVisitMap.get(key);
          const currentHasVitals = cv.checkStatus === 'Completed' || cv.bpSystolic || cv.sugarRBS;
          const existingHasVitals = existing.checkStatus === 'Completed' || existing.bpSystolic || existing.sugarRBS;
          if (currentHasVitals && !existingHasVitals) {
            campVisitMap.set(key, cv);
          }
        }
      }
      campVisits = Array.from(campVisitMap.values());
    } catch (e) {
      console.error('Error fetching camp visits:', e);
    }

    // 3. Appointments & Bookings
    let appointments = [];
    try {
      if (patient.mobile) {
        appointments = await Appointment.find({
          $or: [
            { phone: patient.mobile },
            { phone: `+91${patient.mobile.slice(-10)}` }
          ]
        }).sort({ createdAt: -1 }).lean();
      }
    } catch (e) {
      console.error('Error fetching appointments:', e);
    }

    let physioBookings = [];
    try {
      const physioQueries = [];
      if (patient._id) physioQueries.push({ patientId: patient._id });
      if (patient.mobile) physioQueries.push({ patientPhone: patient.mobile });
      if (physioQueries.length > 0) {
        physioBookings = await PhysioBooking.find({ $or: physioQueries })
          .populate('departmentId', 'name')
          .populate('conditionId', 'name')
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      console.error('Error fetching physio bookings:', e);
    }

    // 3.1 Home Care & Nursing Care Bookings
    let homeCareBookings = [];
    try {
      const homeQueries = [];
      if (patient._id) homeQueries.push({ patientId: patient._id });
      if (patient.patientId) homeQueries.push({ patientPermanentId: patient.patientId });
      if (patient.mobile) homeQueries.push({ patientPhone: patient.mobile });
      if (homeQueries.length > 0) {
        homeCareBookings = await HomeCareBooking.find({ $or: homeQueries })
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      console.error('Error fetching home care bookings:', e);
    }

    // 4. Payments
    let payments = [];
    try {
      const bookingIds = [
        ...appointments.map(a => a.bookingId).filter(Boolean),
        ...physioBookings.map(b => b.bookingId).filter(Boolean),
        ...homeCareBookings.map(h => h.bookingId).filter(Boolean)
      ];

      if (bookingIds.length > 0) {
        payments = await Payment.find({
          bookingId: { $in: bookingIds }
        }).sort({ createdAt: -1 }).lean();
      }
    } catch (e) {
      console.error('Error fetching payments:', e);
    }

    // 5. Prescriptions
    let formattedPrescriptions = [];
    try {
      const rxQueries = [];
      if (patient.patientId) rxQueries.push({ patientId: patient.patientId });
      if (patientId) rxQueries.push({ patientId: patientId });
      if (patient._id) rxQueries.push({ patientDbId: patient._id });
      if (patient.mobile) rxQueries.push({ patientPhone: patient.mobile });

      if (rxQueries.length > 0) {
        const prescriptions = await Prescription.find({ $or: rxQueries })
          .sort({ createdAt: -1 })
          .lean();

        formattedPrescriptions = prescriptions.map(p => ({
          ...p,
          fileUrl: `/api/prescriptions/${p.prescriptionId}/file`,
          downloadUrl: `/api/prescriptions/${p.prescriptionId}/file?download=1`
        }));
      }
    } catch (e) {
      console.error('Error fetching prescriptions:', e);
    }

    // 6. Notifications
    let notifications = [];
    try {
      const notifQueries = [];
      if (patient.patientId) notifQueries.push({ patientId: patient.patientId });
      if (patientId) notifQueries.push({ patientId: patientId });
      if (notifQueries.length > 0) {
        notifications = await Notification.find({ $or: notifQueries })
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }

    // 7. ICU at Home Requests & Care Plans
    let icuRequests = [];
    try {
      const icuQueries = [];
      if (patient.patientId) icuQueries.push({ patientId: patient.patientId });
      if (patient.mobile) {
        icuQueries.push({ phone: patient.mobile });
        icuQueries.push({ phone: `+91${patient.mobile.slice(-10)}` });
      }
      if (icuQueries.length > 0) {
        icuRequests = await IcuRequest.find({ $or: icuQueries })
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      console.error('Error fetching icu requests:', e);
    }

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

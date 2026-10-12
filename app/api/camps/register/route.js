import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Camp from '@/lib/models/Camp';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';
import Notification from '@/lib/models/Notification';
import { notifyNewLead } from '@/lib/notificationHelper';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { campId, patientId, name, mobile, notes } = body;

    if (!campId) {
      return NextResponse.json({ success: false, message: 'Camp ID is required' }, { status: 400 });
    }

    const camp = await Camp.findOne({ campId });
    const campName = camp ? camp.name : 'Dr Jhatka Free Medical Camp';
    const campLocation = camp ? camp.location : 'Lucknow';

    let resolvedPatientId = patientId;
    let resolvedPatientName = name;
    let resolvedMobile = mobile;

    if (patientId) {
      const patient = await Patient.findOne({ patientId });
      if (patient) {
        resolvedPatientName = patient.name;
        resolvedMobile = patient.mobile;
      }
    } else if (mobile) {
      const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
      const patient = await Patient.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `+91${cleanMobile}` }
        ]
      });
      if (patient) {
        resolvedPatientId = patient.patientId;
        resolvedPatientName = patient.name;
      }
    }

    // Check if already registered
    if (resolvedPatientId) {
      const existingVisit = await CampVisit.findOne({
        patientId: resolvedPatientId,
        campId
      });

      if (existingVisit) {
        return NextResponse.json({
          success: true,
          alreadyRegistered: true,
          message: 'You are already registered for this Free Health Camp!'
        });
      }
    }

    // Create Camp Registration entry (as a pending checkup visit)
    const newVisit = new CampVisit({
      patientId: resolvedPatientId || `GUEST-${Date.now().toString().slice(-6)}`,
      patientName: resolvedPatientName || 'Guest Patient',
      campId,
      campName,
      location: campLocation,
      visitDate: new Date(),
      registeredBy: resolvedPatientId ? 'Self Registered via Portal' : 'Website Lead',
      checkStatus: 'Pending',
      doctorNotes: notes || 'Online Camp Pre-Registration'
    });

    await newVisit.save();

    // Increment camp totalRegistered
    if (camp) {
      camp.totalRegistered = (camp.totalRegistered || 0) + 1;
      await camp.save();
    }

    // Notify Admin / Notification center
    try {
      await notifyNewLead({
        bookingId: `CAMP-REG-${campId}-${Date.now().toString().slice(-4)}`,
        patientName: resolvedPatientName || 'Camp Visitor',
        mobile: resolvedMobile || 'Not provided',
        service: `Free Medical Camp: ${campName}`,
        problem: `Camp Registration (${campLocation})`,
        date: camp?.date || new Date().toISOString().split('T')[0],
        time: camp?.time || 'Camp Hours',
        location: campLocation,
        paymentStatus: 'Free',
        bookingSource: 'Camp Online Pre-Registration'
      });
    } catch (notifErr) {
      console.warn('Camp lead notification warning:', notifErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for Free Health Camp!',
      campName,
      campDate: camp?.date,
      campTime: camp?.time,
      location: campLocation
    });
  } catch (error) {
    console.error('Camp registration error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

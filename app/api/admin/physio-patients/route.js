import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/physio/Patient";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get('search'); // mobile or patientId
    
    let query = { isArchived: { $ne: true } };
    if (search) {
      query.$or = [
        { mobile: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Convert to plain objects to attach extra properties
    const patients = await Patient.find(query).sort({ createdAt: -1 }).lean();
    
    // Attach latest booking and plan info
    const enrichedPatients = await Promise.all(patients.map(async (p) => {
        const PhysioBooking = mongoose.model('PhysioBooking');
        const TreatmentPlan = mongoose.model('TreatmentPlan');
        
        const latestBooking = await PhysioBooking.findOne({ patientId: p._id, status: { $ne: 'Cancelled' } })
            .sort({ createdAt: -1 })
            .populate('departmentId', 'name')
            .populate('conditionId', 'name')
            .populate('assignedTherapistId', 'name')
            .lean();
            
        let plan = null;
        if (latestBooking) {
            plan = await TreatmentPlan.findOne({ bookingId: latestBooking._id }).lean();
        }
        
        return {
            ...p,
            latestBooking: latestBooking || null,
            latestPlan: plan || null
        };
    }));

    return NextResponse.json({ success: true, data: enrichedPatients });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Smart Rule: One Mobile = One Patient
    const existing = await Patient.findOne({ mobile: body.mobile });
    if (existing) {
       return NextResponse.json({ success: false, message: "A patient with this mobile number already exists." }, { status: 409 });
    }

    // Auto-generate Patient ID if not provided (e.g. DJM-PT-XXXXXX)
    if (!body.patientId) {
      const count = await Patient.countDocuments();
      body.patientId = `DJM-PT-${(count + 1).toString().padStart(6, '0')}`;
    }
    
    const patient = await Patient.create(body);
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

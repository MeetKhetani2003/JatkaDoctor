import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/physio/Patient";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get('search'); // mobile or patientId
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { mobile: { $regex: search, $options: 'i' } },
          { patientId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const patients = await Patient.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
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

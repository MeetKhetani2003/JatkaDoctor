import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Camp from '@/lib/models/Camp';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const campId = params.campId;

    await dbConnect();
    const camp = await Camp.findOne({ campId }).lean();
    if (!camp) {
      return NextResponse.json({ success: false, message: 'Camp not found' }, { status: 404 });
    }

    // Get all registered patients for this camp
    const patients = await Patient.find({ campId }).sort({ createdAt: -1 }).lean();

    // Get all camp visits / health check entries for this camp
    const visits = await CampVisit.find({ campId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      camp,
      patients,
      visits
    });
  } catch (error) {
    console.error('Get camp details error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    const params = await context.params;
    const campId = params.campId;
    const body = await req.json();

    await dbConnect();
    const updated = await Camp.findOneAndUpdate(
      { campId },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Camp not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Camp updated successfully',
      camp: updated
    });
  } catch (error) {
    console.error('Update camp error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

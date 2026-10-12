import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prescription from '@/lib/models/Prescription';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const patientId = searchParams.get('patientId') || '';

    const filter = {};

    if (patientId) {
      filter.$or = [
        { patientId: patientId },
        { patientPhone: patientId }
      ];
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { patientName: regex },
        { patientPhone: regex },
        { prescriptionId: regex },
        { notes: regex }
      ];
    }

    const prescriptions = await Prescription.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      prescriptions: prescriptions.map(p => ({
        ...p,
        fileUrl: `/api/prescriptions/${p.prescriptionId}/file`,
        downloadUrl: `/api/prescriptions/${p.prescriptionId}/file?download=1`
      }))
    });
  } catch (error) {
    console.error('Admin Prescriptions GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, status, reviewedBy } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing prescription ID or status' }, { status: 400 });
    }

    const updated = await Prescription.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy: reviewedBy || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, prescription: updated });
  } catch (error) {
    console.error('Admin Prescriptions PATCH Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

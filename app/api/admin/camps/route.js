import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Camp from '@/lib/models/Camp';
import { generateCampId } from '@/lib/idGenerator';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const camps = await Camp.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, camps });
  } catch (error) {
    console.error('Fetch camps error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.location || !body.date) {
      return NextResponse.json({ 
        success: false, 
        message: 'Camp Name, Location, and Date are required' 
      }, { status: 400 });
    }

    // Auto-generate Camp ID (e.g. CAMP-0001)
    const campId = await generateCampId();

    const newCamp = new Camp({
      campId,
      name: body.name.trim(),
      location: body.location.trim(),
      city: body.city || 'Lucknow',
      address: body.address || '',
      date: body.date,
      time: body.time || '09:00 AM - 04:00 PM',
      campType: body.campType || 'Free General Health & Physiotherapy Camp',
      assignedStaff: body.assignedStaff || [],
      status: body.status || 'Active',
      description: body.description || '',
      targetPatients: body.targetPatients ? parseInt(body.targetPatients, 10) : 100,
      totalRegistered: 0,
      totalChecksCompleted: 0,
      notes: body.notes || '',
      createdBy: body.createdBy || 'Admin'
    });

    await newCamp.save();

    return NextResponse.json({
      success: true,
      message: `Camp ${campId} created successfully!`,
      camp: newCamp
    });
  } catch (error) {
    console.error('Create camp error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/lib/models/Staff';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const zone = searchParams.get('zone');
    
    let filter = {};
    if (role) {
      filter.role = role;
    }
    if (zone) {
      filter.zone = zone;
    }

    const staff = await Staff.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { 
      name, 
      role, 
      description, 
      image, 
      mobile, 
      whatsapp, 
      zone, 
      experience, 
      qualification, 
      status 
    } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Missing name or role' }, { status: 400 });
    }

    const staff = new Staff({
      name,
      role,
      description: description || '',
      image: image || '',
      mobile: mobile || '',
      whatsapp: whatsapp || '',
      zone: zone || '',
      experience: experience || '',
      qualification: qualification || '',
      status: status || 'Active'
    });

    await staff.save();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

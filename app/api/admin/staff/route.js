import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/lib/models/Staff';
import { verifyAdmin } from '@/lib/adminAuth';
import { uploadToGridFS } from '@/lib/gridfs';

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

    let name, role, description, image, imageFileId, mobile, whatsapp, zone, experience, qualification, status, rating;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = formData.get('name');
      role = formData.get('role');
      description = formData.get('description') || '';
      mobile = formData.get('mobile') || '';
      whatsapp = formData.get('whatsapp') || '';
      zone = formData.get('zone') || '';
      experience = formData.get('experience') || '';
      qualification = formData.get('qualification') || '';
      status = formData.get('status') || 'Active';
      rating = formData.get('rating') || '4.9';
      
      const file = formData.get('image');
      if (file && typeof file !== 'string' && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        imageFileId = await uploadToGridFS(buffer, file.name, file.type);
        image = `/api/images/${imageFileId}`;
      } else {
        image = formData.get('imageUrl') || '';
        imageFileId = formData.get('imageFileId') || '';
      }
    } else {
      const body = await req.json();
      name = body.name;
      role = body.role;
      description = body.description || '';
      image = body.image || '';
      imageFileId = body.imageFileId || '';
      mobile = body.mobile || '';
      whatsapp = body.whatsapp || '';
      zone = body.zone || '';
      experience = body.experience || '';
      qualification = body.qualification || '';
      status = body.status || 'Active';
      rating = body.rating || '4.9';
    }

    if (!name || !role) {
      return NextResponse.json({ error: 'Missing name or role' }, { status: 400 });
    }

    const staff = new Staff({
      name,
      role,
      description,
      image,
      imageFileId,
      mobile,
      whatsapp,
      zone,
      experience,
      qualification,
      status,
      rating
    });

    await staff.save();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

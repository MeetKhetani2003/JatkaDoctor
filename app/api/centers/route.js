import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PhysioCenter from '@/lib/models/PhysioCenter';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET() {
  await dbConnect();
  try {
    const centers = await PhysioCenter.find({}).sort({ createdAt: -1 });
    return NextResponse.json(centers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const subtitle = formData.get('subtitle');
    const location = formData.get('location');
    const rating = formData.get('rating');
    const experience = formData.get('experience');
    const features = JSON.parse(formData.get('features') || '[]');
    const treatments = JSON.parse(formData.get('treatments') || '[]');
    const numbers = JSON.parse(formData.get('numbers') || '[]');
    const file = formData.get('image');

    let imageFileId = null;
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    const center = await PhysioCenter.create({
      name,
      subtitle,
      location,
      rating: parseFloat(rating),
      experience,
      features,
      treatments,
      numbers,
      imageFileId,
    });

    return NextResponse.json(center, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

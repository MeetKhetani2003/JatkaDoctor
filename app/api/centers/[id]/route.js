import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PhysioCenter from '@/lib/models/PhysioCenter';
import { uploadToGridFS } from '@/lib/gridfs';

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
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

    const updateData = {
      name,
      subtitle,
      location,
      rating: parseFloat(rating),
      experience,
      features,
      treatments,
      numbers,
    };

    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageFileId = await uploadToGridFS(buffer, file.name, file.type);
      updateData.imageFileId = imageFileId;
    }

    const center = await PhysioCenter.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(center);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    await PhysioCenter.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Center deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogAuthor from '@/lib/models/BlogAuthor';
import { uploadToGridFS } from '@/lib/gridfs';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const updateData = {};
    const fields = ['name', 'qualification', 'designation', 'bio'];
    
    fields.forEach(f => {
      const val = formData.get(f);
      if (val !== null) updateData[f] = val;
    });
    
    // Handle Image Upload
    const file = formData.get('photo');
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      updateData.photoFileId = await uploadToGridFS(buffer, file.name, file.type);
    } else if (typeof file === 'string' && file) {
      updateData.photoUrl = file;
    }
    
    const author = await BlogAuthor.findByIdAndUpdate(params.id, updateData, { new: true });
    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await BlogAuthor.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

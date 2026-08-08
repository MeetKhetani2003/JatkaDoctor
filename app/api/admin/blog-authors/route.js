import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogAuthor from '@/lib/models/BlogAuthor';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET() {
  try {
    await connectDB();
    const authors = await BlogAuthor.find({}).sort({ createdAt: -1 });
    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const name = formData.get('name');
    const qualification = formData.get('qualification');
    const designation = formData.get('designation');
    const bio = formData.get('bio');
    
    // Handle Image Upload
    const file = formData.get('photo');
    let photoFileId = null;
    let photoUrl = null;
    
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      photoFileId = await uploadToGridFS(buffer, file.name, file.type);
    } else if (typeof file === 'string' && file) {
      photoUrl = file;
    }
    
    const author = new BlogAuthor({
      name,
      qualification,
      designation,
      bio,
      photoFileId,
      photoUrl
    });
    
    await author.save();
    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

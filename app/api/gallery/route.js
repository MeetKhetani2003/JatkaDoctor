import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET() {
  try {
    await dbConnect();
    const items = await Gallery.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Gallery GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    // Check if it's form data (for photos) or JSON (for videos)
    const contentType = request.headers.get('content-type') || '';
    
    let type, url, title;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      type = formData.get('type');
      title = formData.get('title') || '';
      const file = formData.get('file');
      
      if (type !== 'photo' || !file) {
         return NextResponse.json({ error: 'Invalid photo data' }, { status: 400 });
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageId = await uploadToGridFS(buffer, file.name, file.type);
      url = `/api/images/${imageId}`;
      
    } else {
      const body = await request.json();
      type = body.type;
      url = body.url;
      title = body.title || '';
      
      if (type !== 'video' || !url) {
         return NextResponse.json({ error: 'Invalid video data' }, { status: 400 });
      }
    }
    
    const newGalleryItem = new Gallery({ type, url, title });
    await newGalleryItem.save();
    
    return NextResponse.json(newGalleryItem, { status: 201 });
  } catch (error) {
    console.error('Gallery POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { uploadToGridFS } from '@/lib/gridfs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check if size is over 500KB - just a safety net on backend too, frontend should compress
    if (buffer.length > 500 * 1024) {
        // We'll allow it for now but in a strict system we might throw an error
        // return NextResponse.json({ error: 'File size exceeds 500KB' }, { status: 400 });
    }

    const imageId = await uploadToGridFS(buffer, file.name, file.type);
    const url = `/api/images/${imageId}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

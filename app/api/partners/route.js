import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PartnerRegistration from '@/lib/models/PartnerRegistration';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET() {
  try {
    await connectDB();
    const registrations = await PartnerRegistration.find({}).sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const type = formData.get('type');
    if (!type) {
      return NextResponse.json({ error: "Partner type (collection) is required" }, { status: 400 });
    }

    const file = formData.get('idFile');
    let idFileId = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      idFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      location: formData.get('location'),
      experience: formData.get('experience'),
      bio: formData.get('bio'),
      type: type,
      idFileId: idFileId
    };

    const registration = await PartnerRegistration.create(data);
    return NextResponse.json(registration);
  } catch (error) {
    console.error("Partner registration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

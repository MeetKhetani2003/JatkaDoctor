import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AmbulancePackage from "@/lib/models/AmbulancePackage";
import { uploadToGridFS } from "@/lib/gridfs";

export async function GET() {
  try {
    await dbConnect();
    const packages = await AmbulancePackage.find({}).sort({ price: 1 });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    
    const title = formData.get('title');
    const description = formData.get('description');
    const icon = formData.get('icon');
    const price = formData.get('price');
    const originalPrice = formData.get('originalPrice');
    const discount = formData.get('discount');
    const baseKm = formData.get('baseKm');
    const pricePerKm = formData.get('pricePerKm');
    const badge = formData.get('badge');
    const isPopular = formData.get('isPopular') === 'true';
    const features = JSON.parse(formData.get('features') || '[]');
    const file = formData.get('image');

    let imageFileId = null;
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    const newPackage = await AmbulancePackage.create({
      title,
      description,
      icon,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      discount,
      baseKm: baseKm ? parseInt(baseKm) : 5,
      pricePerKm: pricePerKm ? parseInt(pricePerKm) : null,
      badge,
      isPopular,
      features,
      imageFileId
    });

    return NextResponse.json(newPackage);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


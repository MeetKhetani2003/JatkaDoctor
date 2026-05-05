import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServicePackage from "@/lib/models/ServicePackage";
import { uploadToGridFS } from "@/lib/gridfs";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const query = type ? { serviceType: type } : {};
    const packages = await ServicePackage.find(query).sort({ price: 1 });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    
    const serviceType = formData.get('serviceType');
    const title = formData.get('title');
    const description = formData.get('description');
    const icon = formData.get('icon');
    const price = formData.get('price');
    const originalPrice = formData.get('originalPrice');
    const discount = formData.get('discount');
    const baseKm = formData.get('baseKm');
    const pricePerKm = formData.get('pricePerKm');
    const period = formData.get('period');
    const badge = formData.get('badge');
    const isPopular = formData.get('isPopular') === 'true';
    const features = JSON.parse(formData.get('features') || '[]');
    const file = formData.get('image');

    let imageFileId = null;
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    const newPackage = await ServicePackage.create({
      serviceType,
      title,
      description,
      icon,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      discount,
      baseKm: baseKm ? parseInt(baseKm) : null,
      pricePerKm: pricePerKm ? parseInt(pricePerKm) : null,
      period,
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

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AmbulancePackage from "@/lib/models/AmbulancePackage";

import { uploadToGridFS } from "@/lib/gridfs";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
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

    const updateData = {
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
    };

    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageFileId = await uploadToGridFS(buffer, file.name, file.type);
      updateData.imageFileId = imageFileId;
    }

    const updatedPackage = await AmbulancePackage.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await AmbulancePackage.findByIdAndDelete(id);
    return NextResponse.json({ message: "Package deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

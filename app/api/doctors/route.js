import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import Category from '@/lib/models/Category';
import { uploadToGridFS, deleteFromGridFS } from "@/lib/gridfs";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const slug = searchParams.get('slug');

    if (slug) {
      const doctor = await Doctor.findOne({ slug }).populate('category');
      return NextResponse.json(doctor);
    }

    const query = categoryId ? { category: categoryId } : {};
    const doctors = await Doctor.find(query).populate('category');
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const name = formData.get('name');
    const category = formData.get('category');
    const role = formData.get('role');
    const degree = formData.get('degree');
    const experience = formData.get('experience');
    const description = formData.get('description');
    const specializationStr = formData.get('specialization');
    let specialization = [];
    try {
      specialization = specializationStr ? JSON.parse(specializationStr) : [];
    } catch (e) {
      console.error('Error parsing specialization:', e);
    }
    
    const availability = formData.get('availability') || "Available Today";
    const rating = formData.get('rating') || "4.9";
    const area = formData.get('area');
    const isVerified = formData.get('isVerified') === 'true';
    const file = formData.get('image');

    let imageFileId = null;
    if (file && typeof file !== 'string' && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    let slug = formData.get('slug');
    if (!slug && name) {
      slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const doctorData = {
      name,
      slug,
      category,
      role,
      degree,
      experience,
      description,
      specialization,
      availability,
      rating,
      area,
      isVerified,
      imageFileId
    };

    const doctor = await Doctor.create(doctorData);
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const formData = await req.formData();
    
    const updateData = {};
    const fields = ['name', 'category', 'role', 'degree', 'experience', 'description', 'availability', 'rating', 'area', 'slug'];
    
    fields.forEach(field => {
      if (formData.has(field)) {
        updateData[field] = formData.get(field);
      }
    });

    if (formData.has('isVerified')) {
      updateData.isVerified = formData.get('isVerified') === 'true';
    }

    if (formData.has('specialization')) {
      try {
        updateData.specialization = JSON.parse(formData.get('specialization') || '[]');
      } catch (e) {
        console.error('Error parsing specialization in PUT:', e);
      }
    }

    const file = formData.get('image');
    if (file && typeof file !== 'string' && file.size > 0) {
      // Get existing doctor to check for old image
      const existingDoctor = await Doctor.findById(id);
      if (existingDoctor?.imageFileId) {
        try {
          await deleteFromGridFS(existingDoctor.imageFileId);
        } catch (e) {
          console.error('Error deleting old image:', e);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      updateData.imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Doctor.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

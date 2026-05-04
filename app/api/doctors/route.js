import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import Category from '@/lib/models/Category';

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
    const body = await req.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const doctor = await Doctor.create(body);
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

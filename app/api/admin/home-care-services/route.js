import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // 'home-care' | 'nursing-care'
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query = {};
    if (category) query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await HomeCareService.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching home care services:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.shortDescription) {
      return NextResponse.json(
        { success: false, error: 'Name and short description are required' }, 
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure unique slug
      let count = 1;
      let existingSlug = await HomeCareService.findOne({ slug: body.slug });
      while (existingSlug) {
        body.slug = `${body.slug}-${count++}`;
        existingSlug = await HomeCareService.findOne({ slug: body.slug });
      }
    }

    const newService = await HomeCareService.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating home care service:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

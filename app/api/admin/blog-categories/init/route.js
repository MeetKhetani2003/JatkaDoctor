import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';

const defaultCategories = [
  "Physiotherapy",
  "Ambulance Service",
  "Home Healthcare",
  "Doctor Visit At Home",
  "ICU Care At Home",
  "Nursing Care",
  "Lab Test At Home",
  "Medical Equipment Rental",
  "Health Tips",
  "Disease Information",
  "Surgery & Recovery",
  "Patient Care Guide",
  "Emergency Care",
  "Preventive Healthcare",
  "Medicine & Treatment Information"
];

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function POST() {
  try {
    await connectDB();
    
    let addedCount = 0;
    
    for (const catName of defaultCategories) {
      const slug = generateSlug(catName);
      
      const existing = await Category.findOne({ slug });
      if (!existing) {
        await Category.create({ name: catName, slug });
        addedCount++;
      }
    }
    
    return NextResponse.json({ success: true, addedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

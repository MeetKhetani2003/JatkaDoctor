import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import Doctor from '@/lib/models/Doctor';
import Staff from '@/lib/models/Staff';
import { medicalTeam } from '@/lib/medicalTeam';

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await Category.deleteMany({});
    await Doctor.deleteMany({});
    await Staff.deleteMany({});

    // Create Categories
    const categories = [
      { name: 'Doctors', slug: 'doctors', description: 'Qualified Medical Doctors' },
      { name: 'Nurses', slug: 'nurses', description: 'Certified Nursing Staff' },
      { name: 'Technicians', slug: 'technicians', description: 'Medical Technicians' },
      { name: 'Caregivers', slug: 'caregivers', description: 'Professional Patient Caregivers' },
    ];

    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.name] = cat._id;
    });

    // Migrate Medical Team
    for (const member of medicalTeam) {
      if (member.category === 'Doctors') {
        await Doctor.create({
          name: member.name,
          slug: member.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          category: catMap['Doctors'],
          role: member.role,
          degree: member.role.includes('Dr.') ? 'MBBS, MD' : 'MBBS',
          experience: member.experience,
          image: member.image,
          description: member.bio,
          specialization: member.specialization,
        });
      } else {
        await Staff.create({
          name: member.name,
          role: member.role,
          image: member.image,
          description: member.bio,
        });
      }
    }

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

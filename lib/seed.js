import connectDB from './db.js';
import Category from './models/Category.js';
import Doctor from './models/Doctor.js';
import Staff from './models/Staff.js';
import { medicalTeam } from './medicalTeam.js';

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to database for seeding...");

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

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();

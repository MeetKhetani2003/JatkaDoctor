import connectDB from '../lib/db.js';
import Doctor from '../lib/models/Doctor.js';
import Category from '../lib/models/Category.js';

const seedDoctors = async () => {
  try {
    await connectDB();
    console.log("Connected to database for full doctor seeding...");

    // Find Categories
    let nurseCat = await Category.findOne({ slug: 'nurses' });
    let docCat = await Category.findOne({ slug: 'doctors' });
    let physioCat = await Category.findOne({ slug: 'technicians' }); // Mapping physio tech to technicians or creating new

    if (!nurseCat) nurseCat = await Category.create({ name: 'Nurses', slug: 'nurses', description: 'Certified Nursing Staff' });
    if (!docCat) docCat = await Category.create({ name: 'Doctors', slug: 'doctors', description: 'Qualified Medical Doctors' });
    
    // Create new category if needed for specific roles
    let icuCat = await Category.findOne({ slug: 'icu-support' });
    if (!icuCat) icuCat = await Category.create({ name: 'ICU Support', slug: 'icu-support', description: 'Critical Care Specialists' });

    // Clear existing doctors to re-order
    await Doctor.deleteMany({});

    const doctors = [
      {
        name: "Dr. A. Sharma",
        slug: "dr-a-sharma",
        role: "General Physician",
        category: docCat._id,
        experience: "12+ Years",
        area: "Lucknow City",
        specialization: ["Fever Treatment", "Diabetes Management", "Blood Pressure Control"],
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        description: "Expert in general medicine and critical care at home."
      },
      {
        name: "Senior Physiotherapist",
        slug: "senior-physiotherapist",
        role: "Senior Physiotherapist",
        category: docCat._id, // User wants them in profile, so putting as doctor/expert
        experience: "3+ Years",
        area: "Lucknow (All Areas)",
        specialization: ["Sports Rehab", "Post-Op Recovery", "Geriatric Physio"],
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
        description: "Verified By dr Jhatka Medicare. Expert in home-based recovery."
      },
      {
        name: "Pooja Agrahari",
        slug: "pooja-agrahari",
        role: "Nursing Staff",
        category: nurseCat._id,
        experience: "3+ Years",
        area: "Alambagh / Krishna Nagar",
        specialization: ["Elderly Care", "Home Nursing Support"],
        image: "https://images.unsplash.com/photo-1576765608596-5883596c0d6b?w=400&h=400&fit=crop",
        description: "Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Sudha Yadav",
        slug: "sudha-yadav",
        role: "Nursing Staff",
        category: nurseCat._id,
        experience: "3.5+ Years",
        area: "Charbagh / Naka / Rajajipuram",
        specialization: ["Patient Care", "Home Nursing Support"],
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        description: "Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Neha Kumar",
        slug: "neha-kumar",
        role: "Nursing Staff",
        category: nurseCat._id,
        experience: "3+ Years",
        area: "Gomti Nagar / Indira Nagar",
        specialization: ["Home Patient Care", "Daily Monitoring"],
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        description: "Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Diksha Nishad",
        slug: "diksha-nishad",
        role: "Nursing Staff",
        category: nurseCat._id,
        experience: "3+ Years",
        area: "Chowk / Old Lucknow",
        specialization: ["Patient Care", "Recovery Support"],
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
        description: "Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Priyanka Gond",
        slug: "priyanka-gond",
        role: "Nursing Staff",
        category: nurseCat._id,
        experience: "4+ Years",
        area: "Hazratganj / Lalbagh",
        specialization: ["Elderly Care", "Patient Support"],
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?w=400&h=400&fit=crop",
        description: "Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Shivanshu Verma",
        slug: "shivanshu-verma",
        role: "Nursing Staff / ICU Support",
        category: icuCat._id,
        experience: "5+ Years",
        area: "Jankipuram / Sitapur Road",
        specialization: ["ICU Care", "Ventilator Support", "Critical Patient Monitoring"],
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        description: "ICU Support Available. Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Mohd. Farhan",
        slug: "mohd-farhan",
        role: "Nursing Staff / OT Support",
        category: nurseCat._id,
        experience: "4+ Years",
        area: "Kalyanpur / Kanpur Road",
        specialization: ["OT Assistance", "Patient Care", "Procedure Support"],
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        description: "OT Support Available. Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Arpit Yadav",
        slug: "arpit-yadav",
        role: "Nursing Staff / Emergency Trauma Support",
        category: nurseCat._id,
        experience: "5+ Years",
        area: "Lucknow (All Major Areas)",
        specialization: ["Emergency Response", "Trauma Care", "Critical Patient Handling"],
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
        description: "Emergency Support Available. Fast Response."
      },
      {
        name: "Mohd. Jaseem",
        slug: "mohd-jaseem",
        role: "Cardiology Support / OT Staff",
        category: icuCat._id,
        experience: "5+ Years",
        area: "Lucknow (City-wide Support)",
        specialization: ["Cardiac Monitoring", "ECG Support", "OT Assistance"],
        image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=400&fit=crop",
        description: "Cardiac Support Available. Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Deepak Kumar",
        slug: "deepak-kumar",
        role: "Nursing Staff / Pharmacy Support",
        category: nurseCat._id,
        experience: "4+ Years",
        area: "Lucknow (All Major Areas)",
        specialization: ["Medication Management", "Patient Care"],
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?w=400&h=400&fit=crop",
        description: "Medicine Support Available. Verified & Trained by Dr Jhatka Medicare."
      },
      {
        name: "Sanjeev Kumar",
        slug: "sanjeev-kumar",
        role: "ICU Support Staff",
        category: icuCat._id,
        experience: "6+ Years",
        area: "Lucknow (City-wide ICU Support)",
        specialization: ["Critical Care Monitoring", "ICU Setup"],
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        description: "ICU Care Available. Emergency Support."
      },
      {
        name: "Abdul Moheed",
        slug: "abul-moheed",
        role: "Nursing Staff / OT Support",
        category: nurseCat._id,
        experience: "3+ Years",
        area: "Lucknow (All Major Areas)",
        specialization: ["Patient Care", "OT Assistance", "Procedure Support"],
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        description: "OT Support Available. Verified & Trained by Dr Jhatka Medicare."
      }
    ];

    await Doctor.insertMany(doctors);
    console.log("Doctors & Staff seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDoctors();

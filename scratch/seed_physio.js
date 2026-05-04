import connectDB from '../lib/db.js';
import PhysioCenter from '../lib/models/PhysioCenter.js';

const seedPhysio = async () => {
  try {
    await connectDB();
    console.log("Connected to database for physio seeding...");

    // Delete existing centers if any
    await PhysioCenter.deleteMany({});

    const centers = [
      {
        name: "Dr Jhatka Medicare Physiotherapy Center",
        subtitle: "@ Gurudwara Physiotherapy Clinic",
        location: "22/3, Nimbu Park Rd, Lajpat Nagar Colony, Lajpat Nagar, Chowk, Lucknow, Uttar Pradesh 226003",
        rating: 5.0,
        experience: "20+ year experience",
        features: ["Certified Physiotherapist", "Background Verified", "Advance physiotherapy Equipment"],
        treatments: ["Pain Management", "Stroke Rehabilitation", "Post-Surgery Recovery", "Orthopedic Physiotherapy"],
        numbers: ["8874744756", "9026365448"]
      },
      {
        name: "Dr Jhatka Medicare Physiotherapy Center",
        subtitle: "@ Dhruv Hospital",
        location: "Jehta Rd, Barawan Kalan, Lucknow, Uttar Pradesh 226101",
        rating: 4.8,
        experience: "6+ year experience",
        features: ["Certified Physiotherapist", "Background Verified", "Advance physiotherapy Equipment"],
        treatments: ["Geriatric Care", "Neuro Physiotherapy", "Sports Injury Treatment", "Back Pain Relief"],
        numbers: ["8874744756", "9026365448"]
      },
      {
        name: "Dr Jhatka Medicare Physiotherapy Center",
        subtitle: "@ Hiranya Medical Center Physiotherapy Department",
        location: "B-327, Sector B Rd, Mahanagar, Lucknow, Uttar Pradesh 226006",
        rating: 4.9,
        experience: "8+ year experience",
        features: ["Certified Physiotherapist", "Background Verified", "Advance physiotherapy Equipment"],
        treatments: ["Joint Mobilization", "Postural Correction", "Manual Therapy", "Pediatric Physiotherapy"],
        numbers: ["8874744756", "9026365448"]
      }
    ];

    await PhysioCenter.insertMany(centers);
    console.log("Physio Centers seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedPhysio();

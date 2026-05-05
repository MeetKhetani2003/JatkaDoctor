const mongoose = require('mongoose');

// Define the schema here to avoid import issues in a scratch script
const AmbulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: "Lucknow" },
  status: { type: String, enum: ['available', 'coming_soon'], default: 'available' },
  eta: { type: String },
  icon: { type: String, default: 'Building2' },
  badge: { type: String },
  verified: { type: Boolean, default: true },
}, { timestamps: true });

const Ambulance = mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema);

const staticLocations = [
  {
    name: "Dubagga",
    city: "Lucknow",
    status: "available",
    eta: "10 - 15 Min",
    icon: "Building2",
    badge: "AVAILABLE",
    verified: true,
  },
  {
    name: "Gomti Nagar",
    city: "Lucknow",
    status: "available",
    eta: "12 - 18 Min",
    icon: "Landmark",
    badge: "AVAILABLE",
    verified: true,
  },
  {
    name: "Aminabad",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "Hotel",
    badge: "COMING SOON",
    verified: false,
  },
  {
    name: "Alambagh",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "Building",
    badge: "COMING SOON",
    verified: false,
  },
  {
    name: "Indira Nagar",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "School",
    badge: "COMING SOON",
    verified: false,
  },
];

async function seed() {
  const MONGODB_URI = "mongodb+srv://mkdigital:Meet2003@cluster0.fhbeqyk.mongodb.net/jataka-claude?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");

    // Clear existing ambulances
    await Ambulance.deleteMany({});
    console.log("Cleared existing ambulances");

    // Insert new ones
    await Ambulance.insertMany(staticLocations);
    console.log("Inserted static locations into database");

    console.log("Seeding finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();

const mongoose = require('mongoose');

const AmbulancePackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: 'Ambulance' },
  image: { type: String },
  imageFileId: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  baseKm: { type: Number, default: 5 },
  pricePerKm: { type: Number },
  features: [{ type: String }],
  badge: { type: String },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

const AmbulancePackage = mongoose.models.AmbulancePackage || mongoose.model('AmbulancePackage', AmbulancePackageSchema);

const initialPackages = [
  {
    title: "Normal Ambulance",
    description: "Standard emergency transport",
    icon: "Ambulance",
    image: "/images/services/basic_ambulance.png",
    price: 1199,
    originalPrice: 1499,
    discount: "20% OFF",
    baseKm: 5,
    pricePerKm: 18,
    badge: "Most Used",
    features: ["Stretcher", "First Aid", "Trained Driver"],
    isPopular: true
  },
  {
    title: "Oxygen Ambulance",
    description: "With oxygen cylinder support",
    icon: "Activity",
    image: "/images/services/oxygen_ambulance.png",
    price: 1699,
    originalPrice: 1999,
    discount: "15% OFF",
    baseKm: 5,
    pricePerKm: 22,
    features: ["O2 Cylinder", "Oximeter", "Attendant"],
    isPopular: false
  },
  {
    title: "ICU Ambulance",
    description: "Advanced life support systems",
    icon: "Monitor",
    image: "/images/services/icu_ambulance.png",
    price: 4999,
    originalPrice: 6999,
    discount: "28% OFF",
    baseKm: 5,
    pricePerKm: 30,
    features: ["Ventilator", "Monitor", "Medical Staff"],
    isPopular: false
  },
  {
    title: "Dead Body",
    description: "Respectful mortuary transport",
    icon: "Shield",
    image: "/images/services/mortuary_ambulance.png",
    price: 1799,
    originalPrice: 2499,
    discount: "28% OFF",
    baseKm: 5,
    pricePerKm: 20,
    features: ["Freezer Box", "Safe Handling", "Doorstep"],
    isPopular: false
  }
];

async function seed() {
  const MONGODB_URI = "mongodb+srv://mkdigital:Meet2003@cluster0.fhbeqyk.mongodb.net/jataka-claude?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await AmbulancePackage.deleteMany({});
    console.log("Cleared existing ambulance packages");

    await AmbulancePackage.insertMany(initialPackages);
    console.log("Inserted initial ambulance packages into database");

    console.log("Seeding finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();

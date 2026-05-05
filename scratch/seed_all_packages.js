const mongoose = require('mongoose');

const ServicePackageSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: 'Activity' },
  image: { type: String },
  imageFileId: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  baseKm: { type: Number },
  pricePerKm: { type: Number },
  period: { type: String },
  badge: { type: String },
  isPopular: { type: Boolean, default: false },
  features: [{ type: String }],
}, { timestamps: true });

const ServicePackage = mongoose.models.ServicePackage || mongoose.model('ServicePackage', ServicePackageSchema);

const initialData = [
  // Ambulance
  { 
    serviceType: 'ambulance', 
    title: "Normal Ambulance", 
    description: "Standard emergency transport (0-5km)", 
    icon: "Ambulance", 
    image: "/images/services/basic_ambulance.png", 
    price: 1199, 
    originalPrice: 1499, 
    discount: "20% OFF", 
    baseKm: 5, 
    pricePerKm: 18, 
    badge: "Most Used", 
    features: ["Stretcher Support", "Basic First Aid", "Trained Driver"], 
    isPopular: true 
  },
  { 
    serviceType: 'ambulance', 
    title: "Oxygen Ambulance", 
    description: "With oxygen cylinder support (0-5km)", 
    icon: "Activity", 
    image: "/images/services/oxygen_ambulance.png", 
    price: 1699, 
    originalPrice: 1999, 
    discount: "15% OFF", 
    baseKm: 5, 
    pricePerKm: 22, 
    features: ["Oxygen Cylinder", "Pulse Oximeter", "Attendant Support"], 
    isPopular: false 
  },
  { 
    serviceType: 'ambulance', 
    title: "ICU / Ventilator", 
    description: "Advanced life support systems (0-5km)", 
    icon: "Monitor", 
    image: "/images/services/icu_ambulance.png", 
    price: 4999, 
    originalPrice: 5999, 
    discount: "28% OFF", 
    baseKm: 5, 
    pricePerKm: 30, 
    badge: "Critical Care",
    features: ["Ventilator", "Cardiac Monitor", "Trained Medical Staff"], 
    isPopular: false 
  },
  { 
    serviceType: 'ambulance', 
    title: "Dead Body / Mortuary", 
    description: "Respectful mortuary transport (0-5km)", 
    icon: "Shield", 
    image: "/images/services/mortuary_ambulance.png", 
    price: 1799, 
    originalPrice: 2199, 
    discount: "Limited Offer", 
    baseKm: 5, 
    pricePerKm: 20, 
    features: ["Freezer Box", "Safe & Respectful Handling", "Trained Staff", "Doorstep Pickup"], 
    isPopular: false 
  },

  // Physiotherapy
  { serviceType: 'physiotherapy', title: "1 Session (Trial)", description: "First visit assessment & therapy", icon: "Activity", price: 499, originalPrice: 999, discount: "50% OFF", period: "per session", badge: "Trial Offer", features: ["Assessment", "Manual Therapy", "Exercise Guidance"] },
  { serviceType: 'physiotherapy', title: "7 Days Package", description: "Weekly intensive care", icon: "Activity", price: 2999, originalPrice: 3999, discount: "25% OFF", period: "7 days", features: ["Daily Visits", "Progress Tracking", "Equipment Included"] },
  { serviceType: 'physiotherapy', title: "15 Days Package", description: "Half month recovery plan", icon: "Activity", price: 5499, originalPrice: 6999, discount: "21% OFF", period: "15 days", badge: "Most Popular", isPopular: true, features: ["Complete Recovery", "Extended Care", "Senior Therapist"] },

  // Doctor
  { serviceType: 'doctor', title: "Standard Visit", description: "Regular home consultation", icon: "Stethoscope", price: 999, originalPrice: 1299, badge: "Standard", features: ["General Exam", "Prescription", "Health Monitoring"] },
  { serviceType: 'doctor', title: "Priority Visit", description: "Faster doctor assignment", icon: "Stethoscope", price: 1199, originalPrice: 1499, isPopular: true, badge: "Most Popular", features: ["Fast Track", "Preferred Slot", "In-depth Consultation"] },

  // ICU
  { serviceType: 'icu', title: "Basic ICU Setup", description: "Essential critical care at home", icon: "Bed", price: 1999, period: "per day", features: ["Cardiac Monitor", "O2 Support", "Experienced Nurse"] },
  { serviceType: 'icu', title: "Advanced ICU", description: "Full ventilator & monitor support", icon: "Monitor", price: 4999, period: "per day", isPopular: true, badge: "Recommended", features: ["Ventilator", "Syringe Pump", "24/7 ICU Nurse"] },

  // Nursing
  { serviceType: 'nursing', title: "Day Shift (12h)", description: "Professional nursing care", icon: "Activity", price: 800, period: "12 hours", features: ["Medication", "Vitals Check", "Dressing"] },
  { serviceType: 'nursing', title: "Full Day (24h)", description: "Round the clock support", icon: "Activity", price: 1500, period: "24 hours", isPopular: true, features: ["Complete Monitoring", "Night Support", "Doctor Coordination"] },
];


async function seed() {
  const MONGODB_URI = "mongodb+srv://mkdigital:Meet2003@cluster0.fhbeqyk.mongodb.net/jataka-claude?retryWrites=true&w=majority&appName=Cluster0";
  try {
    await mongoose.connect(MONGODB_URI);
    await ServicePackage.deleteMany({});
    await ServicePackage.insertMany(initialData);
    console.log("Seeding finished successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seed();

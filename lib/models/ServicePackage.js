import mongoose from 'mongoose';

const ServicePackageSchema = new mongoose.Schema({
  serviceType: { 
    type: String, 
    required: true,
    enum: ['ambulance', 'physiotherapy', 'doctor', 'icu', 'nursing', 'lab-tests', 'home-care']
  },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: 'Activity' },
  image: { type: String },
  imageFileId: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  baseKm: { type: Number }, // For ambulance
  pricePerKm: { type: Number }, // For ambulance
  period: { type: String }, // e.g., "per day", "7 days"
  badge: { type: String },
  isPopular: { type: Boolean, default: false },
  features: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.ServicePackage || mongoose.model('ServicePackage', ServicePackageSchema);

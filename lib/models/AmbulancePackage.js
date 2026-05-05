import mongoose from 'mongoose';

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

export default mongoose.models.AmbulancePackage || mongoose.model('AmbulancePackage', AmbulancePackageSchema);

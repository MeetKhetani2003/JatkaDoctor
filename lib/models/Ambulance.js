import mongoose from 'mongoose';

const AmbulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: "Lucknow" },
  status: { type: String, enum: ['available', 'coming_soon'], default: 'available' },
  eta: { type: String }, // e.g., "10 - 15 Min" or "Launching Soon"
  icon: { type: String, default: 'Building2' }, // Store icon name (Lucide icon component name)
  badge: { type: String }, // e.g., "AVAILABLE" or "COMING SOON"
  verified: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema);

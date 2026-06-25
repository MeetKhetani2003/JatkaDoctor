import mongoose from 'mongoose';

const AmbulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: "Lucknow" },
  status: { type: String, enum: ['available', 'coming_soon'], default: 'available' },
  eta: { type: String }, // e.g., "10 - 15 Min" or "Launching Soon"
  icon: { type: String, default: 'Building2' }, // Store icon name (Lucide icon component name)
  badge: { type: String }, // e.g., "AVAILABLE" or "COMING SOON"
  verified: { type: Boolean, default: true },
  ambulanceNumber: { type: String },
  ambulanceType: { 
    type: String, 
    enum: ['Normal', 'Oxygen', 'ICU'], 
    default: 'Normal' 
  },
  driverName: { type: String },
  driverMobile: { type: String },
  availabilityStatus: { 
    type: String, 
    enum: ['Available', 'Busy', 'Offline'], 
    default: 'Available' 
  },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Ambulance;
}

export default mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema);

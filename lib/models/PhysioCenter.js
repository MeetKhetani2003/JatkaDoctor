import mongoose from 'mongoose';

const PhysioCenterSchema = new mongoose.Schema({
  // 1. Center Information
  name: { type: String, required: true },
  subtitle: { type: String },
  location: { type: String, required: true }, // Full Address
  googleMapPin: { type: String },
  mobileNumber: { type: String },
  whatsappNumber: { type: String },
  openTime: { type: String },
  closeTime: { type: String },
  closedDays: { type: [String], default: [] },
  
  // 2. Images & Gallery
  coverBanner: { type: String },
  logo: { type: String },
  gallery: { type: [String], default: [] },
  
  // 3. Treatments & Departments
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PhysioDepartment' }],
  treatments: { type: [String], default: [] }, // E.g. Knee Pain, Back Pain
  
  // 4. Home Visit Settings
  homeVisitAvailable: { type: Boolean, default: false },
  serviceRadius: { type: Number, default: 5 }, // in km
  homeVisitCharges: { type: Number, default: 0 },
  
  // 5. Therapist Assignment
  assignedTherapists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  
  // 6. Equipment
  equipment: { type: [String], default: [] },
  
  // 7. Booking Settings
  sessionDuration: { type: Number, enum: [30, 45, 60], default: 45 },
  dailyBookingLimit: { type: Number, default: 20 },
  approvalRequired: { type: Boolean, default: false }, // false = Instant Book
  
  // 8. Display & SEO & State
  rating: { type: Number, default: 5.0 },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  slug: { type: String },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioCenter;
}

export default mongoose.models.PhysioCenter || mongoose.model('PhysioCenter', PhysioCenterSchema);

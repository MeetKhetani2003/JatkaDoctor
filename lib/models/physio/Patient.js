import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true }, // e.g. DJM-PT-000125
  familyId: { type: String }, // Optional linkage
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  whatsappNumber: { type: String },
  email: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String },
  pincode: { type: String },
  totalBookings: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  // Google OAuth
  googleId: { type: String },
  googleEmail: { type: String },
  googleAvatar: { type: String },
  googleName: { type: String },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Patient;
}

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

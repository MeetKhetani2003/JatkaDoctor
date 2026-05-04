import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  role: { type: String, required: true }, // e.g., General Physician
  degree: { type: String }, // e.g., MBBS, MD
  experience: { type: String }, // e.g., 5+ Years
  image: { type: String },
  description: { type: String },
  specialization: [{ type: String }],
  availability: { type: String, default: "Available Today" },
  rating: { type: String, default: "4.9" },
  area: { type: String }, // New field for service area
  isVerified: { type: Boolean, default: true }, // New field for verification status
}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

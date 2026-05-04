import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., Nurse, Technician
  image: { type: String },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

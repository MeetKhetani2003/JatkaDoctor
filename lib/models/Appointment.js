import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  category: { type: String }, // Can be name or ID
  doctor: { type: String },   // Can be name or ID
  date: { type: String },
  time: { type: String },
  notes: { type: String },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

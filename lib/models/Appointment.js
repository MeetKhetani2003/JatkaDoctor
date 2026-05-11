import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  category: { type: String }, // Can be name or ID
  doctor: { type: String },   // Can be name or ID
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Reference to doctor
  date: { type: String },
  time: { type: String },
  appointmentDate: { type: String }, // YYYY-MM-DD format from patient
  appointmentTime: { type: String }, // HH:mm format from patient
  notes: { type: String },
  bookingId: { type: String, unique: true, sparse: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Completed", "Cancelled"] },
}, { timestamps: true });

// Handle model compilation error in development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Appointment;
}

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

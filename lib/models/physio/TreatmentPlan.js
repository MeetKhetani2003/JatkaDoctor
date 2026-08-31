import mongoose from 'mongoose';

const TreatmentPlanSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioBooking', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  totalSessions: { type: Number, required: true },
  completedSessions: { type: Number, default: 0 },
  remainingSessions: { type: Number, required: true }, // Should equal total - completed
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.TreatmentPlan;
}

export default mongoose.models.TreatmentPlan || mongoose.model('TreatmentPlan', TreatmentPlanSchema);

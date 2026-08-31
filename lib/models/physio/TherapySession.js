import mongoose from 'mongoose';

const TherapySessionSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'TreatmentPlan', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioBooking', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Or a dedicated Therapist model if needed
  
  sessionNumber: { type: Number, required: true }, // e.g., 1 of 10
  
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String },
  
  status: { type: String, enum: ['Scheduled', 'Started', 'Completed', 'No Show', 'Cancelled'], default: 'Scheduled' },
  
  therapistNotes: { type: String },
  patientFeedback: { type: String },
  rating: { type: Number },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.TherapySession;
}

export default mongoose.models.TherapySession || mongoose.model('TherapySession', TherapySessionSchema);

import mongoose from 'mongoose';

const FollowupTaskSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Feedback Request', 'Google Review Request', 'Manual Followup'] 
  },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Failed'] },
  remarks: { type: String },
  nextFollowupDate: { type: Date },
  followupStatus: { 
    type: String, 
    enum: ['Pending', 'Contacted', 'No Answer', 'Scheduled', 'Closed'], 
    default: 'Pending' 
  },
  sessionNotes: { type: String },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.FollowupTask;
}

export default mongoose.models.FollowupTask || mongoose.model('FollowupTask', FollowupTaskSchema);

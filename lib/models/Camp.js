import mongoose from 'mongoose';

const CampSchema = new mongoose.Schema({
  campId: { type: String, required: true, unique: true, index: true }, // e.g. CAMP-0001
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, default: 'Lucknow' },
  address: { type: String },
  date: { type: String, required: true }, // YYYY-MM-DD or readable date
  time: { type: String, required: true }, // e.g. "09:00 AM - 04:00 PM"
  campType: { 
    type: String, 
    default: 'Free General Health & Physiotherapy Camp',
    enum: [
      'Free General Health & Physiotherapy Camp',
      'Senior Citizen Wellness Camp',
      'Corporate & Community Health Camp',
      'Specialized Cardiac & Neuro Screening',
      'Other'
    ]
  },
  assignedStaff: [{
    name: { type: String },
    role: { type: String }, // Doctor, Physiotherapist, Camp Staff, Nurse
    phone: { type: String }
  }],
  status: { 
    type: String, 
    default: 'Active', 
    enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'] 
  },
  description: { type: String },
  targetPatients: { type: Number, default: 100 },
  totalRegistered: { type: Number, default: 0 },
  totalChecksCompleted: { type: Number, default: 0 },
  qrCodeToken: { type: String, unique: true, sparse: true }, // Camp direct registration token
  notes: { type: String },
  createdBy: { type: String, default: 'Admin' }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Camp;
}

export default mongoose.models.Camp || mongoose.model('Camp', CampSchema);

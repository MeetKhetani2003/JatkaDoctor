import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Doctor', 'Physiotherapist', 'Nurse', 'Ambulance Staff'] 
  },
  image: { type: String },
  description: { type: String },
  mobile: { type: String },
  whatsapp: { type: String },
  zone: { type: String },
  experience: { type: String },
  qualification: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Busy', 'Offline'], 
    default: 'Active' 
  },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Staff;
}

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

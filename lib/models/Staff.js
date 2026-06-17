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
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Staff;
}

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

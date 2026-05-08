import mongoose from 'mongoose';

const PartnerRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a contact number'],
  },
  email: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  experience: {
    type: String,
  },
  type: {
    type: String,
    required: [true, 'Partner type is required'],
  },
  bio: {
    type: String,
  },
  idFileId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PartnerRegistration || mongoose.model('PartnerRegistration', PartnerRegistrationSchema);

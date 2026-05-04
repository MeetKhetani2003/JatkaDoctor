import mongoose from 'mongoose';

const PhysioCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the center.'],
    maxlength: [100, 'Name cannot be more than 100 characters.'],
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide a subtitle.'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location.'],
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  experience: {
    type: String,
    required: [true, 'Please provide experience years.'],
  },
  imageFileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // For GridFS
  },
  features: {
    type: [String],
    default: [],
  },
  treatments: {
    type: [String],
    default: [],
  },
  numbers: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PhysioCenter || mongoose.model('PhysioCenter', PhysioCenterSchema);

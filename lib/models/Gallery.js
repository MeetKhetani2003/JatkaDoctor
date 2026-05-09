import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

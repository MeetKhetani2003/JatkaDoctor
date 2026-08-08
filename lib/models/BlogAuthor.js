import mongoose from 'mongoose';

const BlogAuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoFileId: { type: String },
  photoUrl: { type: String }, // fallback or direct url
  qualification: { type: String },
  designation: { type: String },
  bio: { type: String },
}, { timestamps: true });

export default mongoose.models.BlogAuthor || mongoose.model('BlogAuthor', BlogAuthorSchema);

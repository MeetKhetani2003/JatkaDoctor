import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // can be ID or name
  
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Draft' },
  publishDate: { type: Date },
  
  // Author
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogAuthor' },
  
  // Main Content
  content: { type: String }, // Rich text HTML
  faqs: [FaqSchema],
  
  // Basic Info
  readTime: { type: String }, // Optional, can be auto-calculated
  
  // Image & Image SEO
  image: { type: String },
  imageFileId: { type: String },
  imageAlt: { type: String },
  imageTitle: { type: String },
  imageCaption: { type: String },
  
  // SEO fields
  metaTitle: { type: String },
  metaDescription: { type: String },
  focusKeyword: { type: String },
  secondaryKeywords: { type: String },
  canonicalUrl: { type: String },
  
  // Analytics
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

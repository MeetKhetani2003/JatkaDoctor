import mongoose from 'mongoose';

const PhysioDepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // Can be an icon name or image URL
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioDepartment;
}

export default mongoose.models.PhysioDepartment || mongoose.model('PhysioDepartment', PhysioDepartmentSchema);

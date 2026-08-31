import mongoose from 'mongoose';

const PhysioProblemGroupSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioDepartment', required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioProblemGroup;
}

export default mongoose.models.PhysioProblemGroup || mongoose.model('PhysioProblemGroup', PhysioProblemGroupSchema);

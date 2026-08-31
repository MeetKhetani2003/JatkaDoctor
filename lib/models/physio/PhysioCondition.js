import mongoose from 'mongoose';

const PhysioConditionSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioProblemGroup', required: true },
  name: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String },
  isPopular: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  relatedConditions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PhysioCondition' }],
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioCondition;
}

export default mongoose.models.PhysioCondition || mongoose.model('PhysioCondition', PhysioConditionSchema);

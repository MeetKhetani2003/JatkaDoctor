import mongoose from 'mongoose';

const PhysioPackageSchema = new mongoose.Schema({
  conditionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioCondition' }, // Optional, if package is linked to specific condition, else general
  title: { type: String, required: true }, // e.g., "5 Sessions", "1 Month"
  description: { type: String },
  icon: { type: String },
  sessionsCount: { type: Number, required: true }, // Number of therapy sessions included
  validityDays: { type: Number, required: true }, // Days package is valid for
  basePrice: { type: Number, required: true }, // Total price of package
  perSessionPrice: { type: Number }, // Computed or manual price per session
  discount: { type: Number, default: 0 }, // Discount percentage or amount
  isRecommended: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioPackage;
}

export default mongoose.models.PhysioPackage || mongoose.model('PhysioPackage', PhysioPackageSchema);

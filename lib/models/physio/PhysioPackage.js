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
  offerPrice: { type: Number }, // Final discounted price
  isRecommended: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

PhysioPackageSchema.pre('save', function (next) {
  if (this.basePrice && this.sessionsCount && this.sessionsCount > 0) {
    this.perSessionPrice = Math.round(this.basePrice / this.sessionsCount);
  }
  next();
});

PhysioPackageSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  // Ensure we have both basePrice and sessionsCount in update, or we might need to fetch the document
  // In typical form submissions, both are sent. If not, it could be tricky. 
  // A simple way is to calculate if both are present in the update payload.
  let basePrice = update.$set?.basePrice !== undefined ? update.$set.basePrice : update.basePrice;
  let sessionsCount = update.$set?.sessionsCount !== undefined ? update.$set.sessionsCount : update.sessionsCount;

  if (basePrice !== undefined && sessionsCount !== undefined && sessionsCount > 0) {
    if (update.$set) {
        update.$set.perSessionPrice = Math.round(basePrice / sessionsCount);
    } else {
        update.perSessionPrice = Math.round(basePrice / sessionsCount);
    }
  }
  next();
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioPackage;
}

export default mongoose.models.PhysioPackage || mongoose.model('PhysioPackage', PhysioPackageSchema);

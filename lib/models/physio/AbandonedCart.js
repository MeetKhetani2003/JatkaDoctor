import mongoose from 'mongoose';

const AbandonedCartSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  sessionId: { type: String },
  
  lastStep: { type: String, required: true }, // e.g., 'ConditionSelection', 'Payment'
  payload: { type: mongoose.Schema.Types.Mixed }, // JSON of selected data (dept, condition, package)
  
  status: { type: String, enum: ['Abandoned', 'Recovered', 'Converted'], default: 'Abandoned' },
  reminderCount: { type: Number, default: 0 },
  lastReminderSentAt: { type: Date },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.AbandonedCart;
}

export default mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', AbandonedCartSchema);

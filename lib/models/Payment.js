import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  transactionId: { type: String },
  bookingId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed', 'Refund Pending', 'Refunded'] },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Payment;
}

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

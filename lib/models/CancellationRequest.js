import mongoose from 'mongoose';

const CancellationRequestSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  reason: { type: String, required: true },
  refundStatus: { 
    type: String, 
    default: "Pending", 
    enum: ["Pending", "Approved", "Refunded"] 
  },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.CancellationRequest;
}

export default mongoose.models.CancellationRequest || mongoose.model('CancellationRequest', CancellationRequestSchema);

import mongoose from 'mongoose';

const CancellationRequestSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  reason: { type: String, required: true },
  refundStatus: { 
    type: String, 
    default: "Pending", 
    enum: ["Pending", "Approved", "Refunded", "Rejected"] 
  },
  refundMethod: {
    type: String,
    enum: ["UPI", "Bank Transfer"]
  },
  refundDetails: {
    upiId: String,
    accountName: String,
    accountNumber: String,
    bankName: String,
    branchName: String,
    ifsc: String,
    email: String,
    phone: String
  },
  userScreenshotId: { type: String }, // GridFS ID for user's payment proof
  adminRefundProofId: { type: String }, // GridFS ID for admin's refund proof
  rejectionReason: { type: String }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.CancellationRequest;
}

export default mongoose.models.CancellationRequest || mongoose.model('CancellationRequest', CancellationRequestSchema);

import mongoose from 'mongoose';

const FinancialAssistanceSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioBooking', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  
  originalPrice: { type: Number, required: true },
  concessionType: { type: String, enum: ['Flat', 'Percentage'], default: 'Flat' },
  concessionValue: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  reason: { type: String },
  
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  
  approvedPrice: { type: Number },
  approvedBy: { type: String }, // Admin username or ID
  adminRemarks: { type: String },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.FinancialAssistance;
}

export default mongoose.models.FinancialAssistance || mongoose.model('FinancialAssistance', FinancialAssistanceSchema);

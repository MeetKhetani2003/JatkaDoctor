import mongoose from 'mongoose';

const PhysioBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioDepartment' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioProblemGroup' },
  conditionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioCondition' },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysioPackage' },
  assignedTherapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  
  // Payment Details
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  concessionAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid', 'Failed'], default: 'Pending' },
  
  // Location & Scheduling
  locationType: { type: String, enum: ['Home', 'Center'], default: 'Home' },
  address: { type: String },
  pincode: { type: String },
  mapLocation: { type: String },
  
  preferredDate: { type: String },
  preferredTime: { type: String },
  
  status: { type: String, enum: ['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled'], default: 'New' },
  createdBy: { type: String, enum: ['Website', 'Admin', 'Phone'], default: 'Website' },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.PhysioBooking;
}

export default mongoose.models.PhysioBooking || mongoose.model('PhysioBooking', PhysioBookingSchema);

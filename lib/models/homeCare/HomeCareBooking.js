import mongoose from 'mongoose';

const HomeCareBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true, index: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['home-care', 'nursing-care'], 
    default: 'home-care',
    index: true 
  },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeCareService', required: true },
  serviceName: { type: String, required: true },
  
  // Patient details (linked to permanent Patient record)
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  patientPermanentId: { type: String, index: true }, // e.g. DJM-PT-000125
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  patientGender: { type: String },
  patientPhone: { type: String, required: true, index: true },
  patientEmail: { type: String },
  
  // Care requirements
  careType: { type: String }, // e.g. "Day Care (8 Hours)", "Short Visit Nursing", "24 Hour Care"
  selectedRequirements: [{ type: String }],
  specialInstructions: { type: String },

  // Location
  address: { type: String, required: true },
  area: { type: String },
  city: { type: String, default: 'Lucknow' },
  pincode: { type: String },
  mapLocation: { type: String },

  // Schedule
  startDate: { type: String, required: true },
  startTime: { type: String },
  duration: { type: String },

  // Assigned Staff / Nurse
  assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  assignedStaffName: { type: String },
  assignedStaffRole: { type: String },

  // Financials
  pricingType: { type: String, default: 'Starting From' },
  basePrice: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Partial', 'Refunded', 'Failed'], 
    default: 'Pending',
    index: true 
  },
  paymentMethod: { type: String, default: 'Online' },
  paymentId: { type: String },

  // Status & Workflow
  bookingStatus: { 
    type: String, 
    enum: [
      'New', 
      'Pending Review', 
      'Quote Required', 
      'Quote Sent', 
      'Confirmed', 
      'Staff Assigned', 
      'On The Way', 
      'In Progress', 
      'Completed', 
      'Cancelled', 
      'Rejected'
    ], 
    default: 'New',
    index: true 
  },

  // Long-Term & Recurring Care Plan
  carePlan: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String }, // Daily, Alternate Days, Weekly, Custom
    totalSessions: { type: Number, default: 1 },
    completedSessions: { type: Number, default: 0 },
  },

  source: { type: String, enum: ['Website', 'Admin', 'Phone', 'WhatsApp'], default: 'Website' },
  activityLogs: [{
    action: { type: String },
    performedBy: { type: String, default: 'System' },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }]
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.HomeCareBooking;
}

export default mongoose.models.HomeCareBooking || mongoose.model('HomeCareBooking', HomeCareBookingSchema);

import mongoose from 'mongoose';

const CarePlanItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Nursing Staff', 'Equipment', 'Doctor Support', 'Physiotherapy Support', 'Consumables', 'Other'],
    required: true
  },
  itemName: { type: String, required: true },
  details: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'Day' }, // Day, Session, Visit, Unit
  duration: { type: String, default: '15 Days' },
  ratePerUnit: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  assignedResource: { type: String, default: '' }, // e.g. Staff Name or Equipment Model
  resourceStatus: { type: String, default: 'Available' }
}, { _id: false });

const IcuRequestSchema = new mongoose.Schema({
  requestId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  patientId: { type: String, index: true }, // e.g. DJM-PT-000009
  patientName: { type: String, required: true },
  age: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String, required: true },
  email: { type: String },
  
  // Care Type & Medical Need
  careType: {
    type: String,
    enum: [
      'Basic ICU Care at Home',
      'Critical Care at Home',
      'Ventilator Support at Home',
      'Post-ICU / Step-Down Care',
      'Palliative / Comfort Care',
      'Assessment / Custom Plan'
    ],
    default: 'Basic ICU Care at Home'
  },
  condition: { type: String, required: true }, // e.g. "Post ICU, breathing issue"
  additionalNotes: { type: String, default: '' },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High'
  },
  
  // Schedule & Location
  startDate: { type: String, required: true }, // YYYY-MM-DD
  duration: { type: String, default: '15 Days' },
  location: { type: String, required: true }, // Address / Gomti Nagar, Lucknow
  zone: { type: String, default: 'Gomti Nagar Zone' },
  timeToStart: { 
    type: String, 
    enum: ['As soon as possible', 'Within 24 hours', 'Within 2-3 days', 'Flexible'],
    default: 'As soon as possible'
  },

  // Initial Requirements selected by family
  requirements: {
    nursingCare: { type: String, default: '24/7 Nursing' }, // 12h, 24h, None
    icuBed: { type: Boolean, default: false },
    patientMonitor: { type: Boolean, default: false },
    oxygenSupport: { type: Boolean, default: false },
    ventilator: { type: Boolean, default: false },
    suctionMachine: { type: Boolean, default: false },
    doctorVisit: { type: Boolean, default: false },
    physiotherapySupport: { type: Boolean, default: false },
    otherRequirements: { type: String, default: '' }
  },

  // Care Plan Builder
  carePlan: {
    planSummary: { type: String, default: '' },
    items: [CarePlanItemSchema],
    nursingShift: { type: String, default: '24 Hours' },
    doctorVisitsCount: { type: Number, default: 2 },
    physioSessionsCount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    carePlanNotes: { type: String, default: '' },
    createdAt: { type: Date }
  },

  // Quotation
  quote: {
    quoteNumber: { type: String },
    validUntil: { type: Date },
    sentAt: { type: Date },
    sentVia: { type: [String], default: [] }, // WhatsApp, Email
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
      default: 'Draft'
    },
    rejectionReason: { type: String }
  },

  // Assigned Team & Resources
  assignments: {
    nursingStaff: [{
      staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
      name: { type: String },
      phone: { type: String },
      shift: { type: String }
    }],
    doctor: {
      staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
      name: { type: String },
      phone: { type: String },
      specialty: { type: String }
    },
    physiotherapist: {
      staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
      name: { type: String },
      phone: { type: String }
    },
    equipment: [{
      name: { type: String },
      modelSerial: { type: String },
      installedAt: { type: Date },
      status: { type: String, default: 'Installed' }
    }]
  },

  // Overall Status
  status: {
    type: String,
    enum: [
      'New',
      'In Review',
      'Care Plan Created',
      'Quote Sent',
      'Accepted',
      'Booking Confirmed',
      'Staff Assigned',
      'On the Way',
      'Arrived',
      'Service Started',
      'Completed',
      'Rejected',
      'Cancelled'
    ],
    default: 'New',
    index: true
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true
  },
  
  // Link to converted Appointment/Booking ID if converted
  convertedBookingId: { type: String },
  
  // Activity / Audit Log
  activityLogs: [{
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  source: { type: String, default: 'Website' },
  createdBy: { type: String, default: 'Patient' }
}, {
  timestamps: true
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.IcuRequest;
}

export default mongoose.models.IcuRequest || mongoose.model('IcuRequest', IcuRequestSchema);

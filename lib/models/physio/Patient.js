import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  // Permanent Lifetime Patient ID (e.g. DJM-PT-000125) - Never changes or reused
  patientId: { type: String, required: true, unique: true, index: true },
  
  // Family Account Linkage (e.g. DJM-FAM-000125)
  familyId: { type: String, index: true },
  isFamilyHead: { type: Boolean, default: false },
  familyRelation: { type: String, default: 'Self' }, // Self, Father, Mother, Son, Daughter, Spouse, Guardian, Other
  
  // Core Information
  name: { type: String, required: true },
  mobile: { type: String, required: true, index: true },
  whatsappNumber: { type: String },
  email: { type: String },
  emailVerified: { type: Boolean, default: false },
  dob: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  city: { type: String, default: 'Lucknow' },
  area: { type: String },
  address: { type: String },
  pincode: { type: String },
  photo: { type: String }, // URL or Base64
  
  // Emergency Contact
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  emergencyContactRelation: { type: String },
  
  // Optional Health Information
  bloodGroup: { type: String },
  bloodGroupStatus: { type: String, enum: ['Self-reported', 'Verified'], default: 'Self-reported' },
  existingConditions: { type: String },
  allergies: { type: String },
  
  // Digital Health Card Attributes
  cardStatus: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  cardVersion: { type: Number, default: 1 },
  cardIssuedAt: { type: Date, default: Date.now },
  cardDeactivatedAt: { type: Date },
  cardDeactivationReason: { type: String },
  qrToken: { type: String, unique: true, sparse: true },
  deliveryStatus: {
    whatsApp: {
      status: { type: String, default: 'Pending', enum: ['Pending', 'Sent', 'Failed'] },
      sentAt: { type: Date },
      error: { type: String }
    },
    email: {
      status: { type: String, default: 'Pending', enum: ['Pending', 'Sent', 'Failed'] },
      sentAt: { type: Date },
      error: { type: String }
    }
  },
  cardHistory: [{
    version: { type: Number },
    generatedAt: { type: Date, default: Date.now },
    updatedFields: [{ type: String }],
    generatedBy: { type: String, default: 'System' }
  }],
  
  // Senior Citizen Benefit (70+ years auto-flagged or admin-assigned)
  isSeniorCitizen: { type: Boolean, default: false },
  seniorCitizenBenefitActive: { type: Boolean, default: true },
  
  // Patient Source Tracking
  source: { 
    type: String, 
    default: 'Website', 
    enum: ['Website', 'Camp', 'WhatsApp', 'Phone', 'Admin', 'Referral', 'Walk-in', 'Other'] 
  },
  campId: { type: String, index: true }, // e.g. CAMP-0001 if registered through or visited a camp
  registeredBy: { type: String, default: 'Self' }, // 'Self', 'Camp Staff', 'Admin'
  
  // Legal & Consent
  healthDataConsent: { type: Boolean, default: true },
  termsAccepted: { type: Boolean, default: true },
  communicationConsent: { type: Boolean, default: true },
  marketingConsent: { type: Boolean, default: false },
  consentTimestamp: { type: Date, default: Date.now },
  
  // Reward / Coin System
  rewardCoinsBalance: { type: Number, default: 50 }, // 50 Welcome bonus coins
  rewardHistory: [{
    coins: { type: Number, required: true },
    type: { type: String, enum: ['Earned', 'Used', 'Expired'], required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  
  // Offers & Benefits Assigned
  offers: [{
    code: { type: String },
    title: { type: String },
    discount: { type: String },
    validTill: { type: Date },
    isUsed: { type: Boolean, default: false }
  }],

  // Follow-up Management
  followupStatus: { 
    type: String, 
    default: 'New', 
    enum: ['New', 'Contacted', 'Follow-up Required', 'Booking', 'Service Completed'] 
  },
  followupDate: { type: Date },
  followupNotes: { type: String },

  // Audit Log
  auditLogs: [{
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  // Notification Preferences
  notificationPreferences: {
    whatsapp: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    offers: { type: Boolean, default: true }
  },

  // Existing legacy stats
  totalBookings: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },

  // Google OAuth
  googleId: { type: String },
  googleEmail: { type: String },
  googleAvatar: { type: String },
  googleName: { type: String },
}, { timestamps: true });

// Pre-save hook to compute senior citizen status
PatientSchema.pre('save', function() {
  if (this.age && this.age >= 70) {
    this.isSeniorCitizen = true;
  }
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Patient;
}

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

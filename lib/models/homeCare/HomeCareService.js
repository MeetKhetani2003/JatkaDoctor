import mongoose from 'mongoose';

const HomeCareServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['home-care', 'nursing-care'], 
    default: 'home-care',
    index: true
  },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  mainImage: { type: String },
  galleryImages: [{ type: String }],
  icon: { type: String },

  // Duration & Staff
  duration: { type: String, default: 'Flexible' },
  requiredStaffType: { 
    type: String, 
    default: 'Caregiver / Attendant'
  },

  // Pricing & Offers
  pricingType: { 
    type: String, 
    enum: ['Fixed Price', 'Starting From', 'Per Visit', 'Hourly', 'Daily', 'Custom Quote', 'Assessment Required'], 
    default: 'Starting From' 
  },
  price: { type: Number, default: 0 },
  priceUnit: { type: String, default: 'day' }, // day, visit, hour, month, session
  hasOffer: { type: Boolean, default: false },
  discountType: { type: String, enum: ['Percentage', 'Fixed'], default: 'Percentage' },
  discountValue: { type: Number, default: 0 },
  offerStartDate: { type: String },
  offerEndDate: { type: String },

  // Clinical & Care Details
  includedServices: [{ type: String }],
  targetPatients: [{ type: String }],
  importantNotes: [{ type: String }],
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],

  // Service Area & Availability
  serviceAreaType: { 
    type: String, 
    enum: ['all', 'zones', 'areas', 'unavailable'], 
    default: 'all' 
  },
  selectedAreas: [{ type: String }],
  availabilityDays: [{ type: String, default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
  workingHours: { type: String, default: '9:00 AM - 8:00 PM' },
  minNoticeTime: { type: String, default: '1 Hour' },
  is24x7: { type: Boolean, default: false },
  isSameDayBooking: { type: Boolean, default: true },

  // Ratings & Social Proof
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 18 },
  verifiedBookingsCount: { type: Number, default: 120 },
  badge: { type: String, default: '' }, // e.g. "Most Booked", "Available Today", "Specialized Care"

  // Controls
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Archived'], 
    default: 'Active',
    index: true 
  },
  showOnWebsite: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.HomeCareService;
}

export default mongoose.models.HomeCareService || mongoose.model('HomeCareService', HomeCareServiceSchema);

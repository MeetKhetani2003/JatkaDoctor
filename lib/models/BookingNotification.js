import mongoose from 'mongoose';

const ChannelLogSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['Browser', 'WhatsApp', 'Email'],
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Pending', 'Failed'],
    default: 'Pending'
  },
  sentAt: { type: Date },
  errorDetails: { type: String, default: '' },
  retryCount: { type: Number, default: 0 }
}, { _id: false });

const BookingNotificationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  service: {
    type: String,
    default: 'General Consultation'
  },
  problem: {
    type: String,
    default: 'N/A'
  },
  preferredDate: {
    type: String,
    default: ''
  },
  preferredTime: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Lucknow'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refund Pending', 'Refunded', 'Uploaded', 'N/A'],
    default: 'Pending'
  },
  source: {
    type: String,
    default: 'Website'
  },
  category: {
    type: String,
    default: 'General'
  },
  notificationType: {
    type: String,
    enum: ['Booking Lead', 'Payment', 'System', 'Prescription'],
    default: 'Booking Lead'
  },
  title: {
    type: String,
    default: 'New Booking Lead Received'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  channels: [ChannelLogSchema],
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.BookingNotification;
}

export default mongoose.models.BookingNotification || mongoose.model('BookingNotification', BookingNotificationSchema);

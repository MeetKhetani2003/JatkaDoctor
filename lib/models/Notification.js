import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  patientId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Card', 'Booking', 'Offer', 'Reward', 'Reminder', 'System', 'Camp'], 
    default: 'System' 
  },
  actionUrl: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Notification;
}

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

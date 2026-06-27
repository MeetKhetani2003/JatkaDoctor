import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  category: { type: String }, // Can be name or ID
  service: { type: String },  // Explicit service name
  doctor: { type: String },   // Can be name or ID
  package: { type: String },  // Selected package name
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Reference to doctor
  date: { type: String },
  time: { type: String },
  appointmentDate: { type: String }, // YYYY-MM-DD format from patient
  appointmentTime: { type: String }, // HH:mm format from patient
  notes: { type: String },
  bookingId: { type: String, unique: true, sparse: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Completed", "Cancelled"] },
  
  // Upgraded Fields (Phase 3)
  bookingStatus: { 
    type: String, 
    default: "New", 
    enum: ["New", "Assigned", "In Progress", "Completed", "Cancelled"] 
  },
  leadSource: { 
    type: String, 
    default: "Website", 
    enum: ["Website", "WhatsApp", "Google Business Profile", "Direct", "Other"] 
  },
  doctorAssigned: { type: String, default: "" },
  physiotherapistAssigned: { type: String, default: "" },
  nurseAssigned: { type: String, default: "" },
  ambulanceAssigned: { type: String, default: "" },
  paymentStatus: { 
    type: String, 
    default: "Pending", 
    enum: ["Pending", "Paid", "Failed", "Refund Pending", "Refunded"] 
  },
  internalNotes: { type: String, default: "" },
  followupRemarks: { type: String, default: "" },
  createdBy: { type: String, default: "System" },
  updatedBy: { type: String, default: "System" },
  patientAddress: { type: String },
  zone: { type: String },
  googleMapLocation: { type: String },
  patientCondition: { type: String },
  emergencyPriority: { 
    type: String, 
    enum: ["Low", "Medium", "High", "Critical"], 
    default: "Medium" 
  },
  totalAmount: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
}, { timestamps: true });

// Handle model compilation error in development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Appointment;
}

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);


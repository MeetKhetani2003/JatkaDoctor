import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    unique: true,
    required: true,
  },
  patientDbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  patientId: {
    type: String,
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true,
  },
  fileGridFsId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  uploadSource: {
    type: String,
    enum: ['Take Photo', 'Gallery', 'Upload PDF', 'Web Upload'],
    default: 'Web Upload',
  },
  notes: {
    type: String,
    trim: true,
  },
  bookingId: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  reviewedBy: {
    type: String,
  },
  reviewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);

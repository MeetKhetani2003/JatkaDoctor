import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema({
  familyId: { type: String, required: true, unique: true, index: true }, // e.g. DJM-FAM-000125
  familyName: { type: String }, // e.g. Verma Family
  primaryPatientId: { type: String, required: true }, // Head of family's Permanent Patient ID
  primaryPhone: { type: String, required: true },
  members: [{
    patientId: { type: String, required: true }, // Member's unique Permanent Patient ID
    name: { type: String, required: true },
    relation: { type: String, required: true }, // Father, Mother, Son, Daughter, Spouse, Guardian, etc.
    mobile: { type: String },
    gender: { type: String },
    age: { type: Number },
    isMinor: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  notes: { type: String }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Family;
}

export default mongoose.models.Family || mongoose.model('Family', FamilySchema);

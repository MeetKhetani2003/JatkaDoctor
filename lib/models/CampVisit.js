import mongoose from 'mongoose';

const CampVisitSchema = new mongoose.Schema({
  patientId: { type: String, required: true, index: true }, // Permanent Patient ID e.g. DJM-PT-000125
  patientName: { type: String },
  campId: { type: String, required: true, index: true }, // e.g. CAMP-0001
  campName: { type: String },
  location: { type: String },
  visitDate: { type: Date, default: Date.now },
  registeredBy: { type: String, default: 'Camp Staff' },

  // Health Check Vitals
  bpSystolic: { type: Number },
  bpDiastolic: { type: Number },
  sugarRBS: { type: Number }, // mg/dL
  spo2: { type: Number }, // %
  pulse: { type: Number }, // bpm
  temperature: { type: Number }, // °F
  weight: { type: Number }, // kg
  height: { type: Number }, // cm
  bmi: { type: Number },
  
  // Clinical Screening & Advice
  postureScreening: { type: String },
  physiotherapyAdvice: { type: String },
  doctorNotes: { type: String },
  recommendedService: { type: String }, // e.g. "Home Physiotherapy", "Doctor Consultation", "Lab Investigation"

  checkStatus: { 
    type: String, 
    enum: ['Pending', 'Completed'], 
    default: 'Completed' 
  },

  // Camp Follow-up
  followupRequired: { type: Boolean, default: false },
  followupDate: { type: Date },
  followupNotes: { type: String }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.CampVisit;
}

export default mongoose.models.CampVisit || mongoose.model('CampVisit', CampVisitSchema);

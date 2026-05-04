"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  Calendar, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const PRIMARY = "#0F9D58";

function BookingFormContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    category: '',
    doctor: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [catsRes, docsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/doctors')
        ]);
        const cats = await catsRes.json();
        const docs = await docsRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
        setDoctors(Array.isArray(docs) ? docs : []);

        // Auto-fill from query params
        const catParam = searchParams.get('category');
        const docParam = searchParams.get('doctor');
        
        if (catParam) setFormData(prev => ({ ...prev, category: catParam }));
        if (docParam) {
          const doc = docs.find(d => d.slug === docParam || d.name === docParam);
          if (doc) {
            setFormData(prev => ({ 
              ...prev, 
              doctor: doc.name,
              category: doc.category?.name || doc.category
            }));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [searchParams]);

  // Filter doctors by selected category
  const filteredDoctors = formData.category 
    ? doctors.filter(d => (d.category?.name === formData.category || d.category === formData.category))
    : doctors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (e) {
      alert("Error booking appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-5 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-normal text-black tracking-tight mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm font-normal mb-8 max-w-xs">
          Our care coordinator will call you shortly to finalize your appointment.
        </p>
        <Link 
          href="/"
          className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-normal shadow-lg shadow-primary/20 active:scale-95 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Info Section */}
      <div className="space-y-3">
        <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest ml-1 mb-1">Patient Details</p>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            required
            value={formData.patientName}
            onChange={e => setFormData({...formData, patientName: e.target.value})}
            type="text" 
            placeholder="Patient Full Name"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            type="tel" 
            placeholder="Phone Number"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Service Section */}
      <div className="space-y-3 pt-4">
        <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest ml-1 mb-1">Service & Doctor</p>
        <div className="relative">
          <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value, doctor: ''})}
            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none text-gray-700"
          >
            <option value="">Select Category / Service</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select 
            value={formData.doctor}
            onChange={e => setFormData({...formData, doctor: e.target.value})}
            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none text-gray-700"
          >
            <option value="">Select Doctor (Optional)</option>
            {filteredDoctors.map(doc => (
              <option key={doc._id} value={doc.name}>{doc.name} - {doc.role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest ml-1">Preferred Date</p>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              type="date" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest ml-1">Time Slot</p>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="">Time Slot</option>
              {["Morning", "Afternoon", "Evening", "Emergency (ASAP)"].map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1 pt-4">
        <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest ml-1">Health Notes (Optional)</p>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
          <textarea 
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder="Briefly describe your symptoms or requirements..."
            rows="3"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
        </div>
      </div>

      <button 
        disabled={isSubmitting}
        type="submit"
        className="w-full h-16 mt-6 bg-primary text-white rounded-2xl text-sm font-normal shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}, #0d8a4e)` }}
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Confirm Booking Appointment <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center mt-4 px-4 font-normal leading-relaxed">
        By clicking confirm, you agree to our terms. Our medical coordinator will reach out within 15-30 minutes.
      </p>
    </form>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft className="w-5 h-5 text-black" />
          </Link>
          <h1 className="text-lg font-normal text-black tracking-tight">Book Appointment</h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 pt-8">
        {/* Trust Header */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-light rounded-3xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-normal text-black tracking-tight mb-2">Hospital-Grade Care at Home</h2>
          <p className="text-gray-400 text-sm font-normal">Trusted by 5000+ families in Lucknow</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[40px] p-6 sm:p-8 border border-gray-100 shadow-sm">
          <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <BookingFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

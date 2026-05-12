"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Send, User, Calendar, Loader2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const PRIMARY = "#0F9D58";
const phone = "8874744756";

function BookingFormInner({ 
  defaultService = "", 
  title = "Get in Touch", 
  subtitle = "We respond within minutes",
  hideService = false,
  defaultDoctor = "",
  defaultPackage = "",
  prefilledMessage = "",
  onSuccess = () => {}
}) {
  const searchParams = useSearchParams();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef(null);
  
  const [categories, setCategories] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [allPackages, setAllPackages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: defaultService,
    otherService: "",
    doctor: defaultDoctor,
    package: defaultPackage,
    appointmentDate: "",
    appointmentTime: "",
    message: prefilledMessage || ""
  });

  // Fetch categories and doctors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, docsRes, ambRes, packRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/doctors'),
          fetch('/api/ambulances'),
          fetch('/api/service-packages')
        ]);
        const cats = await catsRes.json();
        const docs = await docsRes.json();
        const ambs = await ambRes.json();
        const packs = await packRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
        setAllDoctors(Array.isArray(docs) ? docs : []);
        setAmbulances(Array.isArray(ambs) ? ambs : []);
        setAllPackages(Array.isArray(packs) ? packs : []);
        
        // Initial filter if defaultService is provided
        if (defaultService) {
          const filtered = docs.filter(d => 
            (d.category?.name || d.category || "").toLowerCase().includes(defaultService.toLowerCase()) ||
            defaultService.toLowerCase().includes((d.category?.name || d.category || "").toLowerCase())
          );
          setFilteredDoctors(filtered);
        } else {
          setFilteredDoctors(docs);
        }

        // Auto-fill from URL params
        const serviceParam = searchParams.get('service') || searchParams.get('category') || defaultService;
        const doctorParam = searchParams.get('doctor');
        const packageParam = searchParams.get('package') || defaultPackage;

        if (packageParam) {
          setFormData(prev => ({ ...prev, package: packageParam }));
        }

        if (serviceParam) {
          const slugMapping = {
            'ambulance': 'Ambulance Service',
            'physiotherapy': 'Physiotherapy',
            'doctor': 'Doctors',
            'icu': 'ICU Support',
            'home-care': 'Caregivers',
            'nursing': 'Nurses',
            'lab-test': 'Lab Test',
            'equipment': 'Equipment Rental'
          };
          
          const mappedName = slugMapping[serviceParam] || serviceParam;
          
          // Try to find matching category by name or slug
          const matchedCat = cats.find(c => 
            c.slug === serviceParam || 
            c.name.toLowerCase() === serviceParam.toLowerCase() ||
            c.name.toLowerCase() === mappedName.toLowerCase()
          );

          setFormData(prev => ({ ...prev, service: matchedCat ? matchedCat.name : mappedName }));
        }

        if (doctorParam) {
          const doc = docs.find(d => d.slug === doctorParam || d.name.toLowerCase().includes(doctorParam.toLowerCase()));
          if (doc) {
            setFormData(prev => {
              const matchedCatName = doc.category?.name || doc.category || prev.service;
              return { 
                ...prev, 
                doctor: doc.name,
                service: matchedCatName
              };
            });
          }
        }
      } catch (e) {
        console.error("Error fetching form data:", e);
      }
    };
    fetchData();
  }, [searchParams, defaultService]);

  // Update filtered doctors when service changes
  useEffect(() => {
    if (formData.service) {
      const filtered = allDoctors.filter(d => {
        const docCat = (d.category?.name || d.category || "").toLowerCase();
        const selectedCat = formData.service.toLowerCase();
        return docCat.includes(selectedCat) || selectedCat.includes(docCat);
      });
      setFilteredDoctors(filtered.length > 0 ? filtered : allDoctors.slice(0, 10));
    } else {
      setFilteredDoctors(allDoctors);
    }
  }, [formData.service, allDoctors]);

  const [bookingId, setBookingId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    
    setIsSubmitting(true);
    try {
      const token = recaptchaRef.current.getValue();
      if (!token) {
        alert("Please complete the reCAPTCHA");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.name,
          phone: formData.phone,
          email: formData.email,
          category: formData.service === 'Other' ? formData.otherService : (formData.service || 'General Inquiry'),
          service: formData.service === 'Other' ? formData.otherService : formData.service,
          doctor: formData.doctor || 'Any Available',
          package: formData.package || '',
          appointmentDate: formData.appointmentDate || new Date().toISOString().split('T')[0],
          appointmentTime: formData.appointmentTime || '09:00',
          notes: formData.message,
          recaptchaToken: token
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingId(data.bookingId);
        setSuccess(true);
        setFormData({ name: "", phone: "", email: "", service: defaultService, otherService: "", doctor: "", appointmentDate: "", appointmentTime: "", message: "" });
        setAgreed(false);
        onSuccess();
      } else {
        alert(data.error || "Error submitting request. Please try again.");
      }
    } catch (err) {
      alert("Error submitting request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 text-center flex flex-col items-center justify-center min-h-[400px]"
      >
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <Send className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h2>
        
        {bookingId && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 mb-4">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Booking ID</span>
            <div className="text-lg font-black text-primary tracking-tight">{bookingId}</div>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Our care coordinator will contact you at <strong>{phone}</strong> within 15 minutes.
        </p>
        <button 
          onClick={() => {
            setSuccess(false);
            setBookingId("");
          }}
          className="text-primary font-medium hover:underline text-sm"
        >
          Send another request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-12 h-12">
          <Image
            src="/Dr.Jhatka.png"
            alt="Dr Jhatka Medicare"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* FORM */}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            name="name"
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        <div className="relative">
          <input
            name="phone"
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        <div className="relative">
          <input
            name="email"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        {!hideService && (
          <div className="relative">
            <select 
              name="service" 
              required
              value={formData.service}
              onChange={e => setFormData({...formData, service: e.target.value, doctor: ""})}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700 appearance-none"
            >
              <option value="">Select Service</option>
              {/* Always show core services if not in DB categories */}
              {(!categories.some(c => c.name === 'Ambulance Service')) && (
                <option value="Ambulance Service">Ambulance Service</option>
              )}
              {(!categories.some(c => c.name === 'Physiotherapy')) && (
                <option value="Physiotherapy">Physiotherapy</option>
              )}
              {(!categories.some(c => c.name === 'Lab Test')) && (
                <option value="Lab Test">Lab Test</option>
              )}
              {(!categories.some(c => c.name === 'Equipment Rental')) && (
                <option value="Equipment Rental">Equipment Rental</option>
              )}
              
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
              {!categories.length && (
                <>
                  <option>Doctors</option>
                  <option>ICU Support</option>
                  <option>Nurses</option>
                  <option>Caregivers</option>
                </>
              )}
              <option value="Other">Other Service</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        {formData.service === 'Other' && (
          <div className="relative">
            <input
              name="otherService"
              required
              value={formData.otherService}
              onChange={e => setFormData({...formData, otherService: e.target.value})}
              type="text"
              placeholder="Specify Service Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        )}

        <div className="relative">
          {formData.service === 'Ambulance Service' ? (
            <select 
              name="doctor" 
              value={formData.doctor}
              onChange={e => setFormData({...formData, doctor: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700 appearance-none"
            >
              <option value="">Select Preferred Ambulance (Optional)</option>
              <option value="Any Available">Any Available Ambulance</option>
              <optgroup label="Ambulance Types">
                <option value="Normal Ambulance">Normal Ambulance</option>
                <option value="Oxygen Ambulance">Oxygen Ambulance</option>
                <option value="ICU Ventilator Ambulance">ICU Ventilator Ambulance</option>
                <option value="Cardiac Ambulance">Cardiac Ambulance</option>
              </optgroup>
              {ambulances.length > 0 && (
                <optgroup label="Available Nearby">
                  {ambulances.map(amb => (
                    <option key={amb._id} value={amb.name}>{amb.name} ({amb.city})</option>
                  ))}
                </optgroup>
              )}
            </select>
          ) : (allPackages.some(p => p.service === formData.service || p.category === formData.service) || formData.package) ? (
            <select 
              name="package" 
              value={formData.package}
              onChange={e => setFormData({...formData, package: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700 appearance-none"
            >
              <option value="">Select Preferred Package</option>
              {formData.package && !allPackages.some(p => p.name === formData.package) && (
                <option value={formData.package}>{formData.package} (Selected)</option>
              )}
              {allPackages.filter(p => p.service === formData.service || p.category === formData.service).map(p => (
                <option key={p._id} value={p.name}>{p.name} - {p.price}</option>
              ))}
              {!allPackages.filter(p => p.service === formData.service || p.category === formData.service).length && formData.package && (
                 <option value={formData.package}>{formData.package}</option>
              )}
            </select>
          ) : (
            <select 
              name="doctor" 
              value={formData.doctor}
              onChange={e => setFormData({...formData, doctor: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700 appearance-none"
            >
              <option value="">Select Preferred Doctor (Optional)</option>
              <option value="Any Available">Any Available Expert</option>
              {filteredDoctors.map(doc => (
                <option key={doc._id} value={doc.name}>
                  {doc.name} ({doc.role || (doc.category?.name || doc.category)})
                </option>
              ))}
            </select>
          )}
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Appointment Date */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">📅 Preferred Date</label>
          <input
            type="date"
            value={formData.appointmentDate}
            onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700"
          />
        </div>

        {/* Appointment Time */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">⏰ Preferred Time</label>
          <input
            type="time"
            value={formData.appointmentTime}
            onChange={e => setFormData({...formData, appointmentTime: e.target.value})}
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-700"
          />
        </div>

        <textarea
          name="message"
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          placeholder="Your Message / Symptoms"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
        />

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 mt-1 mb-2">
          <input
            id="agreement-universal"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 cursor-pointer"
          />
          <label htmlFor="agreement-universal" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
            I agree to the <Link href="/policies/terms-and-conditions" className="text-primary hover:underline" target="_blank">Terms</Link> & <Link href="/policies/privacy-policy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>. I consent to be contacted by Dr Jhatka Medicare.
          </label>
        </div>

        <div className="mb-2 overflow-hidden flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            size="normal"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !agreed}
          className="bg-primary text-white py-3.5 rounded-xl font-bold mt-1 active:scale-95 transition hover:bg-primary-dark flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Request
        </button>
      </form>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary/10"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>

        <a
          href={`https://wa.me/91${phone}`}
          className="flex items-center justify-center gap-2 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary/10"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

export default function BookingForm(props) {
  return (
    <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <BookingFormInner {...props} />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Send, User, Calendar, Loader2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PRIMARY = "#0F9D58";
const phone = "8874744756";

function BookingFormInner({ 
  defaultService = "", 
  title = "Get in Touch", 
  subtitle = "We respond within minutes",
  hideService = false,
  defaultDoctor = ""
}) {
  const searchParams = useSearchParams();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: defaultService,
    doctor: defaultDoctor,
    message: ""
  });

  // Fetch categories and doctors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, docsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/doctors')
        ]);
        const cats = await catsRes.json();
        const docs = await docsRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
        setAllDoctors(Array.isArray(docs) ? docs : []);
        
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

        if (serviceParam) {
          const slugMapping = {
            'ambulance': 'Ambulance Service',
            'physiotherapy': 'Physiotherapy',
            'doctor': 'Doctor at Home',
            'icu': 'ICU at Home',
            'home-care': 'Home Care Services',
            'nursing': 'Nursing Care',
            'lab-test': 'Lab Test',
            'equipment': 'Equipment Rental'
          };
          
          const mappedName = slugMapping[serviceParam] || serviceParam;
          
          // Try to find matching category by name or slug
          const matchedCat = cats.find(c => 
            c.slug === serviceParam || 
            c.name.toLowerCase() === serviceParam.toLowerCase() ||
            c.name === mappedName
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.name,
          phone: formData.phone,
          category: formData.service || 'General Inquiry',
          doctor: formData.doctor || 'Any Available',
          notes: formData.message
        })
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", phone: "", service: defaultService, doctor: "", message: "" });
        setAgreed(false);
      } else {
        alert("Error submitting request. Please try again.");
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
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Our care coordinator will contact you at <strong>{phone}</strong> within 15 minutes.
        </p>
        <button 
          onClick={() => setSuccess(false)}
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
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
              {!categories.length && (
                <>
                  <option>Ambulance Service</option>
                  <option>Doctor at Home</option>
                  <option>ICU at Home</option>
                  <option>Physiotherapy</option>
                  <option>Lab Test</option>
                  <option>Nursing Care</option>
                  <option>Equipment Rental</option>
                </>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        <div className="relative">
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
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <textarea
          name="message"
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          placeholder="Your Message"
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

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

export default function PartnerRegistrationForm({ title, type }) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 bg-green-50 text-[#0F9D58] rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="text-gray-500 max-w-sm">
          Thank you for your interest in joining the Dr Jhatka Medicare Network. Our team will review your application and contact you within 24–48 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2 bg-[#0F9D58] text-white rounded-xl font-bold hover:bg-[#0c8047] transition-colors"
        >
          Submit Another Response
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{title}</h2>
        <p className="text-gray-500 font-medium">Fill out the form below to register as a {type}.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name / Organization Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Dr. John Doe or City Hospital"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Contact Number</label>
            <input 
              required
              type="tel" 
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 ml-1">City / Location</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Lucknow, Kanpur"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Professional Experience / Bio</label>
          <textarea 
            rows={4}
            placeholder="Tell us about your experience and why you want to join us..."
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Upload ID/License Proof (Optional)</label>
          <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="text-gray-400">Click to upload or drag and drop</div>
            <div className="text-[10px] text-gray-400">PDF, JPG, PNG up to 5MB</div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 mt-4 mb-2">
          <input
            id="agreement-partner"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 cursor-pointer"
          />
          <label htmlFor="agreement-partner" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
            I agree to the <a href="/policies/terms-and-conditions" className="text-[#0F9D58] hover:underline" target="_blank">Terms & Conditions</a> and <a href="/policies/partner-registration-policy" className="text-[#0F9D58] hover:underline" target="_blank">Partner Policy</a>. I understand my data will be used for registration verification.
          </label>
        </div>

        <button 
          type="submit"
          disabled={!agreed}
          className="w-full py-4 bg-[#0F9D58] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#0F9D58]/20 hover:bg-[#0c8047] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          <span>SUBMIT REGISTRATION</span>
        </button>
        
        <p className="text-center text-[10px] text-gray-400">
          By submitting, you agree to our Terms & Conditions and Partner Policy.
        </p>
      </form>
    </div>
  );
}

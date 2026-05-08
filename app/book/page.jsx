"use client";
import React, { Suspense } from 'react';
import { 
  ChevronLeft,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';

const PRIMARY = "#0F9D58";

function BookingFormContent() {
  return (
    <div className="py-2">
      <BookingForm title="Book Appointment" subtitle="Trusted Healthcare at Home" />
    </div>
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

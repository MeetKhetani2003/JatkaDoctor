"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { Calendar, Phone, MessageCircle, Clock, ShieldCheck } from "lucide-react";

export default function BookNowPage() {
  const phone = "8874744756";
  
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Calendar className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-normal text-black tracking-tight mb-4">Book a Service</h1>
        <p className="text-gray-500 font-normal max-w-xl mx-auto mb-12">
          Select your preferred way to book. Our care coordinators are available 24/7 for immediate assistance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <a href={`tel:${phone}`} className="flex flex-col items-center p-8 bg-primary text-white rounded-[40px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition active:scale-95">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Call to Book</h2>
            <p className="text-white/80 text-sm font-normal mb-6">Instant booking & emergency support</p>
            <span className="text-2xl font-normal tracking-wide">+91 {phone}</span>
          </a>
          
          <a href={`https://wa.me/91${phone}`} className="flex flex-col items-center p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:border-primary/30 transition active:scale-95">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-500">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-normal text-black tracking-tight mb-2">WhatsApp Booking</h2>
            <p className="text-gray-500 text-sm font-normal mb-6">Share details & get quote instantly</p>
            <span className="text-xl font-normal text-green-600">Chat with Care Team</span>
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center text-gray-600">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-normal">24/7 Available</span>
          </div>
          <div className="flex items-center gap-3 justify-center text-gray-600">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-normal">Safe Home Care</span>
          </div>
          <div className="flex items-center gap-3 justify-center text-gray-600">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-normal">Same Day Visits</span>
          </div>
        </div>
      </div>
      <StickyBottomBar />
    </main>
  );
}

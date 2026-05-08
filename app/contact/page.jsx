"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import BookingForm from "@/components/BookingForm";

export default function ContactPage() {
  const phone = "8874744756";
  
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-20">
        <h1 className="text-3xl font-normal text-black tracking-tight mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-normal text-black tracking-tight mb-4">Get in Touch</h2>
              <p className="text-gray-500 font-normal">We are available 24/7 for medical emergencies and inquiries.</p>
            </div>
            
            <div className="space-y-4">
              <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary/30 transition shadow-sm">
                <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-normal">Call Us Anytime</p>
                  <p className="text-base font-normal text-black tracking-tight">+91 {phone}</p>
                </div>
              </a>
              
              <a href={`https://wa.me/91${phone}`} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary/30 transition shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-normal">WhatsApp Enquiry</p>
                  <p className="text-base font-normal text-black tracking-tight">Chat with our team</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-normal">Service Area</p>
                  <p className="text-base font-normal text-black tracking-tight">All areas of Lucknow, UP</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
            <BookingForm 
              title="Inquiry Form" 
              subtitle="Get a response within minutes"
            />
          </div>

        </div>
      </div>
      <StickyBottomBar />
    </main>
  );
}

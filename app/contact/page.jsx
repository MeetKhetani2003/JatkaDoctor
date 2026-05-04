"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";

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
            <h2 className="text-xl font-normal text-black tracking-tight mb-6">Inquiry Form</h2>
            <form className="space-y-4" onSubmit={async (e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              try {
                const res = await fetch('/api/appointments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    patientName: data.name,
                    phone: data.phone,
                    category: 'General Enquiry',
                    doctor: data.doctor || 'Any Available',
                    notes: data.message
                  })
                });
                if (res.ok) alert("Enquiry submitted successfully!");
              } catch (err) {
                alert("Error submitting enquiry.");
              }
            }}>
              <div>
                <input name="name" required type="text" placeholder="Your Name" className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <input name="phone" required type="tel" placeholder="Phone Number" className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <select name="doctor" className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none text-gray-700">
                  <option value="">Select Preferred Doctor (Optional)</option>
                  <option value="Any Available">Any Available Expert</option>
                  <option value="Dr. Jhatka">Dr. Jhatka (Physiotherapist)</option>
                  <option value="Dr. Sharma">Dr. Sharma (General Physician)</option>
                  <option value="Dr. Verma">Dr. Verma (Orthopedic)</option>
                </select>
              </div>
              <div>
                <textarea name="message" placeholder="Message / Service Required" rows="4" className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl text-sm font-normal shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Send Enquiry
              </button>
            </form>
          </div>

        </div>
      </div>
      <StickyBottomBar />
    </main>
  );
}

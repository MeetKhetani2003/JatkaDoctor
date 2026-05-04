"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Landmark,
  Hotel,
  Building,
  School
} from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Dubagga",
    city: "Lucknow",
    status: "available",
    eta: "10 - 15 Min",
    icon: Building2,
    badge: "AVAILABLE",
    verified: true,
  },
  {
    id: 2,
    name: "Gomti Nagar",
    city: "Lucknow",
    status: "available",
    eta: "12 - 18 Min",
    icon: Landmark,
    badge: "AVAILABLE",
    verified: true,
  },
  {
    id: 3,
    name: "Aminabad",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: Hotel,
    badge: "COMING SOON",
    verified: false,
  },
  {
    id: 4,
    name: "Alambagh",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: Building,
    badge: "COMING SOON",
    verified: false,
  },
  {
    id: 5,
    name: "Indira Nagar",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: School,
    badge: "COMING SOON",
    verified: false,
  },
];

export default function AmbulanceNetwork() {
  const phone = "8874744756";

  return (
    <section className="py-12 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Our Ambulance Network in Lucknow
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-2 rounded-full" />
          <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            We are expanding our network to be closer to you. Select your nearest location to book an ambulance.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="flex overflow-x-auto pb-8 gap-4 snap-x hide-scrollbar scroll-smooth">
            {locations.map((loc) => {
              const Icon = loc.icon;
              const isAvailable = loc.status === "available";

              return (
                <div
                  key={loc.id}
                  className="min-w-[280px] sm:min-w-[240px] snap-center"
                >
                  <div className={`bg-white rounded-[24px] p-6 border ${isAvailable ? 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'border-gray-100 opacity-80'} flex flex-col items-center text-center relative h-full transition-all duration-300 hover:shadow-lg`}>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${
                      isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {loc.badge}
                    </div>

                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 mt-2 ${
                      isAvailable ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
                    }`}>
                      <Icon className="w-10 h-10" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-0.5">{loc.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{loc.city}</p>
                    
                    <div className="flex items-center gap-1.5 mb-4 text-[13px] font-medium text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      {loc.eta}
                    </div>

                    {/* Trust Factor */}
                    <div className={`flex items-center gap-2 py-2 px-4 rounded-full text-[11px] font-medium mb-6 ${
                      isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isAvailable ? 'text-emerald-500' : 'text-gray-400'}`} />
                      {isAvailable ? 'Verified Ambulance Partner' : 'New Partner Onboarding'}
                    </div>

                    {/* CTA Button */}
                    <a
                      href={isAvailable ? `tel:${phone}` : "#"}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isAvailable 
                        ? 'bg-[#0F9D58] text-white hover:bg-[#0B7A44] shadow-md shadow-emerald-500/20' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? 'Book Now' : 'Coming Soon'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-[#0F9D58] text-[#0F9D58] font-bold text-sm hover:bg-[#0F9D58] hover:text-white transition-all active:scale-95">
            View All Locations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

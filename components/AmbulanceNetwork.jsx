"use client";

import React, { useEffect, useState } from "react";
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
  School,
  Loader2,
  Ambulance
} from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";

const ICON_MAP = {
  Building2,
  Landmark,
  Hotel,
  Building,
  School
};

const staticLocations = [
  {
    id: 1,
    name: "Dubagga",
    city: "Lucknow",
    status: "available",
    eta: "10 - 15 Min",
    icon: "Building2",
    badge: "AVAILABLE",
    verified: true,
  },
  {
    id: 2,
    name: "Gomti Nagar",
    city: "Lucknow",
    status: "available",
    eta: "12 - 18 Min",
    icon: "Landmark",
    badge: "AVAILABLE",
    verified: true,
  },
  {
    id: 3,
    name: "Aminabad",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "Hotel",
    badge: "COMING SOON",
    verified: false,
  },
  {
    id: 4,
    name: "Alambagh",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "Building",
    badge: "COMING SOON",
    verified: false,
  },
  {
    id: 5,
    name: "Indira Nagar",
    city: "Lucknow",
    status: "coming_soon",
    eta: "Launching Soon",
    icon: "School",
    badge: "COMING SOON",
    verified: false,
  },
];

export default function AmbulanceNetwork() {
  const { openAmbulanceModal } = useBookingModal();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/ambulances');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLocations(data);
        } else {
          setLocations(staticLocations);
        }
      } catch (e) {
        setLocations(staticLocations);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <section className="py-12 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight uppercase">
            Our Ambulance Network in Lucknow
          </h2>
          <div className="w-12 h-1 bg-red-500 mx-auto mt-2 rounded-full" />
          <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-2xl mx-auto font-medium">
            24/7 Emergency Support • Average Response Time: 5–10 Minutes
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-8 gap-4 snap-x hide-scrollbar scroll-smooth">
              {locations.map((loc) => {
                const Icon = ICON_MAP[loc.icon] || Building2;
                const isAvailable = loc.status === "available";

                return (
                  <div
                    key={loc._id || loc.id}
                    className="min-w-[280px] sm:min-w-[240px] snap-center"
                  >
                    <div className={`bg-white rounded-[24px] p-6 border ${isAvailable ? 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'border-gray-100 opacity-80'} flex flex-col items-center text-center relative h-full transition-all duration-300 hover:shadow-lg`}>
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${
                        isAvailable ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {loc.badge}
                      </div>

                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 mt-2 ${
                        isAvailable ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <Icon className="w-10 h-10" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-0.5 uppercase tracking-tight">{loc.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">{loc.city}</p>
                      
                      <div className="flex items-center gap-1.5 mb-4 text-[13px] font-bold text-red-600">
                        <Clock className="w-3.5 h-3.5" />
                        {isAvailable ? 'ETA: 5-10 MINS' : loc.eta}
                      </div>

                      {/* Trust Factor */}
                      <div className={`flex items-center gap-2 py-2 px-4 rounded-full text-[11px] font-bold mb-6 ${
                        isAvailable ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isAvailable ? 'text-blue-500' : 'text-gray-400'}`} />
                        {isAvailable ? 'Verified Partner' : 'Onboarding...'}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={isAvailable ? openAmbulanceModal : undefined}
                        disabled={!isAvailable}
                        className={`w-full py-4 rounded-xl text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide ${
                          isAvailable 
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 animate-pulse-red' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <Ambulance className="w-4 h-4" />
                            Book Now
                          </>
                        ) : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-red-600 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95">
            View All Locations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

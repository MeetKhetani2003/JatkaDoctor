"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  ChevronRight,
  ShieldCheck,
  Activity,
  Award,
  Stethoscope,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const centers = [
  {
    id: 1,
    name: "Dr Jhatka Medicare Physiotherapy Center",
    subtitle: "@ Gurudwara Physiotherapy Clinic",
    location: "22/3, Nimbu Park Rd, Lajpat Nagar Colony, Lajpat Nagar, Chowk, Lucknow, Uttar Pradesh 226003",
    rating: 5.0,
    experience: "20+ year experience",
    image: "/images/centers/gurudwara.png",
    features: [
      "Certified Physiotherapist",
      "Background Verified",
      "Advance physiotherapy Equipment"
    ],
    treatments: ["Back Pain", "Knee Pain", "Neck Pain", "Sports Injury", "Stroke Rehab"],
    numbers: ["8874744756", "9026365448"]
  },
  {
    id: 2,
    name: "Dr Jhatka Medicare Physiotherapy Center",
    subtitle: "@ Dhruv Hospital",
    location: "Jehta Rd, Barawan Kalan, Lucknow, Uttar Pradesh 226101",
    rating: 4.8,
    experience: "6+ year experience",
    image: "/images/centers/dhruv.png",
    features: [
      "Certified Physiotherapist",
      "Background Verified",
      "Advance physiotherapy Equipment"
    ],
    treatments: ["Post Surgery Rehab", "Joint Pain", "Sciatica", "Ligament Tear"],
    numbers: ["8874744756", "9026365448"]
  },
  {
    id: 3,
    name: "Dr Jhatka Medicare Physiotherapy Center",
    subtitle: "@ Hiranya Medical Center",
    location: "B-327, Sector B Rd, Mahanagar, Lucknow, Uttar Pradesh 226006",
    rating: 4.9,
    experience: "8+ year experience",
    image: "/images/centers/hiranya.png",
    features: [
      "Certified Physiotherapist",
      "Background Verified",
      "Advance physiotherapy Equipment"
    ],
    treatments: ["Frozen Shoulder", "Cervical", "Slip Disc", "Muscle Strain"],
    numbers: ["8874744756", "9026365448"]
  }
];

export default function PhysiotherapyCenters() {
  const [dynamicCenters, setDynamicCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const phone = "8874744756";

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch("/api/centers");
        if (res.ok) {
          const data = await res.json();
          setDynamicCenters(data);
        }
      } catch (err) {
        console.error("Failed to fetch centers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  // Use dynamic data if available, otherwise fallback to initial centers
  const displayCenters = dynamicCenters.length > 0 ? dynamicCenters : centers;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" /> Our Clinic Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Dr Jhatka Medicare Physiotherapy Centers
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Visit our state-of-the-art physiotherapy clinics equipped with advanced medical technology and expert therapists.
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayCenters.map((center, i) => {
            const centerId = center.id || center._id;
            const imageUrl = center.imageFileId ? `/api/images/${center.imageFileId}` : center.image;
            const numbers = center.numbers && center.numbers.length > 0 ? center.numbers : ["8874744756", "9026365448"];

            return (
              <motion.div
                key={centerId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-500"
              >
                {/* Image Header */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={center.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-gray-900">{center.rating}</span>
                    </div>
                    <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white text-sm font-medium opacity-90">{center.subtitle}</h4>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    {center.name}
                  </h3>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {center.location}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-gray-700">{center.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-gray-700">Certified</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {center.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Treatments */}
                  <div className="mb-8">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Treatments Available</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {center.treatments.map((t) => (
                        <span key={t} className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${numbers[0]}`}
                        className="bg-emerald-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all shadow-md shadow-emerald-200"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${numbers[1]}`}
                        className="bg-white border-2 border-emerald-600 text-emerald-600 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all group/btn">
                      Book Appointment
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

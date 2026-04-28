"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Star } from "lucide-react";

const doctors = [
  {
    name: "Dr. Rajesh Sharma",
    role: "General Physician",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: "4.9",
  },
  {
    name: "Dr. Neha Verma",
    role: "Cardiologist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: "4.8",
  },
  {
    name: "Dr. Amit Singh",
    role: "Orthopedic",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: "4.7",
  },
  {
    name: "Dr. Priya Kapoor",
    role: "Dermatologist",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: "4.9",
  },
];

export default function DoctorsSection() {
  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Our Doctors</h2>
        <span className="text-sm text-emerald-600 font-semibold">
          View all →
        </span>
      </div>

      {/* SCROLL */}
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x hide-scrollbar">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="snap-center shrink-0 w-[200px]"
          >
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* IMAGE */}
              <div className="relative w-full h-[140px]">
                <Image
                  src={doc.image}
                  alt={doc.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {/* RATING */}
                <div className="absolute top-2 right-2 bg-white/95 px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-semibold shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500" />
                  {doc.rating}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-[12.5px] font-semibold text-gray-900 leading-tight">
                  {doc.name}
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">{doc.role}</p>

                {/* CTA */}
                <button
                  onClick={() => (window.location.href = "tel:8707790677")}
                  className="mt-3 w-full flex items-center justify-center gap-2 
                  bg-emerald-600 text-white py-2 rounded-lg text-[12px] font-semibold 
                  active:scale-95 transition"
                >
                  <Phone className="w-4 h-4" />
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

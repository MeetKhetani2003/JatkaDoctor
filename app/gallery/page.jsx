"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  X,
  Grid3X3,
  Ambulance,
  Activity,
  Stethoscope,
  Bed,
  Home,
  Phone,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import StickyBottomBar from "@/components/StickyBottomBar";

const phone = "8707790677";

const categories = [
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "ambulance", name: "Ambulance", icon: Ambulance },
  { id: "physio", name: "Physiotherapy", icon: Activity },
  { id: "doctor", name: "Doctor Visit", icon: Stethoscope },
  { id: "icu", name: "ICU Setup", icon: Bed },
  { id: "homecare", name: "Home Care", icon: Home },
];

const images = [
  {
    src: "/gallery/ambulance-1.jpg",
    category: "ambulance",
    title: "Emergency Ambulance",
  },
  {
    src: "/gallery/ambulance-2.jpg",
    category: "ambulance",
    title: "ICU Ambulance",
  },
  {
    src: "/gallery/physio-1.jpg",
    category: "physio",
    title: "Physiotherapy Session",
  },
  {
    src: "/gallery/physio-2.jpg",
    category: "physio",
    title: "Home Physio Care",
  },
  { src: "/gallery/doctor-1.jpg", category: "doctor", title: "Doctor at Home" },
  {
    src: "/gallery/doctor-2.jpg",
    category: "doctor",
    title: "Patient Checkup",
  },
  { src: "/gallery/icu-1.jpg", category: "icu", title: "ICU Setup" },
  { src: "/gallery/icu-2.jpg", category: "icu", title: "Ventilator Support" },
  {
    src: "/gallery/homecare-1.jpg",
    category: "homecare",
    title: "Nursing Care",
  },
  {
    src: "/gallery/homecare-2.jpg",
    category: "homecare",
    title: "Elderly Care",
  },
  {
    src: "/gallery/equipment-1.jpg",
    category: "homecare",
    title: "Equipment Rental",
  },
  { src: "/gallery/lab-1.jpg", category: "doctor", title: "Sample Collection" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <span className="font-bold text-gray-900">Gallery</span>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <section className="mt-14 px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar snap-x">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-start shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Image Grid */}
      <section className="px-4 pt-2 max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setLightbox(i)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-bold">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 bg-black/90 z-[60]"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full max-w-lg aspect-square">
                <Image
                  src={filtered[lightbox].src}
                  alt={filtered[lightbox].title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white font-bold">
                  {filtered[lightbox].title}
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox(
                        lightbox > 0 ? lightbox - 1 : filtered.length - 1,
                      );
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox(
                        lightbox < filtered.length - 1 ? lightbox + 1 : 0,
                      );
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

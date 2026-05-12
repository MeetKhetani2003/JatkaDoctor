"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "/hero-ambulance.jpeg",
    title: "24x7 Ambulance Service",
    subtitle: "Fast response in Lucknow",
  },
  {
    image: "/hero-icu.jpeg",
    title: "ICU Ambulance Available",
    subtitle: "Advanced life support",
  },
  {
    image: "/hero-doctor.jpeg",
    title: "Doctor at Home",
    subtitle: "Trusted medical care",
  },
  {
    image: "/hero-physio.jpeg",
    title: "Physiotherapy",
    subtitle: "Trusted medical care",
  }
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const paginate = (newDirection) => {
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[380px] sm:h-[380px] mt-20 overflow-hidden lg:mt-20 group">
      {/* SLIDES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -50) {
              paginate(1);
            } else if (swipe > 50) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={slides[index].image}
            alt="banner"
            fill
            priority
            className="object-cover object-[75%_center] sm:object-center select-none"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-12 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-white text-[22px] font-bold leading-tight">
            {slides[index].title}
          </h1>
          <p className="text-white/80 text-sm mt-1 mb-4">
            {slides[index].subtitle}
          </p>

          {/* CTA */}
          <div className="flex gap-3">
            <a
              href="tel:8707790677"
              className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 active:scale-95 animate-pulse-red shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>

            <a
              href="https://wa.me/918707790677"
              className="bg-white text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

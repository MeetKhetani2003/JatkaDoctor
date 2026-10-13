"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: "physiotherapy",
    image: "/newimages/img4.jpeg",
    title: "Physiotherapy at Home",
    link: "/services/physiotherapy",
    alt: "Physiotherapy at Home - Dr Jhatka Medicare",
  },
  {
    id: "doctor",
    image: "/newimages/img5.jpeg",
    title: "Doctor Visit at Home",
    link: "/services/doctor",
    alt: "Doctor Visit at Home - Dr Jhatka Medicare",
  },
  {
    id: "icu",
    image: "/newimages/img6.jpeg",
    title: "ICU at Home",
    link: "/icu-at-home",
    alt: "ICU at Home - Dr Jhatka Medicare",
  },
  {
    id: "ambulance",
    image: "/newimages/img7.jpeg",
    title: "Ambulance at Home",
    link: "/services/ambulance",
    alt: "Ambulance at Home - Dr Jhatka Medicare",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const paginate = (newDirection) => {
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  // Auto slide
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, index]);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 mt-16 sm:mt-20">
      <div
        className="relative w-full aspect-[16/7.2] sm:aspect-[16/6.8] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group bg-emerald-950"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SLIDES */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset }) => {
              const swipe = offset.x;
              if (swipe < -40) {
                paginate(1);
              } else if (swipe > 40) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 cursor-pointer select-none"
          >
            <Link
              href={slides[index].link}
              className="block w-full h-full relative"
              title={slides[index].title}
            >
              <Image
                src={slides[index].image}
                alt={slides[index].alt}
                fill
                priority={index === 0}
                className="object-cover object-center select-none"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* LEFT / RIGHT ARROWS (DESKTOP) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            paginate(-1);
          }}
          aria-label="Previous slide"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            paginate(1);
          }}
          aria-label="Next slide"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* DOT INDICATORS */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                i === index ? "w-5 sm:w-6 bg-white shadow-xs" : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

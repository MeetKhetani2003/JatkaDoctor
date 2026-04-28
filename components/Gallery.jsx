"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1588776814546-ec7e9c8c1d1a",
  "https://images.unsplash.com/photo-1576765608622-067973a79f53",
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
  "https://images.unsplash.com/photo-1580281658629-4b3e7e32e2f0",
  "https://images.unsplash.com/photo-1600959907703-125ba1374a12",
];
export default function GallerySection() {
  const [active, setActive] = useState(null);
  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Gallery</h2>
        <span className="text-sm text-emerald-600 font-semibold">
          View all →
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.96 }}
            className="relative w-full h-[140px] rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setActive(i)}
          >
            <Image
              src={`${img}?auto=format&fit=crop&w=800&q=80`}
              alt="gallery"
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {active !== null && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setActive(null)}
            />

            {/* IMAGE VIEW */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-md">
                {/* CLOSE */}
                <button
                  onClick={() => setActive(null)}
                  className="absolute -top-10 right-0 text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <Image
                  src={images[active]}
                  alt="preview"
                  width={500}
                  height={500}
                  className="rounded-xl object-contain"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const videos = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1588776814546-ec7e9c8c1d1a?q=80&w=800",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Emergency Response Experience",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=800",
    video: "https://www.w3schools.com/html/movie.mp4",
    title: "Quick Ambulance Service",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Doctor at Home Service",
  },
];

export default function VideoTestimonials() {
  const [active, setActive] = useState(null);

  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">
          Video Testimonials
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real experiences from our patients
        </p>
      </div>

      {/* CARDS */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x hide-scrollbar">
        {videos.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="snap-center shrink-0 w-[240px]"
          >
            <div
              onClick={() => setActive(item)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* IMAGE */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-[160px] object-cover group-hover:scale-105 transition"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-emerald-600 ml-1" />
                </div>
              </div>
            </div>

            <p className="text-[12px] font-semibold text-gray-900 mt-2">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {active && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            />

            {/* VIDEO MODAL */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
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

                {/* VIDEO */}
                <video
                  src={active.video}
                  controls
                  autoPlay
                  className="w-full rounded-2xl shadow-xl"
                />

                {/* TITLE */}
                <p className="text-white text-sm mt-3 text-center">
                  {active.title}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

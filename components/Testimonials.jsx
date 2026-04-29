"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Gomti Nagar, Lucknow",
    rating: 5,
    text: "Very fast service! Ambulance arrived within 15 minutes. The staff was very professional and handled the emergency perfectly. Thanks to the team for the quick response.",
    service: "Ambulance Service",
  },
  {
    id: 2,
    name: "Anil Sharma",
    location: "Indira Nagar, Lucknow",
    rating: 5,
    text: "Very professional ICU setup at home. The team was supportive and took excellent care of my father. Equipment was top-notch and nurses were well trained.",
    service: "ICU at Home",
  },
  {
    id: 3,
    name: "Neha Verma",
    location: "Aliganj, Lucknow",
    rating: 5,
    text: "Doctor came on time and gave proper treatment. Very good experience with home visit service. Will definitely recommend to everyone in my locality.",
    service: "Doctor at Home",
  },
  {
    id: 4,
    name: "Amit Verma",
    location: "Hazratganj, Lucknow",
    rating: 5,
    text: "Very good physiotherapist. Got relief in my back pain in few sessions. Highly recommended! The home visit convenience is a game changer for elderly patients.",
    service: "Physiotherapy",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          What Our Patients Say
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real experiences from real patients
        </p>
      </div>

      {/* TESTIMONIAL CARD */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start gap-1 mb-3">
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>

            <Quote className="w-8 h-8 text-primary/20 mb-2" />

            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {testimonials[active].text}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {testimonials[active].name}
                </p>
                <p className="text-xs text-gray-500">
                  {testimonials[active].location}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
                {testimonials[active].service}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-gray-100 hover:bg-primary-light transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full bg-gray-100 hover:bg-primary-light transition active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

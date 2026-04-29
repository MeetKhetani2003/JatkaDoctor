"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  ShieldCheck,
  Users,
  BadgeCheck,
  HeartPulse,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24x7 Available",
    desc: "Round the clock emergency support",
  },
  {
    icon: Zap,
    title: "Fast Response",
    desc: "Ambulance reaches in 10-15 mins",
  },
  {
    icon: ShieldCheck,
    title: "ISO Certified",
    desc: "Highest quality standards maintained",
  },
  {
    icon: Users,
    title: "Verified Staff",
    desc: "Background checked professionals",
  },
  {
    icon: BadgeCheck,
    title: "Doctor Verified",
    desc: "All treatments supervised by MDs",
  },
  {
    icon: HeartPulse,
    title: "Affordable Pricing",
    desc: "Best rates guaranteed in city",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Why Choose Us</h2>
        <p className="text-sm text-gray-500 mt-1">
          Trusted by thousands of families in Lucknow
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {features.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-gray-100 
              p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(15,157,88,0.08)] transition-all text-center"
            >
              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-light mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary" />
              </div>

              {/* TEXT */}
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {item.title}
              </h3>

              <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Users, Clock, Gauge, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "1000+", label: "Happy Patients" },
  { icon: Clock, value: "24x7", label: "Active Service" },
  { icon: Gauge, value: "10-15 Min", label: "Fast Response" },
  { icon: Award, value: "50+", label: "Partner Clinics" },
];

export default function StatsStrip() {
  return (
    <section className="px-4 pt-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary-soft rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-primary-dark leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}

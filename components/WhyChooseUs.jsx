"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, User, MapPin } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24x7 Availability",
    desc: "Always ready for emergency",
  },
  {
    icon: CheckCircle,
    title: "10–15 Min Response",
    desc: "Fast arrival guaranteed",
  },
  {
    icon: User,
    title: "Expert Staff",
    desc: "Trained medical professionals",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "GPS enabled ambulance",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-4 pt-10">
      {/* TITLE */}
      <div className="mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Why Choose Us</h2>
        <p className="text-sm text-gray-500 mt-1">
          Trusted emergency healthcare services
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-gradient-to-br from-white to-gray-50 
              p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              {/* ICON */}
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 mb-3">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>

              {/* TEXT */}
              <h3 className="text-[13px] font-semibold text-gray-900 leading-tight">
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

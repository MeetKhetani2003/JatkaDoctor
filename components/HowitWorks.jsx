"use client";

import { motion } from "framer-motion";
import { PhoneCall, MapPin, Ambulance } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "Call or Book",
    desc: "Call us or book instantly via WhatsApp",
  },
  {
    icon: MapPin,
    title: "Share Location",
    desc: "Provide your pickup location details",
  },
  {
    icon: Ambulance,
    title: "Ambulance Arrives",
    desc: "Our team reaches you within minutes",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 pt-10">
      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900">How It Works</h2>
        <p className="text-sm text-gray-500 mt-1">
          Quick and simple process to get help
        </p>
      </div>

      {/* STEPS */}
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex items-start gap-4 bg-white rounded-2xl p-4 
              shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              {/* STEP NUMBER */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>

                {/* CONNECTOR LINE */}
                {i !== steps.length - 1 && (
                  <div className="w-[2px] h-10 bg-emerald-100 mt-2" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex gap-3">
                {/* ICON */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

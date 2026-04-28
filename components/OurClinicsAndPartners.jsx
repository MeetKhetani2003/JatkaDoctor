"use client";

import { motion } from "framer-motion";

const partners = [
  "City Hospital",
  "Care Clinic",
  "Apollo Care",
  "MedLife Center",
  "HealthPlus",
  "Prime Diagnostics",
];

export default function PartnersSection() {
  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900">
          Our Clinics & Partners
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Trusted by leading healthcare providers
        </p>
      </div>

      {/* SCROLL */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {partners.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="snap-center shrink-0 w-[150px]"
          >
            <div
              className="bg-white rounded-2xl p-4 
            shadow-[0_6px_20px_rgba(0,0,0,0.05)]
            flex flex-col items-center justify-center text-center
            active:scale-95 transition"
            >
              {/* LOGO BADGE */}
              <div
                className="w-12 h-12 rounded-xl bg-emerald-50 
              flex items-center justify-center mb-3"
              >
                <span className="text-emerald-600 font-bold text-lg">
                  {name.charAt(0)}
                </span>
              </div>

              {/* NAME */}
              <h3 className="text-[12px] font-semibold text-gray-900 leading-tight">
                {name}
              </h3>

              {/* TYPE */}
              <p className="text-[10px] text-gray-500 mt-1">
                Healthcare Partner
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TRUST STRIP */}
      <div className="mt-6 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            50+ Trusted Clinics
          </p>
          <p className="text-xs text-gray-500">Serving across your city</p>
        </div>

        <div className="text-emerald-600 text-lg font-bold">✓</div>
      </div>
    </section>
  );
}

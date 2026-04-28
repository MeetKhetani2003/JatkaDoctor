"use client";

import { MapPin, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const areas = [
  { name: "Lucknow", status: "active" },
  { name: "Kanpur", status: "soon" },
  { name: "Ayodhya", status: "soon" },
  { name: "Varanasi", status: "soon" },
];

export default function ServiceArea() {
  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Service Areas</h2>
        <p className="text-sm text-gray-500 mt-1">
          Currently serving Lucknow. Expanding soon.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3">
        {areas.map((area, i) => {
          const isActive = area.status === "active";

          return (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 flex items-center gap-3 
              ${
                isActive
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              {/* ICON */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center 
                ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-gray-900">
                  {area.name}
                </h3>

                <div className="flex items-center gap-1 mt-1 text-[10px] font-medium">
                  {isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Available Now</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400">Coming Soon</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

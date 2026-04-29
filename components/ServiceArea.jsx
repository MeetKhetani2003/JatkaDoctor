"use client";

import { MapPin, CheckCircle, Clock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const areas = [
  {
    name: "Lucknow",
    status: "active",
    areas: "Gomti Nagar, Indira Nagar, Aliganj, Hazratganj",
  },
  { name: "Kanpur", status: "soon" },
  { name: "Ayodhya", status: "soon" },
  { name: "Varanasi", status: "soon" },
];

export default function ServiceArea() {
  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Service Areas</h2>
        <p className="text-sm text-gray-500 mt-1">
          Currently serving Lucknow. Expanding across Uttar Pradesh.
        </p>
      </div>

      {/* CITY SELECTOR */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Selected City</p>
              <p className="text-base font-bold text-gray-900 flex items-center gap-1">
                Lucknow <ChevronDown className="w-4 h-4 text-gray-400" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {areas.map((area, i) => {
          const isActive = area.status === "active";

          return (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 
              ${isActive ? "bg-primary-soft border-2 border-primary/20" : "bg-white border border-gray-100"}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center 
                ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">{area.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold">
                  {isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-primary" />
                      <span className="text-primary">Available Now</span>
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

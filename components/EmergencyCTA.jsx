"use client";

import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const phone = "8874744756";

export default function EmergencyCTA() {
  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl p-6 overflow-hidden bg-primary"
      >
        {/* BACKGROUND PATTERN */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                Live Emergency Support
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Need Emergency Help?
            </h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-white/90 text-sm">
                <Clock className="w-4 h-4" /> 10–15 Min Response
              </span>
              <span className="flex items-center gap-1.5 text-white/90 text-sm">
                <MapPin className="w-4 h-4" /> Lucknow
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-5 sm:mt-0">
            <a
              href={`tel:${phone}`}
              className="flex-1 sm:flex-none bg-white text-red-600 px-6 py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition flex items-center justify-center gap-2 hover:bg-red-50 animate-pulse-red"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>

            <a
              href={`https://wa.me/91${phone}`}
              className="flex-1 sm:flex-none bg-primary-dark text-white border-2 border-white/30 px-6 py-3.5 rounded-xl font-bold active:scale-95 transition flex items-center justify-center gap-2 hover:bg-primary-light hover:text-primary"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

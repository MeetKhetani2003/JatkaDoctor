"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencyCTA() {
  return (
    <section className="px-4 pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl p-5 overflow-hidden 
        bg-gradient-to-br from-emerald-600 to-emerald-700 text-white"
      >
        {/* PULSE EFFECT */}
        <div className="absolute inset-0 opacity-20 animate-pulse bg-white/10" />

        {/* CONTENT */}
        <div className="relative z-10">
          <h2 className="text-[18px] font-bold leading-tight">
            Need Emergency Help?
          </h2>

          <p className="text-sm text-white/90 mt-1">
            Ambulance arrives within 10–15 minutes
          </p>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">
            {/* CALL */}
            <a
              href="tel:8707790677"
              className="flex-1 bg-white text-emerald-700 py-3 rounded-xl 
              flex items-center justify-center gap-2 font-semibold 
              shadow-md active:scale-95 transition"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/918707790677"
              className="flex-1 bg-black/20 border border-white/30 
              py-3 rounded-xl flex items-center justify-center gap-2 
              font-semibold active:scale-95 transition"
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

"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const phone = "8874744756";

export default function StickyBottomBar({ phone = "8874744756" }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary shadow-[0_-4px_20px_rgba(0,0,0,0.15)] sm:hidden"
    >
      <div className="flex items-center">
        <a
          href={`tel:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm bg-red-600 animate-pulse-red transition"
        >
          <Phone className="w-5 h-5" />
          <div className="text-left leading-tight">
            <div className="text-[10px] opacity-90 font-medium">Call Now</div>
            <div>{phone}</div>
          </div>
        </a>

        <div className="w-px h-8 bg-white/20" />

        <a
          href={`https://wa.me/91${phone}`}
          className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm active:bg-primary-dark transition"
        >
          <MessageCircle className="w-5 h-5" />
          <div className="text-left leading-tight">
            <div className="text-[10px] opacity-90 font-medium">WhatsApp</div>
            <div>Chat Now</div>
          </div>
        </a>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-primary" />
    </motion.div>
  );
}

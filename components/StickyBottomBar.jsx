"use client";

import { Phone, MessageCircle, Truck } from "lucide-react";
import { motion } from "framer-motion";

const phone = "8874744756";
const whatsapp = "8707790677";

export default function StickyBottomBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-white/10 sm:hidden"
    >
      <div className="flex items-center h-[64px]">
        {/* CALL */}
        <a
          href={`tel:${phone}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 h-full text-white active:bg-white/10 transition-colors"
        >
          <Phone size={20} className="text-[#0F9D58]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Call Now</span>
        </a>

        <div className="w-px h-8 bg-white/10" />

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/91${whatsapp}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 h-full text-white active:bg-white/10 transition-colors"
        >
          <MessageCircle size={20} className="text-[#25D366]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>

        {/* AMBULANCE - HIGHLIGHTED */}
        <a
          href={`tel:${phone}`}
          className="flex-[1.2] flex items-center justify-center gap-2 h-full bg-red-600 text-white font-black px-2 active:bg-red-700 transition-colors"
        >
          <Truck size={20} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] opacity-90 uppercase">Emergency</span>
            <span className="text-sm">AMBULANCE</span>
          </div>
        </a>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#111111]" />
    </motion.div>
  );
}

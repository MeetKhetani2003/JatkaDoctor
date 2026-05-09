"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaUserMd, FaWhatsapp } from "react-icons/fa";
import { CalendarCheck, PhoneCall, Menu } from "lucide-react";
import { motion } from "framer-motion";

const phone = "8874744756";
const whatsapp = "8707790677";

export default function StickyBottomBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between h-[68px] px-3">
        {/* Doctors */}
        <Link
          href="/our-medical-team"
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
        >
          <FaUserMd size={26} className="text-[#003366] mb-0.5" />
          <span className="text-[12px] font-semibold tracking-tight leading-none">Doctors</span>
        </Link>

        {/* Book Appt */}
        <Link
          href={pathname?.startsWith('/services/') ? `/book?service=${pathname.split('/services/')[1]}` : "/book"}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
        >
          <CalendarCheck size={26} strokeWidth={2} className="text-[#003366] mb-0.5" />
          <span className="text-[12px] font-semibold tracking-tight leading-none whitespace-nowrap">Book Appt</span>
        </Link>

        {/* Chat */}
        <a
          href={`https://wa.me/91${whatsapp}`}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
        >
          <FaWhatsapp size={32} className="text-[#25D366] drop-shadow-sm mb-0.5" />
          <span className="text-[12px] font-semibold tracking-tight leading-none">Chat</span>
        </a>

        {/* Call Us */}
        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
        >
          <PhoneCall size={26} strokeWidth={2} className="text-[#003366] mb-0.5" />
          <span className="text-[12px] font-semibold tracking-tight leading-none whitespace-nowrap">Call Us</span>
        </a>

        {/* Menu */}
        <button
          onClick={(e) => {
             e.preventDefault();
             window.dispatchEvent(new Event('open-mobile-menu'));
          }}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
        >
          <Menu size={30} strokeWidth={2.5} className="text-[#003366] mb-0.5" />
          <span className="text-[12px] font-semibold tracking-tight leading-none">Menu</span>
        </button>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </motion.div>
  );
}

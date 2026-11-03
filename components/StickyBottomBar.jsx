"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBookingModal } from "@/context/BookingModalContext";
import { usePatientAuth } from "@/context/PatientAuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { CalendarCheck, PhoneCall, Ambulance, User } from "lucide-react";
import { motion } from "framer-motion";

const phone = "8874744756";
const whatsapp = "8707790677";

export default function StickyBottomBar() {
  const { openModal, openAmbulanceModal } = useBookingModal();
  const { loggedIn, patient } = usePatientAuth();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between h-[66px] px-1.5">
        {/* 1. Emergency Ambulance (FIRST) */}
        <button
          onClick={openAmbulanceModal}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-white transition-all active:scale-95 rounded-xl mx-0.5"
          style={{
            background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          }}
          aria-label="Book Emergency Ambulance"
        >
          <Ambulance size={24} strokeWidth={2.5} className="text-white animate-pulse" />
          <span className="text-[10px] font-black tracking-tight leading-none uppercase">Ambulance</span>
        </button>

        {/* 2. Book Appt */}
        <button
          onClick={() => {
            const s = pathname?.startsWith('/services/') ? pathname.split('/services/')[1] : "";
            openModal({ service: s });
          }}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
          aria-label="Book Appointment"
        >
          <CalendarCheck size={22} strokeWidth={2} className="text-[#003366]" />
          <span className="text-[11px] font-semibold tracking-tight leading-none whitespace-nowrap">Book Appt</span>
        </button>

        {/* 3. WhatsApp Chat */}
        <a
          href={`https://wa.me/91${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={26} className="text-[#25D366] drop-shadow-xs" />
          <span className="text-[11px] font-semibold tracking-tight leading-none">Chat</span>
        </a>

        {/* 4. Call Us */}
        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#003366] active:bg-gray-50 transition-colors"
          aria-label="Call Dr Jhatka Medicare"
        >
          <PhoneCall size={22} strokeWidth={2} className="text-[#003366]" />
          <span className="text-[11px] font-semibold tracking-tight leading-none whitespace-nowrap">Call Us</span>
        </a>

        {/* 5. Profile (LAST RIGHT SIDE) */}
        <Link
          href={loggedIn ? "/patient/profile" : "/patient/dashboard"}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors active:bg-gray-50 ${
            pathname?.startsWith("/patient") ? "text-[#006837] font-bold" : "text-[#003366]"
          }`}
          aria-label="Patient Profile"
        >
          {loggedIn && patient?.avatar ? (
            <img
              src={patient.avatar}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover border border-[#006837]"
            />
          ) : (
            <div className="relative">
              <User size={22} strokeWidth={2} className={pathname?.startsWith("/patient") ? "text-[#006837]" : "text-[#003366]"} />
              {loggedIn && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              )}
            </div>
          )}
          <span className="text-[11px] font-semibold tracking-tight leading-none">
            {loggedIn && patient?.name ? patient.name.split(" ")[0] : "Profile"}
          </span>
        </Link>
      </div>

      {/* Safe area padding for iOS notch */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </motion.div>
  );
}

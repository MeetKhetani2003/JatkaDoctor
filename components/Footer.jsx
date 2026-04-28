"use client";

import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gray-950 text-white">
      {/* 🔥 TOP CTA STRIP */}
      <div className="px-4 pt-6">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Need Immediate Assistance?</p>
            <p className="text-xs text-white/80">Ambulance within 10–15 mins</p>
          </div>

          <a
            href="tel:8707790677"
            className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold active:scale-95"
          >
            Call Now
          </a>
        </div>
      </div>

      {/* 🔥 CONTACT CARD */}
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <h2 className="text-[18px] font-bold">Get in Touch</h2>

          <p className="text-sm text-gray-400 mt-1">
            We’ll get back to you within minutes
          </p>

          {/* FORM */}
          <form className="mt-5 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <textarea
              placeholder="Your Message"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              className="bg-emerald-600 py-3 rounded-lg font-semibold mt-2 active:scale-95 transition"
            >
              Submit Request
            </button>
          </form>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <a
              href="tel:8707790677"
              className="flex items-center justify-center gap-2 bg-gray-800 py-3 rounded-xl text-sm active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-500" />
              Call
            </a>

            <a
              href="https://wa.me/918707790677"
              className="flex items-center justify-center gap-2 bg-gray-800 py-3 rounded-xl text-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* 🔥 FOOTER INFO */}
      <div className="px-4 pb-6 border-t border-gray-800">
        <div className="pt-6 flex flex-col gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-500" />
            support@drjhatka.com
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Lucknow, Uttar Pradesh
          </div>
        </div>

        {/* MINI NAV */}
        <div className="flex justify-between text-xs text-gray-500 mt-6">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-4 text-xs text-gray-600 text-center">
          © 2026 Dr. Jhatka Medicare
        </div>
      </div>
    </footer>
  );
}

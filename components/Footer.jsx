"use client";

import { Phone, MessageCircle, Mail, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const phone = "8874744756";

export default function Footer() {
  return (
    <footer className="mt-10 bg-primary-soft border-t border-primary/10">
      {/* TOP CTA STRIP */}
      <div className="px-4 pt-6 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-primary p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg">
              Need Immediate Assistance?
            </p>
            <p className="text-white/80 text-sm">
              Ambulance within 10–15 mins • 24/7 Available
            </p>
          </div>

          <a
            href={`tel:${phone}`}
            className="bg-white text-primary px-6 py-3 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-gray-50 shadow-lg flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call {phone}
          </a>
        </div>
      </div>

      {/* CONTACT CARD */}
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-12 h-12">
              <Image
                src="/Dr.Jhatka.png"
                alt="Dr Jhatka Medicare"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Get in Touch</h2>
              <p className="text-sm text-gray-500">We respond within minutes</p>
            </div>
          </div>

          {/* FORM */}
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />

            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-gray-600">
              <option>Select Service</option>
              <option>Ambulance Service</option>
              <option>Doctor at Home</option>
              <option>ICU at Home</option>
              <option>Physiotherapy</option>
              <option>Lab Test</option>
              <option>Nursing Care</option>
              <option>Equipment Rental</option>
            </select>

            <textarea
              placeholder="Your Message"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />

            <button
              type="submit"
              className="bg-primary text-white py-3.5 rounded-xl font-bold mt-1 active:scale-95 transition hover:bg-primary-dark flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>
          </form>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary/10"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>

            <a
              href={`https://wa.me/91${phone}`}
              className="flex items-center justify-center gap-2 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* FOOTER INFO */}
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <div className="pt-6 border-t border-primary/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              support@drjhatka.com
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              +91 {phone}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Lucknow, Uttar Pradesh
            </div>
          </div>

          {/* MINI NAV */}
          <div className="flex justify-center sm:justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-6 text-xs text-gray-500 font-medium">
              <span className="hover:text-primary cursor-pointer transition">
                Privacy Policy
              </span>
              <span className="hover:text-primary cursor-pointer transition">
                Terms
              </span>
              <span className="hover:text-primary cursor-pointer transition">
                Support
              </span>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-4 text-xs text-gray-400 text-center">
            © 2026 Dr. Jhatka Medicare. All rights reserved. | ISO 9001:2015
            Certified
          </div>
        </div>
      </div>
    </footer>
  );
}

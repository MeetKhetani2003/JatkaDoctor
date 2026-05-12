"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function OfferPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("offer_popup_shown");
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("offer_popup_shown", "true");
  };

  const whatsappLink = `https://wa.me/918004123456?text=${encodeURIComponent("Hello, I want to book healthcare service.")}`;
  const callLink = "tel:+918004123456";

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[480px] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-500 hover:text-gray-900 shadow-sm transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-48 sm:h-56">
              <Image
                src="/images/offer-popup.png"
                alt="Healthcare Offer"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Limited Time Offer
                </span>
              </div>
            </div>
            <div className="px-6 pb-8 pt-2 flex flex-col items-center text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                🎉 Special Healthcare Offer
              </h2>
              <div className="bg-primary-light text-primary font-semibold px-4 py-2 rounded-xl text-lg sm:text-xl mb-6">
                Get ₹100 OFF on First Home Visit
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8 w-full">
                <div className="flex flex-col gap-2 items-start text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>Physiotherapy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>Doctor Visit</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-start text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>24x7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>Verified Pros</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href={callLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

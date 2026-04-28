"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const phone = "8707790677";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Home",
    "Services",
    "Doctors",
    "Ambulance",
    "Physiotherapy",
    "Lab Tests",
    "Blog",
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-auto flex items-center">
              <Image
                src="/Dr.Jhatka.png"
                alt="Dr Jhatka Medicare"
                width={160}
                height={50}
                priority
                className="object-contain h-full w-auto scale-110"
              />
            </div>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">
            {/* CALL ICON */}
            <button
              onClick={() => (window.location.href = `tel:${phone}`)}
              className="p-2 rounded-full bg-gray-100 active:scale-90 transition"
            >
              <Phone className="w-5 h-5" />
            </button>

            {/* MENU */}
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-full bg-gray-100 active:scale-90 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING WHATSAPP CTA */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() =>
          window.open(`https://wa.me/${phone}?text=Hello Doctor`, "_blank")
        }
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">Chat</span>
      </motion.button>

      {/* FULL SCREEN MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[100] flex flex-col"
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-5 h-16 border-b">
              <span className="font-bold text-lg">Menu</span>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* NAV ITEMS */}
            <div className="flex flex-col px-6 pt-6 gap-3">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setOpen(false)}
                    className="block text-lg font-medium py-3 border-b border-gray-100"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* BOTTOM CTA */}
            <div className="mt-auto p-5">
              <button
                onClick={() => window.open(`https://wa.me/${phone}`, "_blank")}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold"
              >
                Contact on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

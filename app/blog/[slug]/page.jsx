"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, Share2, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import StickyBottomBar from "@/components/StickyBottomBar";

const phone = "8707790677";

const blogContent = {
  title: "When to Call an Ambulance? Key Warning Signs",
  image: "/blog/ambulance-signs.jpg",
  category: "Emergency",
  date: "Apr 28, 2026",
  readTime: "5 min read",
  content: [
    {
      heading: "Recognizing Medical Emergencies",
      text: "Knowing when to call an ambulance can save lives. Many people hesitate, thinking they can drive to the hospital themselves. However, certain conditions require immediate professional medical attention during transport.",
    },
    {
      heading: "Chest Pain & Heart Attack Symptoms",
      text: "If you or someone experiences severe chest pain, shortness of breath, sweating, or pain radiating to the arm or jaw, call an ambulance immediately. These are classic signs of a heart attack that require emergency care.",
    },
    {
      heading: "Difficulty Breathing",
      text: "Severe asthma attacks, allergic reactions (anaphylaxis), or any breathing difficulty that doesn't improve with medication requires immediate ambulance transport with oxygen support.",
    },
    {
      heading: "Severe Bleeding & Trauma",
      text: "Uncontrolled bleeding, deep wounds, head injuries, or injuries from accidents should always be handled by professionals who can provide first aid and stabilization during transport.",
    },
    {
      heading: "Stroke Symptoms (FAST)",
      text: "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call ambulance. Stroke treatment is time-sensitive — every minute counts.",
    },
    {
      heading: "When in Doubt, Call",
      text: "If you're unsure whether the situation is an emergency, it's always better to call. Our 24/7 ambulance service in Lucknow ensures rapid response with trained medical staff.",
    },
  ],
};

export default function BlogPostPage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <span className="font-bold text-gray-900 truncate max-w-[200px]">
              {blogContent.title}
            </span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <section className="mt-14 relative w-full aspect-[16/10]">
        <Image
          src={blogContent.image}
          alt={blogContent.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="text-[10px] bg-primary text-white px-2.5 py-1 rounded-full font-bold uppercase">
            {blogContent.category}
          </span>
        </div>
      </section>

      {/* Content */}
      <article className="px-4 pt-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {blogContent.title}
        </h1>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {blogContent.readTime}
          </span>
          <span>{blogContent.date}</span>
        </div>

        <div className="mt-6 space-y-6">
          {blogContent.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {section.heading}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-8 bg-primary-soft rounded-2xl p-5">
          <h3 className="text-base font-bold text-primary-dark">
            Need Emergency Help?
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Our ambulance is available 24/7 in Lucknow
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href={`tel:${phone}`}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-bold text-center active:scale-95 transition animate-pulse-red shadow-lg"
            >
              Call Now
            </a>
            <a
              href={`https://wa.me/91${phone}`}
              className="flex-1 bg-white text-primary border-2 border-primary py-3 rounded-xl text-sm font-bold text-center active:scale-95 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </article>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

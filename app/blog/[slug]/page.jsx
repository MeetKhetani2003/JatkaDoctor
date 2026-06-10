"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { ChevronLeft, Clock, Share2, Phone, MessageCircle, Loader2 } from "lucide-react";
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

export default function BlogPostPage(props) {
  const params = use(props.params);
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlogData(data);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback to static if not found or no content
  const displayBlog = blogData || blogContent;
  
  let content = blogContent.content;
  if (blogData) {
    if (blogData.content) {
      try {
        const trimmed = blogData.content.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          content = JSON.parse(trimmed);
        } else {
          content = [{ heading: "", text: blogData.content }];
        }
      } catch (e) {
        console.error("Failed to parse blog content:", e);
        content = [{ heading: "", text: blogData.content }];
      }
    } else {
      content = [];
    }
  }

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
              {displayBlog.title}
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
          src={displayBlog.image}
          alt={displayBlog.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="text-[10px] bg-primary text-white px-2.5 py-1 rounded-full font-bold uppercase">
            {displayBlog.category}
          </span>
        </div>
      </section>

      {/* Content */}
      <article className="px-4 pt-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {displayBlog.title}
        </h1>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {displayBlog.readTime}
          </span>
          <span>{displayBlog.date}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content Columns */}
          <div className="lg:col-span-2 space-y-6">
            {content.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {section.heading && (
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {section.heading}
                  </h2>
                )}
                {section.text && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.text}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Emergency CTA Box */}
              <div className="bg-primary-soft rounded-2xl p-5 border border-primary/10 shadow-sm">
                <h3 className="text-base font-bold text-primary-dark">
                  Need Emergency Help?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Our ambulance is available 24/7 in Lucknow
                </p>
                <div className="flex flex-col gap-2.5 mt-4">
                  <a
                    href={`tel:${phone}`}
                    className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-bold text-center active:scale-95 transition animate-pulse-red shadow-lg block"
                  >
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/91${phone}`}
                    className="w-full bg-white text-primary border-2 border-primary py-3 rounded-xl text-sm font-bold text-center active:scale-95 transition block"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Service Directory Info Card */}
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-150">
                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Our Key Services</h3>
                <ul className="space-y-2 text-xs font-medium text-gray-600">
                  <li className="flex items-center gap-1.5">• Physiotherapy at Home</li>
                  <li className="flex items-center gap-1.5">• ICU Setup at Home</li>
                  <li className="flex items-center gap-1.5">• Doctor Visit at Home</li>
                  <li className="flex items-center gap-1.5">• Home Nursing Care</li>
                  <li className="flex items-center gap-1.5">• Lab Test & Sample Collection</li>
                  <li className="flex items-center gap-1.5">• 24/7 Ambulance Service</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link href="/services" className="inline-block text-xs font-bold text-primary hover:text-primary-dark hover:underline">
                    Explore All Services &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import StickyBottomBar from "@/components/StickyBottomBar";

const phone = "8707790677";

const blogs = [
  {
    slug: "when-to-call-ambulance",
    title: "When to Call an Ambulance? Key Warning Signs",
    excerpt:
      "Learn the critical signs that indicate you need immediate emergency medical transport.",
    image: "/blog/ambulance-signs.jpg",
    category: "Emergency",
    date: "Apr 28, 2026",
    readTime: "5 min read",
  },
  {
    slug: "icu-vs-normal-ambulance",
    title: "ICU Ambulance vs Normal Ambulance: What's the Difference?",
    excerpt:
      "Understanding when you need advanced life support versus standard emergency transport.",
    image: "/blog/icu-ambulance.jpg",
    category: "Guide",
    date: "Apr 25, 2026",
    readTime: "4 min read",
  },
  {
    slug: "doctor-at-home-benefits",
    title: "Benefits of Doctor at Home Service for Elderly Patients",
    excerpt:
      "Why home visits are becoming the preferred choice for senior healthcare in Lucknow.",
    image: "/blog/doctor-home.jpg",
    category: "Healthcare",
    date: "Apr 22, 2026",
    readTime: "6 min read",
  },
  {
    slug: "handle-medical-emergencies",
    title: "How to Handle Medical Emergencies Before Help Arrives",
    excerpt:
      "Essential first aid steps everyone should know while waiting for ambulance.",
    image: "/blog/emergency-first-aid.jpg",
    category: "Tips",
    date: "Apr 20, 2026",
    readTime: "7 min read",
  },
  {
    slug: "physiotherapy-at-home",
    title: "Physiotherapy at Home: Recovery Without Hospital Visits",
    excerpt:
      "How home-based physiotherapy is helping patients recover faster post-surgery.",
    image: "/blog/physio-home.jpg",
    category: "Physiotherapy",
    date: "Apr 18, 2026",
    readTime: "5 min read",
  },
  {
    slug: "lab-test-preparation",
    title: "How to Prepare for Blood Tests at Home",
    excerpt:
      "Simple tips to ensure accurate results from your home sample collection.",
    image: "/blog/lab-prep.jpg",
    category: "Lab Tests",
    date: "Apr 15, 2026",
    readTime: "3 min read",
  },
];

export default function BlogPage() {
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <span className="font-bold text-gray-900">Health Insights</span>
          </div>
        </div>
      </header>

      {/* Featured Blog */}
      <section className="mt-14 px-4 pt-4 max-w-7xl mx-auto">
        <Link href={`/blog/${featured.slug}`}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden aspect-[16/10]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[10px] bg-primary text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {featured.category}
              </span>
              <h1 className="text-white text-lg font-bold mt-2 leading-tight">
                {featured.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
                <span>{featured.date}</span>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* Blog Grid */}
      <section className="px-4 pt-6 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((blog, i) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/blog/${blog.slug}`}
                className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-primary font-bold bg-primary-light px-2 py-0.5 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-xs font-bold">
                    Read More <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

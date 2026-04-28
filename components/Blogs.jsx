"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "When to Call an Ambulance? Key Warning Signs",
    image:
      "https://images.unsplash.com/photo-1588776814546-ec7e9c8c1d1a?q=80&w=800",
    category: "Emergency",
    date: "Sep 2025",
  },
  {
    title: "ICU Ambulance vs Normal Ambulance",
    image:
      "https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=800",
    category: "Guide",
    date: "Sep 2025",
  },
  {
    title: "Benefits of Doctor at Home Service",
    image:
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800",
    category: "Healthcare",
    date: "Sep 2025",
  },
  {
    title: "How to Handle Medical Emergencies",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800",
    category: "Tips",
    date: "Sep 2025",
  },
];

export default function BlogSection() {
  return (
    <section className="px-4 pt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Health Insights</h2>
        <span className="text-sm text-emerald-600 font-semibold">
          View all →
        </span>
      </div>

      {/* FEATURED BLOG */}
      <div className="mb-6">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={blogs[0].image}
            alt={blogs[0].title}
            width={500}
            height={300}
            className="w-full h-[180px] object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {/* CONTENT */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded-md">
              {blogs[0].category}
            </span>

            <h3 className="text-[14px] font-semibold mt-2 leading-tight">
              {blogs[0].title}
            </h3>
          </div>
        </div>
      </div>

      {/* SCROLL BLOGS */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x hide-scrollbar">
        {blogs.slice(1).map((blog, i) => (
          <motion.div
            key={blog.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="snap-center shrink-0 w-[220px]"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
              {/* IMAGE */}
              <Image
                src={blog.image}
                alt={blog.title}
                width={220}
                height={140}
                className="w-full h-[120px] object-cover"
              />

              {/* CONTENT */}
              <div className="p-3">
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {blog.category}
                </span>

                <h3 className="text-[12px] font-semibold text-gray-900 mt-1 leading-tight">
                  {blog.title}
                </h3>

                <p className="text-[10px] text-gray-400 mt-2">{blog.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

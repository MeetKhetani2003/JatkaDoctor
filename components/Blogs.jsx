"use client";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useRef } from "react";
import {
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const blogs = [
  {
    title: "When to Call an Ambulance? Key Warning Signs",
    image:
      "https://images.unsplash.com/photo-1588776814546-ec7e9c8c1d1a?q=80&w=800",
    category: "Emergency",
    date: "Sep 2025",
    readTime: "5 min read",
    author: "Dr. Sarah Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
  },
  {
    title: "ICU Ambulance vs Normal Ambulance: Complete Guide",
    image:
      "https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=800",
    category: "Guide",
    date: "Sep 2025",
    readTime: "7 min read",
    author: "Dr. Michael Chen",
    authorAvatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
  },
  {
    title: "Benefits of Doctor at Home Service for Elderly",
    image:
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800",
    category: "Healthcare",
    date: "Sep 2025",
    readTime: "6 min read",
    author: "Dr. Priya Sharma",
    authorAvatar:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
  },
  {
    title: "How to Handle Medical Emergencies at Home",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800",
    category: "Tips",
    date: "Sep 2025",
    readTime: "4 min read",
    author: "Dr. Rahul Verma",
    authorAvatar:
      "https://images.unsplash.com/photo-1612532478427-62262a050a9a?w=100&h=100&fit=crop",
  },
];

// Category colors
const categoryColors = {
  Emergency: "bg-red-100 text-red-600",
  Guide: "bg-blue-100 text-blue-600",
  Healthcare: "bg-emerald-100 text-emerald-600",
  Tips: "bg-amber-100 text-amber-600",
};

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  const itemWidth = 236; // 220px + 16px gap
  const minX = -(blogs.slice(1).length * itemWidth);

  const handleDragEnd = () => {
    const currentX = x.get();
    const nearestIndex = Math.max(
      0,
      Math.min(
        Math.round(Math.abs(currentX) / itemWidth),
        blogs.slice(1).length - 1,
      ),
    );

    const targetX = -(nearestIndex * itemWidth);
    setCurrentIndex(nearestIndex);

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const navigate = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, blogs.slice(1).length - 1)
        : Math.max(currentIndex - 1, 0);

    setCurrentIndex(newIndex);
    animate(x, -(newIndex * itemWidth), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <section className="px-4 pt-12 pb-8 bg-gradient-to-b from-white to-gray-50">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Insights</h2>
          <p className="text-sm text-gray-600 mt-1">
            Expert advice from our medical team
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-semibold text-emerald-600 flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* FEATURED BLOG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-8 group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={blogs[0].image}
            alt={blogs[0].title}
            width={800}
            height={400}
            className="w-full h-[220px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* CONTENT */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${categoryColors[blogs[0].category]}`}
              >
                {blogs[0].category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-200">
                <Clock className="w-3 h-3" />
                {blogs[0].readTime}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold leading-tight mb-2">
              {blogs[0].title}
            </h3>
            <div className="flex items-center gap-2">
              <Image
                src={blogs[0].authorAvatar}
                alt={blogs[0].author}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border-2 border-white/30"
              />
              <span className="text-xs text-gray-200">{blogs[0].author}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SCROLLABLE BLOGS WITH SWIPE */}
      <div className="relative">
        {/* NAVIGATION BUTTONS (Desktop) */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Articles
          </h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("prev")}
              disabled={currentIndex === 0}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("next")}
              disabled={currentIndex === blogs.slice(1).length - 1}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* SWIPEABLE TRACK */}
        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: minX, right: 0 }}
            dragElastic={0.1}
            dragMomentum={true}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="flex gap-4 pb-6"
          >
            {blogs.slice(1).map((blog, i) => (
              <motion.div
                key={blog.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring" }}
                whileHover={{ y: -4 }}
                className="shrink-0 w-[240px] cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={240}
                      height={160}
                      className="w-full h-[140px] object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${categoryColors[blog.category]}`}
                      >
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                      {blog.title}
                    </h3>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={blog.authorAvatar}
                          alt={blog.author}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[10px] text-gray-600">
                          {blog.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <span className="text-[10px] text-gray-400">
                        {blog.date}
                      </span>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1"
                      >
                        Read more <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* DOT INDICATORS */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {blogs.slice(1).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                animate(x, -(i * itemWidth), {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                });
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? "w-6 bg-emerald-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

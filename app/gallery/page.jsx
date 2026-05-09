"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  X,
  Grid3X3,
  Image as ImageIcon,
  Video,
  Play,
  Loader2
} from "lucide-react";
import Link from "next/link";
import StickyBottomBar from "@/components/StickyBottomBar";

const phone = "8707790677";

const categories = [
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "photo", name: "Photos", icon: ImageIcon },
  { id: "video", name: "Videos", icon: Video },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((img) => img.type === activeCategory);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
            <span className="font-bold text-gray-900">Gallery</span>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <section className="mt-14 px-4 pt-4 max-w-7xl mx-auto flex justify-center">
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar snap-x">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-start shrink-0 flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Image Grid */}
      <section className="px-4 pt-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
            No gallery items found for the selected category.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setLightbox(i)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 border border-gray-100"
                >
                  {item.type === "photo" ? (
                    <Image
                      src={item.url}
                      alt={item.title || "Gallery photo"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.url)}/hqdefault.jpg`}
                        alt={item.title || "Gallery video"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/640x640?text=Video" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                         <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                           <Play className="w-6 h-6 text-primary ml-1" />
                         </div>
                      </div>
                    </>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-bold truncate">{item.title}</p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                      {item.type === "photo" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Lightbox for Media */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 bg-black/90 z-[60]"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {filtered[lightbox].type === "photo" ? (
                  <Image
                    src={filtered[lightbox].url}
                    alt={filtered[lightbox].title || "Photo"}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(filtered[lightbox].url)}?autoplay=1`}
                    title={filtered[lightbox].title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                )}
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                {filtered[lightbox].title && (
                  <p className="text-white font-bold mb-4">
                    {filtered[lightbox].title}
                  </p>
                )}
                
                {filtered.length > 1 && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1);
                      }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0);
                      }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

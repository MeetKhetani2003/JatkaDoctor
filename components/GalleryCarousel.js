"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Image as ImageIcon, Video, Play, Loader2 } from "lucide-react";

export default function GalleryCarousel() {
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
        // Limit to first 10 items
        setItems(data.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Gallery</h2>
          <p className="text-gray-600">Glimpses of our healthcare services & events</p>
        </div>
        <Link 
          href="/gallery" 
          className="hidden md:flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
            >
              <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                {item.type === "photo" ? (
                  <Image
                    src={item.url}
                    alt={item.title || "Gallery photo"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.url)}/hqdefault.jpg`}
                      alt={item.title || "Gallery video"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/640x480?text=Video" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary ml-1" />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                    {item.type === "photo" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  </span>
                </div>
                
                {item.title && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-semibold truncate drop-shadow-md">
                      {item.title}
                    </p>
                  </div>
                )}
                
                {item.type === "video" && (
                   <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10">
                     <span className="sr-only">Play Video</span>
                   </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 md:hidden text-center">
          <Link 
            href="/gallery" 
            className="inline-flex items-center gap-1 text-primary font-medium px-4 py-2 bg-primary/10 rounded-full"
          >
            View Full Gallery <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

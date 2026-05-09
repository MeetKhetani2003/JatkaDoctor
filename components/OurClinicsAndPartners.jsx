"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ShieldCheck, Award, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const partners = [
  { name: "Lakshay Cancer Hospital", type: "Verified Partner", image: "/healthcarepartner/partner1.png" },
  { name: "PHC Multi Speciality Hospital", type: "Verified Partner", image: "/healthcarepartner/partner2.png" },
  { name: "Lucknow CISRO Hospital", type: "Verified Partner", image: "/healthcarepartner/partner3.png" },
  { name: "SRS Hospital", type: "Verified Partner", image: "/healthcarepartner/partner4.png" },
  { name: "Amrut Hospital", type: "Verified Partner", image: "/healthcarepartner/partner5.png" },
  { name: "Lakshay Janta Hospital", type: "Verified Partner", image: "/healthcarepartner/partner6.png" },
  { name: "Lucknow CISRO", type: "Verified Partner", image: "/healthcarepartner/partner7.png" },
  { name: "LabCare Diagnostics", type: "Verified Partner", image: "/healthcarepartner/partner8.png" },
  { name: "GoodHealth Diagnostic", type: "Verified Partner", image: "/healthcarepartner/partner9.png" },
  { name: "Dhruv Hospital", type: "Verified Partner", image: "/healthcarepartner/partner10.png" },
  { name: "National Pathology Centre", type: "Verified Partner", image: "/healthcarepartner/partner11.png" },
];

export default function PartnersSection() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  
  // Responsive card widths
  const [cardWidth, setCardWidth] = useState(280); 
  const gap = 16;
  const itemWidth = cardWidth + gap;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardWidth(window.innerWidth * 0.75); // Larger cards on mobile
      } else {
        setCardWidth(280);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalWidth = partners.length * itemWidth;
  
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Calculate which card to snap to based on drag and velocity
    let targetIndex = currentIndex;
    if (Math.abs(offset) > 50 || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        targetIndex = Math.max(0, currentIndex - 1);
      } else {
        targetIndex = Math.min(partners.length - 1, currentIndex + 1);
      }
    }

    const targetX = -(targetIndex * itemWidth);
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    setCurrentIndex(targetIndex);
  };

  const scrollTo = (index) => {
    const targetX = -(index * itemWidth);
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#0F9D58] font-bold text-xs uppercase tracking-widest mb-3">
              <Zap size={14} />
              Our Network
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-[#003366] leading-tight">
              Our Healthcare Partners
            </h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base">
              Trusted by leading medical institutions across Lucknow for fast response and quality care.
            </p>
          </div>

          {/* Nav Buttons (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => scrollTo(Math.max(0, currentIndex - 1))}
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scrollTo(Math.min(partners.length - 1, currentIndex + 1))}
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative cursor-grab active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={{ 
              right: 0, 
              left: -(partners.length - 1) * itemWidth 
            }}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="flex gap-4"
          >
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                style={{ width: cardWidth }}
                className="shrink-0"
              >
                <div className="bg-white rounded-[24px] border border-gray-100 p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col group">
                  {/* Logo Area - White background with multiply blending to help remove light backgrounds */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl bg-white flex items-center justify-center p-4 mb-5 overflow-hidden group-hover:shadow-md transition-all border border-gray-50">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      priority={i < 3}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm md:text-base font-bold text-[#333] leading-snug mb-2 group-hover:text-[#0F9D58] transition-colors">
                      {partner.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#0F9D58] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={12} />
                        Verified
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-0.5 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-[11px] text-gray-400 ml-1.5 font-medium">5.0</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress Bar (Mobile focused) */}
        <div className="mt-10 flex items-center gap-4 px-2">
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#0F9D58]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentIndex + 1) / partners.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <span className="text-[12px] font-bold text-gray-400 tracking-tighter">
            {String(currentIndex + 1).padStart(2, '0')} / {String(partners.length).padStart(2, '0')}
          </span>
        </div>

        {/* Trust Badges Row */}
        <div className="mt-12 grid grid-cols-3 gap-3 md:flex md:justify-center md:gap-12">
            {[
                { icon: ShieldCheck, text: "Verified Partners", color: "text-emerald-500" },
                { icon: Award, text: "Quality Care", color: "text-blue-500" },
                { icon: Zap, text: "Instant Support", color: "text-yellow-500" }
            ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${badge.color}`}>
                        <badge.icon size={20} />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-600 text-center">{badge.text}</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}

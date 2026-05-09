"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Shield,
  MapPin,
  Users,
  Hospital,
  Home,
  Heart,
  Microscope,
  PlusCircle,
  Activity,
  CheckCircle,
  Award,
  Zap,
} from "lucide-react";

import Image from "next/image";

const partners = [
  { name: "Lakshay Cancer Hospital", type: "Verified Partner", image: "/healthcarepartner/partner1.jpeg" },
  { name: "PHC Multi Speciality Hospital", type: "Verified Partner", image: "/healthcarepartner/partner2.jpeg" },
  { name: "Lucknow CISRO Hospital", type: "Verified Partner", image: "/healthcarepartner/partner3.jpeg" },
  { name: "SRS Hospital", type: "Verified Partner", image: "/healthcarepartner/partner4.jpeg" },
  { name: "Amrut Hospital", type: "Verified Partner", image: "/healthcarepartner/partner5.jpeg" },
  { name: "Lakshay Janta Hospital", type: "Verified Partner", image: "/healthcarepartner/partner6.jpeg" },
  { name: "Lucknow CISRO", type: "Verified Partner", image: "/healthcarepartner/partner7.jpeg" },
  { name: "LabCare Diagnostics", type: "Verified Partner", image: "/healthcarepartner/partner8.jpeg" },
  { name: "GoodHealth Diagnostic", type: "Verified Partner", image: "/healthcarepartner/partner9.jpeg" },
  { name: "Dhruv Hospital", type: "Verified Partner", image: "/healthcarepartner/partner10.jpeg" },
  { name: "National Pathology Centre", type: "Verified Partner", image: "/healthcarepartner/partner11.jpeg" },
];

export default function PartnersSection() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Motion values for smooth dragging
  const x = useMotionValue(0);
  const containerWidth = useRef(0);
  const itemWidth = 240; // 224px + 16px gap

  // Calculate drag constraints
  const minX = -(partners.length * itemWidth - containerWidth.current);

  // Snap to nearest card
  const handleDragEnd = () => {
    const currentX = x.get();
    const nearestIndex = Math.round(Math.abs(currentX) / itemWidth);
    const targetX = -(nearestIndex * itemWidth);

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onUpdate: (latest) => {
        if (Math.abs(latest - targetX) < 1) {
          setCurrentIndex(nearestIndex);
        }
      },
    });
  };

  return (
    <section className="px-4 pt-12 pb-8 bg-gradient-to-b from-white to-emerald-50/30">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Our Healthcare Partners
        </h2>
        <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
          Trusted by leading hospitals and clinics across Lucknow
        </p>
      </motion.div>

      {/* SWIPEABLE CAROUSEL */}
      <div
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={() => containerRef.current?.classList.add("touch-pan-x")}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.1}
          dragMomentum={true}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="flex gap-4 pb-6 items-stretch"
        >
          {partners.map((partner, i) => {
            const Icon = partner.icon;
            const isActive = i === currentIndex;

            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                className="shrink-0 w-[224px] flex"
              >
                <div className="group relative w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200 overflow-hidden flex flex-col flex-1">
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* VERIFIED BADGE */}
                  <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Shield className="w-3 h-3 text-white fill-emerald-500" />
                  </div>

                  {/* LOGO */}
                  <div className="relative z-10 flex flex-col items-center w-full h-full flex-1">
                    <div
                      className={`relative w-full h-28 shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden ${
                        isActive ? "ring-2 ring-emerald-300" : ""
                      }`}
                    >
                      <Image 
                        src={partner.image} 
                        alt={partner.name} 
                        fill 
                        className="object-contain p-2" 
                      />
                    </div>

                    <div className="flex flex-col items-center mt-auto">
                      {/* NAME */}
                      <h3 className="text-sm font-bold text-gray-900 text-center leading-tight">
                        {partner.name}
                      </h3>

                      {/* TYPE */}
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        {partner.type}
                      </p>

                    {/* RATING */}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-[10px] text-gray-500 ml-1">
                        5.0
                      </span>
                    </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* DOT INDICATORS */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {partners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const targetX = -(i * itemWidth);
              animate(x, targetX, {
                type: "spring",
                stiffness: 300,
                damping: 30,
              });
              setCurrentIndex(i);
            }}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? "w-6 bg-emerald-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* TRUST STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">50+ Trusted Partners</p>
              <p className="text-sm text-emerald-50">
                Across Lucknow & expanding
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-100" />
            <span className="text-sm font-medium">All Areas Covered</span>
          </div>
        </div>
      </motion.div>

      {/* TRUST BADGES */}
      <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar">
        {[
          { icon: CheckCircle, text: "Verified Partners" },
          { icon: Award, text: "Quality Assured" },
          { icon: Zap, text: "Quick Response" },
        ].map((badge, i) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="shrink-0 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm flex items-center gap-2"
            >
              <Icon className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-700">
                {badge.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

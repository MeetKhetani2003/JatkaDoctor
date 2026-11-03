"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle,
  Home,
  Zap,
} from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";

// Fallback services in case API is loading or network is slow
const INITIAL_POPULAR_SERVICES = [
  {
    id: "physiotherapy-home",
    serviceType: "physiotherapy",
    serviceCategory: "physiotherapy",
    title: "Physiotherapy at Home",
    shortDescription: "Certified physiotherapist visits your home for back, neck, knee pain, neuro & post-surgery rehabilitation.",
    badge: "👑 Most Booked",
    badgeColor: "bg-emerald-600 text-white",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "500+ Bookings",
    rating: 4.9,
    reviewCount: "320+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 499,
    originalPrice: 599,
    priceUnit: "session",
    savings: 100,
    serviceName: "Physiotherapy at Home",
    link: "/services/physiotherapy",
  },
  {
    id: "doctor-visit-home",
    serviceType: "doctor",
    serviceCategory: "doctor",
    title: "Doctor Visit at Home",
    shortDescription: "Qualified MBBS & MD doctors visit your home with full diagnostic medical kit for consultation & prescription.",
    badge: "⚡ Quick & Reliable",
    badgeColor: "bg-[#006837] text-white",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "300+ Bookings",
    rating: 4.8,
    reviewCount: "200+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 599,
    originalPrice: 799,
    priceUnit: "visit",
    savings: 200,
    serviceName: "Doctor Visit at Home",
    link: "/services/doctor",
  },
  {
    id: "nursing-at-home",
    serviceType: "nursing",
    serviceCategory: "nursing",
    title: "Nursing at Home",
    shortDescription: "Experienced registered nurses for IV drips, injections, wound dressing, catheterization & post-operative care.",
    badge: "🛡️ Safe & Hygienic",
    badgeColor: "bg-teal-600 text-white",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "200+ Bookings",
    rating: 4.8,
    reviewCount: "150+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 699,
    originalPrice: 899,
    priceUnit: "visit",
    savings: 200,
    serviceName: "Nursing Care at Home",
    link: "/services/nursing",
  },
  {
    id: "patient-attendant-care",
    serviceType: "home-care",
    serviceCategory: "home-care",
    title: "Patient Attendant / Elderly Care",
    shortDescription: "Compassionate, 100% background-verified caregivers for elderly assistance, daily living support & mobility.",
    badge: "🤝 Compassionate Care",
    badgeColor: "bg-amber-600 text-white",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "180+ Bookings",
    rating: 4.8,
    reviewCount: "180+ Reviews",
    features: ["⚡ Same Day Availability", "🏠 Home Visit"],
    price: 399,
    originalPrice: 599,
    priceUnit: "day",
    savings: 200,
    serviceName: "Home Care Services",
    link: "/services/home-care",
  },
  {
    id: "icu-at-home",
    serviceType: "icu",
    serviceCategory: "icu",
    title: "Complete ICU Setup at Home",
    shortDescription: "Hospital-grade ventilator, BiPAP, monitor and round-the-clock ICU nurse support in your home bedroom.",
    badge: "🏥 Critical Care",
    badgeColor: "bg-purple-600 text-white",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "120+ Bookings",
    rating: 4.9,
    reviewCount: "95+ Reviews",
    features: ["⏱️ 24/7 Setup Support", "🏠 Home Setup"],
    price: 2999,
    originalPrice: 4500,
    priceUnit: "day",
    savings: 1501,
    serviceName: "ICU at Home",
    link: "/icu-at-home",
  },
  {
    id: "ambulance-emergency",
    serviceType: "ambulance",
    serviceCategory: "ambulance",
    title: "24/7 Emergency Ambulance",
    shortDescription: "Lucknow's fastest emergency response ambulance equipped with oxygen, ventilator, defibrillator & paramedic team.",
    badge: "🚨 15-20 Min Express",
    badgeColor: "bg-red-600 text-white",
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "1,200+ Trips",
    rating: 4.9,
    reviewCount: "450+ Reviews",
    features: ["⏱️ 15-20 Min Response", "🚑 GPS Tracked"],
    price: 1199,
    originalPrice: 1699,
    priceUnit: "trip",
    savings: 500,
    serviceName: "Ambulance Service",
    isAmbulance: true,
    link: "/services/ambulance",
  }
];

const CATEGORIES = [
  { id: "all", label: "All Popular" },
  { id: "physiotherapy", label: "Physiotherapy" },
  { id: "doctor", label: "Doctor Visit" },
  { id: "nursing", label: "Nursing Care" },
  { id: "home-care", label: "Elderly & Attendant" },
  { id: "icu", label: "ICU Setup" },
  { id: "ambulance", label: "Ambulance" },
];

export default function PopularServices() {
  const [services, setServices] = useState(INITIAL_POPULAR_SERVICES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState({});
  const carouselRef = useRef(null);
  const { openModal, openAmbulanceModal } = useBookingModal();
  const router = useRouter();

  // Fetch dynamic popular services from Admin
  useEffect(() => {
    let isMounted = true;
    async function loadPopularServices() {
      try {
        const res = await fetch("/api/services/popular");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setServices(json.data);
        }
      } catch (err) {
        console.warn("Could not load dynamic popular services, using defaults:", err);
      }
    }
    loadPopularServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter(
          (s) =>
            s.serviceType === activeCategory ||
            s.serviceCategory === activeCategory ||
            (activeCategory === "home-care" && s.serviceType === "home-care")
        );

  const handleBook = (svc) => {
    if (svc.isAmbulance || svc.serviceType === "ambulance") {
      openAmbulanceModal();
      return;
    }
    openModal({
      service: svc.serviceName || svc.title,
      package: svc.title,
    });
  };

  return (
    <section className="px-4 py-8 sm:py-10 max-w-7xl mx-auto">
      {/* HEADER SECTION (Matching Mockup 1) */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
            <span className="text-base">👑</span>
            <span className="uppercase tracking-wider text-[11px] font-black text-[#006837]">
              Popular Services
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Most booked services in Lucknow
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Carousel Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous services"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs active:scale-95 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next services"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs active:scale-95 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#006837] hover:text-[#004e29] transition group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-[#006837] text-white shadow-xs"
                  : "bg-gray-100/90 text-gray-600 hover:bg-gray-200/80"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* HORIZONTAL CAROUSEL CONTAINER (OCCUPIES LESS SPACE) */}
      <div
        ref={carouselRef}
        className="flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredServices.map((svc) => {
          const isFav = !!favorites[svc.id];
          return (
            <motion.div
              key={svc.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="w-[240px] sm:w-[260px] shrink-0 snap-start bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group select-none"
            >
              {/* Top Image + Badges */}
              <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Status / Demanded Badge */}
                {svc.badge && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                      svc.badgeColor || "bg-[#006837] text-white"
                    }`}
                  >
                    {svc.badge}
                  </span>
                )}

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(svc.id, e)}
                  aria-label="Add to favorites"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-xs transition"
                >
                  <Heart
                    size={14}
                    className={
                      isFav ? "fill-red-500 text-red-500" : "text-gray-600"
                    }
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#006837] transition-colors leading-snug line-clamp-1 mb-1.5">
                    {svc.title}
                  </h3>

                  {/* Social Proof (Bookings + Rating) */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold mb-2">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Users size={12} className="text-[#006837]" />
                      <span>{svc.bookingsCount || "250+ Bookings"}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{svc.rating || 4.8} ({svc.reviewCount?.replace(/ Reviews\+?/, '') || "150+"})</span>
                    </span>
                  </div>

                  {/* Feature Tags (Pills) */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <Zap size={10} className="text-emerald-600" />
                      <span>Arrives in 30 Min</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      <Home size={10} className="text-gray-500" />
                      <span>Home Visit</span>
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div>
                  <div className="flex items-baseline justify-between gap-1 mb-2.5 pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5">
                      {svc.originalPrice && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{svc.originalPrice}
                        </span>
                      )}
                      <span className="text-base font-black text-gray-900">
                        ₹{svc.price}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        /{svc.priceUnit || "visit"}
                      </span>
                    </div>

                    {svc.savings > 0 && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-[#006837] px-1.5 py-0.5 rounded">
                        Save ₹{svc.savings}
                      </span>
                    )}
                  </div>

                  {/* Book Now Button */}
                  <button
                    type="button"
                    onClick={() => handleBook(svc)}
                    className="w-full py-2 px-3 rounded-xl bg-[#006837] hover:bg-[#004e29] active:scale-[0.98] text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TRUST BANNER BELOW POPULAR CAROUSEL (Image 7 bottom bar) */}
      <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-200/70 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1.5 text-gray-700 font-semibold py-1">
          <Users size={14} className="text-[#006837]" />
          <span>1,000+ Happy Patients</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-gray-700 font-semibold py-1">
          <Clock size={14} className="text-[#006837]" />
          <span>30 Min Avg Response</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-gray-700 font-semibold py-1">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span>4.9/5 Lucknow Rating</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-gray-700 font-semibold py-1">
          <ShieldCheck size={14} className="text-[#006837]" />
          <span>100% Verified Staff</span>
        </div>
      </div>
    </section>
  );
}

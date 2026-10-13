"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Activity,
  HeartPulse,
  Stethoscope,
  Ambulance,
  Bed,
  UserCheck,
} from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";

const POPULAR_SERVICES = [
  {
    id: "doctor-visit",
    category: "doctor",
    categoryLabel: "Doctor at Home",
    icon: Stethoscope,
    badge: "Most Demanded",
    badgeColor: "bg-emerald-600 text-white",
    title: "Doctor Consultation at Home",
    shortDescription:
      "Qualified MBBS & MD doctors visit your home with a diagnostic kit for full checkups & treatment.",
    highlights: [
      "Arrival in 30–45 mins",
      "Vitals & full physical checkup",
      "Digital prescription & guidance",
    ],
    rating: 4.9,
    reviews: "1,450+",
    price: "₹999",
    priceUnit: "visit",
    originalPrice: "₹1,499",
    link: "/services/doctor",
    serviceName: "Doctor Visit at Home",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "physiotherapy",
    category: "physiotherapy",
    categoryLabel: "Physiotherapy",
    icon: Activity,
    badge: "Top Rated",
    badgeColor: "bg-teal-600 text-white",
    title: "Physiotherapy at Home",
    shortDescription:
      "Specialized rehabilitation for back, cervical, knee pain, post-surgery & stroke recovery.",
    highlights: [
      "Certified physiotherapists",
      "Electrotherapy & pain relief",
      "Customized recovery exercise plan",
    ],
    rating: 4.9,
    reviews: "2,100+",
    price: "₹499",
    priceUnit: "session",
    originalPrice: "₹899",
    link: "/services/physiotherapy",
    serviceName: "Physiotherapy at Home",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ambulance",
    category: "ambulance",
    categoryLabel: "Ambulance",
    icon: Ambulance,
    badge: "15-20 Min Express",
    badgeColor: "bg-red-600 text-white",
    title: "24/7 Emergency & ICU Ambulance",
    shortDescription:
      "Fastest emergency ambulance in Lucknow equipped with oxygen, ventilator & paramedic team.",
    highlights: [
      "15–20 min rapid arrival",
      "Oxygen, ECG & ventilator support",
      "Trained paramedics & doctor onboard",
    ],
    rating: 4.8,
    reviews: "3,600+",
    price: "₹1,199",
    priceUnit: "trip",
    originalPrice: "₹1,699",
    link: "/services/ambulance",
    serviceName: "Ambulance Service",
    isAmbulance: true,
    image:
      "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nursing",
    category: "nursing",
    categoryLabel: "Nursing Care",
    icon: HeartPulse,
    badge: "Certified Staff",
    badgeColor: "bg-blue-600 text-white",
    title: "Professional Nursing Care at Home",
    shortDescription:
      "Registered nurses for IV/IM injections, sterile wound dressing, vitals monitoring & post-op care.",
    highlights: [
      "Hospital-trained registered nurses",
      "Dressing, cannula & injections",
      "Available for short visits or 12/24h shifts",
    ],
    rating: 4.8,
    reviews: "1,280+",
    price: "₹499",
    priceUnit: "visit",
    originalPrice: "₹799",
    link: "/services/nursing",
    serviceName: "Nursing Care at Home",
    image:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "icu-home",
    category: "icu",
    categoryLabel: "ICU at Home",
    icon: Bed,
    badge: "Critical Care",
    badgeColor: "bg-purple-600 text-white",
    title: "Complete ICU Setup at Home",
    shortDescription:
      "Hospital-grade ICU setup at home with ventilator, multipara monitor, infusion pump & 24/7 ICU nurse.",
    highlights: [
      "Ventilator, BiPAP & oxygen support",
      "Dedicated 24/7 critical care nurse",
      "Saves up to 60% compared to hospital ICU",
    ],
    rating: 4.9,
    reviews: "450+",
    price: "₹2,999",
    priceUnit: "day",
    originalPrice: "₹4,500",
    link: "/icu-at-home",
    serviceName: "ICU at Home",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "elderly-care",
    category: "home-care",
    categoryLabel: "Elderly & Home Care",
    icon: UserCheck,
    badge: "Compassionate",
    badgeColor: "bg-amber-600 text-white",
    title: "Patient Attendant & Elderly Care",
    shortDescription:
      "Compassionate, verified attendants to assist seniors and recovering patients with daily living.",
    highlights: [
      "100% background-verified staff",
      "Hygiene, mobility & feeding support",
      "Medicine reminders & companionship",
    ],
    rating: 4.8,
    reviews: "1,150+",
    price: "₹399",
    priceUnit: "day",
    originalPrice: "₹599",
    link: "/services/home-care",
    serviceName: "Home Care Services",
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "doctor", label: "Doctor Visit" },
  { id: "physiotherapy", label: "Physiotherapy" },
  { id: "ambulance", label: "Ambulance" },
  { id: "nursing", label: "Nursing Care" },
  { id: "icu", label: "ICU at Home" },
  { id: "home-care", label: "Elderly Care" },
];

export default function PopularServices() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { openModal, openAmbulanceModal } = useBookingModal();

  const filteredServices =
    activeCategory === "all"
      ? POPULAR_SERVICES
      : POPULAR_SERVICES.filter((s) => s.category === activeCategory);

  const handleBook = (svc) => {
    if (svc.isAmbulance) {
      openAmbulanceModal();
    } else {
      openModal({
        service: svc.serviceName,
        package: svc.title,
      });
    }
  };

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Lucknow&apos;s Most Booked Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Popular Healthcare Services
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
            Trusted, verified medical care delivered quickly to your doorstep with 24/7 dedicated support.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006837] hover:text-[#004e29] transition group self-start md:self-end"
        >
          <span>View all services</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-[#006837] text-white shadow-md shadow-emerald-900/10 scale-[1.02]"
                  : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* SERVICES GRID */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,104,55,0.12)] hover:border-emerald-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* SERVICE IMAGE & BADGES */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {/* TOP BADGE */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm ${svc.badgeColor}`}
                      >
                        {svc.badge}
                      </span>
                    </div>

                    {/* CATEGORY ICON */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#006837] shadow">
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* QUICK AVAILABILITY PILL */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lucknow 24/7 Available</span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    {/* RATING & BOOKINGS */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{svc.rating}</span>
                      </div>
                      <span className="text-emerald-700 font-semibold text-[11px]">
                        {svc.reviews} bookings
                      </span>
                    </div>

                    {/* TITLE */}
                    <Link href={svc.link} className="block group-hover:text-[#006837] transition">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-1">
                        {svc.title}
                      </h3>
                    </Link>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {svc.shortDescription}
                    </p>

                    {/* KEY HIGHLIGHTS */}
                    <ul className="mt-3.5 space-y-1.5 border-t border-gray-50 pt-3">
                      {svc.highlights.map((hl, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-[11px] text-gray-600 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-5 pt-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                      Starting from
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                        {svc.price}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        /{svc.priceUnit}
                      </span>
                      {svc.originalPrice && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {svc.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={svc.link}
                      className="px-3 py-2 text-xs font-bold text-gray-700 hover:text-[#006837] bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition shadow-2xs"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleBook(svc)}
                      className="px-4 py-2 bg-[#006837] hover:bg-[#004e29] active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* QUICK EMERGENCY / SUPPORT STRIP */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Need immediate medical assistance in Lucknow?
            </h4>
            <p className="text-xs text-gray-600">
              Talk directly with our on-duty medical coordinator for emergency ambulance or instant doctor dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+918887754988"
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 24/7 Helpline</span>
          </a>
        </div>
      </div>
    </section>
  );
}

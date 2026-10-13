"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, HeartHandshake, Star, Clock, CheckCircle2, 
  MapPin, Phone, MessageCircle, Search, ArrowRight, UserCheck, 
  Activity, Bed, Sparkles, Filter
} from "lucide-react";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import HomeCareBookingFlowModal from "@/components/HomeCareBookingFlowModal";

export default function HomeCareLandingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("All");

  // Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  useEffect(() => {
    fetch("/api/home-care/services?category=home-care")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.data || []);
        }
      })
      .catch((err) => console.error("Error loading home care services:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookNow = (service) => {
    setSelectedServiceForBooking(service);
    setIsModalOpen(true);
  };

  const pills = [
    "All",
    "Patient Attendant",
    "Elderly Care",
    "Post-Surgery Care",
    "Bedridden Care",
    "Vital Monitoring",
    "Wound Care",
  ];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesPill =
      selectedPill === "All" ||
      s.name.toLowerCase().includes(selectedPill.toLowerCase());
    return matchesSearch && matchesPill;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-white pt-8 pb-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Dr Jhatka Medicare Verified Home Care</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Home Care <span className="text-emerald-700">Services</span>
                </h1>

                <p className="text-lg sm:text-xl font-medium text-gray-700">
                  “Professional Care in the Comfort of Your Home”
                </p>

                {/* Supporting Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    "Trained & Verified Care Staff",
                    "Personalized Care Plans",
                    "Flexible Service Options",
                    "Trusted Home Healthcare",
                    "24×7 Support in Lucknow",
                  ].map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={() => handleBookNow(services[0] || null)}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
                  >
                    <span>Book Home Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://wa.me/917991787123?text=Hello%20Dr%20Jhatka%20Medicare,%20I%20would%20like%20to%20enquire%20about%20Home%20Care%20Services."
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-600 font-bold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                    alt="Home Care Staff with Patient"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">100% Background Verified</p>
                      <p className="text-[11px] text-gray-500">Caregivers, Attendants & Staff</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                      ⭐ 4.8 Rating
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SEARCH & PILL FILTERS */}
        <section className="py-6 border-b border-gray-100 bg-white sticky top-16 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {/* Search input */}
            <div className="relative max-w-xl mx-auto">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search home care services (e.g. attendant, elderly, vitals)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-start sm:justify-center no-scrollbar">
              {pills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSelectedPill(pill)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedPill === pill
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Our Home Care Services
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Choose the specialized care support you need at home
                </p>
              </div>
              <p className="text-xs font-semibold text-emerald-700">
                {filteredServices.length} Services Available in Lucknow
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm">Loading live verified services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 p-8">
                <p className="text-base font-semibold">No services found for your query.</p>
                <button
                  onClick={() => { setSearch(""); setSelectedPill("All"); }}
                  className="mt-3 text-sm text-emerald-600 font-bold hover:underline"
                >
                  Clear search & show all services
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((svc) => (
                  <div
                    key={svc._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-200 overflow-hidden flex flex-col group"
                  >
                    {/* Card Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={svc.mainImage || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80"}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {svc.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                          {svc.badge}
                        </div>
                      )}
                      {svc.isSameDayBooking && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>Available Today</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Rating & Verified Bookings */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-bold text-gray-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {svc.rating || 4.8}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            {svc.actualBookingCount || svc.verifiedBookingsCount || 100}+ Bookings
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition">
                          {svc.name}
                        </h3>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {svc.shortDescription}
                        </p>

                        {/* Included bullet tags */}
                        {svc.includedServices?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {svc.includedServices.slice(0, 3).map((item, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px] font-medium border border-gray-100"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                            {svc.pricingType || "Starting From"}
                          </p>
                          {svc.pricingType === "Custom Quote" ? (
                            <p className="text-base font-bold text-purple-700">Custom Quote</p>
                          ) : (
                            <p className="text-base font-extrabold text-gray-900">
                              ₹{svc.effectivePrice || svc.price}
                              <span className="text-xs text-gray-500 font-normal">
                                /{svc.priceUnit || "day"}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/services/home-care/${svc.slug}`}
                            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleBookNow(svc)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <HomeCareBookingFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedServiceForBooking}
        category="home-care"
      />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Clock, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import HomeCareBookingFlowModal from "@/components/HomeCareBookingFlowModal";

export default function PopularHomeCareSection() {
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch("/api/home-care/services?popular=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPopularServices(data.data || []);
        }
      })
      .catch((err) => console.error("Error fetching popular services:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookNow = (svc) => {
    setSelectedService(svc);
    setIsModalOpen(true);
  };

  if (!loading && popularServices.length === 0) return null;

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold tracking-wide">
              Top Booked
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Popular Home Care & Nursing
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Most trusted healthcare services delivered directly to your doorstep in Lucknow
          </p>
        </div>
        <Link
          href="/services/home-care"
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularServices.slice(0, 4).map((svc) => (
          <div
            key={svc._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={svc.mainImage || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80"}
                  alt={svc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {svc.badge && (
                  <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    {svc.badge}
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Available</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-0.5 font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {svc.rating || 4.8}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">
                    {svc.actualBookingCount || svc.verifiedBookingsCount || 100}+ Bookings
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition line-clamp-1">
                  {svc.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {svc.shortDescription}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  {svc.pricingType || "Starting"}
                </p>
                <p className="text-sm font-extrabold text-gray-900">
                  ₹{svc.effectivePrice || svc.price}
                  <span className="text-[10px] text-gray-500 font-normal">
                    /{svc.priceUnit || "day"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleBookNow(svc)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 active:scale-95"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <HomeCareBookingFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        category={selectedService?.category || "home-care"}
      />
    </section>
  );
}

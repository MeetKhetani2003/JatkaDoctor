"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  ShieldCheck, HeartHandshake, Star, Clock, CheckCircle2, 
  MapPin, Phone, MessageCircle, ChevronRight, ArrowRight, 
  HelpCircle, UserCheck, Calendar, IndianRupee, Layers
} from "lucide-react";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import HomeCareBookingFlowModal from "@/components/HomeCareBookingFlowModal";

export default function HomeCareServiceDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/home-care/services/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setService(data.data);
        }
      })
      .catch((err) => console.error("Error fetching service details:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-500 mb-6">The requested home care service could not be found or has been moved.</p>
          <Link
            href="/services/home-care"
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold"
          >
            Back to Home Care Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 bg-gray-50/40">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/services/home-care" className="hover:text-gray-900">Home Care</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-emerald-800 truncate">{service.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero & Detail Overview */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image & Feature Badges */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-gray-100">
                  <img
                    src={service.mainImage || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  {service.badge && (
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {service.badge}
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-950">Trained & Verified Staff</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-950">Flexible Timings</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-950">Same Day Availability</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-950">Affordable Pricing</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Rating, Price, CTAs */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {service.name}
                  </h1>
                  <p className="text-base text-gray-600 mt-1 font-medium">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Rating & Verified Bookings */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 bg-amber-50 text-amber-900 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{service.rating || 4.8}/5</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-emerald-700">
                    {service.actualBookingCount || service.verifiedBookingsCount || 100}+ Verified Bookings
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Lucknow
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-5 bg-gradient-to-r from-emerald-50/80 to-emerald-50/30 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                      {service.pricingType || "Starting From"}
                    </span>
                    {service.pricingType === "Custom Quote" ? (
                      <span className="text-2xl font-extrabold text-purple-700">Custom Quote</span>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-black text-gray-900">
                        ₹{service.effectivePrice || service.price}
                        <span className="text-sm font-semibold text-gray-500">
                          /{service.priceUnit || "day"}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Final price may vary based on care duration, clinical condition and specialized requirements.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/917991787123?text=${encodeURIComponent(
                      `Hello Dr Jhatka Medicare, I would like to enquire about ${service.name}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-600 font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Tabs Headers */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "included", label: "What's Included" },
                      { id: "patients", label: "Who is it for?" },
                      { id: "faqs", label: "FAQs" },
                      { id: "reviews", label: "Reviews" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-emerald-600 text-emerald-800 font-bold"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tabs Content */}
                  <div className="pt-5 text-sm text-gray-700 space-y-4">
                    {activeTab === "overview" && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base mb-2">About This Service</h3>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {service.fullDescription || service.shortDescription}
                          </p>
                        </div>

                        {service.includedServices?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-2.5">Key Features:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.includedServices.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "included" && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-base mb-2">What We Provide</h3>
                        <div className="space-y-2">
                          {(service.includedServices || []).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-800 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "patients" && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-base mb-2">Target Patients & Use Cases</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(service.targetPatients?.length > 0 ? service.targetPatients : [
                            "Elderly individuals needing daily living support",
                            "Post-operative recovery patients",
                            "Bedridden patients needing hygiene & repositioning",
                            "Chronic care patients requiring medication adherence"
                          ]).map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-950 font-medium flex items-center gap-2">
                              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "faqs" && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-base mb-2">Frequently Asked Questions</h3>
                        {(service.faqs?.length > 0 ? service.faqs : [
                          { question: "Are attendants verified?", answer: "Yes, all attendants and nurses are medically verified and background-checked." },
                          { question: "Can I replace an attendant if not satisfied?", answer: "Yes, Dr Jhatka Medicare provides hassle-free replacement within 24 hours." }
                        ]).map((faq, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                            <p className="font-bold text-xs text-gray-900">{faq.question}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-base mb-2">Verified Patient Reviews</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-gray-900">Alok Srivastava (Gomti Nagar)</span>
                              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                5.0
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              "The attendant sent for my father was extremely polite and trained. Assisted with hygiene and mobility gently. Highly recommended in Lucknow."
                            </p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-gray-900">Dr. Meera Verma (Indira Nagar)</span>
                              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                5.0
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              "Prompt response within 45 minutes. Safe and aseptic dressing done for post-laparoscopy incision. Thank you Dr Jhatka Medicare."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <HomeCareBookingFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
        category="home-care"
      />
    </div>
  );
}

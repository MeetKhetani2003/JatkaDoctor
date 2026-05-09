"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Award,
  Clock,
  Calendar,
  ChevronLeft,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  MapPin,
  MessageCircle,
  Video,
  CheckCheck,
  Shield,
  Award as AwardIcon,
  Zap,
  MessageSquare,
  Smartphone,
  Stethoscope,
  Home,
} from "lucide-react";
import BookingForm from "@/components/BookingForm";

const PRIMARY = "#0F9D58";

export default function DoctorProfilePage() {
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors?slug=${params.slug}`);
        const data = await res.json();
        setDoctor(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchDoctor();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2
          className="w-10 h-10 animate-spin"
          style={{ color: PRIMARY }}
        />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-5 text-center">
        <h2 className="text-2xl font-normal text-black tracking-tight mb-4">
          Doctor Not Found
        </h2>
        <Link
          href="/"
          className="text-primary font-normal flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="min-h-screen bg-gray-50/50 pb-32">
        {/* Top Navigation */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </Link>
          <h1 className="text-sm font-normal text-black tracking-tight">
            Expert Profile
          </h1>
          <div className="w-10 h-10"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* 1. Proper Doctor Image (Full Width on Mobile) */}
          <div className="relative w-full aspect-square sm:aspect-video bg-gray-200 overflow-hidden sm:rounded-[40px] sm:mt-6 shadow-sm">
            <img
              src={
                doctor.imageFileId
                  ? `/api/images/${doctor.imageFileId}`
                  : doctor.image ||
                    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
              }
              alt={doctor.name}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            <div className="absolute bottom-6 left-6 right-6">
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-green-50/95 backdrop-blur-md text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
                <div className="flex items-center gap-1 bg-amber-50/95 backdrop-blur-md text-amber-700 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {doctor.rating || "4.9"}
                </div>
                <div className="flex items-center gap-1 bg-blue-50/95 backdrop-blur-md text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-md">
                  <Smartphone className="w-3.5 h-3.5" />
                  Same-Day
                </div>
              </div>
              
              {/* Name and Role */}
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2 leading-tight">
                {doctor.name}
              </h2>
              <p className="text-white/90 text-base sm:text-lg font-medium">{doctor.role}</p>
            </div>
          </div>

          <div className="px-5 pt-8 space-y-6">
            {/* Quick Trust Badges Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
                <CheckCheck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-green-700 uppercase">Verified</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-blue-700 uppercase">Same Day</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
                <Home className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-amber-700 uppercase">Home Care</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3 text-center border border-purple-100">
                <Video className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-purple-700 uppercase">Online</p>
              </div>
            </div>

            {/* 2. About That Doctor */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-black tracking-tight mb-3">
                About {doctor.name.split(" ")[0]}
              </h3>
              <p className="text-gray-600 text-sm font-normal leading-relaxed">
                {doctor.description ||
                  `${doctor.name} is a highly experienced ${doctor.role} specializing in providing personalized medical care at home. Dedicated to delivering compassionate and effective treatment plans tailored to patient needs.`}
              </p>
            </section>

            {/* 3. Degree of That Doctor */}
            <section className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-3xl p-6 border border-green-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-green-200">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest mb-0.5">
                  Professional Degree
                </p>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  {doctor.degree || "Certified Medical Professional"}
                </h3>
              </div>
            </section>

            {/* 4. Remain Details (Stats & Location) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                  Experience
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {doctor.experience}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                  Service Area
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {doctor.area || "Lucknow"}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialization Tags */}
            {doctor.specialization && doctor.specialization.length > 0 && (
              <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-black tracking-tight mb-4">
                  Core Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialization.map((spec, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* How It Works Section */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-black tracking-tight mb-6">
                How It Works
              </h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Book Request", desc: "Schedule appointment in minutes" },
                  { step: "2", title: "Doctor Assigned", desc: "Verified professional confirmed" },
                  { step: "3", title: "Home Visit / Video", desc: "Expert care at your doorstep" },
                  { step: "4", title: "Prescription Support", desc: "Digital prescription & follow-up" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-700">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-0.5">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video Consultation Section */}
            <section className="bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-3xl p-6 border border-purple-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-purple-200">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Online Video Consultation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Skip the travel! Get expert medical advice via video call. Supports Google Meet, WhatsApp Video, and our secure platform.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-full">
                      WhatsApp Video
                    </span>
                    <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-full">
                      Google Meet
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Patient Trust & Care */}
            <section className="bg-green-50 rounded-3xl p-6 border border-green-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">
                Your Trust & Care
              </h3>
              <div className="space-y-3">
                {[
                  "✓ Verified Background & Documents",
                  "✓ Advanced Portable Medical Equipment",
                  "✓ Personalized Recovery Plan",
                  "✓ 24/7 Direct Access to Support Team",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Badges Section */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Trust Us</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-blue-700">MSME Certified</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                  <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-amber-700">Startup India</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-green-700">24×7 Support</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                  <AwardIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-purple-700">Trusted Care</p>
                </div>
              </div>
            </section>

            <div className="bg-gray-50 py-12 px-5 rounded-3xl mt-8 mb-28">
              <BookingForm 
                title={`Book Appointment with ${doctor.name.split(' ')[0]}`}
                subtitle="Expert Care at Your Doorstep"
                defaultService={doctor.category?.name || doctor.category || ""}
                defaultDoctor={doctor.name}
                hideService={true}
              />
            </div>
          </div>
        </div>

        {/* Premium Footer Section */}
        <div className="bg-white border-t border-gray-100 px-5 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
                <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-green-700 mb-1">Emergency</p>
                <a href="tel:8874744756" className="text-sm font-bold text-gray-900">
                  887-4744-756
                </a>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-blue-700 mb-1">Service Areas</p>
                <p className="text-sm font-bold text-gray-900">{doctor.area || "Lucknow"}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">
                Available 24/7 for emergencies and consultations
              </p>
              <a 
                href="https://wa.me/8874744756?text=Hi, I'd like to book an appointment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Booking Bar - Enhanced */}
        <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-5 py-3 z-40 shadow-lg shadow-black/5">
          <div className="max-w-2xl mx-auto flex items-center gap-2 sm:gap-3">
            {/* Call Button */}
            <a
              href="tel:8874744756"
              className="h-12 w-14 sm:h-14 sm:w-auto sm:flex-1 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 text-gray-700 active:scale-95 transition-all font-bold text-xs sm:text-sm"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">Call</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/8874744756?text=Hi, I'd like to book an appointment with Dr. Contact me soon"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-14 sm:h-14 sm:w-auto sm:flex-1 rounded-xl sm:rounded-2xl bg-green-50 hover:bg-green-100 border border-green-200 flex items-center justify-center gap-2 text-green-700 active:scale-95 transition-all font-bold text-xs sm:text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Video Consultation Button */}
            <Link
              href={`/book?doctor=${doctor.slug}&service=Video&category=${doctor.category?.name || doctor.category || ""}`}
              className="h-12 w-14 sm:h-14 sm:w-auto sm:flex-1 rounded-xl sm:rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center justify-center gap-2 text-purple-700 active:scale-95 transition-all font-bold text-xs sm:text-sm"
            >
              <Video className="w-5 h-5" />
              <span className="hidden sm:inline">Video</span>
            </Link>

            {/* Book Now Button */}
            <Link
              href={`/book?doctor=${doctor.slug}&category=${doctor.category?.name || doctor.category || ""}`}
              className="h-12 sm:h-14 flex-1 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-bold shadow-lg active:scale-95 transition-all"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, #0d8a4e)`,
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>Book</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                {doctor.isVerified !== false && (
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4 fill-blue-50" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Verified Profile
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-yellow-600 px-3 py-1 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-bold">
                    {doctor.rating || "4.9"}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-normal text-white tracking-tight mb-1">
                {doctor.name}
              </h2>
              <p className="text-white/80 text-sm font-normal">{doctor.role}</p>
            </div>
          </div>

          <div className="px-5 pt-8 space-y-8">
            {/* 2. About That Doctor */}
            <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-normal text-black tracking-tight mb-3">
                About {doctor.name.split(" ")[0]}
              </h3>
              <p className="text-gray-500 text-sm font-normal leading-relaxed">
                {doctor.description ||
                  `${doctor.name} is a highly experienced ${doctor.role} specializing in providing personalized medical care at home. Dedicated to delivering compassionate and effective treatment plans tailored to patient needs.`}
              </p>
            </section>

            {/* 3. Degree of That Doctor */}
            <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-0.5">
                  Professional Degree
                </p>
                <h3 className="text-base font-normal text-black tracking-tight">
                  {doctor.degree || "Certified Medical Professional"}
                </h3>
              </div>
            </section>

            {/* 4. Remain Details (Stats & Location) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-2">
                  Experience
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-base font-normal text-black">
                    {doctor.experience}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-2">
                  Service Area
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-base font-normal text-black truncate">
                    {doctor.area || "Lucknow"}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialization Tags */}
            {doctor.specialization && doctor.specialization.length > 0 && (
              <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-normal text-black tracking-tight mb-4">
                  Core Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialization.map((spec, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-2xl text-xs font-normal border border-gray-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            <div className="bg-primary/5 rounded-[40px] p-8 border border-primary/10">
              <h3 className="text-lg font-normal text-black tracking-tight mb-6">
                Patient Trust & Care
              </h3>
              <div className="space-y-4">
                {[
                  "Verified Background & Documents",
                  "Advanced Portable Equipment",
                  "Personalized Recovery Plan",
                  "Direct Access to Support Team",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-gray-600 font-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Booking Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 z-40">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <a
              href="tel:8874744756"
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
            >
              <Phone className="w-5 h-5" />
            </a>
            <Link
              href={`/book?doctor=${doctor.slug}&category=${doctor.category?.name || doctor.category || ""}`}
              className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-white text-sm font-normal shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, #0d8a4e)`,
              }}
            >
              Book Appointment Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

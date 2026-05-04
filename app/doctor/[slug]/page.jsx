"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  ArrowRight
} from 'lucide-react';

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
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-5 text-center">
        <h2 className="text-2xl font-normal text-black tracking-tight mb-4">Doctor Not Found</h2>
        <Link href="/" className="text-primary font-normal flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-gray-50">
        <Link href="/" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5 text-black" />
        </Link>
        <h1 className="text-sm font-normal text-black tracking-tight">Doctor Profile</h1>
        <div className="w-10 h-10"></div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-28 h-28 rounded-[32px] overflow-hidden shadow-xl shadow-primary/10 border-4 border-white">
            <Image 
              src={doctor.image} 
              alt={doctor.name} 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-normal text-black tracking-tight">{doctor.name}</h2>
              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
            </div>
            <p className="text-primary text-sm font-normal mb-2">{doctor.role}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-[11px] font-normal text-yellow-700">{doctor.rating || '4.9'}</span>
              </div>
              <span className="text-gray-400 text-xs font-normal">•</span>
              <span className="text-gray-500 text-xs font-normal">{doctor.experience} Experience</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-50 p-4 rounded-3xl text-center">
            <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-1">Patients</p>
            <p className="text-lg font-normal text-black">1.2k+</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl text-center">
            <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-1">Exp.</p>
            <p className="text-lg font-normal text-black">{doctor.experience.split('+')[0]}Yrs</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl text-center">
            <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mb-1">Reviews</p>
            <p className="text-lg font-normal text-black">480+</p>
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <h3 className="text-lg font-normal text-black tracking-tight mb-3">About Doctor</h3>
          <p className="text-gray-500 text-sm font-normal leading-relaxed">
            {doctor.description || `${doctor.name} is a highly experienced ${doctor.role} specializing in providing personalized medical care at home. With ${doctor.experience} of clinical practice, they focus on delivering compassionate and effective treatment plans tailored to patient needs.`}
          </p>
        </div>

        {/* Specialization Tags */}
        {doctor.specialization && doctor.specialization.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-normal text-black tracking-tight mb-4">Specialization</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialization.map((spec, i) => (
                <span key={i} className="px-4 py-2 bg-primary-light text-primary rounded-2xl text-[11px] font-normal">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services / Benefits */}
        <div className="bg-gray-50 rounded-[40px] p-8 mb-8">
          <h3 className="text-lg font-normal text-black tracking-tight mb-6">Why Choose {doctor.name}?</h3>
          <div className="space-y-4">
            {[
              "Verified Background & Documents",
              "Advanced Portable Equipment",
              "24/7 Support for Emergencies",
              "Personalized Recovery Plan"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
                </div>
                <span className="text-sm text-gray-600 font-normal">{item}</span>
              </div>
            ))}
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
            href={`/book?doctor=${doctor.slug}&category=${doctor.category?.name || doctor.category || ''}`}
            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-white text-sm font-normal shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, #0d8a4e)` }}
          >
            Book Appointment Now <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </div>
  );
}

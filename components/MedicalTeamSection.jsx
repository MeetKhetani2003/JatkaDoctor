"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ChevronRight, Star, Clock, Phone, Loader2, MapPin } from 'lucide-react';
import { medicalTeam as staticTeam } from '@/lib/medicalTeam';

export default function MedicalTeamSection() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data.slice(0, 8));
        } else {
          setDoctors(staticTeam.filter(m => m.category === 'Doctors').slice(0, 8));
        }
      } catch (e) {
        setDoctors(staticTeam.filter(m => m.category === 'Doctors').slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleCardClick = (slug) => {
    if (slug) {
      router.push(`/doctor/${slug}`);
    } else {
      router.push('/our-medical-team');
    }
  };

  return (
    <section className="py-16 px-5 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="h-1 w-12 bg-primary mb-3 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-normal text-black tracking-tight">Our Medical Team</h2>
            <p className="text-gray-500 text-sm mt-2 font-normal">Expert Doctors, Nurses & Technicians for Home Care</p>
          </div>
          <Link href="/our-medical-team" className="hidden sm:flex items-center gap-1 text-primary text-sm font-normal">
            View All Team <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-6 -mx-5 px-5 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:px-0 sm:mx-0 scrollbar-hide">
            {doctors.map((member) => (
              <div 
                key={member._id || member.id} 
                onClick={() => handleCardClick(member.slug)}
                className="min-w-[280px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group active:scale-[0.98] transition-transform duration-200 cursor-pointer"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-primary font-normal flex items-center gap-1 shadow-sm border border-primary/10">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                    Available Today
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-normal text-black leading-tight truncate mr-2 group-hover:text-primary transition-colors">{member.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] text-gray-400 font-normal">{member.rating || '4.9'}</span>
                    </div>
                  </div>
                  <p className="text-primary text-xs font-normal mb-2">{member.role}</p>
                  
                  {member.area && (
                    <div className="flex items-center gap-1.5 mb-3 text-[11px] text-gray-500">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="truncate">{member.area}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-auto py-3 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">Experience</span>
                      <span className="text-xs text-gray-700 font-normal">{member.experience}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">Specialist</span>
                      <span className="text-xs text-gray-700 font-normal truncate">
                        {member.specialization?.[0] || member.category?.name || 'Expert'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <Link 
                      href={member.slug ? `/doctor/${member.slug}` : "/our-medical-team"}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 text-gray-700 text-xs font-normal border border-gray-100 hover:bg-gray-100 transition active:bg-gray-200"
                    >
                      <User className="w-3 h-3" /> Profile
                    </Link>
                    <Link 
                      href={member.slug ? `/book?doctor=${member.slug}&category=${member.category?.slug || 'general'}` : "/book"}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-white text-xs font-normal shadow-md shadow-primary/20 hover:bg-primary-dark transition active:scale-95"
                    >
                      Book Now
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link 
            href="/our-medical-team" 
            className="inline-flex items-center justify-center w-full py-4 bg-white border border-gray-100 rounded-2xl text-primary text-sm font-normal shadow-sm active:bg-gray-50"
          >
            View All Team Members <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}


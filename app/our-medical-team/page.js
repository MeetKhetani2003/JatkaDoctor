"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, ChevronLeft, Search, Filter, Phone, MessageSquare, Star, Clock, MapPin, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import { medicalTeam as staticTeam } from '@/lib/medicalTeam';

export default function MedicalTeamPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState([]);
  const [categories, setCategories] = useState(["All", "Doctors", "Nurses", "Technicians", "Caregivers"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, staffRes, catsRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/staff'),
          fetch('/api/categories')
        ]);
        const docs = await docsRes.json();
        const staff = await staffRes.json();
        const cats = await catsRes.json();

        let combined = [];
        if (Array.isArray(docs) && docs.length > 0) combined = [...combined, ...docs];
        if (Array.isArray(staff) && staff.length > 0) combined = [...combined, ...staff];

        if (combined.length === 0) {
          setTeam(staticTeam);
        } else {
          setTeam(combined);
          if (Array.isArray(cats) && cats.length > 0) {
            setCategories(["All", ...cats.map(c => c.name)]);
          }
        }
      } catch (e) {
        setTeam(staticTeam);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTeam = team.filter(member => {
    const memberCat = member.category?.name || member.category;
    const matchesCategory = activeCategory === "All" || memberCat === activeCategory;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* App-like Header Navigation */}
      <div className="mt-14 bg-white px-5 py-4 flex items-center justify-between sticky top-14 z-20 shadow-sm sm:hidden">
        <Link href="/" className="p-2 -ml-2 rounded-full active:bg-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <h1 className="text-lg font-normal text-black tracking-tight">Our Medical Team</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="hidden sm:block mb-10 mt-10">
          <h1 className="text-4xl font-normal text-black tracking-tight mb-2 text-center">Our Medical Team</h1>
          <p className="text-gray-500 text-center font-normal">Expert Healthcare Professionals at Your Doorstep</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or specialization..."
            className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 rounded-3xl text-sm font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 -mx-5 px-5 scrollbar-hide mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-normal transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white text-gray-600 border-gray-100 shadow-sm hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTeam.map((member) => (
              <div 
                key={member._id || member.id} 
                onClick={() => {
                  if (member.slug) window.location.href = `/doctor/${member.slug}`;
                }}
                className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
                    <Image src={member.image} alt={member.name} fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    {member.isVerified !== false && (
                      <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-normal text-black truncate leading-tight group-hover:text-primary transition-colors">{member.name}</h3>
                      <div className="flex items-center gap-0.5 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] text-gray-400 font-normal">{member.rating || '4.9'}</span>
                      </div>
                    </div>
                    <p className="text-primary text-[11px] font-normal mb-1">{member.role}</p>
                    
                    {member.area && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-normal mb-1">
                        <MapPin className="w-2.5 h-2.5 text-primary" /> <span className="truncate">{member.area}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-normal">
                      <Clock className="w-3 h-3" /> {member.experience} Experience
                    </div>
                  </div>
                </div>


                <div className="bg-gray-50 rounded-2xl p-4 mb-5 flex-1">
                  <p className="text-gray-600 text-[11px] font-normal leading-relaxed italic mb-3 line-clamp-2">
                    "{member.description || member.bio || "Dedicated healthcare professional providing expert home care services."}"
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(member.specialization || []).slice(0, 2).map((spec, i) => (
                      <span key={i} className="text-[9px] bg-white border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-normal">
                        {spec}
                      </span>
                    ))}
                    {(member.specialization || []).length > 2 && (
                      <span className="text-[9px] text-primary font-normal p-1">+{(member.specialization || []).length - 2} more</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link 
                    href={member.slug ? `/doctor/${member.slug}` : "/book"}
                    className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl text-xs font-normal shadow-lg shadow-primary/10 hover:bg-primary-dark transition active:scale-95"
                  >
                    View Profile & Book <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a 
                    href={`https://wa.me/918874744756`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl text-xs font-normal hover:bg-gray-50 transition active:bg-gray-100"
                  >
                    <MessageSquare className="w-4 h-4 text-green-500" /> WhatsApp Enquiry
                  </a>
                </div>
              </div>
            ))}
          </div>

        )}

        {!loading && filteredTeam.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-normal text-black mb-2">No profiles found</h3>
            <p className="text-sm text-gray-500 font-normal">Try searching for a different name or role.</p>
          </div>
        )}
      </div>

      <Footer />
      <StickyBottomBar />
    </main>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Briefcase
} from "lucide-react";

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal text-black tracking-tight">Join Requests</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
          <User className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-normal text-black tracking-tight mb-1">
            No partner requests yet
          </h3>
          <p className="text-gray-400 text-sm font-normal">
            New applications from the 'Join Us' page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 pb-0 flex justify-between items-start">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-normal uppercase tracking-wider">
                  {partner.type}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-normal text-black tracking-tight">
                    {partner.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {partner.location}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                    <Phone className="w-4 h-4 text-gray-400" /> {partner.phone}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                    <Mail className="w-4 h-4 text-gray-400" /> {partner.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                    <Clock className="w-4 h-4 text-gray-400" /> {partner.experience || "N/A"}
                  </div>
                  {partner.bio && (
                    <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-600 line-clamp-3">
                      "{partner.bio}"
                    </div>
                  )}
                  {partner.idFileId && (
                    <a 
                      href={`/api/images/${partner.idFileId}`} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-[10px] text-primary hover:underline font-medium bg-primary-light px-3 py-1.5 rounded-lg"
                    >
                      <Upload className="w-3 h-3" /> View Proof / ID
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30 flex gap-2">
                <button className="flex-1 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl text-[11px] font-normal hover:bg-gray-50 transition">
                  Review
                </button>
                <button className="flex-1 py-3 bg-primary text-white rounded-2xl text-[11px] font-normal hover:bg-primary-dark transition shadow-lg shadow-primary/10">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

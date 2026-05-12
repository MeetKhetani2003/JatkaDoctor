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
  Briefcase,
  Upload,
  Trash2,
  Eye,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      const res = await fetch("/api/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchData();
        setSelectedPartner(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    setActionLoading(id + "delete");
    try {
      const res = await fetch(`/api/partners?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
        setSelectedPartner(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-normal text-black tracking-tight">Join Requests</h1>
          <p className="text-gray-500 text-xs font-normal mt-1">Manage partner applications and recruitment</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-normal text-black tracking-tight mb-2">
            No partner requests yet
          </h3>
          <p className="text-gray-400 text-sm font-normal max-w-xs mx-auto">
            New applications from the 'Join Us' page will appear here for your review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group"
            >
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {partner.type}
                  </span>
                  <StatusBadge status={partner.status} />
                </div>
              </div>

              <div className="p-6 pt-2 space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-bold text-black tracking-tight group-hover:text-primary transition-colors">
                    {partner.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {partner.location}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    {partner.phone}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="truncate">{partner.email}</span>
                  </div>
                  
                  {partner.bio && (
                    <div className="bg-gray-50 p-4 rounded-2xl text-[11px] text-gray-500 line-clamp-2 italic leading-relaxed">
                      "{partner.bio}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/20 flex gap-2">
                <button 
                  onClick={() => setSelectedPartner(partner)}
                  className="flex-1 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl text-[11px] font-bold hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Review
                </button>
                <div className="flex gap-2">
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(partner._id, "Approved")}
                      className="w-11 h-11 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
                      title="Approve"
                    >
                      {actionLoading === partner._id + "Approved" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(partner._id, "Rejected")}
                      className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center justify-center hover:bg-red-100 transition-all active:scale-95"
                      title="Reject"
                    >
                      {actionLoading === partner._id + "Rejected" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleDelete(partner._id)}
                      className="w-11 h-11 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                      title="Delete"
                    >
                      {actionLoading === partner._id + "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-50">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                     <Briefcase className="w-8 h-8" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-black tracking-tight">{selectedPartner.name}</h2>
                     <p className="text-primary font-bold text-sm uppercase tracking-widest">{selectedPartner.type}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedPartner(null)}
                  className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem icon={Phone} label="Phone Number" value={selectedPartner.phone} />
                  <InfoItem icon={Mail} label="Email Address" value={selectedPartner.email} />
                  <InfoItem icon={MapPin} label="Base Location" value={selectedPartner.location} />
                  <InfoItem icon={Clock} label="Experience" value={selectedPartner.experience || "N/A"} />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">About / Bio</h4>
                  <div className="bg-gray-50 p-6 rounded-3xl text-sm text-gray-700 leading-relaxed italic">
                    "{selectedPartner.bio || "No description provided."}"
                  </div>
                </div>

                {selectedPartner.idFileId && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Uploaded Proof / ID</h4>
                    <a 
                      href={`/api/images/${selectedPartner.idFileId}`}
                      target="_blank"
                      className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl group hover:bg-primary/10 transition-all"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Identity Verification Document</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Click to view original file</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <button 
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPartner._id, "Approved")}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {actionLoading?.includes("Approved") ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Approve Application</>}
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPartner._id, "Rejected")}
                  className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {actionLoading?.includes("Rejected") ? <Loader2 className="w-5 h-5 animate-spin" /> : <><XCircle className="w-5 h-5" /> Reject Application</>}
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => handleDelete(selectedPartner._id)}
                  className="w-14 h-14 bg-white border border-gray-200 text-gray-400 rounded-2xl flex items-center justify-center hover:text-red-600 hover:bg-red-50 transition-all active:scale-[0.98]"
                >
                  {actionLoading?.includes("delete") ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'Pending': 'bg-amber-100 text-amber-600',
    'Approved': 'bg-green-100 text-green-600',
    'Rejected': 'bg-red-100 text-red-600',
    'Reviewed': 'bg-blue-100 text-blue-600',
  };
  return (
    <span className={`${colors[status] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-tight`}>
      {status}
    </span>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

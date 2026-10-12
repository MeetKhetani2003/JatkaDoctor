"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Activity,
  CreditCard,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Info,
  X,
  CheckCircle2,
  Phone,
  Sparkles,
  Stethoscope,
  ChevronRight
} from "lucide-react";

export default function UpcomingCampBanner() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCampIndex, setActiveCampIndex] = useState(0);

  // Modals
  const [selectedCampForDetails, setSelectedCampForDetails] = useState(null);
  const [selectedCampForRegister, setSelectedCampForRegister] = useState(null);

  // Quick Register Form
  const [regForm, setRegForm] = useState({ name: "", mobile: "", patientId: "", notes: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    async function fetchCamps() {
      try {
        const res = await fetch("/api/camps");
        const data = await res.json();
        if (data.success && data.camps && data.camps.length > 0) {
          setCamps(data.camps);
        }
      } catch (err) {
        console.error("Failed to load upcoming camps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCamps();
  }, []);

  const camp = camps[activeCampIndex] || {
    campId: "CAMP-LKO-001",
    name: "Free Mega Health & Physiotherapy Check-up Camp",
    location: "Gomti Nagar, Lucknow",
    address: "Dr Jhatka Medicare Medical Camp, Near Patrakarpuram, Lucknow",
    date: "Sunday, 18 Oct 2026",
    time: "10:00 AM – 02:00 PM",
    status: "Upcoming",
    description: "Free comprehensive health check-up camp organized by Dr Jhatka Medicare. Avail free Blood Pressure, Random Blood Sugar, BMI check, Physiotherapy consultation, and get your Permanent Free Health Card.",
    assignedStaff: [
      { name: "Dr. S. K. Verma", role: "Chief Medical Officer" },
      { name: "Dr. Priya Sharma (PT)", role: "Senior Physiotherapist" }
    ],
    totalRegistered: 84
  };

  const freeServices = [
    { label: "Free BP Check", icon: Heart },
    { label: "Free Sugar Check", icon: Activity },
    { label: "Free BMI Check", icon: ShieldCheck },
    { label: "Physio Consultation", icon: UserCheck },
    { label: "Physiotherapy at Home", icon: Stethoscope },
    { label: "Free Health Card for All", icon: CreditCard },
  ];

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.mobile || regForm.mobile.replace(/[^0-9]/g, "").length < 10) {
      setRegError("Please enter a valid 10-digit mobile number");
      return;
    }
    setRegLoading(true);
    setRegError("");

    try {
      const res = await fetch("/api/camps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campId: selectedCampForRegister?.campId || camp.campId,
          name: regForm.name,
          mobile: regForm.mobile,
          patientId: regForm.patientId,
          notes: regForm.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess(true);
      } else {
        setRegError(data.message || "Registration failed");
      }
    } catch {
      setRegError("Network error. Please try again or call our helpline.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <section className="py-4 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50/30 border border-emerald-200/80 p-4 sm:p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          
          {/* Left: Badge + Camp Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] sm:text-xs font-black tracking-wide uppercase shadow-xs">
                <span>📢</span>
                <span>{camp.status === "Active" ? "LIVE TODAY" : "UPCOMING CAMP"}</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                Dr Jhatka Medicare Community Health Initiative
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              <span className="text-[#006837] uppercase">{camp.name || "FREE HEALTH CHECK-UP CAMP"}</span>
            </h2>
          </div>

          {/* Right: Date, Time & Location Pill Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur-xs p-3 sm:p-3.5 rounded-xl border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-gray-900 leading-tight">
                  {camp.date}
                </p>
                <p className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-700" />
                  <span>{camp.time}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-gray-900 leading-tight">
                  {camp.location}
                </p>
                <p className="text-[11px] font-medium text-gray-600 truncate max-w-[200px]">
                  {camp.city || "Lucknow"} • Dr Jhatka Medicare Camp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Checks & Benefits Icons Grid */}
        <div className="py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free Health Screenings & Consultations For All:</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {freeServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/95 rounded-xl p-2.5 border border-emerald-100 shadow-2xs hover:border-emerald-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006837] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 leading-tight">
                    {srv.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-[#006837]" />
              <span>No Prior Registration Fee • Walk-ins & Pre-booking Welcome</span>
            </span>
            {camp.totalRegistered ? (
              <span className="hidden md:inline-block bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold text-gray-700">
                👥 {camp.totalRegistered}+ Already Registered
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setSelectedCampForRegister(camp);
                setRegSuccess(false);
                setRegError("");
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#006837] hover:bg-[#00502a] text-white text-xs sm:text-sm font-extrabold shadow-sm transition active:scale-95"
            >
              <span>Register for Camp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedCampForDetails(camp)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-2xs transition"
            >
              <Info className="w-4 h-4 text-emerald-700" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: VIEW DETAILS MODAL */}
      {/* ============================================================== */}
      {selectedCampForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedCampForDetails(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-[#006837] text-xs font-extrabold uppercase mb-3">
              <span>Dr Jhatka Medicare Free Camp</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-2">
              {selectedCampForDetails.name}
            </h3>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              {selectedCampForDetails.description || "Join our free medical checkup camp designed to provide preventive healthcare, vitals assessment, senior citizen mobility screenings, and instant Health Cards."}
            </p>

            {/* Timings & Address Details */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-5 border border-gray-100">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#006837] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Camp Date</p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">{selectedCampForDetails.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#006837] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Camp Hours</p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">{selectedCampForDetails.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Camp Venue & Address</p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                    {selectedCampForDetails.address || selectedCampForDetails.location}
                  </p>
                  <p className="text-xs text-gray-500">{selectedCampForDetails.city || "Lucknow"}</p>
                </div>
              </div>
            </div>

            {/* Doctors / Staff on Duty */}
            {selectedCampForDetails.assignedStaff && selectedCampForDetails.assignedStaff.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                  Medical Team On Duty:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCampForDetails.assignedStaff.map((staff, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <Stethoscope className="w-4 h-4 text-[#006837]" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{staff.name}</p>
                        <p className="text-[10px] text-gray-500">{staff.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions inside Modal */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCampForDetails(null);
                  setSelectedCampForRegister(selectedCampForDetails);
                }}
                className="flex-1 py-3 bg-[#006837] hover:bg-[#00502a] text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-sm text-center"
              >
                Register for this Camp →
              </button>
              <a
                href="tel:+918874744756"
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition"
              >
                <Phone className="w-4 h-4 text-[#006837]" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REGISTER FOR CAMP MODAL */}
      {/* ============================================================== */}
      {selectedCampForRegister && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedCampForRegister(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {regSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-[#006837] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Registration Confirmed!</h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Your spot for <strong>{selectedCampForRegister.name}</strong> is successfully booked. Please visit on <strong>{selectedCampForRegister.date} ({selectedCampForRegister.time})</strong> at <strong>{selectedCampForRegister.location}</strong>.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 font-semibold">
                  🎉 You will receive free BP, Sugar, BMI checks & your Permanent Digital Health Card at the camp.
                </div>
                <button
                  onClick={() => setSelectedCampForRegister(null)}
                  className="w-full py-2.5 bg-[#006837] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-[#006837] tracking-wider">Free Health Camp Registration</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                    {selectedCampForRegister.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {selectedCampForRegister.date} • 📍 {selectedCampForRegister.location}
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold border border-red-200">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Enter patient full name"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={regForm.mobile}
                      onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="10 digit mobile"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-r-xl text-xs focus:ring-2 focus:ring-[#006837] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Dr Jhatka Health Card ID <span className="text-gray-400 font-normal">(Optional, if you already have one)</span>
                  </label>
                  <input
                    type="text"
                    value={regForm.patientId}
                    onChange={(e) => setRegForm({ ...regForm, patientId: e.target.value.toUpperCase() })}
                    placeholder="e.g. DJM-PT-000125"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006837] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Specific Health Problem / Note <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={regForm.notes}
                    onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                    placeholder="e.g. Knee pain, Back pain, High BP, Diabetes check"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006837] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3 bg-[#006837] hover:bg-[#00502a] text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {regLoading ? "Registering..." : "Confirm Free Registration →"}
                  </button>
                </div>

                <div className="text-center pt-1">
                  <Link
                    href={`/health-card?camp=${selectedCampForRegister.campId}`}
                    className="text-[11px] text-[#006837] hover:underline font-bold"
                  >
                    Want to create your Permanent Health Card online right now? Click here
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";
import React from "react";
import Link from "next/link";
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Heart,
  Activity,
  QrCode,
  Users
} from "lucide-react";

export default function FreeHealthCardBanner() {
  return (
    <section className="py-12 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#004d26] via-[#006837] to-[#00381b] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-emerald-500/30">
          
          {/* Subtle background glow & wave graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Zero Cost • Lifetime Permanent ID • Family Linked</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Get Your Dr Jhatka <br />
                <span className="text-emerald-300 underline decoration-emerald-400/50">FREE HEALTH CARD</span> Today
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                One Permanent Patient ID (e.g. <strong>DJM-PT-000125</strong>) for a lifetime. Valid for all free medical camps, home physiotherapy, doctor visits, and ambulance requests in Lucknow.
              </p>

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Instant Digital ATM/PVC Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Unique Secure Verification QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Link Entire Family (Family ID)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>70+ Senior Citizen Priority Benefits</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/health-card"
                  id="hero-create-health-card-btn"
                  className="px-6 py-3.5 bg-white text-[#006837] hover:bg-emerald-50 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>CREATE FREE HEALTH CARD</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/patient/login"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
                >
                  <span>Already Registered? Login</span>
                </Link>
              </div>
            </div>

            {/* Right Card Graphic Demonstration */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[360px] aspect-[85.6/53.98] rounded-2xl bg-white text-gray-900 shadow-2xl p-4 border border-emerald-400/40 transform hover:rotate-1 hover:scale-105 transition-all duration-300 select-none overflow-hidden">
                
                {/* Mini card header */}
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <img src="/Dr.Jhatka.png" alt="DJM" className="w-7 h-7 object-contain" />
                    <div>
                      <p className="text-[10px] font-black text-[#006837] leading-none">Dr Jhatka</p>
                      <p className="text-[7.5px] font-bold text-gray-700 uppercase">MEDICARE</p>
                    </div>
                  </div>
                  <span className="bg-[#006837] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                    FREE HEALTH CARD
                  </span>
                </div>

                {/* Mini card body */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-center">
                  <div className="col-span-3">
                    <div className="w-14 h-16 rounded-lg bg-emerald-50 border border-[#006837] flex items-center justify-center text-emerald-800">
                      <Users className="w-6 h-6 opacity-80" />
                    </div>
                  </div>
                  <div className="col-span-6 text-[9.5px] space-y-0.5">
                    <p className="font-extrabold text-gray-900 leading-tight">Dr. Govind Kumar</p>
                    <p className="font-mono font-black text-[#006837] text-[9px] bg-emerald-50 px-1 py-0.2 rounded inline-block">
                      DJM-PT-000001
                    </p>
                    <p className="text-gray-500 text-[8.5px]">Family: DJM-FAM-000001</p>
                    <p className="text-gray-600 text-[8px]">+91 87077 90677</p>
                  </div>
                  <div className="col-span-3 flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded p-0.5 shadow-xs flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-[#004d26]" />
                    </div>
                    <span className="text-[7px] text-[#006837] font-black uppercase mt-0.5">ACTIVE</span>
                  </div>
                </div>

                {/* Mini card footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#004d26] text-white px-3 py-1 flex items-center justify-between text-[7.5px]">
                  <span>Health Check • Physio Guidance • Special Offers</span>
                  <span className="italic opacity-90">Speed, Care & Trust</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200/80 mt-3 text-center">
                Standard CR80 PVC / ATM Size (85.60 × 53.98 mm) • Print-Ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

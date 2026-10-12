"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Ambulance, 
  Stethoscope, 
  CreditCard, 
  MessageCircle, 
  PhoneCall, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";

export default function QuickActions({ onOpenPrescriptionModal }) {
  const { openModal, openAmbulanceModal } = useBookingModal();

  const actions = [
    {
      id: "quick-action-prescription",
      title: "Upload Prescription",
      subtitle: "Photo, Gallery or PDF",
      icon: FileText,
      badge: "Quick Care",
      badgeColor: "bg-emerald-100 text-emerald-800",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-200 hover:border-emerald-400",
      iconBg: "bg-emerald-600 text-white",
      onClick: onOpenPrescriptionModal,
      isButton: true,
      highlight: true
    },
    {
      id: "quick-action-ambulance",
      title: "24x7 Ambulance",
      subtitle: "15-20 Min Arrival",
      icon: Ambulance,
      badge: "Emergency",
      badgeColor: "bg-rose-100 text-rose-700",
      gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
      borderColor: "border-rose-200 hover:border-rose-400",
      iconBg: "bg-rose-600 text-white animate-pulse",
      onClick: openAmbulanceModal,
      isButton: true,
    },
    {
      id: "quick-action-doctor",
      title: "Doctor at Home",
      subtitle: "Qualified MD / MBBS",
      icon: Stethoscope,
      badge: "Home Visit",
      badgeColor: "bg-blue-100 text-blue-700",
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      borderColor: "border-blue-200 hover:border-blue-400",
      iconBg: "bg-blue-600 text-white",
      onClick: () => openModal({ service: "doctor" }),
      isButton: true,
    },
    {
      id: "quick-action-health-card",
      title: "Free Health Card",
      subtitle: "Save up to 40% on Care",
      icon: CreditCard,
      badge: "100% Free",
      badgeColor: "bg-amber-100 text-amber-800",
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-amber-200 hover:border-amber-400",
      iconBg: "bg-amber-600 text-white",
      href: "/health-card",
      isButton: false,
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Quick Actions</span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Fast Response
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Instant care access, prescription review & emergency bookings in Lucknow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          const content = (
            <div className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 bg-white hover:shadow-md cursor-pointer flex flex-col justify-between h-full group ${act.borderColor} ${act.highlight ? 'ring-2 ring-emerald-500/20' : ''}`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${act.gradient} pointer-events-none`} />

              <div className="relative z-10 flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${act.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                {act.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                )}
              </div>

              <div className="relative z-10 text-left">
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                  <span>{act.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 hidden sm:inline" />
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium truncate">
                  {act.subtitle}
                </p>
              </div>
            </div>
          );

          return act.isButton ? (
            <button
              key={act.id}
              id={act.id}
              type="button"
              onClick={act.onClick}
              className="w-full text-left"
            >
              {content}
            </button>
          ) : (
            <Link key={act.id} id={act.id} href={act.href} className="w-full">
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

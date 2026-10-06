"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Lock,
  Phone,
  Globe,
  ArrowRight
} from "lucide-react";

export default function CardVerificationPage({ params }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/health-card/verify/${token}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
        } else {
          setError(result.message || "Invalid or unrecognized Health Card.");
        }
      })
      .catch((err) => {
        setError("Network error while verifying card. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center">
            <img src="/Dr.Jhatka.png" alt="Dr Jhatka Medicare" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-base font-extrabold text-[#006837] tracking-tight leading-none">
              Dr Jhatka Medicare
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">
              Speed, Care & Trust — All in One
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 space-y-3">
            <div className="w-10 h-10 border-4 border-[#006837] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">
              Verifying Health Card credentials...
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && error && (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Card Not Verified
              </h2>
              <p className="text-xs text-red-600 mt-1 max-w-xs mx-auto">
                {error}
              </p>
            </div>
            <Link
              href="/"
              className="inline-block mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
            >
              Go to Dr Jhatka Homepage
            </Link>
          </div>
        )}

        {/* Verified Result */}
        {!loading && data && (
          <div>
            {/* Status Badge */}
            <div className="mb-6">
              {data.cardStatus === "ACTIVE" ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-[#006837] border border-emerald-300 text-xs font-black tracking-wider uppercase shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>HEALTH CARD VERIFIED • ACTIVE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-300 text-xs font-black tracking-wider uppercase shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>CARD INACTIVE / SUSPENDED</span>
                </div>
              )}
            </div>

            {/* Patient & Card Information Card */}
            <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-5 text-left space-y-3 mb-6">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Patient Name
                </span>
                <span className="text-base font-extrabold text-gray-900">
                  {data.patientName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Permanent Patient ID
                  </span>
                  <span className="text-xs font-black font-mono text-[#006837] bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    {data.patientId}
                  </span>
                </div>

                {data.familyId && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Family ID
                    </span>
                    <span className="text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 inline-block mt-0.5">
                      {data.familyId}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Card Type
                  </span>
                  <span className="font-bold text-gray-700">{data.cardType}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Card Version
                  </span>
                  <span className="font-bold text-gray-700">V{data.cardVersion}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-gray-100 text-[11px] text-gray-500">
                <span>Verified against Dr Jhatka Medicare Central Database on: </span>
                <strong className="text-gray-700">
                  {new Date(data.verifiedAt).toLocaleDateString()}
                </strong>
              </div>
            </div>

            {/* Privacy Protection Notice */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-left text-xs text-blue-900 space-y-1 mb-6">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Lock className="w-3.5 h-3.5 text-blue-700" />
                <span>Patient Privacy Safeguard</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                Vital records, medical history, address, and billing details are strictly confidential and protected. They can only be accessed through secure Patient Login.
              </p>
            </div>

            {/* Helpline and Contact Info */}
            <div className="text-xs text-gray-500 space-y-1 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-center gap-2 text-gray-700 font-bold">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Helpline / WhatsApp: +91 87077 90677</span>
              </div>
              <div className="text-[11px] text-gray-400">
                Lucknow, Uttar Pradesh, India • www.drjhatka.com
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/patient/login"
                className="w-full py-2.5 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                Patient Login to View Full Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

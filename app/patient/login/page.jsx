"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Phone,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import { usePatientAuth } from "@/context/PatientAuthContext";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();
  const { refresh } = usePatientAuth();

  const [loginMethod, setLoginMethod] = useState("otp"); // 'otp' | 'google'
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [demoCode, setDemoCode] = useState("");

  const errorMessages = {
    access_denied: "You denied access to your Google account.",
    token_failed: "Failed to authenticate with Google. Please try again.",
    user_fetch_failed: "Could not retrieve your Google profile. Please try again.",
    server_error: "A server error occurred. Please try again later.",
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const clean = mobile.replace(/[^0-9]/g, "").slice(-10);
    if (clean.length < 10) {
      setIsError(true);
      setMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setIsError(false);
    setMsg("");
    try {
      const res = await fetch("/api/health-card/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: clean }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setDemoCode(data.otp || "123456");
        setMsg(`OTP sent to +91 ${clean}. If you are registered, you will be logged in immediately.`);
      } else {
        setIsError(true);
        setMsg(data.message || "Failed to send OTP");
      }
    } catch {
      setIsError(true);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const clean = mobile.replace(/[^0-9]/g, "").slice(-10);
    if (!otp || otp.length < 4) {
      setIsError(true);
      setMsg("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setIsError(false);
    setMsg("");

    try {
      const res = await fetch("/api/health-card/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: clean, otp: otp.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.isExisting && data.patient) {
          // Logged in! Refresh session context and redirect
          await refresh();
          router.push("/patient/dashboard");
        } else {
          // Unregistered patient -> Redirect to Free Health Card creation with mobile
          router.push(`/health-card?mobile=${clean}`);
        }
      } else {
        setIsError(true);
        setMsg(data.message || "Invalid OTP code");
      }
    } catch {
      setIsError(true);
      setMsg("Verification error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-white">
          
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center mx-auto mb-4 border border-emerald-400">
            <img src="/Dr.Jhatka.png" alt="Dr Jhatka Medicare" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            Dr Jhatka Medicare
          </h1>
          <p className="text-emerald-200/80 text-xs mb-6 font-medium">
            Patient Portal & Health Card Access
          </p>

          {/* Toggle Login Method */}
          <div className="bg-white/10 p-1 rounded-xl flex items-center mb-6 text-xs font-bold">
            <button
              onClick={() => { setLoginMethod("otp"); setOtpSent(false); setMsg(""); }}
              className={`flex-1 py-2 rounded-lg transition ${
                loginMethod === "otp"
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-emerald-100 hover:text-white"
              }`}
            >
              Mobile OTP / Recover
            </button>
            <button
              onClick={() => { setLoginMethod("google"); setMsg(""); }}
              className={`flex-1 py-2 rounded-lg transition ${
                loginMethod === "google"
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-emerald-100 hover:text-white"
              }`}
            >
              Google Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-xs">
              {errorMessages[error] || "An error occurred. Please try again."}
            </div>
          )}

          {msg && (
            <div
              className={`mb-5 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left ${
                isError
                  ? "bg-red-500/20 border border-red-500/30 text-red-200"
                  : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-200"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* OTP / RECOVER LOGIN FORM */}
          {/* ============================================================== */}
          {loginMethod === "otp" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-xs font-bold text-emerald-200/90 mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="9876543210"
                        className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobile.length < 10}
                    className="w-full py-3 bg-[#006837] hover:bg-[#004d26] text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Get OTP & Access Account"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-emerald-200/60 mt-2">
                    Forgot login? Enter your mobile to receive an OTP and recover your account instantly.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-left">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-emerald-200/90">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-emerald-300 hover:underline"
                      >
                        Change ({mobile})
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-center text-lg font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      autoFocus
                    />
                    {demoCode && (
                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setOtp(demoCode)}
                          className="text-[11px] text-emerald-300 underline font-semibold"
                        >
                          Autofill OTP ({demoCode})
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-3 bg-[#006837] hover:bg-[#004d26] text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Open Dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* GOOGLE SIGN IN */}
          {/* ============================================================== */}
          {loginMethod === "google" && (
            <div className="space-y-4">
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg active:scale-95 text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>
              <p className="text-[11px] text-emerald-200/50">
                Securely sign in with your verified Google account
              </p>
            </div>
          )}

          {/* Don't have card yet? */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <p className="text-xs text-emerald-200/80 mb-2">
              Don't have a Free Health Card yet?
            </p>
            <Link
              href="/health-card"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create FREE Health Card in 2 Minutes →</span>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="text-xs text-emerald-200/60 hover:text-white transition flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Dr Jhatka Medicare
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PatientLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}

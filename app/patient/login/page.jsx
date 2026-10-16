"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    access_denied: "You denied access to your Google account.",
    token_failed: "Failed to authenticate with Google. Please try again.",
    invalid_client: "Google Client ID or Secret is invalid on the server. Please update environment variables on your hosting provider.",
    redirect_uri_mismatch: "Google Redirect URI mismatch. Ensure https://drjhatka.com/api/auth/google/callback is in Google Cloud Console.",
    invalid_grant: "Google authorization code expired or already used. Please try logging in again.",
    user_fetch_failed: "Could not retrieve your Google profile. Please try again.",
    server_error: "A server error occurred. Please try again later.",
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

          {/* Error Message */}
          {error && (
            <div className="mb-5 px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessages[error] || "An error occurred during Google sign-in. Please try again."}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON ONLY */}
          <div className="space-y-4">
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white text-gray-800 font-bold rounded-2xl hover:bg-gray-50 transition shadow-xl active:scale-95 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </a>
            
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-200/70 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>One-click secure sign in with your verified Google account</span>
            </div>
          </div>

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

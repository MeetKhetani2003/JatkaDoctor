"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  Heart,
  Activity,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Layers,
  MapPin,
  Mail,
  Calendar,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Camera
} from "lucide-react";
import HealthCard from "@/components/HealthCard";
import Link from "next/link";

// Auto-compress and scale images client-side for fast, seamless mobile uploads under 30KB
const compressImage = (file, maxBytes = 28 * 1024) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Browser only"));
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 320;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length * 0.75 > maxBytes && quality > 0.2) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function HealthCardRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campParam = searchParams.get("camp");
  const sourceParam = searchParams.get("source") || (campParam ? "Camp" : "Website");

  // Step state: 1 = Mobile & OTP, 2 = Details Form, 3 = Card Issued
  const [step, setStep] = useState(1);
  const [emailAuth, setEmailAuth] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState("");

  // Existing patient found state
  const [existingFound, setExistingFound] = useState(false);
  const [activePatient, setActivePatient] = useState(null);

  // Form Details
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    whatsappNumber: "",
    sameAsMobile: true,
    email: "",
    dob: "",
    age: "",
    gender: "Male",
    city: "Lucknow",
    area: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    bloodGroup: "",
    existingConditions: "",
    allergies: "",
    healthDataConsent: true,
    termsAccepted: true,
    communicationConsent: true,
    marketingConsent: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  // Keep email in formData in sync
  useEffect(() => {
    if (emailAuth) {
      setFormData((prev) => ({
        ...prev,
        email: emailAuth,
      }));
    }
  }, [emailAuth]);

  // Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const clean = emailAuth.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setOtpError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/health-card/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setDemoOtpHint(data.otp || "123456");
      } else {
        setOtpError(data.message || "Failed to send OTP");
        if (data.isExisting) {
            // Show toast/message that card already exists
            alert("A Health Card already exists for this email address. Please login.");
        }
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const clean = emailAuth.trim().toLowerCase();
    if (!otp || otp.length < 4) {
      setOtpError("Please enter the verification OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/health-card/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, otp: otp.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        // New Patient -> Go to Step 2 Details Form
        setStep(2);
      } else {
        setOtpError(data.message || "Invalid OTP code");
      }
    } catch (err) {
      setOtpError("Verification error. Please retry.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Details Form Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Full Name is required");
      return;
    }
    const cleanMobile = (formData.mobile || "").replace(/[^0-9]/g, "");
    if (!cleanMobile || cleanMobile.length < 10) {
      setFormError("Please enter a valid 10-digit Mobile Number");
      return;
    }
    if (!formData.termsAccepted || !formData.healthDataConsent) {
      setFormError("Please accept the terms and healthcare consent to continue");
      return;
    }

    setFormLoading(true);
    setFormError("");

    try {
      const payload = {
        ...formData,
        whatsappNumber: formData.sameAsMobile
          ? formData.mobile
          : formData.whatsappNumber,
        source: sourceParam,
        campId: campParam || undefined,
        registeredBy: campParam ? "Camp Self QR" : "Website Registration",
      };

      const res = await fetch("/api/health-card/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.patient) {
        setActivePatient(data.patient);
        if (data.exists) {
          setExistingFound(true);
        }
        setStep(3);
      } else {
        const isTechnicalError = !data.message || 
          typeof data.message !== 'string' ||
          data.message.includes("is not a function") ||
          data.message.includes("TypeError") ||
          data.message.includes("CastError") ||
          data.message.includes("Cannot read propert");
        const errorMsg = !isTechnicalError
          ? data.message
          : "Failed to create Health Card. Please check your information and try again.";
        setFormError(errorMsg);
      }
    } catch (err) {
      setFormError("Submission failed. Please check your internet connection and try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-gray-50 text-gray-900 pb-20 pt-8">
      {/* Top Container */}
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#006837] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lifetime Permanent Patient ID & Health Benefits</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Create Your <span className="text-[#006837]">FREE Health Card</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Get your instant digital ATM-sized Health Card in 2 minutes. One Permanent ID for all Clinics, Camps, Physiotherapy, Doctor Visits & Ambulance services.
          </p>

          {campParam && (
            <div className="mt-3 inline-block bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-xl text-xs font-bold text-amber-800">
              📍 Registering at Medical Camp: <span className="underline">{campParam}</span>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 text-xs font-bold">
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              step === 1
                ? "bg-[#006837] text-white shadow-sm"
                : "bg-emerald-50 text-[#006837]"
            }`}
          >
            <span>1</span>
            <span>Email & OTP</span>
          </div>
          <span className="text-gray-300">──</span>
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              step === 2
                ? "bg-[#006837] text-white shadow-sm"
                : step > 2
                ? "bg-emerald-50 text-[#006837]"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <span>2</span>
            <span>Basic Details</span>
          </div>
          <span className="text-gray-300">──</span>
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              step === 3
                ? "bg-[#006837] text-white shadow-sm"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <span>3</span>
            <span>Digital Card</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: MOBILE & OTP VERIFICATION */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006837] mx-auto mb-3 shadow-xs">
                <CreditCard className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Enter Email Address
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                We will send an instant OTP to your email to verify your account
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm font-bold text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={emailAuth}
                      onChange={(e) => setEmailAuth(e.target.value.toLowerCase())}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837] transition"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || !emailAuth.includes("@")}
                  className="w-full py-3 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {otpLoading ? "Sending OTP..." : "Continue with OTP"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-[#006837] hover:underline font-semibold"
                    >
                      Change Email ({emailAuth})
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    autoFocus
                  />
                  {demoOtpHint && (
                    <div className="mt-2 text-center">
                      <span className="text-[11px] text-gray-400">Instant code: </span>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpHint)}
                        className="text-[11px] font-bold text-[#006837] underline"
                      >
                        Autofill {demoOtpHint}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otp.length < 4}
                  className="w-full py-3 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {otpLoading ? "Verifying..." : "Verify & Continue"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure • Data Protected • Zero Ads</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: PATIENT DETAILS REGISTRATION FORM */}
        {/* ============================================================== */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Health Card Registration
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Email Verified: <strong className="text-[#006837]">{emailAuth}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 hover:text-black flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {/* Hint alert for dynamic fields */}
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-[#006837] text-xs rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Fill only what you know!</strong> Optional fields (like Blood Group or Address) can be left blank. Only filled details will appear cleanly on your card. Missing fields can be updated later anytime without changing your Permanent ID.
              </span>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              
              {/* Basic Details Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  1. Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Kumar Verma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Age or DOB */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Age (Years) <span className="text-gray-400 font-normal">or DOB</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 35"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="checkbox"
                        id="sameAsMobile"
                        checked={formData.sameAsMobile}
                        onChange={(e) =>
                          setFormData({ ...formData, sameAsMobile: e.target.checked })
                        }
                        className="rounded text-[#006837] focus:ring-[#006837]"
                      />
                      <label htmlFor="sameAsMobile" className="text-xs text-gray-700 font-medium">
                        WhatsApp number is same as Mobile
                      </label>
                    </div>

                    {!formData.sameAsMobile && (
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsappNumber: e.target.value })
                        }
                        placeholder="WhatsApp Number"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm focus:outline-none"
                    />
                  </div>
                  
                  {/* Passport Photo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Passport Size Photo <span className="text-red-500">*</span>
                      <span className="text-[11px] text-gray-500 font-normal ml-2">
                        (Auto-optimized for your Health Card)
                      </span>
                    </label>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-dashed border-[#006837]/40 bg-white shadow-xs shrink-0 flex items-center justify-center">
                          {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <User className="w-7 h-7 text-gray-300" />
                              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Photo</span>
                            </div>
                          )}
                          {photoPreview && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                              <CheckCircle2 size={12} />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="file"
                            id="passportPhotoInput"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              setFormError("");
                              try {
                                const compressedDataUrl = await compressImage(file, 28 * 1024);
                                setPhotoPreview(compressedDataUrl);
                                setFormData((prev) => ({ ...prev, photo: compressedDataUrl }));
                              } catch (err) {
                                console.error("Image processing error:", err);
                                setFormError("Could not process this photo. Please try a different image.");
                              }
                            }}
                          />

                          <div className="flex flex-wrap items-center gap-2">
                            <label
                              htmlFor="passportPhotoInput"
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006837] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
                            >
                              <Camera className="w-4 h-4" />
                              <span>{photoPreview ? "Change Photo" : "Upload Passport Photo"}</span>
                            </label>

                            {photoPreview && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPhotoPreview(null);
                                  setFormData((prev) => ({ ...prev, photo: null }));
                                  const input = document.getElementById("passportPhotoInput");
                                  if (input) input.value = "";
                                }}
                                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                            {photoPreview
                              ? "✓ Photo ready and auto-fitted for your Health Card."
                              : "Tap to select photo from Camera or Gallery. Auto-compressed instantly."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  2. Location Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Lucknow"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Gomti Nagar, Aliganj"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House / Street / Flat details"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Health Information */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  3. Health Information (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    >
                      <option value="">Don't know / Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="Relative's Phone Number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>
              </div>

              {/* Consents Section */}
              <div className="pt-2 space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-[#006837] focus:ring-[#006837]"
                  />
                  <span>
                    I accept Dr Jhatka Medicare Terms & Conditions and Healthcare Privacy Policy.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.communicationConsent}
                    onChange={(e) =>
                      setFormData({ ...formData, communicationConsent: e.target.checked })
                    }
                    className="mt-0.5 rounded text-[#006837] focus:ring-[#006837]"
                  />
                  <span>
                    I consent to receive my Digital Health Card and healthcare reminders via WhatsApp and Email.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingConsent: e.target.checked })
                    }
                    className="mt-0.5 rounded text-[#006837] focus:ring-[#006837]"
                  />
                  <span className="text-gray-500">
                    (Optional) Keep me informed about special health camps and discounts.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {formLoading ? "Generating Health Card..." : "Generate My Free Health Card"}
                <CreditCard className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: DIGITAL HEALTH CARD GENERATED VIEW */}
        {/* ============================================================== */}
        {step === 3 && activePatient && (
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Success Banner */}
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#006837] text-white rounded-full mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#006837]">
                {existingFound
                  ? "Existing Patient Profile Loaded!"
                  : "Congratulations! Your Free Health Card is Ready!"}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Permanent Lifetime Patient ID:{" "}
                <strong className="text-gray-900 bg-white px-2.5 py-0.5 rounded border border-emerald-200 font-mono text-sm">
                  {activePatient.patientId}
                </strong>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Your Health Card has been issued and linked to your phone number. You also received <strong>50 Health Coins</strong>!
              </p>
            </div>

            {/* Health Card Component */}
            <HealthCard patient={activePatient} showActions={true} />

            {/* Dashboard Redirect CTA */}
            <div className="mt-8 text-center space-y-3">
              <Link
                href="/patient/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#006837] hover:bg-[#004d26] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition active:scale-95"
              >
                Go to My Patient Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-xs text-gray-500 hover:text-black font-semibold transition"
                >
                  ← Return to Dr Jhatka Medicare Homepage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HealthCardRegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-500">Loading Free Health Card System...</div>}>
      <HealthCardRegistrationContent />
    </Suspense>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, User, MapPin, CheckCircle2, Loader2,
  ChevronDown, Shield, ArrowRight
} from "lucide-react";

const PRIMARY = "#0F9D58";
const PRIMARY_LIGHT = "#E8F8F1";
const PRIMARY_DARK = "#0d8a4e";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    whatsappNumber: "",
    age: "",
    gender: "",
    address: "",
    pincode: "",
  });

  const [sameAsMobile, setSameAsMobile] = useState(true);

  // Fetch session and check if profile already complete
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/patient-session");
        const data = await res.json();
        if (!data.loggedIn) {
          router.replace("/patient/login");
          return;
        }
        if (data.patient?.profileComplete) {
          router.replace("/patient/profile");
          return;
        }
        setPatient(data.patient);
      } catch {
        router.replace("/patient/login");
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "mobile" && sameAsMobile) {
        next.whatsappNumber = value;
      }
      return next;
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.age || isNaN(form.age) || Number(form.age) < 1 || Number(form.age) > 120) {
      setError("Please enter a valid age (1–120).");
      return;
    }
    if (!form.gender) {
      setError("Please select your gender.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        mobile: form.mobile,
        whatsappNumber: sameAsMobile ? form.mobile : form.whatsappNumber,
        age: Number(form.age),
        gender: form.gender,
        address: form.address,
        pincode: form.pincode,
      };

      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/patient/profile"), 1800);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0F9D58 0%, #0d8a4e 100%)" }}>
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0F9D58 0%, #0d8a4e 100%)" }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: PRIMARY }} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Profile Complete! 🎉</h2>
          <p className="text-green-100 text-sm">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0F9D58 0%, #0d8a4e 38%, #f0fdf4 38%)" }}>
      {/* Top bar */}
      <div className="max-w-lg mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <Image src="/Dr.Jhatka.png" alt="Dr. Jhatka" width={120} height={38} className="object-contain" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-16">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white mb-6"
        >
          {patient?.avatar && (
            <div className="flex items-center gap-3 mb-4">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-12 h-12 rounded-2xl border-2 border-white/40 shadow-lg object-cover"
              />
              <div>
                <p className="font-bold text-lg leading-tight">{patient.name}</p>
                <p className="text-green-100 text-xs">{patient.email}</p>
              </div>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-1">Complete Your Profile</h1>
          <p className="text-green-100 text-sm leading-relaxed">
            We need a few more details to provide you with the best healthcare experience. This is required to book any service.
          </p>
        </motion.div>

        {/* Steps indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          {["Google Login ✓", "Complete Profile", "Book Services"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                i === 0 ? "bg-white/20 text-white" :
                i === 1 ? "bg-white text-green-700 shadow-sm" :
                "bg-white/10 text-white/50"
              }`}>
                {i === 0 && <CheckCircle2 className="w-3 h-3" />}
                {step}
              </div>
              {i < 2 && <ArrowRight className="w-3 h-3 text-white/40 shrink-0" />}
            </div>
          ))}
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-xl shadow-green-900/10 border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100" style={{ background: PRIMARY_LIGHT }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: PRIMARY }}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Required Information</p>
                <p className="text-xs text-gray-500">All fields marked with * are required</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <span className="text-sm font-semibold text-gray-400">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition"
                  style={{ "--tw-ring-color": PRIMARY + "40" }}
                  required
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600">WhatsApp Number</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => {
                      setSameAsMobile(e.target.checked);
                      if (e.target.checked) setForm((p) => ({ ...p, whatsappNumber: p.mobile }));
                    }}
                    className="w-3.5 h-3.5 rounded accent-green-600"
                  />
                  <span className="text-xs text-gray-500">Same as mobile</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <span className="text-sm font-semibold text-gray-400">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={sameAsMobile ? form.mobile : form.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value.replace(/\D/g, ""))}
                  disabled={sameAsMobile}
                  placeholder="WhatsApp number"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Age + Gender row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="Years"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition appearance-none text-gray-700"
                    required
                  >
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Home Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <textarea
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="House No., Street, Area, City"
                  rows={2}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition resize-none"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Pincode <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit pincode"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span>Your information is encrypted and never shared with third parties.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                boxShadow: `0 6px 20px rgba(15,157,88,0.3)`,
              }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Save & Continue</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-5">
          You can update these details anytime from your profile page.
        </p>
      </div>
    </div>
  );
}

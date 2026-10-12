"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Shield,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  User,
  Heart,
  ChevronRight,
  ArrowRight,
  ChevronLeft,
  FileText,
  AlertCircle,
  Sparkles,
  Layers,
  Check
} from "lucide-react";

export default function IcuAtHomePage() {
  const router = useRouter();

  // Multi-step form state: 1: Care Type, 2: Patient Details, 3: Requirements, 4: Review, 5: Submitted
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Form payload
  const [formData, setFormData] = useState({
    careType: "Basic ICU Care at Home",
    patientName: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    condition: "",
    startDate: new Date().toISOString().split("T")[0],
    duration: "15 Days",
    location: "Gomti Nagar, Lucknow",
    timeToStart: "As soon as possible",
    additionalNotes: "",
    requirements: {
      nursingCare: "24/7 Nursing (Rotational)",
      icuBed: true,
      patientMonitor: true,
      oxygenSupport: true,
      ventilator: false,
      suctionMachine: false,
      doctorVisit: true,
      physiotherapySupport: false,
      otherRequirements: ""
    }
  });

  const careTypes = [
    {
      id: "Basic ICU Care at Home",
      title: "Basic ICU Care at Home",
      desc: "For patients needing continuous monitoring, vitals check and nursing support.",
      badge: "Most Common",
      icon: "🩺"
    },
    {
      id: "Critical Care at Home",
      title: "Critical Care at Home",
      desc: "For higher-dependency patients requiring uninterrupted critical medical monitoring.",
      badge: "High Dependency",
      icon: "🏥"
    },
    {
      id: "Ventilator Support at Home",
      title: "Ventilator Support at Home",
      desc: "For ventilator-dependent patients with invasive/non-invasive respiratory setup.",
      badge: "Advanced Life Support",
      icon: "🫁"
    },
    {
      id: "Post-ICU / Step-Down Care",
      title: "Post-ICU / Step-Down Care",
      desc: "Hospital discharge recovery support with transition care protocol.",
      badge: "Recovery Care",
      icon: "🌿"
    },
    {
      id: "Palliative / Comfort Care",
      title: "Palliative / Comfort Care",
      desc: "For long-term compassionate comfort, pain management and end-of-life care.",
      badge: "Compassionate",
      icon: "🕊️"
    },
    {
      id: "Assessment / Custom Plan",
      title: "Not Sure? Get an Assessment",
      desc: "Our senior medical team will review and customize the right plan for your patient.",
      badge: "Doctor Assessment",
      icon: "👨‍⚕️"
    }
  ];

  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/icu-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Website"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedData(data.data);
        setStep(5);
      } else {
        alert(data.error || "Failed to submit request.");
      }
    } catch (e) {
      alert("Error submitting ICU request: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <span className="text-emerald-700 font-bold">ICU at Home</span>
        </div>

        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/10">
              <Shield className="w-3.5 h-3.5" /> Hospital-Level Care in the Comfort of Your Home
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ICU Setup at Home
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Complete Critical Care Support with Trained ICU Nurses, Advanced Monitoring Equipment &amp; Continuous Doctor Supervision.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <div className="font-bold text-white text-base">200+</div>
                <div className="text-emerald-200 text-[11px]">Patients Served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <div className="font-bold text-white text-base">4.9/5</div>
                <div className="text-emerald-200 text-[11px]">Family Trust Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <div className="font-bold text-white text-base">24/7</div>
                <div className="text-emerald-200 text-[11px]">Critical Monitoring</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <div className="font-bold text-white text-base">Verified</div>
                <div className="text-emerald-200 text-[11px]">Intensivists &amp; Staff</div>
              </div>
            </div>
          </div>
        </div>

        {/* STEPPER PROGRESS BAR */}
        {step < 5 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
              <span className={step >= 1 ? "text-emerald-700" : ""}>1. Choose Care</span>
              <span className={step >= 2 ? "text-emerald-700" : ""}>2. Patient Details</span>
              <span className={step >= 3 ? "text-emerald-700" : ""}>3. Requirements</span>
              <span className={step >= 4 ? "text-emerald-700" : ""}>4. Review &amp; Submit</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* STEP 1: CHOOSE CARE TYPE */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Choose Your Care Requirement</h2>
              <p className="text-xs text-gray-500 mt-1">Select the level of critical care required for the patient</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careTypes.map((type) => {
                const isSelected = formData.careType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setFormData({ ...formData, careType: type.id })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/30 shadow-md ring-2 ring-emerald-600/10"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {type.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mt-3">{type.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                Next: Patient Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PATIENT DETAILS & LOCATION */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Patient Details &amp; Location</h2>
              <p className="text-xs text-gray-500 mt-1">Provide medical context so our intensivist can evaluate</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Contact Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Age</label>
                <input
                  type="text"
                  placeholder="e.g. 68"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Primary Condition / Medical Diagnosis *</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Post-ICU discharge, tracheostomy care, breathing issue, needs ventilator & suction machine"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Patient Home Location in Lucknow *</label>
                <input
                  type="text"
                  placeholder="e.g. Gomti Nagar, Lucknow (House No, Landmark)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Preferred Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Expected Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                >
                  <option value="7 Days">7 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="Custom Duration">Custom Duration</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (!formData.patientName || !formData.phone || !formData.condition) {
                    alert("Please fill in patient name, phone, and condition.");
                    return;
                  }
                  setStep(3);
                }}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                Next: Care Requirements <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CARE & EQUIPMENT REQUIREMENTS */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Care &amp; Equipment Requirements</h2>
              <p className="text-xs text-gray-500 mt-1">Select the equipment and staffing you need at home</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: "icuBed", label: "ICU Bed (Motorized / Multi-Function)", icon: "🛏️" },
                  { key: "patientMonitor", label: "Multipara Patient Monitor (BP, SpO2, ECG)", icon: "📊" },
                  { key: "oxygenSupport", label: "Oxygen Concentrator / Cylinder", icon: "💨" },
                  { key: "ventilator", label: "Ventilator Support (Invasive / BiPAP)", icon: "🫁" },
                  { key: "suctionMachine", label: "Medical Suction Machine", icon: "⚙️" },
                  { key: "doctorVisit", label: "Regular Physician / Intensivist Home Visits", icon: "👨‍⚕️" },
                  { key: "physiotherapySupport", label: "Chest / Neuro Physiotherapy Support", icon: "🧘" }
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.requirements[item.key]
                        ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20 font-bold text-emerald-950"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.requirements[item.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            [item.key]: e.target.checked
                          }
                        })
                      }
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1">Time to Start</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {["As soon as possible", "Within 24 hours", "Within 2-3 days", "Flexible"].map((timeOption) => (
                    <button
                      key={timeOption}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeToStart: timeOption })}
                      className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                        formData.timeToStart === timeOption
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {timeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                Next: Review &amp; Submit <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Your Request</h2>
              <p className="text-xs text-gray-500 mt-1">
                No immediate payment required. Our medical team will review and provide a customized Care Plan &amp; Quotation.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-400">Selected Care:</span> <strong className="text-gray-900 block">{formData.careType}</strong></div>
                <div><span className="text-gray-400">Duration:</span> <strong className="text-gray-900 block">{formData.duration} (From {formData.startDate})</strong></div>
                <div><span className="text-gray-400">Patient:</span> <strong className="text-gray-900 block">{formData.patientName} ({formData.age || 'N/A'}, {formData.gender})</strong></div>
                <div><span className="text-gray-400">Mobile:</span> <strong className="text-gray-900 font-mono block">{formData.phone}</strong></div>
                <div className="col-span-2"><span className="text-gray-400">Location:</span> <strong className="text-gray-900 block">{formData.location}</strong></div>
                <div className="col-span-2"><span className="text-gray-400">Condition:</span> <span className="text-rose-700 font-bold block">{formData.condition}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={submitting}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2"
              >
                {submitting ? "Submitting..." : "Submit ICU Request"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS / REQUEST SUBMITTED SCREEN */}
        {step === 5 && submittedData && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Request ID: {submittedData.requestId}
              </span>
              <h2 className="text-2xl font-black text-gray-900">Your Request Has Been Submitted!</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Our critical care intensivist and coordinator are assessing your patient&apos;s requirements.
              </p>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-gray-50 rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <h4 className="font-bold text-gray-800 text-sm mb-1">Our Care Team Will:</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Assess patient condition &amp; doctor recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Confirm immediate equipment &amp; staff availability</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Share customized Care Plan &amp; quotation on WhatsApp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guide your family on setup &amp; doctor coordination</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
              >
                Go to Homepage
              </Link>
              <a
                href={`https://wa.me/918707790677?text=Hello%20Dr%20Jhatka%20Medicare,%20I%20have%20submitted%20ICU%20Request%20${submittedData.requestId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> Chat with Care Coordinator
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import {
  X, Check, ChevronRight, ChevronLeft, MapPin, Calendar, Clock,
  User, Phone, Mail, ShieldCheck, HeartHandshake, IndianRupee,
  AlertCircle, CheckCircle2, MessageCircle
} from "lucide-react";

export default function HomeCareBookingFlowModal({
  isOpen,
  onClose,
  service = null,
  category = "home-care"
}) {
  const [step, setStep] = useState(1);
  const [patientType, setPatientType] = useState("new"); // "new" | "existing"
  const [existingPatients, setExistingPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchPatientPhone, setSearchPatientPhone] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    patientPhone: "",
    patientEmail: "",
    primaryRequirement: "",
    additionalNotes: "",
    careType: "",
    selectedRequirements: [],
    specialInstructions: "",
    address: "",
    area: "Gomti Nagar",
    city: "Lucknow",
    pincode: "226010",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "10:00 AM",
    duration: "Day Care (8 Hours)",
    paymentMethod: "online", // "online" | "quote"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const defaultCareTypes = category === "nursing-care" ? [
    { label: "Short Visit Nursing (1-2 Hours)", price: 499 },
    { label: "8 Hour Nursing Care", price: 1499 },
    { label: "12 Hour Nursing Care", price: 1999 },
    { label: "24 Hour Nursing Care", price: 2999 },
    { label: "Post-Surgery Nursing Care", price: 1499 },
    { label: "Bedridden Patient Nursing", price: 1499 },
    { label: "Critical Patient Nursing Support", price: 2499 },
  ] : [
    { label: "Day Care (8 Hours)", price: service?.price || 399 },
    { label: "Night Care (8-12 Hours)", price: (service?.price || 399) + 100 },
    { label: "24 Hour Care", price: (service?.price || 399) * 2 },
    { label: "Short Clinical Visit", price: 299 },
    { label: "Custom Duration Plan", price: 0 },
  ];

  const defaultRequirements = category === "nursing-care" ? [
    "Vital Monitoring (BP, SpO2, Temperature)",
    "Medication Assistance",
    "Injection Assistance (IV/IM)",
    "Wound / Dressing Care",
    "Catheter Care",
    "Feeding Assistance",
    "Personal Care & Hygiene",
    "Doctor Coordination",
  ] : [
    "Personal Care & Hygiene",
    "Mobility Assistance",
    "Feeding Assistance",
    "Medication Reminders",
    "Doctor Visit Coordination",
    "Gentle Walking & Exercise Support",
  ];

  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        careType: service.duration || (category === "nursing-care" ? "Short Visit Nursing (1-2 Hours)" : "Day Care (8 Hours)"),
        selectedRequirements: service.includedServices?.slice(0, 3) || defaultRequirements.slice(0, 3),
        primaryRequirement: service.name,
      }));
    }
  }, [service, category]);

  // Search existing patients when typing 10 digits
  useEffect(() => {
    if (patientType === "existing" && searchPatientPhone.length >= 10) {
      fetch(`/api/admin/physio-patients?search=${searchPatientPhone}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.length > 0) {
            setExistingPatients(data.data);
          }
        })
        .catch(() => {});
    }
  }, [patientType, searchPatientPhone]);

  const handleSelectExistingPatient = (patient) => {
    setSelectedPatientId(patient._id);
    setFormData((prev) => ({
      ...prev,
      patientName: patient.name,
      patientPhone: patient.mobile,
      patientEmail: patient.email || "",
      patientAge: patient.age || "",
      patientGender: patient.gender || "Male",
      address: patient.address || prev.address,
      area: patient.area || prev.area,
      pincode: patient.pincode || prev.pincode,
    }));
  };

  const handleToggleRequirement = (reqItem) => {
    setFormData((prev) => {
      const exists = prev.selectedRequirements.includes(reqItem);
      const updated = exists
        ? prev.selectedRequirements.filter((r) => r !== reqItem)
        : [...prev.selectedRequirements, reqItem];
      return { ...prev, selectedRequirements: updated };
    });
  };

  // Pricing calculation
  const basePrice = service?.effectivePrice || service?.price || 399;
  const isCustomQuote = service?.pricingType === "Custom Quote" || formData.paymentMethod === "quote";

  const handleNext = () => {
    setErrorMessage("");
    if (step === 1) {
      if (!formData.patientName.trim()) {
        setErrorMessage("Please enter patient full name.");
        return;
      }
      if (!formData.patientPhone.trim() || formData.patientPhone.length < 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.address.trim()) {
        setErrorMessage("Please provide service address in Lucknow.");
        return;
      }
    }
    if (step < 5) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        category,
        serviceId: service?._id,
        serviceName: service?.name || (category === "nursing-care" ? "Nursing Care Service" : "Home Care Service"),
        patientType,
        existingPatientId: selectedPatientId || undefined,
        patientName: formData.patientName,
        patientAge: formData.patientAge ? Number(formData.patientAge) : undefined,
        patientGender: formData.patientGender,
        patientPhone: formData.patientPhone,
        patientEmail: formData.patientEmail,
        careType: formData.careType,
        selectedRequirements: formData.selectedRequirements,
        specialInstructions: formData.specialInstructions,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        pincode: formData.pincode,
        startDate: formData.startDate,
        startTime: formData.startTime,
        duration: formData.duration,
        pricingType: service?.pricingType || "Starting From",
        basePrice: basePrice,
        discountAmount: 0,
        totalAmount: isCustomQuote ? 0 : basePrice,
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch("/api/home-care/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data.data);
      } else {
        setErrorMessage(data.error || "Failed to submit booking request.");
      }
    } catch (err) {
      console.error("Booking submit error:", err);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              {category === "nursing-care" ? (
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
              {category === "nursing-care" ? "Book Nursing Care" : "Book Home Care"}
            </h2>
            <p className="text-xs text-emerald-800 font-medium">
              {service?.name || "Professional Healthcare at Your Home"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1 to 5) */}
        {!bookingResult && (
          <div className="px-6 pt-4 pb-2 bg-white">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-2">
              <span className={step >= 1 ? "text-emerald-700 font-bold" : ""}>1. Patient</span>
              <span className={step >= 2 ? "text-emerald-700 font-bold" : ""}>2. Care</span>
              <span className={step >= 3 ? "text-emerald-700 font-bold" : ""}>3. Location</span>
              <span className={step >= 4 ? "text-emerald-700 font-bold" : ""}>4. Schedule</span>
              <span className={step >= 5 ? "text-emerald-700 font-bold" : ""}>5. Review</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {bookingResult ? (
            /* Success Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {bookingResult.isQuote ? "Quote Request Submitted!" : "Booking Initiated!"}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Our clinical coordinator will contact you shortly to confirm the scheduled care staff and timings.
                </p>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-mono font-bold text-emerald-800">{bookingResult.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Permanent Patient ID:</span>
                  <span className="font-mono font-bold text-gray-900">{bookingResult.patientPermanentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Patient:</span>
                  <span className="font-semibold text-gray-900">{bookingResult.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-semibold text-gray-900">{bookingResult.serviceName}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200/60 pt-2">
                  <span className="text-gray-600 font-semibold">Total Amount:</span>
                  <span className="font-bold text-emerald-700">
                    {bookingResult.totalAmount > 0 ? `₹${bookingResult.totalAmount}` : "Quote Assessment"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/917991787123?text=${encodeURIComponent(
                    `Hello Dr Jhatka Medicare, I have booked ${bookingResult.serviceName}. My Booking ID is ${bookingResult.bookingId}. Please assist me.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: PATIENT DETAILS */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Patient toggle */}
                  <div className="flex p-1 bg-gray-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPatientType("new")}
                      className={`flex-1 py-2 rounded-lg transition ${
                        patientType === "new" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600"
                      }`}
                    >
                      New Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatientType("existing")}
                      className={`flex-1 py-2 rounded-lg transition ${
                        patientType === "existing" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600"
                      }`}
                    >
                      Existing Patient
                    </button>
                  </div>

                  {patientType === "existing" && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                      <label className="block text-xs font-bold text-emerald-800">
                        Enter Registered Mobile Number:
                      </label>
                      <input
                        type="text"
                        placeholder="Search 10-digit mobile..."
                        value={searchPatientPhone}
                        onChange={(e) => setSearchPatientPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs"
                      />
                      {existingPatients.length > 0 && (
                        <div className="space-y-1 pt-1 max-h-36 overflow-y-auto">
                          {existingPatients.map((p) => (
                            <div
                              key={p._id}
                              onClick={() => handleSelectExistingPatient(p)}
                              className={`p-2 rounded-lg cursor-pointer text-xs flex justify-between items-center ${
                                selectedPatientId === p._id
                                  ? "bg-emerald-600 text-white font-bold"
                                  : "bg-white hover:bg-emerald-100/50 text-gray-800"
                              }`}
                            >
                              <span>{p.name} ({p.patientId})</span>
                              <span className="font-mono text-[10px]">{p.mobile}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 68"
                        value={formData.patientAge}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.patientGender}
                        onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Primary Requirement / Condition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Post-surgery care, elderly assistance, stroke recovery"
                      value={formData.primaryRequirement}
                      onChange={(e) => setFormData({ ...formData, primaryRequirement: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: CARE REQUIREMENTS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Select Care Type *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {defaultCareTypes.map((ct) => (
                        <label
                          key={ct.label}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                            formData.careType === ct.label
                              ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="careType"
                              value={ct.label}
                              checked={formData.careType === ct.label}
                              onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                              className="text-emerald-600"
                            />
                            <span>{ct.label}</span>
                          </div>
                          {ct.price > 0 && (
                            <span className="font-semibold text-gray-500">₹{ct.price}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Clinical & Care Assistance Needed
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultRequirements.map((req) => {
                        const isChecked = formData.selectedRequirements.includes(req);
                        return (
                          <label
                            key={req}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                              isChecked
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-medium"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRequirement(req)}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                            <span>{req}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Special Medical Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Patient has diabetes and needs insulin at 8 AM; requires back care every 2 hours..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Serving All Areas & Zones of Lucknow with Trained Care Staff.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Complete House / Street Address *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="House/Flat No., Building Name, Street, Landmark..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Area / Locality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gomti Nagar, Aliganj, Indira Nagar"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 226010"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DATE & TIME */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Preferred Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Preferred Start Time
                      </label>
                      <select
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="Available in ~30 min">Immediate (~30 mins)</option>
                        <option value="08:00 AM">08:00 AM (Morning Shift)</option>
                        <option value="10:00 AM">10:00 AM (Standard)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="08:00 PM">08:00 PM (Night Shift)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Expected Duration / Frequency
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="Single Visit">Single Visit</option>
                      <option value="Day Care (8 Hours)">Day Care (8 Hours)</option>
                      <option value="Night Care (8-12 Hours)">Night Care (8-12 Hours)</option>
                      <option value="24 Hours Round the Clock">24 Hours Round the Clock</option>
                      <option value="Weekly Plan (7 Days)">Weekly Plan (7 Days)</option>
                      <option value="Monthly Plan (30 Days)">Monthly Plan (30 Days)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & PAYMENT */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-2.5">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                      Booking Summary
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Patient:</span>
                      <span className="font-semibold text-gray-900">
                        {formData.patientName} ({formData.patientAge ? `${formData.patientAge}y, ` : ""}{formData.patientGender})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service:</span>
                      <span className="font-semibold text-gray-900">{service?.name || "Home Healthcare"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Care Type:</span>
                      <span className="font-semibold text-emerald-800">{formData.careType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date & Time:</span>
                      <span className="font-semibold text-gray-900">{formData.startDate} at {formData.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-semibold text-gray-900">{formData.area}, {formData.city}</span>
                    </div>
                    {formData.selectedRequirements.length > 0 && (
                      <div className="border-t pt-2">
                        <span className="text-gray-500">Tasks: </span>
                        <span className="text-gray-800 font-medium">
                          {formData.selectedRequirements.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Estimated Price */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-800 font-semibold">Estimated Amount</p>
                      <p className="text-[11px] text-gray-500">Final price may vary based on clinical assessment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-700">
                        {isCustomQuote ? "Quote" : `₹${basePrice}`}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {isCustomQuote ? "Free Clinical Assessment" : `/ ${service?.priceUnit || "day"}`}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Payment & Confirmation Option
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center gap-2 transition ${
                          formData.paymentMethod === "online"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === "online"}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="text-emerald-600"
                        />
                        <span>Pay Online (Razorpay)</span>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center gap-2 transition ${
                          formData.paymentMethod === "quote"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="quote"
                          checked={formData.paymentMethod === "quote"}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="text-emerald-600"
                        />
                        <span>Request Custom Quote</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!bookingResult && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : formData.paymentMethod === "quote" ? "Request Quote" : "Confirm & Pay"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

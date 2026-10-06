"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Plus,
  Users,
  Search,
  Activity,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  Share2,
  Sparkles,
  Stethoscope,
  Eye,
  Edit,
  ArrowRight
} from "lucide-react";
import QRCode from "qrcode";

export default function CampManagementPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [campDetails, setCampDetails] = useState({ camp: null, patients: [], visits: [] });
  const [detailsLoading, setDetailsLoading] = useState(false);

  // New Camp Form
  const [newCamp, setNewCamp] = useState({
    name: "",
    location: "",
    city: "Lucknow",
    address: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00 AM - 04:00 PM",
    campType: "Free General Health & Physiotherapy Camp",
    targetPatients: 100,
    description: "",
    assignedStaff: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  // Health Check Entry Modal State
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);
  const [checkPatientSearch, setCheckPatientSearch] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [checkForm, setCheckForm] = useState({
    bpSystolic: "",
    bpDiastolic: "",
    sugarRBS: "",
    spo2: "",
    pulse: "",
    temperature: "",
    weight: "",
    bmi: "",
    postureScreening: "",
    physiotherapyAdvice: "",
    doctorNotes: "",
    followupRequired: false,
    followupNotes: "",
  });
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkMsg, setCheckMsg] = useState("");

  // QR Code for Camp Registration
  const [campQrUrl, setCampQrUrl] = useState("");

  // Fetch Camps
  const fetchCamps = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== "All" ? `/api/admin/camps?status=${statusFilter}` : "/api/admin/camps";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCamps(data.camps || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, [statusFilter]);

  // Handle Create Camp
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMsg("");
    try {
      const payload = {
        ...newCamp,
        assignedStaff: newCamp.assignedStaff
          ? newCamp.assignedStaff.split(",").map((s) => ({ name: s.trim(), role: "Staff" }))
          : [],
      };

      const res = await fetch("/api/admin/camps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setCreateMsg(`Camp ${data.camp.campId} created successfully!`);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateMsg("");
          fetchCamps();
        }, 1500);
      } else {
        setCreateMsg(data.message || "Failed to create camp");
      }
    } catch {
      setCreateMsg("Error creating camp");
    } finally {
      setCreateLoading(false);
    }
  };

  // View Camp Details
  const handleViewCamp = async (camp) => {
    setSelectedCamp(camp);
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/camps/${camp.campId}`);
      const data = await res.json();
      if (data.success) {
        setCampDetails(data);
      }

      // Generate Camp QR Code for public scanning
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.drjhatka.com";
      const campRegUrl = `${baseUrl}/health-card?camp=${camp.campId}&source=Camp`;
      const qrUrl = await QRCode.toDataURL(campRegUrl, { width: 300, margin: 1, color: { dark: "#006837" } });
      setCampQrUrl(qrUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search Patient for Health Check Entry
  const handleSearchPatientForCheck = async () => {
    if (!checkPatientSearch.trim()) return;
    try {
      const res = await fetch(`/api/admin/health-cards?search=${encodeURIComponent(checkPatientSearch.trim())}`);
      const data = await res.json();
      if (data.success && data.patients.length > 0) {
        setFoundPatient(data.patients[0]);
      } else {
        setFoundPatient(null);
        alert("No patient found. Please register patient first or check Patient ID / Mobile.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Health Check Entry
  const handleSubmitHealthCheck = async (e) => {
    e.preventDefault();
    if (!foundPatient || !selectedCamp) return;

    setCheckLoading(true);
    setCheckMsg("");
    try {
      const res = await fetch(`/api/admin/camps/${selectedCamp.campId}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: foundPatient.patientId,
          ...checkForm,
          registeredBy: "Camp Staff Entry",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCheckMsg("Health Check record saved successfully!");
        setTimeout(() => {
          setShowHealthCheckModal(false);
          setCheckMsg("");
          setFoundPatient(null);
          setCheckPatientSearch("");
          handleViewCamp(selectedCamp);
        }, 1500);
      } else {
        setCheckMsg(data.message || "Failed to record health check");
      }
    } catch {
      setCheckMsg("Error recording health check");
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006837] text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Community Outreach & Health Checkup</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Camp Management Module
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create medical camps, generate camp registration QRs, log health check vitals, and link permanent patient records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Camp</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {["All", "Active", "Upcoming", "Completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              statusFilter === s
                ? "bg-[#006837] text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-black border border-gray-200"
            }`}
          >
            {s} Camps
          </button>
        ))}
      </div>

      {/* Camps Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-gray-400">
          Loading Medical Camps...
        </div>
      ) : camps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50 text-emerald-600" />
          <p className="text-sm font-bold text-gray-700">No Camps Found</p>
          <p className="text-xs mt-1">Click "Create New Camp" to schedule a community health checkup camp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {camps.map((camp) => (
            <div
              key={camp.campId}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black text-[#006837] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {camp.campId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      camp.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : camp.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 leading-snug line-clamp-1">
                  {camp.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{camp.campType}</p>

                <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{camp.location}, {camp.city || "Lucknow"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{camp.date} • {camp.time}</span>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold block">Registered</span>
                    <span className="text-sm font-black text-gray-900">{camp.totalRegistered || 0}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <span className="text-[10px] text-emerald-600 font-bold block">Checks Done</span>
                    <span className="text-sm font-black text-emerald-800">{camp.totalChecksCompleted || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleViewCamp(camp)}
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Manage Camp & Vitals</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* CAMP DETAIL / VITAL RECORDING DRAWER */}
      {/* ============================================================== */}
      {selectedCamp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#006837] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedCamp.campId}
                  </span>
                  <h2 className="text-lg font-extrabold text-gray-900">{selectedCamp.name}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCamp.location} • {selectedCamp.date} ({selectedCamp.time})
                </p>
              </div>
              <button
                onClick={() => setSelectedCamp(null)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              
              {/* Option 1: Camp Public QR */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
                {campQrUrl && (
                  <img src={campQrUrl} alt="Camp QR" className="w-16 h-16 rounded-lg bg-white p-1 border shadow-xs" />
                )}
                <div>
                  <h4 className="font-bold text-xs text-gray-900">Camp Patient QR</h4>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    Patients scan this to register for Free Health Card directly at camp.
                  </p>
                  <a
                    href={campQrUrl}
                    download={`Camp_QR_${selectedCamp.campId}.png`}
                    className="text-[11px] text-[#006837] font-bold underline mt-1 inline-block"
                  >
                    Download QR
                  </a>
                </div>
              </div>

              {/* Option 2: Record Health Check Entry */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-blue-950">Option 2: Staff Health Check</h4>
                  <p className="text-[10px] text-blue-800 mt-0.5">
                    Camp staff can enter BP, Sugar, SpO2, and doctor notes for any patient.
                  </p>
                </div>
                <button
                  onClick={() => setShowHealthCheckModal(true)}
                  className="mt-2 py-1.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Enter Health Check</span>
                </button>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col justify-center text-center">
                <span className="text-xs text-gray-500 font-bold">Total Health Checks</span>
                <span className="text-2xl font-black text-gray-900 mt-0.5">
                  {campDetails.visits.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  Linked to Permanent Patient IDs
                </span>
              </div>
            </div>

            {/* Health Checks Recorded in this Camp */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center justify-between">
                <span>Camp Health Check Records ({campDetails.visits.length})</span>
                <span className="text-xs text-gray-400 font-normal">Auto-linked to Permanent Patient IDs</span>
              </h3>

              {campDetails.visits.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                  No health checks entered for this camp yet. Click "Enter Health Check" to log vitals!
                </div>
              ) : (
                <div className="space-y-3">
                  {campDetails.visits.map((v, i) => (
                    <div
                      key={i}
                      className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#006837] bg-white px-2 py-0.5 rounded border border-emerald-200">
                            {v.patientId}
                          </span>
                          <span className="font-bold text-sm text-gray-900">
                            {v.patientName || "Patient"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-gray-600 font-medium">
                          <span>BP: <strong>{v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic}` : "-"}</strong></span>
                          <span>•</span>
                          <span>Sugar: <strong>{v.sugarRBS ? `${v.sugarRBS} mg/dL` : "-"}</strong></span>
                          <span>•</span>
                          <span>SpO2: <strong>{v.spo2 ? `${v.spo2}%` : "-"}</strong></span>
                          <span>•</span>
                          <span>Pulse: <strong>{v.pulse ? `${v.pulse} bpm` : "-"}</strong></span>
                        </div>
                        {v.physiotherapyAdvice && (
                          <p className="text-emerald-900 text-[11px] mt-1">
                            Advice: {v.physiotherapyAdvice}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-end gap-1">
                        <span className="text-[10px] text-gray-400">
                          {new Date(v.visitDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="bg-emerald-100 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ENTER HEALTH CHECK RECORD */}
      {/* ============================================================== */}
      {showHealthCheckModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Enter Camp Health Check Entry</h3>
                <p className="text-[11px] text-gray-500">Camp: <strong>{selectedCamp?.name}</strong></p>
              </div>
              <button
                onClick={() => setShowHealthCheckModal(false)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            {checkMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {checkMsg}
              </div>
            )}

            {/* Step A: Search / Verify Patient ID or Phone */}
            <div className="mb-5 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
              <label className="block font-bold text-gray-700 mb-1.5">
                Search Patient (by Patient ID or Mobile Number)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checkPatientSearch}
                  onChange={(e) => setCheckPatientSearch(e.target.value)}
                  placeholder="e.g. DJM-PT-000125 or 9876543210"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleSearchPatientForCheck}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
                >
                  Search
                </button>
              </div>

              {foundPatient && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">{foundPatient.name}</p>
                    <p className="text-[11px] text-[#006837] font-mono font-bold">{foundPatient.patientId} • +91 {foundPatient.mobile}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-[#006837] px-2 py-0.5 rounded-full">
                    Patient Selected
                  </span>
                </div>
              )}
            </div>

            {/* Step B: Vitals Entry Form */}
            {foundPatient && (
              <form onSubmit={handleSubmitHealthCheck} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">BP Systolic</label>
                    <input
                      type="number"
                      value={checkForm.bpSystolic}
                      onChange={(e) => setCheckForm({ ...checkForm, bpSystolic: e.target.value })}
                      placeholder="e.g. 120"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">BP Diastolic</label>
                    <input
                      type="number"
                      value={checkForm.bpDiastolic}
                      onChange={(e) => setCheckForm({ ...checkForm, bpDiastolic: e.target.value })}
                      placeholder="e.g. 80"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Sugar RBS (mg/dL)</label>
                    <input
                      type="number"
                      value={checkForm.sugarRBS}
                      onChange={(e) => setCheckForm({ ...checkForm, sugarRBS: e.target.value })}
                      placeholder="e.g. 110"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      value={checkForm.spo2}
                      onChange={(e) => setCheckForm({ ...checkForm, spo2: e.target.value })}
                      placeholder="e.g. 98"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={checkForm.pulse}
                      onChange={(e) => setCheckForm({ ...checkForm, pulse: e.target.value })}
                      placeholder="e.g. 74"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={checkForm.weight}
                      onChange={(e) => setCheckForm({ ...checkForm, weight: e.target.value })}
                      placeholder="e.g. 68"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Physiotherapy Advice</label>
                  <input
                    type="text"
                    value={checkForm.physiotherapyAdvice}
                    onChange={(e) => setCheckForm({ ...checkForm, physiotherapyAdvice: e.target.value })}
                    placeholder="e.g. Lumbar extension exercises, postural correction"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Doctor Notes & Recommendations</label>
                  <textarea
                    rows={2}
                    value={checkForm.doctorNotes}
                    onChange={(e) => setCheckForm({ ...checkForm, doctorNotes: e.target.value })}
                    placeholder="Clinical findings and recommendations"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowHealthCheckModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkLoading}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl font-bold transition disabled:opacity-50"
                  >
                    {checkLoading ? "Saving..." : "Save Health Check Entry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE NEW CAMP */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-base text-gray-900">Create New Medical Camp</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            {createMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {createMsg}
              </div>
            )}

            <form onSubmit={handleCreateCamp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Camp Name *</label>
                <input
                  type="text"
                  required
                  value={newCamp.name}
                  onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                  placeholder="e.g. Gomti Nagar Mega Free Health & Physio Camp"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location / Area *</label>
                  <input
                    type="text"
                    required
                    value={newCamp.location}
                    onChange={(e) => setNewCamp({ ...newCamp, location: e.target.value })}
                    placeholder="e.g. Community Center, Gomti Nagar"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCamp.city}
                    onChange={(e) => setNewCamp({ ...newCamp, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newCamp.date}
                    onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Timings</label>
                  <input
                    type="text"
                    value={newCamp.time}
                    onChange={(e) => setNewCamp({ ...newCamp, time: e.target.value })}
                    placeholder="09:00 AM - 04:00 PM"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Camp Type</label>
                <select
                  value={newCamp.campType}
                  onChange={(e) => setNewCamp({ ...newCamp, campType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                >
                  <option value="Free General Health & Physiotherapy Camp">Free General Health & Physiotherapy Camp</option>
                  <option value="Senior Citizen Wellness Camp">Senior Citizen Wellness Camp</option>
                  <option value="Corporate & Community Health Camp">Corporate & Community Health Camp</option>
                  <option value="Specialized Cardiac & Neuro Screening">Specialized Cardiac & Neuro Screening</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Staff / Doctors</label>
                <input
                  type="text"
                  value={newCamp.assignedStaff}
                  onChange={(e) => setNewCamp({ ...newCamp, assignedStaff: e.target.value })}
                  placeholder="e.g. Dr. Verma, PT Rahul, Nurse Priya"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl font-bold transition disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create Camp & Auto ID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

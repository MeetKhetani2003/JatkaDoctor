"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  User,
  CreditCard,
  Send,
  RotateCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Users,
  Activity,
  Receipt,
  FileSpreadsheet,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import HealthCard from "@/components/HealthCard";

export default function HealthCardsAdminPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [cardStatusFilter, setCardStatusFilter] = useState("All");
  const [seniorFilter, setSeniorFilter] = useState(false);

  // Selected Patient for 360 View Drawer
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patient360Data, setPatient360Data] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [active360Tab, setActive360Tab] = useState("card"); // card | profile | family | visits | bookings | followups | audit

  // Action status message
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (sourceFilter !== "All") params.append("source", sourceFilter);
      if (cardStatusFilter !== "All") params.append("cardStatus", cardStatusFilter);
      if (seniorFilter) params.append("seniorOnly", "true");

      const res = await fetch(`/api/admin/health-cards?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, sourceFilter, cardStatusFilter, seniorFilter]);

  // Load Patient 360 Detail
  const handleOpenPatient360 = async (patientId) => {
    setSelectedPatientId(patientId);
    setDrawerLoading(true);
    setActionMsg("");
    try {
      const res = await fetch(`/api/admin/health-cards/${patientId}`);
      const data = await res.json();
      if (data.success) {
        setPatient360Data(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Card Deactivation / Reactivation
  const handleToggleCardStatus = async (currentStatus) => {
    if (!patient360Data?.patient) return;
    const action = currentStatus === "ACTIVE" ? "deactivate" : "reactivate";
    let reason = "Admin review";
    if (action === "deactivate") {
      reason = prompt("Enter reason for deactivating Health Card (Permanent Patient ID stays intact):", "Lost card / Duplicate suspected");
      if (!reason) return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/health-card/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient360Data.patient.patientId,
          action,
          reason,
          performedBy: "Admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Card status updated to ${data.cardStatus}!`);
        handleOpenPatient360(selectedPatientId);
        fetchPatients();
      }
    } catch {
      setActionMsg("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Resend Card via WhatsApp or Email
  const handleResendCard = async (channel) => {
    if (!patient360Data?.patient) return;
    setActionLoading(true);
    setActionMsg(`Resending card via ${channel.toUpperCase()}...`);
    try {
      const res = await fetch("/api/health-card/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient360Data.patient.patientId,
          channel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Resend completed: ${JSON.stringify(data.results)}`);
        handleOpenPatient360(selectedPatientId);
      }
    } catch {
      setActionMsg("Error triggering resend");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Follow-up Status
  const handleUpdateFollowup = async (status) => {
    if (!patient360Data?.patient) return;
    try {
      await fetch(`/api/admin/health-cards/${patient360Data.patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followupStatus: status, performedBy: "Admin" }),
      });
      handleOpenPatient360(selectedPatientId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006837] text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Central Patient Master & Health Cards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Patient 360° & Free Health Cards
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage permanent patient identities, ATM-size digital cards, card deactivations, delivery tracking, and family networks.
          </p>
        </div>

        {/* 1-Click CSV Export */}
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/health-cards?export=csv"
            download
            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export to Excel / CSV</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient ID (DJM-PT-...), Family ID, Mobile, Name, Email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
          />
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="All">All Sources</option>
            <option value="Website">Website</option>
            <option value="Camp">Camp</option>
            <option value="Admin">Admin</option>
            <option value="Walk-in">Walk-in</option>
          </select>

          {/* Card Status Filter */}
          <select
            value={cardStatusFilter}
            onChange={(e) => setCardStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="All">All Card Statuses</option>
            <option value="ACTIVE">ACTIVE Only</option>
            <option value="INACTIVE">INACTIVE Only</option>
          </select>

          {/* Senior Citizens toggle */}
          <button
            onClick={() => setSeniorFilter(!seniorFilter)}
            className={`px-3 py-2 rounded-xl font-bold border transition ${
              seniorFilter
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-white text-gray-600 border-gray-200 hover:text-black"
            }`}
          >
            👵 70+ Senior Citizens
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Family ID</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Card Status</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Follow-up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-bold">
                    Loading patients directory...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-bold">
                    No patients found matching the criteria.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.patientId} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#006837]">
                      {p.patientId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>
                        {p.name}
                        {p.isSeniorCitizen && (
                          <span className="ml-1.5 text-[9.5px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            70+
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        {p.age ? `${p.age} Yrs • ` : ""}{p.gender || ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-mono">
                      +91 {p.mobile}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.familyId ? (
                        <span className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                          {p.familyId}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.source === "Camp" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.source || "Website"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.cardStatus === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}>
                        {p.cardStatus || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[10.5px]">
                      <div className="flex items-center gap-1">
                        <span>WA:</span>
                        <strong className={p.deliveryStatus?.whatsApp?.status === "Sent" ? "text-emerald-700" : "text-amber-600"}>
                          {p.deliveryStatus?.whatsApp?.status || "Pending"}
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span>Email: {p.deliveryStatus?.email?.status || "Pending"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10.5px] font-semibold text-gray-700">
                        {p.followupStatus || "New"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenPatient360(p.patientId)}
                        className="px-3 py-1.5 bg-[#006837] hover:bg-[#004d26] text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360° Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PATIENT 360° DRAWER / MODAL */}
      {/* ============================================================== */}
      {selectedPatientId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            
            {drawerLoading || !patient360Data ? (
              <div className="py-20 text-center text-sm font-bold text-gray-400">
                Loading Patient 360° Profile...
              </div>
            ) : (
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006837] border border-emerald-100 flex items-center justify-center font-bold text-lg">
                      {patient360Data.patient.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-gray-900 leading-tight">
                          {patient360Data.patient.name}
                        </h2>
                        <span className="font-mono text-xs font-black text-white bg-[#004d26] px-2 py-0.5 rounded">
                          {patient360Data.patient.patientId}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          patient360Data.patient.cardStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {patient360Data.patient.cardStatus} (V{patient360Data.patient.cardVersion || 1})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Family ID: <strong>{patient360Data.patient.familyId || "None"}</strong> • Mobile: +91 {patient360Data.patient.mobile}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPatientId(null)}
                    className="text-gray-400 hover:text-black font-bold text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Message */}
                {actionMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{actionMsg}</span>
                  </div>
                )}

                {/* 360 Navigation Tabs */}
                <div className="flex overflow-x-auto gap-1 border-b border-gray-100 pb-2 mb-5 text-xs font-bold text-gray-500">
                  {[
                    { id: "card", label: "Health Card & Delivery" },
                    { id: "profile", label: "Patient Profile" },
                    { id: "family", label: `Family Members (${(patient360Data.familyMembers || []).length})` },
                    { id: "visits", label: `Camp & Checks (${(patient360Data.campVisits || []).length})` },
                    { id: "bookings", label: `Bookings (${(patient360Data.appointments || []).length + (patient360Data.physioBookings || []).length})` },
                    { id: "followups", label: "Follow-up & Notes" },
                    { id: "audit", label: "Audit Trail" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActive360Tab(t.id)}
                      className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                        active360Tab === t.id
                          ? "bg-gray-900 text-white font-extrabold"
                          : "hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* 1. HEALTH CARD & DELIVERY */}
                {active360Tab === "card" && (
                  <div className="space-y-6">
                    {/* Health Card Component */}
                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center">
                      <HealthCard patient={patient360Data.patient} showActions={false} />
                    </div>

                    {/* Admin Card Controls */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Health Card Status & Actions</h4>
                        <div className="space-y-2">
                          <p className="text-gray-500">
                            Current Status: <strong className="text-gray-800">{patient360Data.patient.cardStatus}</strong>
                          </p>
                          <button
                            onClick={() => handleToggleCardStatus(patient360Data.patient.cardStatus)}
                            disabled={actionLoading}
                            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              patient360Data.patient.cardStatus === "ACTIVE"
                                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>
                              {patient360Data.patient.cardStatus === "ACTIVE"
                                ? "Deactivate Health Card"
                                : "Reactivate Health Card"}
                            </span>
                          </button>
                          <p className="text-[11px] text-gray-400">
                            *Deactivating blocks QR verification. The Permanent Patient ID is lifetime and remains unchanged.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Automated Card Delivery & Resend</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-gray-600">
                            <span>WhatsApp Status: <strong>{patient360Data.patient.deliveryStatus?.whatsApp?.status || "Pending"}</strong></span>
                            <button
                              onClick={() => handleResendCard("whatsapp")}
                              disabled={actionLoading}
                              className="px-3 py-1 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-lg font-bold hover:bg-emerald-100 transition"
                            >
                              Resend WhatsApp
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-gray-600 pt-2 border-t border-gray-100">
                            <span>Email Status: <strong>{patient360Data.patient.deliveryStatus?.email?.status || "Pending"}</strong></span>
                            <button
                              onClick={() => handleResendCard("email")}
                              disabled={actionLoading}
                              className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold hover:bg-blue-100 transition"
                            >
                              Resend Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PATIENT PROFILE */}
                {active360Tab === "profile" && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block">Patient Name</span>
                      <span className="font-bold text-gray-900">{patient360Data.patient.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Mobile</span>
                      <span className="font-bold text-gray-900">+91 {patient360Data.patient.mobile}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Email</span>
                      <span className="font-medium text-gray-800">{patient360Data.patient.email || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Age & Gender</span>
                      <span className="font-medium text-gray-800">{patient360Data.patient.age || "-"} Yrs • {patient360Data.patient.gender || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Blood Group</span>
                      <span className="font-bold text-red-600">{patient360Data.patient.bloodGroup || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Senior Citizen</span>
                      <span className="font-bold text-amber-800">{patient360Data.patient.isSeniorCitizen ? "Eligible (70+)" : "No"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 font-bold block">Address</span>
                      <span className="text-gray-800">{patient360Data.patient.address || "None"} • {patient360Data.patient.city || "Lucknow"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Source & Camp</span>
                      <span className="text-gray-800">{patient360Data.patient.source} {patient360Data.patient.campId ? `(${patient360Data.patient.campId})` : ""}</span>
                    </div>
                  </div>
                )}

                {/* 3. FAMILY MEMBERS */}
                {active360Tab === "family" && (
                  <div className="space-y-3">
                    {patient360Data.familyMembers.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                        No additional family members linked to Family ID {patient360Data.patient.familyId}.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {patient360Data.familyMembers.map((m) => (
                          <div key={m.patientId} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-900">{m.name}</span>
                              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">{m.familyRelation || "Member"}</span>
                            </div>
                            <p className="font-mono text-[#006837] font-bold">{m.patientId}</p>
                            <p className="text-gray-500 text-[11px] mt-1">+91 {m.mobile} • Blood Group: {m.bloodGroup || "-"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. CAMP VISITS & HEALTH CHECKS */}
                {active360Tab === "visits" && (
                  <div className="space-y-3">
                    {patient360Data.campVisits.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                        No camp health check records recorded for this patient.
                      </div>
                    ) : (
                      patient360Data.campVisits.map((v, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                          <div className="flex justify-between font-bold">
                            <span>{v.campName || v.campId}</span>
                            <span className="text-gray-400">{new Date(v.visitDate).toLocaleDateString()}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-white p-2 rounded border">BP: <strong>{v.bpSystolic}/{v.bpDiastolic}</strong></div>
                            <div className="bg-white p-2 rounded border">Sugar: <strong>{v.sugarRBS || "-"}</strong></div>
                            <div className="bg-white p-2 rounded border">SpO2: <strong>{v.spo2 || "-"}%</strong></div>
                            <div className="bg-white p-2 rounded border">Pulse: <strong>{v.pulse || "-"}</strong></div>
                          </div>
                          {v.physiotherapyAdvice && (
                            <p className="text-emerald-900">Advice: {v.physiotherapyAdvice}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. BOOKINGS & SERVICES */}
                {active360Tab === "bookings" && (
                  <div className="space-y-2 text-xs">
                    {[...(patient360Data.appointments || []), ...(patient360Data.physioBookings || [])].length === 0 ? (
                      <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl">
                        No booking history found for this patient.
                      </div>
                    ) : (
                      [...(patient360Data.appointments || []), ...(patient360Data.physioBookings || [])].map((b, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl border flex justify-between">
                          <div>
                            <span className="font-bold">{b.bookingId || "BK"} - {b.service || b.category || "Service"}</span>
                            <p className="text-gray-500 text-[11px]">{b.date || b.preferredDate}</p>
                          </div>
                          <span className="font-bold text-emerald-700">{b.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 6. FOLLOW-UP */}
                {active360Tab === "followups" && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1.5">Change Follow-up Stage</label>
                      <div className="flex flex-wrap gap-2">
                        {["New", "Contacted", "Follow-up Required", "Booking", "Service Completed"].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateFollowup(st)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition ${
                              patient360Data.patient.followupStatus === st
                                ? "bg-emerald-700 text-white"
                                : "bg-white border text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. AUDIT TRAIL */}
                {active360Tab === "audit" && (
                  <div className="space-y-2 text-xs">
                    {(patient360Data.patient.auditLogs || []).map((a, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{a.action}</p>
                          <p className="text-gray-500 text-[11px]">{a.details} (By: {a.performedBy})</p>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(a.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

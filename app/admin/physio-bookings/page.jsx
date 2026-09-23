"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Filter, Plus, X, Download, RotateCw, AlertTriangle,
  CheckCircle2, XCircle, Sun, MessageCircle, ChevronDown, ChevronUp,
  Loader2, User, Calendar, Clock, CreditCard, Activity, Save
} from "lucide-react";
import jsPDF from "jspdf";

// ── Helpers ──────────────────────────────────────────────────────────────────
function PayBadge({ status }) {
  const c = { Paid: "bg-green-100 text-green-800", Pending: "bg-amber-100 text-amber-800", Partial: "bg-blue-100 text-blue-800", Failed: "bg-red-100 text-red-800" };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
}

function StatusBadge({ status }) {
  const c = { New: "bg-gray-100 text-gray-700", Assigned: "bg-blue-100 text-blue-700", "In Progress": "bg-purple-100 text-purple-700", Completed: "bg-green-100 text-green-700", Cancelled: "bg-red-100 text-red-700" };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
}

function AttendanceBtn({ label, icon, color, active, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        active
          ? `${color} shadow-sm scale-[1.02]`
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : icon}
      {label}
    </button>
  );
}

// ── Attendance Row ────────────────────────────────────────────────────────────
function SessionRow({ s, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [sessionDate, setSessionDate] = useState(s.sessionDate || s.scheduledDate || "");
  const [notes, setNotes] = useState(s.notes || "");
  const [attendance, setAttendance] = useState(s.attendanceStatus || "");
  const [showNotes, setShowNotes] = useState(false);
  const [dirty, setDirty] = useState(false);

  const mark = async (status) => {
    setLoading(true);
    const newStatus = attendance === status ? "" : status;
    setAttendance(newStatus);
    await onUpdate(s._id, { attendanceStatus: newStatus, sessionDate, notes });
    setLoading(false);
    setDirty(false);
  };

  const save = async () => {
    setLoading(true);
    await onUpdate(s._id, { attendanceStatus: attendance, sessionDate, notes });
    setLoading(false);
    setDirty(false);
  };

  const rowBg = attendance === "Present" ? "bg-green-50 border-green-100"
    : attendance === "Absent" ? "bg-red-50 border-red-100"
    : attendance === "Holiday" ? "bg-amber-50 border-amber-100"
    : "bg-white border-gray-100";

  return (
    <div className={`border rounded-xl p-3 mb-2 transition-colors ${rowBg}`}>
      <div className="flex items-center gap-3">
        {/* Session # */}
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
          {s.sessionNumber}
        </div>

        {/* Date input */}
        <input
          type="date"
          value={sessionDate}
          onChange={e => { setSessionDate(e.target.value); setDirty(true); }}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-blue-400 w-32"
        />

        {/* Attendance buttons */}
        <div className="flex gap-1.5 flex-wrap">
          <AttendanceBtn
            label="Present"
            icon={<CheckCircle2 className="w-3 h-3" />}
            color="bg-green-100 text-green-700 border-green-300"
            active={attendance === "Present"}
            onClick={() => mark("Present")}
            loading={loading && attendance !== "Present"}
          />
          <AttendanceBtn
            label="Absent"
            icon={<XCircle className="w-3 h-3" />}
            color="bg-red-100 text-red-700 border-red-300"
            active={attendance === "Absent"}
            onClick={() => mark("Absent")}
            loading={loading && attendance !== "Absent"}
          />
          <AttendanceBtn
            label="Holiday"
            icon={<Sun className="w-3 h-3" />}
            color="bg-amber-100 text-amber-700 border-amber-300"
            active={attendance === "Holiday"}
            onClick={() => mark("Holiday")}
            loading={loading && attendance !== "Holiday"}
          />
        </div>

        {/* Notes toggle */}
        <button
          onClick={() => setShowNotes(v => !v)}
          className="ml-auto text-gray-400 hover:text-gray-600 text-[10px] flex items-center gap-1"
        >
          Notes {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Notes & Save */}
      {showNotes && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={notes}
            onChange={e => { setNotes(e.target.value); setDirty(true); }}
            placeholder="Add session notes..."
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-blue-400"
          />
          {dirty && (
            <button
              onClick={save}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Attendance Progress Bar ───────────────────────────────────────────────────
function ProgressBar({ sessions }) {
  const total = sessions.length;
  if (!total) return null;
  const present = sessions.filter(s => s.attendanceStatus === "Present").length;
  const absent = sessions.filter(s => s.attendanceStatus === "Absent").length;
  const holiday = sessions.filter(s => s.attendanceStatus === "Holiday").length;
  const pct = Math.round((present / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium text-gray-600">
        <span>Attendance Progress</span>
        <span className="font-bold text-blue-600">{present}/{total} sessions ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden">
        <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(present / total) * 100}%` }} />
        <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${(absent / total) * 100}%` }} />
        <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${(holiday / total) * 100}%` }} />
      </div>
      <div className="flex gap-4 text-[10px] font-medium">
        <span className="text-green-600">✅ Present: {present}</span>
        <span className="text-red-500">❌ Absent: {absent}</span>
        <span className="text-amber-600">🏖️ Holiday: {holiday}</span>
        <span className="text-gray-400">⏳ Pending: {total - present - absent - holiday}</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PhysioBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [departments, setDepartments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [packages, setPackages] = useState([]);

  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // Status update states
  const [statusUpdating, setStatusUpdating] = useState({});
  const [waLoading, setWaLoading] = useState(false);
  const [waStatus, setWaStatus] = useState(null); // null | 'success' | 'error'

  useEffect(() => {
    fetchMasterData();
    fetchBookings();
  }, []);

  useEffect(() => { applyFilters(); }, [bookings, searchTerm, filterDate, filterDepartment, filterPayment, filterStatus]);

  const fetchMasterData = async () => {
    try {
      const [depRes, staffRes, patRes, packRes] = await Promise.all([
        fetch("/api/admin/physio-departments").then(r => r.json()),
        fetch("/api/admin/staff").then(r => r.json()),
        fetch("/api/admin/physio-patients").then(r => r.json()),
        fetch("/api/admin/physio-packages").then(r => r.json()),
      ]);
      if (depRes.success) setDepartments(depRes.data);
      if (staffRes) setTherapists(staffRes);
      if (patRes.success) setPatients(patRes.data);
      if (packRes.success) setPackages(packRes.data);
    } catch (e) { console.error(e); }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/physio-bookings");
      const data = await res.json();
      if (data.success) { setBookings(data.data); setFilteredBookings(data.data); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = bookings;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.bookingId?.toLowerCase().includes(lower) ||
        b.patientId?.name?.toLowerCase().includes(lower) ||
        b.patientId?.mobile?.includes(searchTerm) ||
        b.patientId?.patientId?.toLowerCase().includes(lower)
      );
    }
    if (filterDate === "Today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(b => b.preferredDate === today);
    } else if (filterDate === "Tomorrow") {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      result = result.filter(b => b.preferredDate === tomorrow);
    }
    if (filterDepartment) result = result.filter(b => b.departmentId?._id === filterDepartment);
    if (filterPayment) result = result.filter(b => b.paymentStatus === filterPayment);
    if (filterStatus) result = result.filter(b => b.status === filterStatus);
    setFilteredBookings(result);
  };

  // ── Inline status change on table ──
  const handleInlineStatusChange = async (bookingId, field, value) => {
    setStatusUpdating(p => ({ ...p, [bookingId + field]: true }));
    try {
      await fetch(`/api/admin/physio-bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, [field]: value } : b));
    } catch (e) { console.error(e); }
    setStatusUpdating(p => ({ ...p, [bookingId + field]: false }));
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`/api/admin/physio-bookings/${id}`);
      const data = await res.json();
      if (data.success) { setSelectedBooking(data.data); setShowViewDetails(true); setWaStatus(null); }
    } catch (e) { console.error(e); }
  };

  // Status update in modal
  const handleModalStatusChange = async (field, value) => {
    if (!selectedBooking?.booking?._id) return;
    const id = selectedBooking.booking._id;
    setStatusUpdating(p => ({ ...p, [`modal_${field}`]: true }));
    try {
      await fetch(`/api/admin/physio-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setSelectedBooking(prev => ({ ...prev, booking: { ...prev.booking, [field]: value } }));
      setBookings(prev => prev.map(b => b._id === id ? { ...b, [field]: value } : b));
    } catch (e) { console.error(e); }
    setStatusUpdating(p => ({ ...p, [`modal_${field}`]: false }));
  };

  const changeTherapist = async (therapistId) => {
    if (!selectedBooking?.booking?._id) return;
    try {
      const res = await fetch(`/api/admin/physio-bookings/${selectedBooking.booking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTherapistId: therapistId }),
      });
      if (res.ok) { handleViewDetails(selectedBooking.booking._id); fetchBookings(); }
    } catch (e) { console.error(e); }
  };

  // Session attendance update
  const handleSessionUpdate = async (sessionId, fields) => {
    try {
      await fetch(`/api/admin/physio-sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      // Refresh the session list in modal
      setSelectedBooking(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => s._id === sessionId ? { ...s, ...fields } : s),
      }));
    } catch (e) { console.error(e); }
  };

  // WhatsApp reminder
  const sendWhatsApp = async () => {
    if (!selectedBooking?.booking?._id) return;
    setWaLoading(true);
    setWaStatus(null);
    try {
      const res = await fetch(`/api/admin/physio-bookings/${selectedBooking.booking._id}/whatsapp`, { method: "POST" });
      const data = await res.json();
      setWaStatus(data.success ? "success" : "error");
    } catch {
      setWaStatus("error");
    }
    setWaLoading(false);
    setTimeout(() => setWaStatus(null), 4000);
  };

  const handleBookSubmit = async (e, override = false) => {
    if (e) e.preventDefault();
    try {
      const payload = { ...bookForm, overrideDuplicate: override };
      const res = await fetch("/api/admin/physio-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 409 && data.isDuplicate && !override) { setDuplicateWarning(true); return; }
      if (data.success) {
        setShowBookModal(false); setDuplicateWarning(false); setBookForm({});
        fetchBookings(); alert("Booking created successfully!");
      } else { alert(data.message || "Failed to create booking"); }
    } catch (e) { console.error(e); alert("Error creating booking"); }
  };

  const handleRepeatBooking = (bookingData) => {
    setBookForm({
      patientId: bookingData.patientId._id,
      departmentId: bookingData.departmentId?._id,
      groupId: bookingData.groupId?._id,
      conditionId: bookingData.conditionId?._id,
      packageId: bookingData.packageId?._id,
      preferredDate: "",
      preferredTime: "",
      totalAmount: bookingData.packageId?.offerPrice || bookingData.packageId?.basePrice || 0,
    });
    setShowViewDetails(false);
    setShowBookModal(true);
  };

  const downloadPDF = (booking, type) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(type === "Receipt" ? "Payment Receipt" : "Booking Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`Patient Name: ${booking.patientId?.name}`, 20, 50);
    doc.text(`Mobile: ${booking.patientId?.mobile}`, 20, 60);
    if (type === "Receipt") {
      doc.text(`Amount Paid: Rs. ${booking.paidAmount}`, 20, 70);
      doc.text(`Total Amount: Rs. ${booking.totalAmount}`, 20, 80);
      doc.text(`Status: ${booking.paymentStatus}`, 20, 90);
    } else {
      doc.text(`Date: ${booking.preferredDate}`, 20, 70);
      doc.text(`Time: ${booking.preferredTime}`, 20, 80);
      doc.text(`Status: ${booking.status}`, 20, 90);
    }
    doc.save(`${booking.bookingId}_${type}.pdf`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Physio Bookings</h2>
          </div>
          <button onClick={() => setShowBookModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Book on Behalf
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by ID, Name, Mobile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none" />
          </div>
          <select className="p-2 bg-gray-50 border rounded-xl text-sm outline-none" value={filterDate} onChange={e => setFilterDate(e.target.value)}>
            <option value="">All Dates</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
          </select>
          <select className="p-2 bg-gray-50 border rounded-xl text-sm outline-none" value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select className="p-2 bg-gray-50 border rounded-xl text-sm outline-none" value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
            <option value="">Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
          <select className="p-2 bg-gray-50 border rounded-xl text-sm outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Booking Status</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="p-4">Booking Info</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Service</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Booking Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{b.bookingId}</div>
                      <div className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{b.patientId?.name}</div>
                      <div className="text-xs text-gray-500">{b.patientId?.mobile} • {b.patientId?.patientId}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-700">{b.departmentId?.name || "General"}</div>
                      <div className="text-xs text-gray-500">Pkg: {b.packageId?.title || "Per Session"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{b.preferredDate}</div>
                      <div className="text-xs text-gray-500">{b.preferredTime}</div>
                    </td>
                    {/* Inline Payment Status Dropdown */}
                    <td className="p-4">
                      <div className="relative">
                        {statusUpdating[b._id + "paymentStatus"] ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <select
                            value={b.paymentStatus}
                            onChange={e => handleInlineStatusChange(b._id, "paymentStatus", e.target.value)}
                            className={`text-[11px] font-bold rounded px-2 py-1 border-0 outline-none cursor-pointer ${
                              b.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                              b.paymentStatus === "Pending" ? "bg-amber-100 text-amber-800" :
                              b.paymentStatus === "Partial" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        )}
                      </div>
                    </td>
                    {/* Inline Booking Status Dropdown */}
                    <td className="p-4">
                      <div className="relative">
                        {statusUpdating[b._id + "status"] ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <select
                            value={b.status}
                            onChange={e => handleInlineStatusChange(b._id, "status", e.target.value)}
                            className={`text-[11px] font-bold rounded px-2 py-1 border-0 outline-none cursor-pointer ${
                              b.status === "New" ? "bg-gray-100 text-gray-700" :
                              b.status === "Assigned" ? "bg-blue-100 text-blue-700" :
                              b.status === "In Progress" ? "bg-purple-100 text-purple-700" :
                              b.status === "Completed" ? "bg-green-100 text-green-700" :
                              b.status === "Cancelled" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleViewDetails(b._id)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium text-xs transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── View Details Modal ─────────────────────────────────────────── */}
      {showViewDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Booking Details — {selectedBooking.booking.bookingId}</h3>
              <button onClick={() => setShowViewDetails(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 border-b pb-4 items-center">
                <button onClick={() => downloadPDF(selectedBooking.booking, "Booking")} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-100"><Download className="w-4 h-4" /> Booking PDF</button>
                <button onClick={() => downloadPDF(selectedBooking.booking, "Receipt")} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-100"><Download className="w-4 h-4" /> Receipt</button>
                <button onClick={() => handleRepeatBooking(selectedBooking.booking)} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-purple-100 ml-auto"><RotateCw className="w-4 h-4" /> Book Again</button>

                {/* WhatsApp Reminder Button */}
                <button
                  onClick={sendWhatsApp}
                  disabled={waLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    waStatus === "success" ? "bg-green-600 text-white" :
                    waStatus === "error" ? "bg-red-100 text-red-600" :
                    "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30"
                  }`}
                >
                  {waLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  {waStatus === "success" ? "Sent!" : waStatus === "error" ? "Failed" : "WhatsApp Reminder"}
                </button>
              </div>

              {/* Patient + Service */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Patient Info</h4>
                  <p className="font-medium">{selectedBooking.booking.patientId?.name} ({selectedBooking.booking.patientId?.patientId})</p>
                  <p className="text-sm text-gray-600">Mobile: {selectedBooking.booking.patientId?.mobile}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Service Details</h4>
                  <p className="font-medium">{selectedBooking.booking.departmentId?.name || "General"}</p>
                  <p className="text-sm text-gray-600">Package: {selectedBooking.booking.packageId?.title || "Standard Session"}</p>
                </div>
              </div>

              {/* Status editors in modal */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Booking Status</h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBooking.booking.status}
                      onChange={e => handleModalStatusChange("status", e.target.value)}
                      disabled={statusUpdating["modal_status"]}
                      className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-blue-400"
                    >
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {statusUpdating["modal_status"] && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Payment Status</h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBooking.booking.paymentStatus}
                      onChange={e => handleModalStatusChange("paymentStatus", e.target.value)}
                      disabled={statusUpdating["modal_paymentStatus"]}
                      className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-blue-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                    {statusUpdating["modal_paymentStatus"] && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Therapist + Concession */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Assign Therapist</h4>
                  <select
                    className="p-2 border rounded-lg w-full text-sm outline-none"
                    value={selectedBooking.booking.assignedTherapistId?._id || ""}
                    onChange={e => changeTherapist(e.target.value)}
                  >
                    <option value="">Select Therapist...</option>
                    {therapists.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Concession Details</h4>
                  <p className="text-sm">Amount: Rs. {selectedBooking.booking.concessionAmount}</p>
                </div>
              </div>

              {/* Session Attendance Tracker */}
              {selectedBooking.plan && selectedBooking.sessions?.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Session Attendance
                    </h4>
                    <span className="text-sm font-bold text-blue-600">
                      {selectedBooking.plan.completedSessions}/{selectedBooking.plan.totalSessions} completed
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <ProgressBar sessions={selectedBooking.sessions} />
                  </div>

                  {/* Session Rows */}
                  <div>
                    {selectedBooking.sessions.map(s => (
                      <SessionRow key={s._id} s={s} onUpdate={handleSessionUpdate} />
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.plan && selectedBooking.sessions?.length === 0 && (
                <div className="pt-4 border-t text-center py-8 text-gray-400 text-sm">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No sessions generated yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Book on Behalf Modal ───────────────────────────────────────── */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Book on Behalf</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              {duplicateWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Duplicate Booking Found</p>
                    <p className="text-xs text-amber-700">This patient already has a booking at this date and time.</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => setDuplicateWarning(false)} className="px-3 py-1 bg-white border rounded text-xs hover:bg-gray-50">Cancel</button>
                      <button type="button" onClick={e => handleBookSubmit(e, true)} className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700">Yes, Continue</button>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select required className="w-full p-2 border rounded-lg text-sm" value={bookForm.patientId || ""} onChange={e => setBookForm({ ...bookForm, patientId: e.target.value })}>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.mobile})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Package / Service</label>
                <select className="w-full p-2 border rounded-lg text-sm" value={bookForm.packageId || ""} onChange={e => {
                  const pkg = packages.find(p => p._id === e.target.value);
                  setBookForm({ ...bookForm, packageId: e.target.value, totalAmount: pkg ? (pkg.offerPrice || pkg.basePrice) : bookForm.totalAmount });
                }}>
                  <option value="">-- Select Package --</option>
                  {packages.map(p => <option key={p._id} value={p._id}>{p.title} - Rs. {p.offerPrice || p.basePrice}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.preferredDate || ""} onChange={e => setBookForm({ ...bookForm, preferredDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.preferredTime || ""} onChange={e => setBookForm({ ...bookForm, preferredTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input type="number" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.totalAmount || ""} onChange={e => setBookForm({ ...bookForm, totalAmount: e.target.value })} />
              </div>
              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={duplicateWarning} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Continue to Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

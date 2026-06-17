"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  Filter,
  ChevronDown,
  Trash2,
  AlertCircle,
  Hash,
  UserCheck,
  CreditCard,
  Notebook,
  Share2,
  CalendarDays,
  FileSpreadsheet
} from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Editor Modal/Accordion state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    bookingStatus: "",
    paymentStatus: "",
    doctorAssigned: "",
    physiotherapistAssigned: "",
    nurseAssigned: "",
    ambulanceAssigned: "",
    internalNotes: "",
    followupRemarks: ""
  });

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      let url = "/api/appointments?";
      if (filterDoctor) url += `doctor=${filterDoctor}&`;
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterDate) url += `appointmentDate=${filterDate}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchStaff();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filterDoctor, filterStatus, filterDate]);

  // Filter appointments by search term (name, phone or bookingId)
  const filteredAppointments = appointments.filter(appt => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appt.patientName?.toLowerCase().includes(searchLower) ||
      appt.phone?.includes(searchTerm) ||
      appt.bookingId?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Assigned":
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (pStatus) => {
    switch (pStatus) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refund Pending":
        return "bg-amber-100 text-amber-800";
      case "Refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const startEditing = (appt) => {
    setEditingId(appt._id);
    setEditForm({
      bookingStatus: appt.bookingStatus || appt.status || "New",
      paymentStatus: appt.paymentStatus || "Pending",
      doctorAssigned: appt.doctorAssigned || "",
      physiotherapistAssigned: appt.physiotherapistAssigned || "",
      nurseAssigned: appt.nurseAssigned || "",
      ambulanceAssigned: appt.ambulanceAssigned || "",
      internalNotes: appt.internalNotes || "",
      followupRemarks: appt.followupRemarks || ""
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      setStatusLoadingId(id);
      
      const payload = {
        id,
        bookingStatus: editForm.bookingStatus,
        paymentStatus: editForm.paymentStatus,
        doctorAssigned: editForm.doctorAssigned,
        physiotherapistAssigned: editForm.physiotherapistAssigned,
        nurseAssigned: editForm.nurseAssigned,
        ambulanceAssigned: editForm.ambulanceAssigned,
        internalNotes: editForm.internalNotes,
        followupRemarks: editForm.followupRemarks,
        updatedBy: "Admin"
      };

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments(appointments.map(a => a._id === id ? updated : a));
        setEditingId(null);
      } else {
        alert("Failed to save assignment changes");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving assignments");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDeleteAppointment = async (appointmentId, patientName) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAppointments(appointments.filter(a => a._id !== appointmentId));
        setDeleteAppointmentId(null);
        alert(`✓ Appointment for ${patientName} deleted successfully`);
      } else {
        alert("Failed to delete appointment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddCancellationRequest = async (bookingId, patientName) => {
    const reason = prompt(`Enter cancellation reason for ${patientName}'s booking (${bookingId}):`);
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Reason is required");
      return;
    }

    try {
      const res = await fetch('/api/admin/cancellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, reason })
      });

      if (res.ok) {
        alert(`✓ Cancellation request submitted for booking ${bookingId}`);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit cancellation request");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting request");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Manage Bookings</h2>
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{paginatedAppointments.length}</span> of <span className="font-bold text-gray-900">{filteredAppointments.length}</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, name, phone..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Doctor Filter */}
          <div className="relative">
            <select
              value={filterDoctor}
              onChange={e => {
                setFilterDoctor(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none animate-none"
            >
              <option value="">All Doctors (Service Preferred)</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc.name}>{doc.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New / Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={e => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : paginatedAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No bookings found
          </h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedAppointments.map((appt) => {
            const isEditing = editingId === appt._id;
            return (
              <div
                key={appt._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
              >
                {/* Upper Details */}
                <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-50">
                  <div className="flex flex-col gap-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    {appt.bookingId && (
                      <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> {appt.bookingId}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                        appt.bookingStatus || appt.status
                      )}`}
                    >
                      {appt.bookingStatus || appt.status}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPaymentStatusColor(appt.paymentStatus)}`}>
                      💳 {appt.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="p-6 pb-4 space-y-3 flex-1">
                  <div>
                    <h4 className="text-base font-bold text-gray-900 tracking-tight">
                      {appt.patientName}
                    </h4>
                    <p className="text-primary text-xs font-bold mt-0.5">
                      {appt.category} • {appt.doctor}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 font-medium">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>Date: {appt.appointmentDate || 'Not specified'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>Time: {appt.appointmentTime || 'Not specified'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>Phone: {appt.phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Share2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Lead Source: <strong className="text-gray-800">{appt.leadSource || 'Website'}</strong></span>
                    </div>

                    {/* Show Assigned Staff */}
                    <div className="bg-gray-50/80 p-3 rounded-2xl space-y-1.5 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Staff</p>
                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
                        <div>👨‍⚕️ Doc: <span className="text-gray-800 font-bold">{appt.doctorAssigned || "None"}</span></div>
                        <div>🏃‍♂️ Physio: <span className="text-gray-800 font-bold">{appt.physiotherapistAssigned || "None"}</span></div>
                        <div>👩‍⚕️ Nurse: <span className="text-gray-800 font-bold">{appt.nurseAssigned || "None"}</span></div>
                        <div>🚑 Ambul: <span className="text-gray-800 font-bold">{appt.ambulanceAssigned || "None"}</span></div>
                      </div>
                    </div>
                  </div>

                  {appt.notes && (
                    <div className="bg-gray-50/50 p-3 rounded-2xl text-[11px] text-gray-500 italic border border-gray-100">
                      "Notes: {appt.notes}"
                    </div>
                  )}

                  {appt.internalNotes && (
                    <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-[11px] text-blue-700">
                      🧠 <strong>Internal Notes:</strong> {appt.internalNotes}
                    </div>
                  )}

                  {appt.followupRemarks && (
                    <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-2xl text-[11px] text-purple-700">
                      📞 <strong>Followup Remarks:</strong> {appt.followupRemarks}
                    </div>
                  )}
                </div>

                {/* Edit Form Drawer Inline */}
                {isEditing && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200 space-y-3 text-xs">
                    <h5 className="font-bold text-gray-800">Assign Staff & Update Booking</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Booking Status</label>
                        <select
                          value={editForm.bookingStatus}
                          onChange={e => setEditForm({ ...editForm, bookingStatus: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Payment Status</label>
                        <select
                          value={editForm.paymentStatus}
                          onChange={e => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refund Pending">Refund Pending</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Doctor Assigned</label>
                        <select
                          value={editForm.doctorAssigned}
                          onChange={e => setEditForm({ ...editForm, doctorAssigned: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="">None</option>
                          {staff.filter(s => s.role === 'Doctor').map(s => (
                            <option key={s._id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Physiotherapist</label>
                        <select
                          value={editForm.physiotherapistAssigned}
                          onChange={e => setEditForm({ ...editForm, physiotherapistAssigned: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="">None</option>
                          {staff.filter(s => s.role === 'Physiotherapist').map(s => (
                            <option key={s._id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Nurse Assigned</label>
                        <select
                          value={editForm.nurseAssigned}
                          onChange={e => setEditForm({ ...editForm, nurseAssigned: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="">None</option>
                          {staff.filter(s => s.role === 'Nurse').map(s => (
                            <option key={s._id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Ambulance Staff</label>
                        <select
                          value={editForm.ambulanceAssigned}
                          onChange={e => setEditForm({ ...editForm, ambulanceAssigned: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                        >
                          <option value="">None</option>
                          {staff.filter(s => s.role === 'Ambulance Staff').map(s => (
                            <option key={s._id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Internal Notes</label>
                      <textarea
                        value={editForm.internalNotes}
                        onChange={e => setEditForm({ ...editForm, internalNotes: e.target.value })}
                        placeholder="Add internal patient notes here..."
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Followup Remarks</label>
                      <textarea
                        value={editForm.followupRemarks}
                        onChange={e => setEditForm({ ...editForm, followupRemarks: e.target.value })}
                        placeholder="Add followup call notes here..."
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-gray-200 rounded-lg text-gray-800 font-bold active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(appt._id)}
                        disabled={statusLoadingId === appt._id}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold active:scale-95 flex items-center gap-1 disabled:opacity-50"
                      >
                        {statusLoadingId === appt._id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions bottom bar */}
                <div className="p-6 pt-0 flex gap-2 border-t border-gray-50 pt-4">
                  {!isEditing ? (
                    <button
                      onClick={() => startEditing(appt)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl text-[11px] font-bold active:scale-95 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Assign & Edit
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleAddCancellationRequest(appt.bookingId, appt.patientName)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-2xl text-[11px] font-bold active:scale-95 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel / Refund
                  </button>

                  <button
                    onClick={() => setDeleteAppointmentId(appt._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl text-[11px] font-bold active:scale-95 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-50 active:scale-95 transition"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500 font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-50 active:scale-95 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAppointmentId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Appointment?
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              This action cannot be undone. The appointment will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteAppointmentId(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const appt = appointments.find(a => a._id === deleteAppointmentId);
                  if (appt) {
                    handleDeleteAppointment(deleteAppointmentId, appt.patientName);
                  }
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

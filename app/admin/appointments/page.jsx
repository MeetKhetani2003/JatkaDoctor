"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  MessageSquare,
  Filter,
  Download,
  ChevronDown,
  Trash2,
  AlertCircle,
} from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
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
      
      // Extract unique statuses
      const statuses = [...new Set(data.map(a => a.status))];
      setUniqueStatuses(statuses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filterDoctor, filterStatus, filterDate]);

  // Filter appointments by search term (name or phone)
  const filteredAppointments = appointments.filter(appt => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appt.patientName.toLowerCase().includes(searchLower) ||
      appt.phone.includes(searchTerm)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleDeleteAppointment = async (appointmentId, patientName) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from list
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

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-900">{filteredAppointments.length}</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name/phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Doctor Filter */}
          <div className="relative">
            <select
              value={filterDoctor}
              onChange={e => setFilterDoctor(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none"
            >
              <option value="">All Doctors</option>
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
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
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
              onChange={e => setFilterDate(e.target.value)}
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
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No appointments found
          </h3>
          <p className="text-gray-500 text-sm">
            New bookings will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 pb-0 flex justify-between items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                    appt.status
                  )}`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                {/* Patient Name */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                    {appt.patientName}
                  </h4>
                  <p className="text-primary text-xs font-bold mt-0.5">
                    {appt.category} • {appt.doctor}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  {/* Appointment Date & Time - NEW */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {appt.appointmentDate
                        ? new Date(appt.appointmentDate + 'T00:00').toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Not specified'}
                    </span>
                  </div>

                  {/* Appointment Time - NEW */}
                  {appt.appointmentTime && (
                    <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{appt.appointmentTime}</span>
                    </div>
                  )}

                  {/* Phone */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{appt.phone}</span>
                  </div>

                  {/* Notes */}
                  {appt.notes && (
                    <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-600 italic border border-gray-100">
                      "{appt.notes}"
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="text-[10px] text-gray-400 font-normal">
                    Booked: {appt.createdAt?.slice(0, 10) || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex gap-2">
                <a
                  href={`tel:${appt.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-[11px] font-bold active:scale-95 transition hover:bg-primary-dark"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/91${appt.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-2xl text-[11px] font-bold active:scale-95 transition hover:bg-green-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <button
                  onClick={() => setDeleteAppointmentId(appt._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold active:scale-95 transition hover:bg-red-100 border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
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

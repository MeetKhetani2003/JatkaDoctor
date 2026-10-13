"use client";
import { useState, useEffect } from "react";
import {
  Search, RefreshCw, Filter, Calendar, Clock, MapPin, Phone,
  UserCheck, HeartHandshake, ShieldCheck, IndianRupee, FileText,
  UserPlus, CheckCircle2, AlertCircle, XCircle, ChevronRight, X
} from "lucide-react";

export default function HomeCareBookingManager({
  category = "home-care",
  title = "Home Care Bookings & Requests",
  subtitle = "Manage patient service requests, caregiver assignments, quotes and care progress"
}) {
  const [bookings, setBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  // Status & Quote Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [customPrice, setCustomPrice] = useState(0);
  const [statusNotes, setStatusNotes] = useState("");

  // Details / Log Drawer
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [activeBookingDetails, setActiveBookingDetails] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/home-care-bookings?category=${category}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data.success) {
        // Filter by role relevant to category
        const targetRoles = category === "nursing-care" 
          ? ["Nurse"] 
          : ["Caregiver", "Attendant", "Caregiver / Attendant", "Nurse", "Physiotherapist"];
        
        const eligible = (data.data || []).filter(
          (s) => targetRoles.includes(s.role) || !category
        );
        setStaffList(eligible.length > 0 ? eligible : data.data || []);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStaff();
  }, [category]);

  const handleOpenAssign = (b) => {
    setSelectedBooking(b);
    setSelectedStaffId(b.assignedStaffId?._id || b.assignedStaffId || "");
    setAssignModalOpen(true);
  };

  const handleSaveAssign = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/admin/home-care-bookings/${selectedBooking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedStaffId: selectedStaffId || null,
          bookingStatus: selectedStaffId ? "Staff Assigned" : selectedBooking.bookingStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssignModalOpen(false);
        fetchBookings();
      } else {
        alert("Error assigning staff: " + data.error);
      }
    } catch (err) {
      console.error("Assignment error:", err);
    }
  };

  const handleOpenStatusModal = (b) => {
    setSelectedBooking(b);
    setNewStatus(b.bookingStatus);
    setNewPaymentStatus(b.paymentStatus || "Pending");
    setCustomPrice(b.totalAmount || 0);
    setStatusNotes("");
    setStatusModalOpen(true);
  };

  const handleSaveStatusModal = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/admin/home-care-bookings/${selectedBooking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingStatus: newStatus,
          paymentStatus: newPaymentStatus,
          totalAmount: Number(customPrice) || selectedBooking.totalAmount,
          statusNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusModalOpen(false);
        fetchBookings();
      } else {
        alert("Error updating status: " + data.error);
      }
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  const handleViewDetails = (b) => {
    setActiveBookingDetails(b);
    setDetailsDrawerOpen(true);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientPhone?.includes(search) ||
      b.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientPermanentId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
    "Quote Required": "bg-purple-50 text-purple-700 border-purple-200",
    "Quote Sent": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Staff Assigned": "bg-teal-50 text-teal-700 border-teal-200",
    "On The Way": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
    Completed: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    Rejected: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            {category === "nursing-care" ? (
              <HeartHandshake className="w-7 h-7 text-emerald-600" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            )}
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter & Status Navigation */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by ID, Patient, Mobile, Service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredBookings.length}</span> of {bookings.length} bookings
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {[
            "All",
            "New",
            "Quote Required",
            "Quote Sent",
            "Confirmed",
            "Staff Assigned",
            "In Progress",
            "Completed",
            "Cancelled",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">Patient Info</th>
                <th className="py-4 px-4">Service & Care</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Schedule</th>
                <th className="py-4 px-4">Assigned Staff</th>
                <th className="py-4 px-4">Financials</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-4 font-mono font-semibold text-xs text-emerald-700">
                      {b.bookingId}
                      <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{b.patientName}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {b.patientPhone}
                        </p>
                        {b.patientPermanentId && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px] font-mono">
                            {b.patientPermanentId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{b.serviceName}</p>
                      {b.careType && (
                        <p className="text-xs text-emerald-700 font-medium">
                          {b.careType}
                        </p>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-xs text-gray-600 max-w-[160px] truncate">
                      <p className="font-medium text-gray-900 truncate">{b.area || b.city}</p>
                      <p className="text-[11px] text-gray-500 truncate">{b.address}</p>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-4 text-xs">
                      <p className="font-medium text-gray-900">{b.startDate}</p>
                      <p className="text-gray-500">{b.startTime || b.duration || "Standard"}</p>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-4 px-4">
                      {b.assignedStaffId ? (
                        <div className="text-xs">
                          <p className="font-semibold text-gray-900">
                            {b.assignedStaffId.name || b.assignedStaffName}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {b.assignedStaffId.role || b.assignedStaffRole || "Staff"}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssign(b)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold"
                        >
                          + Assign Staff
                        </button>
                      )}
                    </td>

                    {/* Financials */}
                    <td className="py-4 px-4 text-xs">
                      <p className="font-bold text-gray-900">₹{b.totalAmount}</p>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                          b.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.paymentStatus === "Failed"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.paymentStatus || "Pending"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenStatusModal(b)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          statusColors[b.bookingStatus] || "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                        title="Click to update status"
                      >
                        {b.bookingStatus}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAssign(b)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                          title="Assign Staff / Nurse"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(b)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                          title="View Details & Logs"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {assignModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                Assign Staff / Nurse
              </h3>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Booking:</span> {selectedBooking.bookingId}</p>
              <p><span className="font-semibold text-gray-700">Patient:</span> {selectedBooking.patientName} ({selectedBooking.patientPhone})</p>
              <p><span className="font-semibold text-gray-700">Service:</span> {selectedBooking.serviceName}</p>
              <p><span className="font-semibold text-gray-700">Area:</span> {selectedBooking.area || selectedBooking.city}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Select Available Staff Member
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="">-- No Staff Assigned / Unassign --</option>
                {staffList.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name} — {st.role} ({st.zone || "Lucknow"}) {st.status === "Active" ? "✓" : `(${st.status})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssign}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status & Quote Modal */}
      {statusModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                Update Status & Pricing
              </h3>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Booking Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="New">New</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Quote Required">Quote Required</option>
                  <option value="Quote Sent">Quote Sent</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Staff Assigned">Staff Assigned</option>
                  <option value="On The Way">On The Way</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Status Change Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Care plan approved by Dr. Sharma, quote communicated."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatusModal}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Update Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details & Activity Log Drawer */}
      {detailsDrawerOpen && activeBookingDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeBookingDetails.bookingId}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {activeBookingDetails.category.replace("-", " ")}
                </p>
              </div>
              <button
                onClick={() => setDetailsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                Patient Information
              </h4>
              <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{activeBookingDetails.patientName}</span></p>
              <p><span className="text-gray-500">Phone:</span> <span className="font-mono">{activeBookingDetails.patientPhone}</span></p>
              <p><span className="text-gray-500">Age / Gender:</span> {activeBookingDetails.patientAge || "N/A"} / {activeBookingDetails.patientGender || "N/A"}</p>
              <p><span className="text-gray-500">Permanent Patient ID:</span> <span className="font-mono font-bold text-emerald-700">{activeBookingDetails.patientPermanentId || "N/A"}</span></p>
              <p><span className="text-gray-500">Address:</span> {activeBookingDetails.address}, {activeBookingDetails.area}</p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                Care Requirements
              </h4>
              <p><span className="text-gray-500">Service:</span> <span className="font-semibold">{activeBookingDetails.serviceName}</span></p>
              <p><span className="text-gray-500">Care Type:</span> {activeBookingDetails.careType || "Standard"}</p>
              <p><span className="text-gray-500">Start Date:</span> {activeBookingDetails.startDate} {activeBookingDetails.startTime}</p>
              {activeBookingDetails.selectedRequirements?.length > 0 && (
                <div>
                  <span className="text-gray-500">Included Tasks:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeBookingDetails.selectedRequirements.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeBookingDetails.specialInstructions && (
                <p><span className="text-gray-500">Instructions:</span> {activeBookingDetails.specialInstructions}</p>
              )}
            </div>

            {/* Activity Logs */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                Activity & Audit Trail
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(activeBookingDetails.activityLogs || []).length === 0 ? (
                  <p className="text-gray-400">No activity logs recorded.</p>
                ) : (
                  activeBookingDetails.activityLogs.map((log, i) => (
                    <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between font-semibold text-gray-800">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{log.notes || `By ${log.performedBy}`}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => setDetailsDrawerOpen(false)}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

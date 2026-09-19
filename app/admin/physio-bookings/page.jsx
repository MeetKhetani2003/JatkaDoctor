"use client";
import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, ChevronDown, User, Hash, FileText, Download, Phone, CreditCard, RotateCw, AlertTriangle, Plus, X } from "lucide-react";
import jsPDF from "jspdf";

export default function PhysioBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterTherapist, setFilterTherapist] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Master Data for Dropdowns
  const [departments, setDepartments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [packages, setPackages] = useState([]);

  // Modals
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    fetchMasterData();
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, searchTerm, filterDate, filterDepartment, filterTherapist, filterPayment, filterStatus]);

  const fetchMasterData = async () => {
    try {
      const [depRes, staffRes, patRes, packRes] = await Promise.all([
        fetch("/api/admin/physio-departments").then(res => res.json()),
        fetch("/api/admin/staff").then(res => res.json()),
        fetch("/api/admin/physio-patients").then(res => res.json()),
        fetch("/api/admin/physio-packages").then(res => res.json()),
      ]);
      if (depRes.success) setDepartments(depRes.data);
      if (staffRes) setTherapists(staffRes);
      if (patRes.success) setPatients(patRes.data);
      if (packRes.success) setPackages(packRes.data);
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/physio-bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
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

    if (filterDate) {
      // Very basic date filtering for preferredDate
      if (filterDate === 'Today') {
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(b => b.preferredDate === today);
      } else if (filterDate === 'Tomorrow') {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        result = result.filter(b => b.preferredDate === tomorrow);
      }
    }

    if (filterDepartment) {
      result = result.filter(b => b.departmentId?._id === filterDepartment);
    }

    if (filterTherapist) {
      result = result.filter(b => b.assignedTherapistId?._id === filterTherapist);
    }

    if (filterPayment) {
      result = result.filter(b => b.paymentStatus === filterPayment);
    }

    if (filterStatus) {
      result = result.filter(b => b.status === filterStatus);
    }

    setFilteredBookings(result);
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`/api/admin/physio-bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.data);
        setShowViewDetails(true);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleBookSubmit = async (e, override = false) => {
    if (e) e.preventDefault();
    try {
      const payload = { ...bookForm, overrideDuplicate: override };
      const res = await fetch("/api/admin/physio-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.status === 409 && data.isDuplicate && !override) {
        setDuplicateWarning(true);
        return;
      }

      if (data.success) {
        setShowBookModal(false);
        setDuplicateWarning(false);
        setBookForm({});
        fetchBookings();
        alert("Booking created successfully!");
      } else {
        alert(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating booking");
    }
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
      totalAmount: bookingData.packageId?.offerPrice || bookingData.packageId?.basePrice || 0
    });
    setShowViewDetails(false);
    setShowBookModal(true);
  };

  const downloadPDF = (booking, type) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(type === 'Receipt' ? "Payment Receipt" : "Booking Details", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`Patient Name: ${booking.patientId?.name}`, 20, 50);
    doc.text(`Mobile: ${booking.patientId?.mobile}`, 20, 60);
    if (type === 'Receipt') {
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

  const changeTherapist = async (therapistId) => {
    if (!selectedBooking?.booking?._id) return;
    try {
        const res = await fetch(`/api/admin/physio-bookings/${selectedBooking.booking._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedTherapistId: therapistId })
        });
        if (res.ok) {
            handleViewDetails(selectedBooking.booking._id);
            fetchBookings();
        }
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar & Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Physio Bookings</h2>
          </div>
          <button 
            onClick={() => setShowBookModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Book on Behalf
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Mobile..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none"
            />
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
            <option value="Scheduled">Scheduled</option>
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
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50">
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
                    <td className="p-4 space-y-1">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : b.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                          {b.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">
                          {b.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleViewDetails(b._id)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium text-xs"
                      >
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

      {/* View Details Modal */}
      {showViewDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Booking Details - {selectedBooking.booking.bookingId}</h3>
              <button onClick={() => setShowViewDetails(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Header Actions */}
              <div className="flex gap-3 border-b pb-4">
                <button onClick={() => downloadPDF(selectedBooking.booking, 'Booking')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4"/> Booking PDF</button>
                <button onClick={() => downloadPDF(selectedBooking.booking, 'Receipt')} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4"/> Receipt</button>
                <button onClick={() => handleRepeatBooking(selectedBooking.booking)} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto"><RotateCw className="w-4 h-4"/> Book Again</button>
              </div>

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

              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Assign Therapist</h4>
                  <select 
                    className="p-2 border rounded-lg w-full text-sm"
                    value={selectedBooking.booking.assignedTherapistId?._id || ""}
                    onChange={(e) => changeTherapist(e.target.value)}
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

              {selectedBooking.plan && (
                <div className="pt-4 border-t">
                  <h4 className="font-bold text-gray-500 text-xs uppercase mb-3 flex justify-between items-center">
                    <span>Session Progress</span>
                    <span className="text-primary font-bold text-lg">{selectedBooking.plan.completedSessions}/{selectedBooking.plan.totalSessions}</span>
                  </h4>
                  <div className="bg-gray-50 border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 border-b">
                        <tr>
                          <th className="p-3">Session</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Therapist</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedBooking.sessions.map(s => (
                          <tr key={s._id}>
                            <td className="p-3 font-medium">{s.sessionNumber}</td>
                            <td className="p-3">{s.scheduledDate}</td>
                            <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${s.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span></td>
                            <td className="p-3">{s.therapistId?.name || "Unassigned"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book on Behalf Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Book on Behalf</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              {duplicateWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Duplicate Booking Found</p>
                    <p className="text-xs text-amber-700">This patient already has a booking on the same date and time. Do you want to continue?</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => setDuplicateWarning(false)} className="px-3 py-1 bg-white border rounded text-xs hover:bg-gray-50">Cancel</button>
                      <button type="button" onClick={(e) => handleBookSubmit(e, true)} className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700">Yes, Continue</button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select 
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                  value={bookForm.patientId || ""}
                  onChange={e => setBookForm({...bookForm, patientId: e.target.value})}
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.mobile})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Package / Service</label>
                <select 
                  className="w-full p-2 border rounded-lg text-sm"
                  value={bookForm.packageId || ""}
                  onChange={e => {
                      const pkg = packages.find(p => p._id === e.target.value);
                      setBookForm({
                          ...bookForm, 
                          packageId: e.target.value,
                          totalAmount: pkg ? (pkg.offerPrice || pkg.basePrice) : bookForm.totalAmount
                      });
                  }}
                >
                  <option value="">-- Select Package --</option>
                  {packages.map(p => <option key={p._id} value={p._id}>{p.title} - Rs. {p.offerPrice || p.basePrice}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.preferredDate || ""} onChange={e => setBookForm({...bookForm, preferredDate: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.preferredTime || ""} onChange={e => setBookForm({...bookForm, preferredTime: e.target.value})}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input type="number" required className="w-full p-2 border rounded-lg text-sm" value={bookForm.totalAmount || ""} onChange={e => setBookForm({...bookForm, totalAmount: e.target.value})}/>
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

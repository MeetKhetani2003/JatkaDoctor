"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
  UserCheck,
  ChevronRight,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MessageCircle,
  X
} from "lucide-react";

export default function AdminIcuRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, inReview: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [staffList, setStaffList] = useState([]);

  // Modal / Drawer states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'details', 'carePlan', 'sendQuote', 'assignment'
  const [actionLoading, setActionLoading] = useState(false);

  // Care Plan Builder Form State
  const [carePlanForm, setCarePlanForm] = useState({
    planSummary: "Basic ICU Setup with 24/7 Nursing & Doctor Supervision",
    nursingShift: "24 Hours",
    doctorVisitsCount: 4,
    physioSessionsCount: 0,
    items: [],
    subtotal: 45000,
    discount: 0,
    totalCost: 45000,
    carePlanNotes: "Continuous oxygen & vitals monitoring required."
  });

  // Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState({
    nurseName: "Anjali Sharma",
    nursePhone: "9876543210",
    nurseShift: "24 Hours (Rotational)",
    doctorName: "Dr. R. Mehta",
    doctorPhone: "9876543211",
    doctorSpecialty: "Intensivist / Physician",
    physioName: "",
    equipmentItems: [
      { name: "ICU Bed", modelSerial: "DJM-BED-04", status: "Available" },
      { name: "Patient Monitor (BP, SpO2, ECG)", modelSerial: "DJM-MON-12", status: "Available" },
      { name: "Oxygen Concentrator (10L)", modelSerial: "DJM-O2-08", status: "Available" }
    ]
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/icu-requests?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (e) {
      console.error("Error fetching ICU requests:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (Array.isArray(data)) setStaffList(data);
    } catch (e) {
      console.error("Error fetching staff:", e);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, [activeTab]);

  const openDetails = (req) => {
    setSelectedRequest(req);
    setActiveModal('details');
  };

  const openCarePlanBuilder = (req) => {
    setSelectedRequest(req);
    // Initialize care plan items
    const defaultItems = [
      { category: 'Nursing Staff', itemName: '24/7 Critical Care ICU Nurse', quantity: 15, unit: 'Day', ratePerUnit: 2000, amount: 30000, assignedResource: 'Anjali Sharma', resourceStatus: 'Available' },
      { category: 'Equipment', itemName: 'ICU Bed (5-function motorized)', quantity: 15, unit: 'Day', ratePerUnit: 400, amount: 6000, assignedResource: 'DJM-BED-04', resourceStatus: 'Available' },
      { category: 'Equipment', itemName: 'Multipara Patient Monitor', quantity: 15, unit: 'Day', ratePerUnit: 300, amount: 4500, assignedResource: 'DJM-MON-12', resourceStatus: 'Available' },
      { category: 'Equipment', itemName: 'Oxygen Concentrator (10L)', quantity: 15, unit: 'Day', ratePerUnit: 250, amount: 3750, assignedResource: 'DJM-O2-08', resourceStatus: 'Available' },
      { category: 'Doctor Support', itemName: 'Physician / Intensivist Home Visit & Tele-review', quantity: 3, unit: 'Visit', ratePerUnit: 1500, amount: 4500, assignedResource: 'Dr. R. Mehta', resourceStatus: 'Available' }
    ];
    const total = defaultItems.reduce((acc, curr) => acc + curr.amount, 0);

    setCarePlanForm({
      planSummary: `${req.careType} - Complete Home Setup`,
      nursingShift: "24 Hours",
      doctorVisitsCount: 3,
      physioSessionsCount: 0,
      items: defaultItems,
      subtotal: total,
      discount: 3750,
      totalCost: total - 3750,
      carePlanNotes: `Patient condition: ${req.condition}. Family requested: ${req.requirements?.oxygenSupport ? 'Oxygen Support, ' : ''}${req.requirements?.ventilator ? 'Ventilator, ' : ''}ICU Bed.`
    });
    setActiveModal('carePlan');
  };

  const handleSaveCarePlan = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/icu-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.requestId,
          action: 'saveCarePlan',
          carePlan: carePlanForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequest(data.data);
        setActiveModal('sendQuote');
        fetchRequests();
      }
    } catch (e) {
      alert("Error saving care plan: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/icu-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.requestId,
          action: 'sendQuote',
          totalAmount: carePlanForm.totalCost || 45000,
          channels: ['WhatsApp', 'Email']
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Quotation for ₹${carePlanForm.totalCost || 45000} sent to patient ${selectedRequest.patientName} via WhatsApp & Email!`);
        setSelectedRequest(data.data);
        setActiveModal(null);
        fetchRequests();
      }
    } catch (e) {
      alert("Error sending quote: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateAcceptanceAndConfirm = async (req) => {
    try {
      setActionLoading(true);
      // 1. Accept Quote
      await fetch('/api/icu-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: req.requestId,
          action: 'acceptQuote'
        })
      });

      // 2. Confirm Booking with Paid status
      const res = await fetch('/api/icu-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: req.requestId,
          action: 'confirmBooking',
          paymentStatus: 'Paid'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequest(data.data);
        setActiveModal('assignment');
        fetchRequests();
      }
    } catch (e) {
      alert("Error confirming booking: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveAssignments = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      const payload = {
        nursingStaff: [{
          name: assignmentForm.nurseName,
          phone: assignmentForm.nursePhone,
          shift: assignmentForm.nurseShift
        }],
        doctor: {
          name: assignmentForm.doctorName,
          phone: assignmentForm.doctorPhone,
          specialty: assignmentForm.doctorSpecialty
        },
        equipment: assignmentForm.equipmentItems.map(eq => ({
          name: eq.name,
          modelSerial: eq.modelSerial,
          installedAt: new Date(),
          status: 'Active'
        }))
      };

      const res = await fetch('/api/icu-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.requestId,
          action: 'assignTeam',
          assignments: payload
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("ICU Staff and Equipment successfully assigned to " + selectedRequest.requestId);
        setSelectedRequest(data.data);
        setActiveModal(null);
        fetchRequests();
      }
    } catch (e) {
      alert("Error assigning team: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ICU at Home Management</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Hospital-Grade Setup
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Assessment, Care Plan Builder, Quotation, Booking &amp; Staff/Equipment Assignment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            Refresh
          </button>
          <Link
            href="/services/icu"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Live Patient Request Page
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "All", label: "All Requests", count: counts.all },
          { key: "Pending", label: "Pending (New / Review)", count: counts.pending },
          { key: "In Review", label: "In Review", count: counts.inReview },
          { key: "Converted", label: "Converted / Active", count: counts.converted }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.key ? "bg-white/20 text-white font-bold" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, Patient Name, Phone or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <button
          onClick={fetchRequests}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
        >
          Search
        </button>
      </div>

      {/* Requests Table / Cards */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading ICU requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No ICU requests found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            When a patient submits an ICU enquiry on the website or you create a new request, it will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Request ID</th>
                  <th className="px-5 py-3.5">Patient Details</th>
                  <th className="px-5 py-3.5">Care Type</th>
                  <th className="px-5 py-3.5">Location / Zone</th>
                  <th className="px-5 py-3.5">Start Date &amp; Duration</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => {
                  let statusBadgeClass = "bg-amber-100 text-amber-800 border-amber-200";
                  if (req.status === 'New') statusBadgeClass = "bg-rose-100 text-rose-800 border-rose-200 font-bold animate-pulse";
                  else if (req.status === 'In Review') statusBadgeClass = "bg-blue-100 text-blue-800 border-blue-200";
                  else if (req.status === 'Care Plan Created') statusBadgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                  else if (req.status === 'Quote Sent') statusBadgeClass = "bg-indigo-100 text-indigo-800 border-indigo-200";
                  else if (req.status === 'Accepted' || req.status === 'Booking Confirmed') statusBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold";
                  else if (req.status === 'Staff Assigned' || req.status === 'Service Started') statusBadgeClass = "bg-teal-100 text-teal-800 border-teal-200";

                  return (
                    <tr key={req._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {req.requestId}
                        {req.priority === 'Critical' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-sans font-bold">CRITICAL</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900 text-sm">{req.patientName}</div>
                        <div className="text-gray-500 font-mono">{req.phone}</div>
                        {req.patientId && (
                          <span className="text-[10px] text-gray-400 font-mono">ID: {req.patientId}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">{req.careType}</div>
                        <div className="text-gray-500 text-[11px] truncate max-w-[160px]" title={req.condition}>
                          {req.condition}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-gray-800 font-medium truncate max-w-[150px]" title={req.location}>
                          {req.location}
                        </div>
                        <div className="text-gray-400 text-[10px]">{req.zone || 'Lucknow'}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-gray-800 font-semibold">{req.startDate}</div>
                        <div className="text-gray-500 text-[11px]">{req.duration}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          req.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          req.paymentStatus === 'Failed' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          💳 {req.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openDetails(req)}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs transition"
                          >
                            View
                          </button>

                          {req.status === 'New' || req.status === 'In Review' ? (
                            <button
                              onClick={() => openCarePlanBuilder(req)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs shadow-sm shadow-purple-600/20 transition flex items-center gap-1"
                            >
                              Create Care Plan
                            </button>
                          ) : req.status === 'Care Plan Created' ? (
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setActiveModal('sendQuote');
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-sm shadow-indigo-600/20 transition flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" /> Send Quote
                            </button>
                          ) : req.status === 'Quote Sent' ? (
                            <button
                              onClick={() => handleSimulateAcceptanceAndConfirm(req)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-sm shadow-emerald-600/20 transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Accept &amp; Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setActiveModal('assignment');
                              }}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs shadow-sm shadow-teal-600/20 transition flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" /> Assign Team
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW REQUEST DETAILS */}
      {activeModal === 'details' && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedRequest.requestId}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Request Details</h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Info Card */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">Patient Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-400 font-medium">Name:</span> <strong className="text-gray-900">{selectedRequest.patientName}</strong></div>
                <div><span className="text-gray-400 font-medium">Phone:</span> <strong className="text-gray-900 font-mono">{selectedRequest.phone}</strong></div>
                <div><span className="text-gray-400 font-medium">Age / Gender:</span> <strong className="text-gray-900">{selectedRequest.age || 'N/A'} • {selectedRequest.gender || 'N/A'}</strong></div>
                <div><span className="text-gray-400 font-medium">Location:</span> <strong className="text-gray-900">{selectedRequest.location}</strong></div>
                <div className="col-span-2"><span className="text-gray-400 font-medium">Condition / Diagnosis:</span> <strong className="text-rose-700">{selectedRequest.condition}</strong></div>
                <div className="col-span-2"><span className="text-gray-400 font-medium">Family Notes:</span> <span className="text-gray-700 italic">{selectedRequest.additionalNotes || 'None'}</span></div>
              </div>
            </div>

            {/* Requirements Requested */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-700 text-xs">Requirements Selected:</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedRequest.requirements?.nursingCare && (
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold">
                    🩺 {selectedRequest.requirements.nursingCare}
                  </span>
                )}
                {selectedRequest.requirements?.icuBed && (
                  <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg font-semibold">
                    🛏️ ICU Bed
                  </span>
                )}
                {selectedRequest.requirements?.patientMonitor && (
                  <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg font-semibold">
                    📊 Patient Monitor (Vitals)
                  </span>
                )}
                {selectedRequest.requirements?.oxygenSupport && (
                  <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg font-semibold">
                    💨 Oxygen Support
                  </span>
                )}
                {selectedRequest.requirements?.ventilator && (
                  <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-semibold">
                    🫁 Ventilator Support
                  </span>
                )}
                {selectedRequest.requirements?.suctionMachine && (
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-semibold">
                    ⚙️ Suction Machine
                  </span>
                )}
                {selectedRequest.requirements?.doctorVisit && (
                  <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-semibold">
                    👨‍⚕️ Regular Doctor Visit
                  </span>
                )}
              </div>
            </div>

            {/* Activity Logs */}
            {selectedRequest.activityLogs && selectedRequest.activityLogs.length > 0 && (
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h4 className="font-bold text-gray-700 text-xs">Activity Audit Trail:</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedRequest.activityLogs.map((log, idx) => (
                    <div key={idx} className="text-[11px] bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                      <div>
                        <strong className="text-gray-800">{log.action}</strong>
                        <span className="text-gray-500 ml-1">by {log.performedBy}: {log.details}</span>
                      </div>
                      <span className="text-gray-400 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => openCarePlanBuilder(selectedRequest)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                Create / Edit Care Plan &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CARE PLAN BUILDER */}
      {activeModal === 'carePlan' && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {selectedRequest.requestId}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">ICU Care Plan Builder</h2>
                <p className="text-xs text-gray-500">Configure staffing shifts, ICU machinery &amp; pricing quotation</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resources Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800 text-xs">Included Staff &amp; Equipment Resources</h4>
                <button
                  onClick={() => {
                    setCarePlanForm(prev => ({
                      ...prev,
                      items: [
                        ...prev.items,
                        { category: 'Equipment', itemName: 'Suction Machine', quantity: 15, unit: 'Day', ratePerUnit: 150, amount: 2250, assignedResource: 'DJM-SUC-02', resourceStatus: 'Available' }
                      ],
                      totalCost: prev.totalCost + 2250
                    }));
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Resource
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Resource / Item</th>
                      <th className="p-3">Qty / Duration</th>
                      <th className="p-3">Rate (₹)</th>
                      <th className="p-3">Amount (₹)</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {carePlanForm.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <input
                            type="text"
                            value={it.itemName}
                            onChange={(e) => {
                              const newItems = [...carePlanForm.items];
                              newItems[idx].itemName = e.target.value;
                              setCarePlanForm({ ...carePlanForm, items: newItems });
                            }}
                            className="w-full bg-transparent font-semibold text-gray-900 border-b border-transparent focus:border-emerald-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-gray-400">{it.category}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={it.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 1;
                                const newItems = [...carePlanForm.items];
                                newItems[idx].quantity = val;
                                newItems[idx].amount = val * newItems[idx].ratePerUnit;
                                const total = newItems.reduce((acc, curr) => acc + curr.amount, 0);
                                setCarePlanForm({ ...carePlanForm, items: newItems, subtotal: total, totalCost: total - carePlanForm.discount });
                              }}
                              className="w-12 p-1 border rounded text-center text-xs"
                            />
                            <span className="text-gray-500">{it.unit}s</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={it.ratePerUnit}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              const newItems = [...carePlanForm.items];
                              newItems[idx].ratePerUnit = val;
                              newItems[idx].amount = val * newItems[idx].quantity;
                              const total = newItems.reduce((acc, curr) => acc + curr.amount, 0);
                              setCarePlanForm({ ...carePlanForm, items: newItems, subtotal: total, totalCost: total - carePlanForm.discount });
                            }}
                            className="w-20 p-1 border rounded text-xs"
                          />
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          ₹{it.amount}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const newItems = carePlanForm.items.filter((_, i) => i !== idx);
                              const total = newItems.reduce((acc, curr) => acc + curr.amount, 0);
                              setCarePlanForm({ ...carePlanForm, items: newItems, subtotal: total, totalCost: total - carePlanForm.discount });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-500 font-medium">Subtotal: ₹{carePlanForm.subtotal}</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Discount (₹):</span>
                  <input
                    type="number"
                    value={carePlanForm.discount}
                    onChange={(e) => {
                      const disc = parseInt(e.target.value, 10) || 0;
                      setCarePlanForm(prev => ({ ...prev, discount: disc, totalCost: Math.max(0, prev.subtotal - disc) }));
                    }}
                    className="w-24 p-1 border rounded text-xs bg-white"
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Quote Amount</div>
                <div className="text-2xl font-black text-emerald-700">₹{carePlanForm.totalCost}</div>
                <span className="text-[10px] text-gray-400">for {selectedRequest.duration || '15 Days'} complete setup</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCarePlan}
                disabled={actionLoading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Plan &amp; Proceed to Quote &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SEND QUOTE TO PATIENT */}
      {activeModal === 'sendQuote' && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Q-{selectedRequest.requestId}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Send Quote to Patient</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quotation Preview */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                <span className="font-bold text-gray-800">Service: {selectedRequest.careType}</span>
                <span className="font-black text-indigo-700 text-base">₹{carePlanForm.totalCost || 45000}</span>
              </div>
              <div className="space-y-1 text-gray-600">
                <p>• Patient: <strong>{selectedRequest.patientName}</strong> ({selectedRequest.phone})</p>
                <p>• Start Date: <strong>{selectedRequest.startDate}</strong></p>
                <p>• Duration: <strong>{selectedRequest.duration || '15 Days'}</strong></p>
                <p>• Includes: 24/7 Nursing, ICU Bed, Patient Monitor, Doctor Consultations</p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              When you click send, an automated WhatsApp quote and email proposal will be dispatched to the patient.
            </p>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuote}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Quote to Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: STAFF & EQUIPMENT ASSIGNMENT */}
      {activeModal === 'assignment' && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedRequest.requestId}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Assign ICU Team &amp; Equipment</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nursing Staff Assignment */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Primary ICU Nurse
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Select Verified Nurse</label>
                    <select
                      value={assignmentForm.nurseName}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, nurseName: e.target.value })}
                      className="w-full p-2 border rounded-xl bg-white font-medium"
                    >
                      <option value="Anjali Sharma">Anjali Sharma (ICU Nurse - 6 Yrs Exp)</option>
                      <option value="Pooja Sharma">Pooja Sharma (Staff Nurse - 4 Yrs Exp)</option>
                      <option value="Revi Singh">Revi Singh (Critical Care - 5 Yrs Exp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Shift Type</label>
                    <select
                      value={assignmentForm.nurseShift}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, nurseShift: e.target.value })}
                      className="w-full p-2 border rounded-xl bg-white font-medium"
                    >
                      <option value="24 Hours (Rotational)">24 Hours (Rotational)</option>
                      <option value="12 Hours Day">12 Hours Day</option>
                      <option value="12 Hours Night">12 Hours Night</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Doctor Assignment */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4 text-blue-600" /> Consulting Doctor / Intensivist
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Select Doctor</label>
                    <select
                      value={assignmentForm.doctorName}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, doctorName: e.target.value })}
                      className="w-full p-2 border rounded-xl bg-white font-medium"
                    >
                      <option value="Dr. R. Mehta">Dr. R. Mehta (MD, Intensivist / Physician)</option>
                      <option value="Dr. S. K. Verma">Dr. S. K. Verma (Critical Care Specialist)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Specialty</label>
                    <input
                      type="text"
                      value={assignmentForm.doctorSpecialty}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, doctorSpecialty: e.target.value })}
                      className="w-full p-2 border rounded-xl bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Equipment Items */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-gray-900 text-xs">Allocated Equipment Serials</h4>
                <div className="grid grid-cols-3 gap-2">
                  {assignmentForm.equipmentItems.map((eq, i) => (
                    <div key={i} className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                      <div className="font-bold text-gray-800">{eq.name}</div>
                      <div className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">{eq.modelSerial}</div>
                      <span className="text-[10px] text-gray-400">Status: {eq.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignments}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-2"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Confirm &amp; Dispatch Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Save({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
      <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
    </svg>
  );
}

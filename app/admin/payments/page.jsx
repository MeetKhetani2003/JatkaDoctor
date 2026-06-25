"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  Loader2, 
  ChevronDown, 
  FileDown, 
  ArrowRight, 
  CalendarDays,
  Smartphone,
  Building2,
  AlertCircle,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Activity,
  FileText,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = "/api/payments?";
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterMethod) url += `method=${filterMethod}&`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}&`;
      if (searchTerm) url += `search=${searchTerm}&`;

      const res = await fetch(url);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterMethod, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportCSV = () => {
    let url = `/api/admin/export?type=payments&`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    window.open(url, "_blank");
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="w-4 h-4 text-green-600" />;
      case "Net Banking":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-purple-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Refund Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900 font-sans tracking-tight">Payments Log</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-primary/20"
            >
              <FileDown className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, booking..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refund Pending">Refund Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Method Filter */}
          <div className="relative">
            <select
              value={filterMethod}
              onChange={e => setFilterMethod(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date range inputs */}
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0 mr-1.5" />
            <input
              type="date"
              placeholder="Start"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent outline-none w-full text-[10px]"
            />
          </div>

          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0 mr-1.5" />
            <input
              type="date"
              placeholder="End"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent outline-none w-full text-[10px]"
            />
          </div>

        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{payments.length} entries</span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs text-gray-500">Retrieving ledger details...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-20 text-center text-gray-400 space-y-2">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-200" />
            <p className="font-bold">No payments found</p>
            <p className="text-xs max-w-xs mx-auto">New transaction records will display here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full text-gray-500">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Processed Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr 
                    key={pay._id} 
                    className="hover:bg-gray-50/40 cursor-pointer transition-colors"
                    onClick={() => setSelectedPayment(pay)}
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">{pay.paymentId}</td>
                    <td className="px-6 py-4 text-gray-400 font-medium font-mono">{pay.transactionId || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-primary">{pay.bookingId}</td>
                    <td className="px-6 py-4 text-gray-900 font-black">₹{pay.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {getMethodIcon(pay.method)}
                        <span>{pay.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(pay.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(pay.status)}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-primary hover:text-white rounded-lg font-bold text-[10px] transition active:scale-95"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Payment Receipt</h3>
                  <p className="text-[10px] text-gray-400 font-mono">{selectedPayment.paymentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-600">
              
              {/* Transaction Summary */}
              <div className="bg-primary/[0.02] border border-primary/5 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Amount Paid</span>
                  <span className="text-base font-black text-gray-900">₹{selectedPayment.amount?.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Payment Method</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    {getMethodIcon(selectedPayment.method)}
                    {selectedPayment.method}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Transaction / Order ID</span>
                  <span className="font-mono text-gray-900 font-medium break-all block">{selectedPayment.transactionId || 'N/A'}</span>
                </div>
              </div>

              {selectedPayment.appointment ? (
                <>
                  {/* Customer / Patient Details */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <User className="w-4 h-4 text-primary" />
                      Patient & Customer Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Patient Name</span>
                        <span className="font-bold text-gray-900">{selectedPayment.appointment.patientName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Phone Number</span>
                        <a 
                          href={`tel:${selectedPayment.appointment.phone}`}
                          className="font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {selectedPayment.appointment.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Email Address</span>
                        {selectedPayment.appointment.email ? (
                          <a 
                            href={`mailto:${selectedPayment.appointment.email}`}
                            className="font-bold text-gray-900 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {selectedPayment.appointment.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>

                    {selectedPayment.appointment.patientAddress && (
                      <div className="pt-2">
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Patient Address</span>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-800">{selectedPayment.appointment.patientAddress}</span>
                            {selectedPayment.appointment.googleMapLocation && (
                              <a 
                                href={selectedPayment.appointment.googleMapLocation}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 ml-2 text-primary hover:underline font-bold text-[10px]"
                              >
                                View on Maps <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking & Service Info */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Service & Booking Information
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Booking ID</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold rounded font-mono text-[10px]">
                          {selectedPayment.appointment.bookingId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Service Type</span>
                        <span className="font-bold text-gray-900 capitalize">{selectedPayment.appointment.service || selectedPayment.appointment.category || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Priority Level</span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] border ${
                          selectedPayment.appointment.emergencyPriority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                          selectedPayment.appointment.emergencyPriority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          selectedPayment.appointment.emergencyPriority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {selectedPayment.appointment.emergencyPriority || 'Medium'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Appointment Schedule</span>
                        <span className="font-medium text-gray-900">
                          {selectedPayment.appointment.appointmentDate || selectedPayment.appointment.date || 'N/A'} at {selectedPayment.appointment.appointmentTime || selectedPayment.appointment.time || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {selectedPayment.appointment.patientCondition && (
                      <div className="pt-2">
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Patient Condition / Complaint</span>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-700 font-medium">
                          {selectedPayment.appointment.patientCondition}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Ledger */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Financial Ledger for {selectedPayment.appointment.bookingId}
                    </h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Total Charge</span>
                        <span className="text-sm font-black text-gray-900">₹{selectedPayment.appointment.totalAmount?.toLocaleString("en-IN") || 0}</span>
                      </div>
                      <div className="border-x border-gray-200">
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Advance Paid</span>
                        <span className="text-sm font-black text-green-600">₹{selectedPayment.appointment.advancePaid?.toLocaleString("en-IN") || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider">Balance Due</span>
                        <span className={`text-sm font-black ${selectedPayment.appointment.balanceDue > 0 ? 'text-rose-600' : 'text-green-600'}`}>
                          ₹{selectedPayment.appointment.balanceDue?.toLocaleString("en-IN") || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Booking Details Unlinked</h5>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      This payment record is not currently linked to an active booking profile (Booking ID: {selectedPayment.bookingId}). The booking might have been removed or archived.
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp info */}
              <div className="text-[10px] text-gray-400 text-right pt-2">
                Processed on: {new Date(selectedPayment.createdAt).toLocaleString("en-IN")}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

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
  AlertCircle
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50/20">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

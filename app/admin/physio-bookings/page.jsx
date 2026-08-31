"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Search, Loader2, CheckCircle, Clock, XCircle, MapPin, User, Calendar } from 'lucide-react';

export default function PhysioBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/physio-bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
    b.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.patientId?.mobile?.includes(search)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-primary" /> Physiotherapy Bookings
          </h1>
          <p className="text-gray-500 mt-1">Manage all home physiotherapy requests and packages.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Mobile..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Booking ID & Date</th>
                <th className="p-4 font-medium">Patient Info</th>
                <th className="p-4 font-medium">Service / Package</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{booking.bookingId}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" /> {booking.patientId?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{booking.patientId?.mobile || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{booking.packageId?.title || "Custom Trial"}</div>
                      <div className="text-xs text-gray-500 mt-1">{booking.departmentId?.name || "General Physiotherapy"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-900">₹{booking.totalAmount}</div>
                      <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 uppercase ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                        booking.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.paymentStatus}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:text-primary-dark text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
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
    </div>
  );
}

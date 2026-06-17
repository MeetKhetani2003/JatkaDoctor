"use client";

import React, { useState } from "react";
import { 
  Search, 
  Loader2, 
  History, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  Phone, 
  Mail, 
  Bookmark, 
  ShieldAlert, 
  Activity 
} from "lucide-react";

export default function PatientHistory() {
  const [phoneQuery, setPhoneQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phoneQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setError("");
    setPatientDetails(null);
    setBookings([]);
    setPayments([]);

    try {
      // Fetch bookings matching the phone number
      const apptRes = await fetch(`/api/appointments?search=${phoneQuery}`);
      if (!apptRes.ok) throw new Error("Failed to fetch patient history");
      
      const apptData = await apptRes.json();
      
      // Filter exactly by phone number (since search query matches regex)
      const exactBookings = apptData.filter(
        b => b.phone.replace(/[^0-9]/g, "").includes(phoneQuery.replace(/[^0-9]/g, ""))
      );

      if (exactBookings.length === 0) {
        setError(`No patient records found matching phone number: ${phoneQuery}`);
        setLoading(false);
        return;
      }

      // Pick patient details from first booking
      const details = {
        name: exactBookings[0].patientName,
        phone: exactBookings[0].phone,
        email: exactBookings[0].email,
        isRepeat: exactBookings.length > 1
      };
      setPatientDetails(details);
      setBookings(exactBookings);

      // Fetch all payments and filter those matching our bookings
      const payRes = await fetch("/api/payments");
      if (payRes.ok) {
        const payData = await payRes.json();
        const bookingIds = exactBookings.map(b => b.bookingId);
        const patientPayments = payData.filter(p => bookingIds.includes(p.bookingId));
        setPayments(patientPayments);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching patient history details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Assigned":
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Patient History Explorer</h1>
        <p className="text-gray-500 text-sm font-normal">Search patients by mobile number to review bookings, payments, and service history.</p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm max-w-xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Enter Patient Mobile Number (e.g. 8874744756)"
              value={phoneQuery}
              onChange={e => setPhoneQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </div>

      {/* Loading & Errors */}
      {loading && (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-500">Searching medical database...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 max-w-3xl">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Results</h3>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      )}

      {/* Main Results View */}
      {searched && !loading && patientDetails && (
        <div className="space-y-6">
          
          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{patientDetails.name}</h3>
                  
                  {/* Repeat Patient Flag (Phase 8) */}
                  {patientDetails.isRepeat ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200 animate-pulse">
                      ★ Repeat Patient
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                      New Patient
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {patientDetails.phone}</span>
                  {patientDetails.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {patientDetails.email}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 font-bold border-l md:border-l border-gray-100 pl-0 md:pl-6 pt-2 md:pt-0">
              <div className="text-center bg-gray-50 px-4 py-2 rounded-2xl">
                <p className="text-gray-400 text-[10px] uppercase">Bookings</p>
                <p className="text-lg font-black text-gray-800">{bookings.length}</p>
              </div>
              <div className="text-center bg-gray-50 px-4 py-2 rounded-2xl">
                <p className="text-gray-400 text-[10px] uppercase">Services Used</p>
                <p className="text-lg font-black text-primary">
                  {new Set(bookings.map(b => b.category || b.service)).size}
                </p>
              </div>
              <div className="text-center bg-gray-50 px-4 py-2 rounded-2xl">
                <p className="text-gray-400 text-[10px] uppercase">Payments</p>
                <p className="text-lg font-black text-green-600">
                  ₹{payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Bookings list */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Service Booking History
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-500">
                    <thead className="text-[10px] text-gray-400 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Booking ID</th>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Consultant</th>
                        <th className="px-4 py-3">Booking Status</th>
                        <th className="px-4 py-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3.5 font-bold text-primary">{booking.bookingId}</td>
                          <td className="px-4 py-3.5 font-medium text-gray-900">
                            {booking.category || booking.service}
                            {booking.package && <span className="block text-[10px] text-gray-400 font-normal">{booking.package}</span>}
                          </td>
                          <td className="px-4 py-3.5 font-medium">
                            {booking.appointmentDate}
                            <span className="block text-[10px] text-gray-400 font-normal">{booking.appointmentTime}</span>
                          </td>
                          <td className="px-4 py-3.5 font-medium">{booking.doctor || 'Any Available'}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(booking.bookingStatus || booking.status)}`}>
                              {booking.bookingStatus || booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              booking.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {booking.paymentStatus || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Payments details */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Transaction Log
                </h4>

                {payments.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No payment logs recorded.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment._id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-800">{payment.paymentId}</p>
                          <p className="text-[10px] text-gray-400">Via {payment.method} · {new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-black text-gray-900">₹{payment.amount.toLocaleString("en-IN")}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                            payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Frequency Summary */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Treatment Frequency
                </h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(
                    bookings.reduce((acc, curr) => {
                      const sName = curr.category || curr.service || "General Consultation";
                      acc[sName] = (acc[sName] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([service, count]) => (
                    <div key={service} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-b-0">
                      <span className="text-gray-600 font-medium">{service}</span>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-bold">{count} visit{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { Search, Loader2, Calendar, Phone, Activity, Clock, ShieldCheck, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || "";
  
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  
  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const fetchBooking = async (e) => {
    if (e) e.preventDefault();
    if (!bookingId) return;

    setLoading(true);
    setError("");
    setBooking(null);
    setCancelSuccess(false);

    try {
      const res = await fetch(`/api/track?bookingId=${bookingId}`);
      const data = await res.json();
      
      if (res.ok) {
        setBooking(data.appointment);
      } else {
        setError(data.error || "Booking not found. Please check your Booking ID.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setCancelLoading(true);
    setError("");

    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.bookingId, reason: cancelReason })
      });
      const data = await res.json();

      if (res.ok) {
        setCancelSuccess(true);
        setShowCancelModal(false);
        // Refresh booking details
        fetchBooking();
      } else {
        setError(data.error || "Failed to submit cancellation request");
      }
    } catch (err) {
      setError("Error submitting cancellation request.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Assigned":
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track Your Booking</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter your Booking ID to check real-time status, assigned medical staff, and manage your request.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <form onSubmit={fetchBooking} className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="e.g. BK-12345678"
              required
              className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-lg tracking-wider uppercase font-bold text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Alert for Cancellation */}
        {cancelSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Cancellation Request Submitted</p>
              <p className="text-xs mt-1">Our support team will process your refund (if applicable) manually.</p>
            </div>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            
            <div className="bg-primary p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-primary-light text-xs font-bold uppercase tracking-widest mb-1 block">Booking Summary</span>
                <h2 className="text-2xl font-black">{booking.patientName}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-white ${getStatusColor(booking.bookingStatus || booking.status).replace('bg-', 'text-').replace('text-', 'text-').split(' ')[1]}`}>
                {booking.bookingStatus || booking.status}
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Activity className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Service Required</p>
                    <p className="font-bold text-gray-900">{booking.service || booking.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Appointment Date & Time</p>
                    <p className="font-bold text-gray-900">{booking.appointmentDate || "Not Set"} at {booking.appointmentTime || "Not Set"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Payment Status</p>
                    <p className="font-bold text-gray-900">{booking.paymentStatus || "Pending"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Registered Phone</p>
                    <p className="font-bold text-gray-900">{booking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Assigned Staff Block */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" /> Medical Staff Assigned
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Doctor</span>
                    <span className="font-bold text-gray-900">{booking.doctorAssigned || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Physiotherapist</span>
                    <span className="font-bold text-gray-900">{booking.physiotherapistAssigned || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Nurse</span>
                    <span className="font-bold text-gray-900">{booking.nurseAssigned || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Ambulance</span>
                    <span className="font-bold text-gray-900">{booking.ambulanceAssigned || "Pending"}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Area */}
              {booking.bookingStatus !== 'Cancelled' && booking.status !== 'Cancelled' && (
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Cancel this Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking</h3>
            <p className="text-sm text-gray-500 mb-6">
              Please provide a reason for cancelling your booking. Refunds are manually processed by our team and may take a few days.
            </p>

            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Reason for Cancellation <span className="text-red-500">*</span></label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  placeholder="Tell us why you are cancelling..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:scale-95 transition"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={cancelLoading || !cancelReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 transition hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>}>
      <TrackContent />
    </Suspense>
  );
}

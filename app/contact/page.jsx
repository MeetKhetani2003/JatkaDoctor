"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { Phone, MessageCircle, MapPin, Search, Loader2, UploadCloud, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import BookingForm from "@/components/BookingForm";

export default function ContactPage() {
  const phone = "8874744756";
  const [activeTab, setActiveTab] = useState("inquiry"); // 'inquiry' | 'cancel'

  // Cancellation State
  const [bookingId, setBookingId] = useState("");
  const [bookingFound, setBookingFound] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [reason, setReason] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [refundMethod, setRefundMethod] = useState("UPI"); // 'UPI' | 'Bank Transfer'
  const [upiDetails, setUpiDetails] = useState({ upiId: "" });
  const [bankDetails, setBankDetails] = useState({
    accountName: "", accountNumber: "", bankName: "", branchName: "", ifsc: "", email: "", phone: ""
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSearchBooking = async (e) => {
    e.preventDefault();
    if (!bookingId) return;
    setSearchLoading(true);
    setSearchError("");
    setBookingFound(null);

    try {
      const res = await fetch(`/api/track?bookingId=${bookingId}`);
      const data = await res.json();
      if (res.ok) {
        if (data.appointment.bookingStatus === 'Cancelled' || data.appointment.status === 'Cancelled') {
          setSearchError("This booking is already cancelled.");
        } else {
          setBookingFound(data.appointment);
        }
      } else {
        setSearchError(data.error || "Booking not found.");
      }
    } catch (err) {
      setSearchError("Network error.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const openPreview = (e) => {
    e.preventDefault();
    if (!reason || !screenshot) {
      alert("Please provide a reason and attach a payment screenshot.");
      return;
    }
    if (refundMethod === "UPI" && !upiDetails.upiId) {
      alert("Please enter a valid UPI ID.");
      return;
    }
    if (refundMethod === "Bank Transfer") {
      const { accountName, accountNumber, bankName, branchName, ifsc, email, phone } = bankDetails;
      if (!accountName || !accountNumber || !bankName || !branchName || !ifsc || !email || !phone) {
        alert("Please fill all bank details.");
        return;
      }
    }
    setShowPreviewModal(true);
  };

  const handleSubmitCancel = async () => {
    setSubmitLoading(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("bookingId", bookingFound.bookingId);
      formData.append("reason", reason);
      formData.append("refundMethod", refundMethod);
      formData.append("screenshot", screenshot);

      const refundData = refundMethod === "UPI" ? upiDetails : bankDetails;
      formData.append("refundDetails", JSON.stringify(refundData));

      const res = await fetch('/api/cancel', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setShowPreviewModal(false);
      } else {
        setSubmitError(data.error || "Failed to submit cancellation request");
        setShowPreviewModal(false);
      }
    } catch (err) {
      setSubmitError("Network error. Please try again.");
      setShowPreviewModal(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-20">
        <h1 className="text-3xl font-normal text-black tracking-tight mb-8">Contact Us & Support</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-100 pb-2">
          <button
            onClick={() => setActiveTab("inquiry")}
            className={`pb-2 px-2 text-sm font-bold border-b-2 transition ${activeTab === "inquiry" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            General Inquiry
          </button>
          <button
            onClick={() => setActiveTab("cancel")}
            className={`pb-2 px-2 text-sm font-bold border-b-2 transition ${activeTab === "cancel" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            Cancellation & Refunds
          </button>
        </div>

        {activeTab === "inquiry" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-normal text-black tracking-tight mb-4">Get in Touch</h2>
                <p className="text-gray-500 font-normal">We are available 24/7 for medical emergencies and inquiries.</p>
              </div>
              
              <div className="space-y-4">
                <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary/30 transition shadow-sm">
                  <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-normal">Call Us Anytime</p>
                    <p className="text-base font-normal text-black tracking-tight">+91 {phone}</p>
                  </div>
                </a>
                
                <a href={`https://wa.me/91${phone}`} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary/30 transition shadow-sm">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-normal">WhatsApp Enquiry</p>
                    <p className="text-base font-normal text-black tracking-tight">Chat with our team</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-normal">Service Area</p>
                    <p className="text-base font-normal text-black tracking-tight">All areas of Lucknow, UP</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
              <BookingForm 
                title="Inquiry Form" 
                subtitle="Get a response within minutes"
              />
            </div>
          </div>
        )}

        {activeTab === "cancel" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">Cancellation Request Submitted!</h3>
                <p className="text-sm text-gray-600">Your request is under review. Our admins will verify the payment screenshot and process your refund within 2-3 business days.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 mt-4 bg-green-100 text-green-800 font-bold rounded-xl active:scale-95 transition">Submit Another Request</button>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Request Cancellation</h2>
                  <p className="text-sm text-gray-500">Search your booking and fill out the form to request a manual refund.</p>
                </div>

                {!bookingFound && (
                  <form onSubmit={handleSearchBooking} className="flex gap-2">
                    <input
                      type="text"
                      value={bookingId}
                      onChange={e => setBookingId(e.target.value)}
                      placeholder="Enter Booking ID (e.g. BK-1234)"
                      required
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary text-sm uppercase tracking-wider font-bold"
                    />
                    <button
                      type="submit"
                      disabled={searchLoading}
                      className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-2"
                    >
                      {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Search
                    </button>
                  </form>
                )}

                {searchError && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {searchError}
                  </div>
                )}

                {submitError && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {submitError}
                  </div>
                )}

                {bookingFound && (
                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Found Booking</p>
                        <p className="font-bold text-gray-900">{bookingFound.patientName}</p>
                        <p className="text-xs text-gray-500">{bookingFound.service || bookingFound.category}</p>
                      </div>
                      <button onClick={() => setBookingFound(null)} className="text-xs text-primary font-bold hover:underline">Change</button>
                    </div>

                    <form onSubmit={openPreview} className="space-y-6">
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Reason for Cancellation *</label>
                        <textarea
                          required
                          value={reason}
                          onChange={e => setReason(e.target.value)}
                          placeholder="Tell us why..."
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary text-sm resize-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Attach Payment Screenshot *</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                          <input 
                            type="file" 
                            accept="image/*" 
                            required 
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <UploadCloud className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-bold text-gray-700">{screenshot ? screenshot.name : "Click or drag to upload image"}</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Refund Destination *</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRefundMethod("UPI")}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl border transition ${refundMethod === "UPI" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                          >
                            UPI Transfer
                          </button>
                          <button
                            type="button"
                            onClick={() => setRefundMethod("Bank Transfer")}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl border transition ${refundMethod === "Bank Transfer" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                          >
                            Bank Transfer
                          </button>
                        </div>
                      </div>

                      {/* UPI Form */}
                      {refundMethod === "UPI" && (
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Enter your UPI ID *</label>
                            <input
                              type="text"
                              value={upiDetails.upiId}
                              onChange={e => setUpiDetails({ upiId: e.target.value })}
                              placeholder="e.g. username@bank"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {/* Bank Form */}
                      {refundMethod === "Bank Transfer" && (
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Account Holder Name *</label>
                              <input type="text" value={bankDetails.accountName} onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Account Number *</label>
                              <input type="text" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Bank Name *</label>
                              <input type="text" value={bankDetails.bankName} onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Branch Name *</label>
                              <input type="text" value={bankDetails.branchName} onChange={e => setBankDetails({...bankDetails, branchName: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">IFSC Code *</label>
                              <input type="text" value={bankDetails.ifsc} onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Registered Phone *</label>
                              <input type="text" value={bankDetails.phone} onChange={e => setBankDetails({...bankDetails, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
                              <input type="email" value={bankDetails.email} onChange={e => setBankDetails({...bankDetails, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition active:scale-95"
                      >
                        Review & Send Request
                      </button>

                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Confirm Details
            </h3>
            
            <div className="space-y-4 text-sm text-gray-700 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p><strong>Booking ID:</strong> {bookingFound?.bookingId}</p>
              <p><strong>Method:</strong> {refundMethod}</p>
              
              <div className="pt-2 border-t border-gray-200">
                {refundMethod === "UPI" ? (
                  <p className="text-lg font-mono font-bold text-primary break-all">{upiDetails.upiId}</p>
                ) : (
                  <div className="space-y-1">
                    <p><strong>A/C Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>A/C No:</strong> <span className="font-mono font-bold">{bankDetails.accountNumber}</span></p>
                    <p><strong>IFSC:</strong> {bankDetails.ifsc}</p>
                    <p><strong>Bank:</strong> {bankDetails.bankName} ({bankDetails.branchName})</p>
                    <p><strong>Phone:</strong> {bankDetails.phone}</p>
                    <p><strong>Email:</strong> {bankDetails.email}</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-red-500 font-bold mt-4 mb-6">
              ⚠️ Please verify your details carefully. Funds sent to incorrect accounts cannot be recovered.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                disabled={submitLoading}
                className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:scale-95 transition"
              >
                Edit Details
              </button>
              <button
                onClick={handleSubmitCancel}
                disabled={submitLoading}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <StickyBottomBar />
    </main>
  );
}

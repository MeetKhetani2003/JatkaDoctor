"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Mail, MessageSquare, ArrowRight, Phone } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("amount");
  const method = searchParams.get("method");
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-lg border border-green-100 text-center space-y-6">
        
        {/* Checkmark */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-primary">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Booking Payment Successful!</h1>
          <p className="text-sm text-gray-500">
            Thank you! Your transaction has been completed, and your booking is confirmed.
          </p>
        </div>

        {/* Invoice Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Booking ID</span>
            <span className="text-gray-900 font-bold text-primary">{bookingId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Payment ID</span>
            <span className="text-gray-900 font-bold">{paymentId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Amount Paid</span>
            <span className="text-gray-900 font-bold">₹{Number(amount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Payment Method</span>
            <span className="text-gray-900 font-bold">{method}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Status</span>
            <span className="text-green-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Successful
            </span>
          </div>
        </div>

        {/* Action Notices */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 font-medium pt-2">
          <div className="flex items-center gap-2 bg-primary-soft p-3 rounded-xl border border-primary/10">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="text-left leading-tight">Email Receipt Sent with PDF Invoice</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50/50 p-3 rounded-xl border border-green-200/50">
            <MessageSquare className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-left leading-tight">WhatsApp Booking Confirmed</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Link 
            href={`/track?bookingId=${bookingId}`}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2"
          >
            Track / Manage Booking <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/"
            className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm border border-gray-200"
          >
            Return to Homepage
          </Link>
          <a
            href="tel:8874744756"
            className="w-full py-3 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm mt-2 border border-gray-100"
          >
            <Phone className="w-4 h-4 text-primary" /> Contact Care Coordinator
          </a>
        </div>

      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <CheckCircle className="w-12 h-12 text-primary animate-pulse" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

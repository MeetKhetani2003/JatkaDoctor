"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CreditCard, 
  Loader2, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError("No Booking ID provided in URL.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`/api/appointments?search=${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking details");
        
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const appt = data[0];
          setBooking(appt);
          
          // Determine price dynamically based on package or category
          let calculatedPrice = 500; // default general fee
          if (appt.package) {
            try {
              const packRes = await fetch("/api/service-packages");
              const packages = await packRes.json();
              const matchedPack = packages.find(p => p.title === appt.package || p.name === appt.package);
              if (matchedPack && matchedPack.price) {
                calculatedPrice = matchedPack.price;
              }
            } catch (e) {
              console.error("Failed to fetch package price:", e);
            }
          } else {
            // Service category fallbacks
            const service = (appt.category || appt.service || "").toLowerCase();
            if (service.includes("ambulance")) calculatedPrice = 1500;
            else if (service.includes("physio")) calculatedPrice = 800;
            else if (service.includes("doctor")) calculatedPrice = 1000;
            else if (service.includes("icu")) calculatedPrice = 5000;
            else if (service.includes("nurse") || service.includes("care")) calculatedPrice = 1200;
            else if (service.includes("lab")) calculatedPrice = 600;
          }
          setAmount(calculatedPrice);
        } else {
          setError(`No booking found matching ID: ${bookingId}`);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading payment booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Load Razorpay Script Helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    setError("");

    try {
      // 1. Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay SDK. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      // 2. Create Razorpay Order on backend
      const orderRes = await fetch("/api/payments/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, amount })
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        setError(orderData.error || "Failed to initialize order on payment server.");
        setProcessing(false);
        return;
      }

      // 3. Configure Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dr Jhatka Medicare",
        description: `Healthcare payment for Booking ID ${bookingId}`,
        image: "/Dr.Jhatka.png",
        order_id: orderData.id,
        handler: async function (response) {
          setProcessing(true);
          try {
            // 4. Verify Signature on backend
            const verifyRes = await fetch("/api/payments/razorpay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId,
                amount,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            if (verifyRes.ok) {
              router.push(`/payment/success?bookingId=${bookingId}&amount=${amount}&method=Razorpay&paymentId=${response.razorpay_payment_id}`);
            } else {
              const verifyData = await verifyRes.json();
              setError(verifyData.error || "Payment signature verification failed.");
              setProcessing(false);
            }
          } catch (verifyError) {
            console.error(verifyError);
            setError("Network error verifying signature.");
            setProcessing(false);
          }
        },
        prefill: {
          name: booking?.patientName || "",
          email: booking?.email || "",
          contact: booking?.phone || "",
        },
        theme: {
          color: "#0F9D58", // Dr Jhatka Green
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", async function (response) {
        console.error("Razorpay failure response:", response.error);
        
        // Log failure to db
        await fetch("/api/payments/razorpay-fail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            amount,
            error: response.error
          })
        });

        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during checkout initialization.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900">Loading Checkout...</h2>
          <p className="text-sm text-gray-500">Retrieving secure booking invoice details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-red-100 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Checkout Error</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-2xl transition hover:bg-primary-dark">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Initiate Payment */}
        <div className="md:col-span-7 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Transaction Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Secure Payment Gateway</h2>
              <p className="text-sm text-gray-500">
                You will be redirected to the secure Razorpay popup to pay via UPI, Card, Net Banking, or Wallet.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Paying to</span>
                <span className="text-gray-900 font-bold">Dr Jhatka Medicare Pvt Ltd</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Description</span>
                <span className="text-gray-900 font-bold">Booking Reference {bookingId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Intended Patient</span>
                <span className="text-gray-900 font-bold">{booking?.patientName}</span>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={processing}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-base shadow-lg shadow-primary/20"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting to Razorpay...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{amount.toLocaleString("en-IN")} via Razorpay
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>SSL Secured Checkout | Razorpay Integrated Solution</span>
          </div>

        </div>

        {/* Right Column: Summary Card */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24 space-y-5">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Booking Summary</h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Patient Name</span>
                <span className="text-gray-900 font-bold">{booking?.patientName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Booking ID</span>
                <span className="text-gray-900 font-bold text-primary">{booking?.bookingId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Service Requested</span>
                <span className="text-gray-900 font-bold">{booking?.category || booking?.service}</span>
              </div>
              {booking?.package && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Package</span>
                  <span className="text-gray-900 font-bold">{booking?.package}</span>
                </div>
              )}
              {booking?.doctor && booking.doctor !== "Any Available" && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Preferred Consultant</span>
                  <span className="text-gray-900 font-bold">{booking?.doctor}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Date & Time</span>
                <span className="text-gray-900 font-bold">{booking?.appointmentDate} @ {booking?.appointmentTime}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Consultation / Service Charge</span>
                <span className="text-gray-900 font-medium">₹{amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Tax & Surcharge</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Payable</span>
                <span className="text-xl font-black text-primary">₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">Need assistance?</p>
                <p className="text-[10px] text-gray-500">Call our care support: 8874744756</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

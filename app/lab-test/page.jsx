"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronLeft,
  FlaskConical,
  Droplets,
  Heart,
  Activity,
  Baby,
  Bone,
  Microscope,
  CheckCircle2,
  Clock,
  Shield,
  Home,
  ChevronDown,
  Star,
} from "lucide-react";
import Link from "next/link";

const phone = "8707790677";

const tests = [
  {
    name: "Complete Blood Count (CBC)",
    price: "₹350",
    icon: Droplets,
    time: "Same Day",
  },
  {
    name: "Blood Sugar (Fasting/PP)",
    price: "₹150",
    icon: Activity,
    time: "Same Day",
  },
  {
    name: "Thyroid Profile (T3/T4/TSH)",
    price: "₹650",
    icon: Heart,
    time: "24 Hours",
  },
  {
    name: "Lipid Profile",
    price: "₹550",
    icon: FlaskConical,
    time: "Same Day",
  },
  {
    name: "Liver Function Test (LFT)",
    price: "₹700",
    icon: Shield,
    time: "Same Day",
  },
  {
    name: "Kidney Function Test (KFT)",
    price: "₹650",
    icon: Activity,
    time: "Same Day",
  },
  { name: "Vitamin D & B12", price: "₹1,200", icon: Sun, time: "48 Hours" },
  {
    name: "Urine Routine",
    price: "₹200",
    icon: FlaskConical,
    time: "Same Day",
  },
  { name: "HbA1c (Diabetes)", price: "₹450", icon: Activity, time: "Same Day" },
  { name: "Pregnancy Test", price: "₹300", icon: Baby, time: "Same Day" },
  { name: "Calcium & Uric Acid", price: "₹400", icon: Bone, time: "Same Day" },
  {
    name: "COVID-19 RT-PCR",
    price: "₹800",
    icon: Microscope,
    time: "24 Hours",
  },
];

const packages = [
  {
    name: "Basic Health",
    price: "₹999",
    tests: ["CBC", "Blood Sugar", "Urine Routine", "Thyroid TSH"],
    popular: false,
  },
  {
    name: "Full Body",
    price: "₹2,499",
    tests: ["CBC", "LFT", "KFT", "Lipid", "Thyroid", "Vitamin D/B12", "HbA1c"],
    popular: true,
  },
  {
    name: "Diabetes Care",
    price: "₹1,499",
    tests: ["FBS/PPBS", "HbA1c", "Lipid Profile", "Microalbumin", "KFT"],
    popular: false,
  },
];

function Sun(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export default function LabTestsPage() {
  const [selectedPackage, setSelectedPackage] = useState(0);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <span className="font-bold text-gray-900">Lab Test at Home</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phone}`}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="mt-14 relative w-full h-[280px] bg-primary-soft">
        <Image
          src="/banner-labtest.jpg"
          alt="Lab Test at Home"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-5 max-w-xl">
          <h1 className="text-white text-3xl font-bold">Lab Test at Home</h1>
          <p className="text-white/90 text-sm mt-2">
            Book blood tests and diagnostics from home with safe sample
            collection.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href={`tel:${phone}`}
              className="bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/91${phone}`}
              className="bg-primary-dark text-white border border-white/30 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="px-4 pt-6 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Tests</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tests.slice(0, 8).map((test, i) => {
            const Icon = test.icon;
            return (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {test.name}
                </h3>
                <p className="text-sm font-bold text-primary mt-2">
                  {test.price}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {test.time}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 pt-8 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Health Packages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPackage(i)}
              className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                selectedPackage === i
                  ? "border-primary bg-primary-soft"
                  : "border-gray-100 bg-white hover:border-primary/30"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-base font-bold text-gray-900 text-center">
                {pkg.name}
              </h3>
              <div className="text-center mt-2">
                <span className="text-3xl font-bold text-primary">
                  {pkg.price}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {pkg.tests.map((t, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />{" "}
                    {t}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl text-sm font-bold active:scale-95 transition">
                Book Package
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Home Collection */}
      <section className="px-4 pt-8 max-w-7xl mx-auto">
        <div className="bg-primary-soft rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Free Home Sample Collection
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Our certified phlebotomist will visit your home for sample
              collection. Reports delivered via WhatsApp/Email within 24-48
              hours.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white text-primary px-3 py-1 rounded-full font-medium">
                NABL Certified
              </span>
              <span className="text-xs bg-white text-primary px-3 py-1 rounded-full font-medium">
                Doctor Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* All Tests List */}
      <section className="px-4 pt-8 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          All Available Tests
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {tests.map((test, i) => {
            const Icon = test.icon;
            return (
              <div
                key={test.name}
                className={`flex items-center justify-between p-4 ${i !== tests.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {test.name}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {test.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{test.price}</p>
                  <button className="text-[11px] text-primary font-bold mt-0.5">
                    Book →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 pt-8 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          What Our Patients Say
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            "Very professional sample collection. Got my reports within 12 hours
            on WhatsApp. Highly recommended!"
          </p>
          <p className="text-xs text-gray-500 mt-3 font-medium">
            — Priya Sharma, Gomti Nagar
          </p>
        </div>
      </section>

      {/* UPI Payment */}
      <section className="px-4 pt-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-900">Payment Options</h3>
          <p className="text-sm text-gray-600 mt-1">
            Pay via UPI or Cash after sample collection
          </p>
          <div className="mt-3 p-3 bg-gray-50 rounded-xl inline-block">
            <p className="text-xs text-gray-500">UPI ID</p>
            <p className="text-sm font-bold text-primary">drjhatka@upi</p>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Scan QR code available with our collector
          </p>
        </div>
      </section>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary sm:hidden">
        <div className="flex items-center">
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm"
          >
            <Phone className="w-5 h-5" />
            <div className="text-left leading-tight">
              <div className="text-[10px] opacity-90">Book Test</div>
              <div>Call Now</div>
            </div>
          </a>
          <div className="w-px h-8 bg-white/20" />
          <a
            href={`https://wa.me/91${phone}`}
            className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <div className="text-left leading-tight">
              <div className="text-[10px] opacity-90">Chat</div>
              <div>WhatsApp</div>
            </div>
          </a>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-primary" />
      </div>
    </main>
  );
}

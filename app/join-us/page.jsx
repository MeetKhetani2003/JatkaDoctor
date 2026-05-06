"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  UserPlus,
  Stethoscope,
  Ambulance,
  Users,
  Building2,
  Phone,
  MessageCircle,
  CheckCircle2,
  Upload,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import StickyBottomBar from "@/components/StickyBottomBar";

const phone = "8707790677";

const categories = [
  {
    id: "doctor",
    name: "Doctor",
    icon: Stethoscope,
    desc: "Register as a visiting doctor",
  },
  {
    id: "ambulance",
    name: "Ambulance Driver",
    icon: Ambulance,
    desc: "Join our emergency fleet",
  },
  {
    id: "staff",
    name: "Medical Staff",
    icon: Users,
    desc: "Nurses, paramedics, caregivers",
  },
  {
    id: "clinic",
    name: "Clinic / Hospital",
    icon: Building2,
    desc: "Partner with us",
  },
];

export default function JoinUsPage() {
  const [selected, setSelected] = useState("doctor");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Application Submitted!
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Our team will review and contact you within 24 hours.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold"
          >
            Back to Home
          </Link>
        </motion.div>
      </main>
    );
  }

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
            <span className="font-bold text-gray-900">Join Our Team</span>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="mt-14 bg-primary-soft px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Join Dr. Jhatka Medicare
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Be part of Lucknow's fastest growing healthcare network
          </p>
        </div>
      </section>

      {/* Category Selection */}
      <section className="px-4 pt-6 max-w-7xl mx-auto">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Select Category
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary-soft"
                    : "border-gray-100 bg-white hover:border-primary/20"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-primary" : "text-gray-400"}`}
                />
                <p
                  className={`text-sm font-bold mt-2 ${isActive ? "text-primary" : "text-gray-900"}`}
                >
                  {cat.name}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{cat.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section className="px-4 pt-6 max-w-7xl mx-auto">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Your Details
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />

          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none text-gray-700">
              <option>Years of Experience</option>
              <option>0-2 Years</option>
              <option>2-5 Years</option>
              <option>5-10 Years</option>
              <option>10+ Years</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <input
            type="text"
            placeholder="City / Location"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />

          <textarea
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />

          {/* Document Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/30 transition cursor-pointer">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">
              Upload CV / Certificate
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              PDF, JPG up to 5MB
            </p>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              required
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              I confirm all information is accurate and agree to verification by
              Dr. Jhatka Medicare team.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3.5 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary-dark mt-2"
          >
            Submit Application
          </button>
        </form>
      </section>

      {/* Contact */}
      <section className="px-4 pt-6 pb-8 max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-500">Questions? Contact us directly</p>
        <div className="flex justify-center gap-3 mt-3">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold animate-pulse-red"
          >
            <Phone className="w-4 h-4" /> {phone}
          </a>
        </div>
      </section>

      <StickyBottomBar phone={phone} />
    </main>
  );
}

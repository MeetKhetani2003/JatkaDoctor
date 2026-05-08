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
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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
          onSubmit={async (e) => {
            e.preventDefault();
            const target = e.target;
            const data = new FormData();
            data.append('name', `${target.firstName.value} ${target.lastName.value}`);
            data.append('phone', target.phone.value);
            data.append('email', target.email.value);
            data.append('experience', target.experience.value);
            data.append('location', target.location.value);
            data.append('bio', target.bio.value);
            data.append('type', categories.find(c => c.id === selected)?.name || "General Partner");
            
            if (selectedFile) {
              data.append('idFile', selectedFile);
            }

            try {
              const res = await fetch('/api/partners', {
                method: 'POST',
                body: data
              });
              if (res.ok) setSubmitted(true);
            } catch (err) {
              alert("Error submitting application");
            }
          }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />

          <div className="relative">
            <select name="experience" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none text-gray-700">
              <option>Years of Experience</option>
              <option>0-2 Years</option>
              <option>2-5 Years</option>
              <option>5-10 Years</option>
              <option>10+ Years</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <input
            name="location"
            type="text"
            placeholder="City / Location"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />

          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />

          {/* Document Upload */}
          <div className="relative group">
            <input 
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition ${selectedFile ? 'bg-primary/5 border-primary/30' : 'border-gray-200 bg-gray-50 hover:border-primary/30'}`}>
              <Upload className={`w-6 h-6 mx-auto mb-2 ${selectedFile ? 'text-primary' : 'text-gray-400'}`} />
              <p className="text-xs text-gray-500 font-medium">
                {selectedFile ? selectedFile.name : 'Upload CV / Certificate'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                PDF, JPG up to 5MB
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-4 mb-2">
            <input
              type="checkbox"
              id="terms-join"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              required
            />
            <label htmlFor="terms-join" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
              I agree to the <Link href="/policies/terms-and-conditions" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="/policies/partner-registration-policy" className="text-primary hover:underline">Partner Policy</Link>. I understand that my details will be verified by Dr Jhatka Medicare.
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

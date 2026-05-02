"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";
import { ShieldCheck, Clock, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-20">
        <h1 className="text-3xl font-normal text-black tracking-tight mb-8">About Dr. Jhatka Medicare</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed font-normal">
              Dr. Jhatka Medicare is Lucknow's leading home healthcare provider, dedicated to bringing hospital-level care to the comfort of your home. We understand that recovery is faster and more comfortable in a familiar environment.
            </p>
            <p className="text-gray-600 leading-relaxed font-normal">
              Our team consists of qualified doctors, ICU-trained nurses, expert physiotherapists, and compassionate caregivers who work tirelessly to ensure the highest standards of medical care.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex flex-col items-center p-6 bg-primary-soft rounded-3xl text-center">
                <ShieldCheck className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-normal text-black">100%</span>
                <span className="text-xs text-gray-500 font-normal">Verified Staff</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-primary-soft rounded-3xl text-center">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-normal text-black">24/7</span>
                <span className="text-xs text-gray-500 font-normal">Available</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 flex flex-col justify-center">
            <h2 className="text-xl font-normal text-black tracking-tight mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed font-normal italic">
              "To make quality healthcare accessible, affordable, and comfortable for every family in Lucknow by providing professional medical services right at their doorstep."
            </p>
          </div>
        </div>
      </div>
      <StickyBottomBar />
    </main>
  );
}

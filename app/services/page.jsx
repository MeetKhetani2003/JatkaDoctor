"use client";

import Header from "@/components/Header";
import ServicesGrid from "@/components/ServiceGrid";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="py-20">
        <ServicesGrid />
      </div>
      <StickyBottomBar />
    </main>
  );
}

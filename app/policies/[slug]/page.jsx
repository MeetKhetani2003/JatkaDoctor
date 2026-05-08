"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, Calendar, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { policies } from "../policyData";

// Note: generateStaticParams must be used in a Server Component. 
// Since this is a Client Component (due to motion and params hooks), 
// we will keep it simple for now, or wrap it if needed.
// However, in Next.js App Router, [slug] works fine as is.

export default function PolicyPage() {
  const { slug } = useParams();
  const policy = policies[slug];

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#0a140f] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Policy Not Found</h1>
        <p className="text-gray-400 mb-8">The policy you are looking for does not exist or has been moved.</p>
        <Link 
          href="/"
          className="px-8 py-3 bg-[#0F9D58] text-white rounded-full font-bold hover:bg-[#0c8a4d] transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
      {/* HEADER */}
      <div className="bg-[#111111] bg-gradient-to-r from-[#111111] to-[#0a140f] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#0F9D58] text-sm font-bold mb-6 hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} />
            BACK TO HOME
          </Link>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight"
          >
            {policy.title}
          </motion.h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#0F9D58]" />
              <span>Effective Date: {policy.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#0F9D58]" />
              <span>Verified Legal Document</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 md:p-12 border border-gray-100">
          <div className="prose prose-slate max-w-none">
            {policy.sections.map((section, idx) => (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={idx} 
                className="mb-12 last:mb-0"
              >
                <h2 className="text-xl font-bold text-[#111111] border-l-4 border-[#0F9D58] pl-4 mb-6 uppercase tracking-tight">
                  {section.title}
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px] md:text-base">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CONTACT BOX */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="bg-[#f8fdfa] border border-[#0F9D58]/10 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-[#111111] mb-4">Need Clarification?</h3>
              <p className="text-gray-600 text-sm mb-6">
                If you have any questions regarding our policies, please contact our legal department.
              </p>
              <div className="flex flex-wrap gap-4 md:gap-8">
                <a href="mailto:drjhatkamedicare@gmail.com" className="flex items-center gap-3 text-[#111111] font-bold text-sm hover:text-[#0F9D58] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0F9D58]">
                    <Mail size={18} />
                  </div>
                  drjhatkamedicare@gmail.com
                </a>
                <a href="tel:8874744756" className="flex items-center gap-3 text-[#111111] font-bold text-sm hover:text-[#0F9D58] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0F9D58]">
                    <Phone size={18} />
                  </div>
                  8874744756
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-4xl mx-auto px-6 mt-12 text-center">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
          © 2026 Dr Jhatka Medicare Pvt Ltd • Lucknow, Uttar Pradesh, India
        </p>
      </div>
    </div>
  );
}

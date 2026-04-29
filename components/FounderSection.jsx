"use client";

import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  GraduationCap,
  Phone,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const phone = "8874744756";

export default function FounderSection() {
  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Our Leadership</h2>
        <div className="w-12 h-1 bg-primary mt-2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
      >
        <div className="flex flex-col md:flex-row">
          {/* IMAGE SIDE */}
          <div className="relative w-full md:w-80 h-80 md:h-auto shrink-0">
            <Image
              src="/leader.jpeg"
              alt="Founder"
              fill
              className="object-contain"
            />
          </div>

          {/* CONTENT SIDE */}
          <div className="p-8 md:p-12 flex-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Dr. Jhatka Medicare
              </h3>
              <p className="text-primary font-bold text-lg mt-1">
                Founder & CEO
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              With over 8+ years of experience in emergency healthcare services,
              our founder established Dr. Jhatka Medicare with a vision to make
              quality healthcare accessible to every home in Lucknow. Under his
              leadership, we have served 1000+ patients with a 99% satisfaction
              rate.
            </p>

            {/* HIGHLIGHTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-y border-gray-100 py-8">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-bold text-gray-900">8+ Years</p>
                  <p className="text-xs text-gray-500 uppercase">Experience</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Healthcare MBA
                  </p>
                  <p className="text-xs text-gray-500 uppercase">Education</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    ISO Certified
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    Quality Care
                  </p>
                </div>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href={`tel:${phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition active:scale-95"
              >
                <Phone className="w-5 h-5" />
                Consult Now
              </a>

              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-sm">
                  1000+ Successful Cases
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

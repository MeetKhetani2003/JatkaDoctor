"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Phone } from "lucide-react";
import Image from "next/image";

const phone = "8874744756";

export default function FounderSection() {
  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Leadership</h2>
        <p className="text-sm text-gray-500 mt-1">
          Meet the founder behind our mission
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* AVATAR */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-primary-soft shrink-0 mx-auto sm:mx-0">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
              alt="Founder"
              fill
              className="object-cover"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">
              Dr. Jhatka Medicare
            </h3>
            <p className="text-sm text-primary font-semibold">Founder & CEO</p>

            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              With over 8+ years of experience in emergency healthcare services,
              our founder established Dr. Jhatka Medicare with a vision to make
              quality healthcare accessible to every home in Lucknow. Under his
              leadership, we have served 1000+ patients with a 99% satisfaction
              rate.
            </p>

            <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> 8+ Years Exp.
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />{" "}
                Healthcare MBA
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Award className="w-3.5 h-3.5 text-primary" /> ISO Certified
              </span>
            </div>

            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 mt-5 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary-dark"
            >
              <Phone className="w-4 h-4" />
              Consult Now
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

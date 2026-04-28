"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ambulance,
  Activity,
  Stethoscope,
  Bed,
  Home,
  UserPlus,
  TestTube,
  Accessibility,
} from "lucide-react";

const services = [
  { title: "Ambulance\nService", icon: Ambulance, link: "/ambulance" },
  { title: "Physiotherapy\nat Home", icon: Activity, link: "/physiotherapy" },
  { title: "Doctor Visit\nat Home", icon: Stethoscope, link: "/doctor" },
  { title: "ICU\nat Home", icon: Bed, link: "/icu" },
  { title: "Home Care\nServices", icon: Home, link: "/home-care" },
  { title: "Nursing Care\nat Home", icon: UserPlus, link: "/nursing" },
  { title: "Lab Test\nat Home", icon: TestTube, link: "/lab-tests" },
  { title: "Equipment\nRental", icon: Accessibility, link: "/equipment" },
];

export default function ServicesGrid() {
  return (
    <section className="px-4 pt-6">
      {/* TITLE */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Our Services</h2>
        <Link
          href="/services"
          className="text-sm font-semibold text-emerald-600"
        >
          View all →
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-4 gap-3">
        {services.map((service, i) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={service.link}
                className="group flex flex-col items-center justify-center 
                rounded-2xl bg-white 
                h-[100px]
                shadow-[0_4px_14px_rgba(0,0,0,0.05)]
                active:scale-[0.96] transition"
              >
                {/* ICON */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>

                {/* TITLE */}
                <span className="mt-2 text-[11px] font-semibold text-gray-800 text-center leading-tight whitespace-pre-line">
                  {service.title}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

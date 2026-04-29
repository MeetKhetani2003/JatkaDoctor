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
  {
    title: "Ambulance\nService",
    icon: Ambulance,
    link: "/services/ambulance",
    desc: "24/7 Emergency",
  },
  {
    title: "Physiotherapy\nat Home",
    icon: Activity,
    link: "/services/physiotherapy",
    desc: "Expert Therapy",
  },
  {
    title: "Doctor Visit\nat Home",
    icon: Stethoscope,
    link: "/services/doctor",
    desc: "Qualified MDs",
  },
  {
    title: "ICU\nat Home",
    icon: Bed,
    link: "/services/icu",
    desc: "Critical Care",
  },
  {
    title: "Home Care\nServices",
    icon: Home,
    link: "/services/home-care",
    desc: "Full Support",
  },
  {
    title: "Nursing Care\nat Home",
    icon: UserPlus,
    link: "/services/nursing",
    desc: "Trained Staff",
  },
  {
    title: "Lab Test\nat Home",
    icon: TestTube,
    link: "/lab-test",
    desc: "NABL Certified",
  },
  {
    title: "Equipment\nRental",
    icon: Accessibility,
    link: "/services/equipment",
    desc: "Affordable Rent",
  },
];
export default function ServicesGrid() {
  return (
    <section className="px-4 pt-8 pb-2 max-w-7xl mx-auto">
      {/* TITLE */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Our Services</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Comprehensive home healthcare
          </p>
        </div>
        <Link
          href="/services"
          className="text-sm font-bold text-primary hover:text-primary-dark transition"
        >
          View all →
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {services.map((service, i) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={service.link}
                className="group flex flex-col items-center justify-center 
                rounded-2xl bg-white border border-gray-100
                h-[110px] sm:h-[120px]
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_24px_rgba(15,157,88,0.12)]
                hover:border-primary/20
                active:scale-[0.96] transition-all duration-300"
              >
                {/* ICON */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary-light group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                {/* TITLE */}
                <span className="mt-2 text-[11px] sm:text-xs font-bold text-gray-800 text-center leading-tight whitespace-pre-line">
                  {service.title}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5 font-medium hidden sm:block">
                  {service.desc}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

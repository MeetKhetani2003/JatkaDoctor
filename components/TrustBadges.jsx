"use client";

import { motion } from "framer-motion";

const badges = [
  {
    name: "ISO 9001:2015",
    desc: "Certified Quality",
    // Official ISO Certification Seal
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/ISO_9001-2015_logo.svg/512px-ISO_9001-2015_logo.svg.png",
  },
  {
    name: "MSME Registered",
    desc: "Govt. of India",
    // Ministry of MSME Logo
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Logo_of_Ministry_of_Micro%2C_Small_and_Medium_Enterprises.svg/1200px-Logo_of_Ministry_of_Micro%2C_Small_and_Medium_Enterprises.svg.png",
  },
  {
    name: "Startup India",
    desc: "DPIIT Recognized",
    // Startup India Official Logo
    logo: "https://www.startupindia.gov.in/content/dam/invest-india/new_logo.png",
  },
  {
    name: "NABL Certified",
    desc: "Lab Standards",
    // NABL India Logo
    logo: "https://upload.wikimedia.org/wikipedia/en/2/23/NABL_India_logo.png",
  },
];

export default function TrustBadges() {
  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Certifications & Trust
        </h2>
        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-medium">
          Recognized by leading authorities
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-20 h-16 mb-4 flex items-center justify-center">
              <img
                src={badge.logo}
                alt={badge.name}
                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                {badge.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                {badge.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

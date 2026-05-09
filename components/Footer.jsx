"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  ChevronDown, 
  ShieldCheck,
  Clock,
  Zap,
  Home,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const pathname = usePathname();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact" },
    { name: "Book Appointment", href: "/book" },
    { name: "Emergency Support", href: "/contact" },
    { name: "Partner With Us", href: "/join-us" },
  ];

  const coreServices = [
    { name: "Ambulance Service", href: "/services/ambulance-service" },
    { name: "Physiotherapy", href: "/services/physiotherapy" },
    { name: "Home Care", href: "/services/home-care" },
    { name: "ICU at Home", href: "/services/icu-at-home" },
    { name: "Nursing Care", href: "/services/nursing-care" },
    { name: "Doctor Visit at Home", href: "/services/doctor-visit-at-home" },
    { name: "Lab Test", href: "/lab-test" },
    { name: "Medical Equipment Rental", href: "/services/medical-equipment-rental" },
  ];

  const policies = [
    { name: "Privacy Policy", href: "/policies/privacy-policy" },
    { name: "Terms & Conditions", href: "/policies/terms-and-conditions" },
    { name: "Refund Policy", href: "/policies/refund-policy" },
    { name: "Cancellation Policy", href: "/policies/cancellation-policy" },
    { name: "Ambulance Policy", href: "/policies/ambulance-service-policy" },
    { name: "Home Care Policy", href: "/policies/home-care-policy" },
    { name: "Physio Policy", href: "/policies/physiotherapy-service-policy" },
    { name: "Partner Policy", href: "/policies/partner-registration-policy" },
    { name: "Doctor Partner", href: "/policies/doctor-partner-policy" },
    { name: "Clinic Partner", href: "/policies/clinic-partner-policy" },
    { name: "Ambulance Partner", href: "/policies/ambulance-partner-policy" },
    { name: "Hospital Partner", href: "/policies/hospital-partner-policy" },
    { name: "Lab Partner", href: "/policies/lab-partner-policy" },
    { name: "Physio Partner", href: "/policies/physiotherapist-partner-policy" },
    { name: "Home Care Partner", href: "/policies/home-care-partner-policy" },
    { name: "Verification & Approval", href: "/policies/verification-approval-policy" },
    { name: "Franchise Policy", href: "/policies/franchise-policy" },
  ];


  const joinNetwork = [
    { name: "Join as Doctor", href: "/doctor-registration" },
    { name: "Join as Physiotherapist", href: "/physiotherapist-registration" },
    { name: "Join as Clinic", href: "/clinic-partner" },
    { name: "Join as Ambulance Partner", href: "/ambulance-partner" },
    { name: "Join as Home Care Partner", href: "/partner-registration" },
    { name: "Join as Lab Partner", href: "/lab-partner" },
    { name: "Join as Hospital Partner", href: "/hospital-partner" },
  ];

  const trustBadges = [
    { icon: <Clock size={14} />, text: "24×7 Support" },
    { icon: <ShieldCheck size={14} />, text: "Verified Partner" },
    { icon: <Zap size={14} />, text: "Fast Response" },
    { icon: <Home size={14} />, text: "Home Healthcare" },
  ];

  const FooterSection = ({ title, links, id }) => (
    <div className="flex flex-col gap-4">
      <h3 className="hidden md:block text-white font-semibold text-base mb-2">{title}</h3>
      <button 
        onClick={() => toggleSection(id)}
        className="md:hidden flex items-center justify-between w-full py-3 border-b border-white/10 text-white font-medium text-sm"
      >
        <span>{title}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${openSection === id ? "rotate-180" : ""}`} 
        />
      </button>
      
      <AnimatePresence>
        {(openSection === id || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.ul 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-2.5 overflow-hidden md:!h-auto md:!opacity-100"
          >
            {links.map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.href}
                  className="text-gray-400 hover:text-[#0F9D58] transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#111111] bg-gradient-to-b from-[#111111] to-[#0a140f] text-white pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND COL */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1.5">
                <Image src="/Dr.Jhatka.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-none tracking-tight">DR JHATKA MEDICARE</h2>
                <p className="text-[#0F9D58] text-[10px] font-medium mt-1 leading-none uppercase tracking-wider">“Speed, Care & Trust – All in One.”</p>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Emergency, Home Healthcare, Physiotherapy, Ambulance & Medical Support Services. We provide quality medical care at your doorstep.
            </p>

            {/* Recognition */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-400 uppercase">MSME</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-400 uppercase">Startup India</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-400 uppercase">ISO Certified</span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div className="text-[#0F9D58]">{badge.icon}</div>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <FooterSection title="Quick Links" links={quickLinks} id="links" />

          {/* CORE SERVICES */}
          <FooterSection title="Core Services" links={coreServices} id="services" />


          {/* CONTACT INFO */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h3 className="text-white font-semibold text-base mb-2">Connect With Us</h3>
            
            <div className="flex flex-col gap-4">
              <a href="tel:8874744756" className="flex items-center gap-3 text-gray-400 hover:text-[#0F9D58] transition-colors group">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#0F9D58]/10">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">Call 24/7</span>
                  <span className="text-sm font-medium text-white">+91 8874744756</span>
                </div>
              </a>

              <a href="https://wa.me/918874744756" className="flex items-center gap-3 text-gray-400 hover:text-[#0F9D58] transition-colors group">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#0F9D58]/10">
                  <MessageCircle size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">WhatsApp</span>
                  <span className="text-sm font-medium text-white">Instant Support</span>
                </div>
              </a>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">Email</span>
                  <span className="text-sm font-medium text-white">support@drjhatka.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">Location</span>
                  <span className="text-sm font-medium text-white">Lucknow, Uttar Pradesh</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0F9D58] transition-all"><Facebook size={14} /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0F9D58] transition-all"><Instagram size={14} /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0F9D58] transition-all"><Linkedin size={14} /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0F9D58] transition-all"><Youtube size={14} /></Link>
            </div>
          </div>
        </div>

        {/* POLICIES & JOIN NETWORK - Horizontal Bar */}
        <div className="pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Policies & Network</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {policies.map((p, idx) => (
                <Link key={idx} href={p.href} className="text-[12px] text-gray-400 hover:text-[#0F9D58] transition-colors">{p.name}</Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Join Dr Jhatka Network</h4>
            <div className="flex flex-wrap gap-2">
              {joinNetwork.map((j, idx) => (
                <Link key={idx} href={j.href} className="px-3 py-1 bg-white/5 hover:bg-[#0F9D58] rounded text-[11px] font-medium transition-all">{j.name}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-medium">
          <p>© 2026 Dr Jhatka Medicare Pvt Ltd. All Rights Reserved.</p>
          <p className="uppercase tracking-widest">24×7 Emergency Support • Lucknow</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

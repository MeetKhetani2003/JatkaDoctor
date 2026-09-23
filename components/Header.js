"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ambulance,
  Activity,
  Stethoscope,
  Bed,
  Home,
  UserPlus,
  TestTube,
  Accessibility,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useBookingModal } from "@/context/BookingModalContext";
import { usePatientAuth } from "@/context/PatientAuthContext";

const PRIMARY = "#0F9D58";
const PRIMARY_LIGHT = "#E8F8F1";
const PRIMARY_DARK = "#0d8a4e";
const TEXT = "#222222";

const services = [
  {
    title: "Ambulance Service",
    icon: Ambulance,
    link: "/services/ambulance",
    desc: "24/7 Emergency response",
  },
  {
    title: "Physiotherapy at Home",
    icon: Activity,
    link: "/services/physiotherapy",
    desc: "Expert therapy sessions",
  },
  {
    title: "Doctor Visit at Home",
    icon: Stethoscope,
    link: "/services/doctor",
    desc: "Qualified MDs at your door",
  },
  {
    title: "ICU at Home",
    icon: Bed,
    link: "/services/icu",
    desc: "Critical care support",
  },
  {
    title: "Home Care Services",
    icon: Home,
    link: "/services/home-care",
    desc: "Comprehensive daily support",
  },
  {
    title: "Nursing Care at Home",
    icon: UserPlus,
    link: "/services/nursing",
    desc: "Trained nursing staff",
  },
  {
    title: "Lab Test at Home",
    icon: TestTube,
    link: "/services/lab-test",
    desc: "NABL Certified labs",
  },
  {
    title: "Equipment Rental",
    icon: Accessibility,
    link: "/services/equipment",
    desc: "Medical equipment on rent",
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasSubmenu: true },
  { label: "Our Team", href: "/our-medical-team" },
  { label: "Lab Tests", href: "/services/lab-test" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─── Desktop Megamenu ─────────────────────────────────── */
function ServicesMegaMenu({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50"
          style={{ width: 580 }}
        >
          {/* Arrow */}
          <div className="flex justify-center -mb-px">
            <div
              className="w-3 h-3 rotate-45 bg-white border-l border-t border-gray-100 z-10"
              style={{ boxShadow: "-2px -2px 5px rgba(0,0,0,0.04)" }}
            />
          </div>

          {/* Panel */}
          <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: `0 24px 64px rgba(15,157,88,0.13)` }}
          >
            {/* Header */}
            <div
              className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between"
              style={{
                background: `linear-gradient(to right, ${PRIMARY_LIGHT}, #ffffff)`,
              }}
            >
              <div>
                <p
                  className="text-[13px] font-normal tracking-tight"
                  style={{ color: TEXT }}
                >
                  Our Services
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                  Trusted home healthcare · Available 24 / 7
                </p>
              </div>
              <Link
                href="/services"
                className="flex items-center gap-1 text-[11px] font-normal px-3 py-1.5 rounded-xl transition-colors"
                style={{ color: PRIMARY, background: PRIMARY_LIGHT }}
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-px bg-gray-100/70">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={s.link}
                      className="flex items-center gap-3 px-4 py-3.5 bg-white group transition-colors duration-150"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F5FDF9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: PRIMARY_LIGHT }}
                      >
                        <Icon
                          style={{ color: PRIMARY, width: 18, height: 18 }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[12.5px] font-normal leading-tight transition-colors group-hover:text-[#0F9D58]"
                          style={{ color: TEXT }}
                        >
                          {s.title}
                        </p>
                        <p className="text-[10.5px] text-gray-400 mt-0.5 font-medium">
                          {s.desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              }}
            >
              <div>
                <p className="text-[12px] font-normal text-white">
                  Need help choosing a service?
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#a7f3d0" }}>
                  Our care coordinators are here 24 / 7
                </p>
              </div>
              <a
                href="tel:+918874744756"
                className="flex items-center gap-1.5 bg-white text-[11px] font-normal px-3.5 py-2 rounded-xl hover:bg-green-50 transition-colors"
                style={{ color: PRIMARY }}
              >
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Patient Avatar Dropdown (Desktop) ────────────────── */
function PatientDropdown({ patient, logout, profileComplete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 hover:shadow-md"
        style={{ borderColor: "#E5E7EB", background: "white" }}
        id="patient-avatar-btn"
        aria-label="Patient account"
      >
        <div className="relative">
          {patient?.avatar ? (
            <Image
              src={patient.avatar}
              alt={patient.name || "Patient"}
              width={28}
              height={28}
              className="rounded-full object-cover border-2"
              style={{ borderColor: profileComplete ? PRIMARY : "#f59e0b" }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: profileComplete ? PRIMARY_LIGHT : "#fef3c7" }}
            >
              <User className="w-4 h-4" style={{ color: profileComplete ? PRIMARY : "#d97706" }} />
            </div>
          )}
          {/* Incomplete badge */}
          {!profileComplete && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white" title="Profile incomplete" />
          )}
        </div>
        <span className="text-[12.5px] font-medium max-w-[90px] truncate" style={{ color: TEXT }}>
          {patient?.name?.split(" ")[0] || "Patient"}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50"
            style={{ boxShadow: "0 12px 40px rgba(15,157,88,0.14)" }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100" style={{ background: profileComplete ? PRIMARY_LIGHT : "#fef3c7" }}>
              <p className="text-[12px] font-semibold truncate" style={{ color: TEXT }}>{patient?.name}</p>
              <p className="text-[10.5px] text-gray-400 truncate mt-0.5">{patient?.email}</p>
              {!profileComplete && (
                <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                  ⚠️ Profile incomplete
                </p>
              )}
            </div>
            {!profileComplete && (
              <Link
                href="/patient/complete-profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold transition-colors bg-amber-50 hover:bg-amber-100"
                style={{ color: "#d97706" }}
              >
                <User className="w-4 h-4" />
                Complete Profile ⚠️
              </Link>
            )}
            <Link
              href="/patient/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-colors hover:bg-gray-50"
              style={{ color: TEXT }}
            >
              <LayoutDashboard className="w-4 h-4" style={{ color: PRIMARY }} />
              My Bookings
            </Link>
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-colors hover:bg-red-50 border-t border-gray-100"
              style={{ color: "#ef4444" }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile Drawer ────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const { patient, loggedIn, logout } = usePatientAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.42)",
              backdropFilter: "blur(3px)",
            }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-[88vw] max-w-[360px] bg-white z-50 flex flex-col overflow-hidden"
            style={{ boxShadow: `-8px 0 40px rgba(15,157,88,0.14)` }}
          >
            {/* Drawer Header — green bar with logo */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              }}
            >
              <Image
                src="/Dr.Jhatka.png"
                alt="Dr. Jhatka"
                width={150}
                height={48}
                className="object-contain"
              />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto">
              <div className="py-1.5">
                {navLinks.map((link) =>
                  link.hasSubmenu ? (
                    <div key={link.label}>
                      {/* Accordion trigger */}
                      <button
                        onClick={() => setServicesOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 text-left"
                        style={{
                          background: servicesOpen ? PRIMARY_LIGHT : "white",
                        }}
                      >
                        <span
                          className="text-[14px] font-normal tracking-tight"
                          style={{ color: servicesOpen ? PRIMARY : TEXT }}
                        >
                          Services
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-normal px-2 py-0.5 rounded-full"
                            style={{
                              background: PRIMARY_LIGHT,
                              color: PRIMARY,
                            }}
                          >
                            8
                          </span>
                          <motion.div
                            animate={{ rotate: servicesOpen ? 180 : 0 }}
                            transition={{ duration: 0.22 }}
                          >
                            <ChevronDown
                              className="w-4 h-4"
                              style={{
                                color: servicesOpen ? PRIMARY : "#9CA3AF",
                              }}
                            />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                            style={{ background: "#FAFAFA" }}
                          >
                            {/* Sub-header */}
                            <div className="px-5 pt-3 pb-1.5 flex items-center justify-between">
                              <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">
                                All Services
                              </p>
                              <Link
                                href="/services"
                                onClick={onClose}
                                className="text-[11px] font-normal flex items-center gap-0.5"
                                style={{ color: PRIMARY }}
                              >
                                View all <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>

                            {/* Service cards */}
                            <div className="px-3 pb-3 space-y-1.5">
                              {services.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                  <motion.div
                                    key={s.title}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.035 }}
                                  >
                                    <Link
                                      href={s.link}
                                      onClick={onClose}
                                      className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white border border-gray-100 active:scale-[0.97] transition-transform group"
                                      style={{
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                      }}
                                    >
                                      <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: PRIMARY_LIGHT }}
                                      >
                                        <Icon
                                          style={{
                                            color: PRIMARY,
                                            width: 20,
                                            height: 20,
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className="text-[13px] font-normal leading-tight"
                                          style={{ color: TEXT }}
                                        >
                                          {s.title}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                          {s.desc}
                                        </p>
                                      </div>
                                      <ChevronRight
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: PRIMARY }}
                                      />
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-5 py-4 text-[14px] font-normal border-b border-gray-100 transition-colors"
                      style={{ color: TEXT }}
                      onTouchStart={(e) =>
                        (e.currentTarget.style.background = PRIMARY_LIGHT)
                      }
                      onTouchEnd={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  ),
                )}
              </div>

              {/* Patient section */}
              {loggedIn && patient ? (
                <div className="mx-4 mt-3 mb-1 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: PRIMARY_LIGHT }}>
                    {patient.avatar ? (
                      <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-full border-2" style={{ borderColor: PRIMARY }} />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: PRIMARY }}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: TEXT }}>{patient.name}</p>
                      <p className="text-[10.5px] text-gray-500 truncate">{patient.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/patient/profile"
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium border-t border-gray-100 transition-colors hover:bg-gray-50"
                    style={{ color: TEXT }}
                  >
                    <LayoutDashboard className="w-4 h-4" style={{ color: PRIMARY }} />
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium border-t border-gray-100 transition-colors hover:bg-red-50"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/google"
                  className="mx-4 mt-3 mb-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:scale-[0.97]"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </a>
              )}

              {/* Info pill */}
              <div
                className="mx-4 mt-4 px-4 py-3 rounded-2xl"
                style={{ background: PRIMARY_LIGHT }}
              >
                <p className="text-[11px] font-normal" style={{ color: PRIMARY }}>
                  🏥 Serving 50+ cities across India
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Same-day appointments available
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              className="p-4 border-t border-gray-100 shrink-0"
              style={{ background: "#FAFAFA" }}
            >
              <a
                href="tel:+918874744756"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-[14px] font-normal tracking-tight active:scale-[0.97] transition-transform animate-pulse-red"
                style={{
                  background: `linear-gradient(135deg, #ef4444, #b91c1c)`,
                  boxShadow: `0 6px 20px rgba(239,68,68,0.28)`,
                }}
              >
                <Phone className="w-4 h-4" />
                Call for Emergency
              </a>
              <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                Toll Free · 24 / 7 · No charges for calling
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Navbar ──────────────────────────────────────── */
export default function Navbar() {
  const { openModal } = useBookingModal();
  const { patient, loggedIn, profileComplete, loading: authLoading, logout } = usePatientAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesHover, setServicesHover] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const scrollHandler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    
    const menuHandler = () => setMenuOpen(true);
    window.addEventListener("open-mobile-menu", menuHandler);
    
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("open-mobile-menu", menuHandler);
    };
  }, []);

  const handleServicesEnter = () => {
    clearTimeout(closeTimer.current);
    setServicesHover(true);
  };
  const handleServicesLeave = () => {
    closeTimer.current = setTimeout(() => setServicesHover(false), 160);
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-30 bg-white transition-all duration-300"
        style={{
          borderBottom: scrolled
            ? "1px solid #F0F0F0"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 16px rgba(15,157,88,0.09)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/Dr.Jhatka.png"
                alt="Dr. Jhatka"
                width={180}
                height={56}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.hasSubmenu ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                  >
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-normal transition-all duration-200"
                      style={{
                        color: servicesHover ? PRIMARY : TEXT,
                        background: servicesHover
                          ? PRIMARY_LIGHT
                          : "transparent",
                      }}
                    >
                      {link.label}
                      <motion.div
                        animate={{ rotate: servicesHover ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.div>
                    </button>
                    <ServicesMegaMenu open={servicesHover} />
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-[13.5px] font-normal transition-all duration-200"
                    style={{ color: TEXT }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = PRIMARY;
                      e.currentTarget.style.background = PRIMARY_LIGHT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = TEXT;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2.5">
              <a
                href="tel:+918874744756"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-normal border transition-all duration-200 animate-pulse-red"
                style={{
                  color: "#ef4444",
                  borderColor: "#ef4444",
                  background: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                <Phone className="w-3.5 h-3.5" />
                +91 8874744756
              </a>

              {/* Patient Auth: show avatar dropdown OR Google sign-in */}
              {!authLoading && (
                loggedIn ? (
                  <PatientDropdown patient={patient} logout={logout} profileComplete={profileComplete} />
                ) : (
                  <a
                    href="/api/auth/google"
                    id="google-signin-btn"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.97]"
                    style={{ color: TEXT }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in
                  </a>
                )
              )}

              <button
                id="book-appointment-btn"
                onClick={() => {
                  if (!loggedIn) {
                    router.push("/patient/login");
                    return;
                  }
                  if (!profileComplete) {
                    router.push("/patient/complete-profile");
                    return;
                  }
                  const s = pathname?.startsWith('/services/') ? pathname.split('/services/')[1] : "";
                  openModal({ service: s });
                }}
                className="px-5 py-2 rounded-xl text-[13px] font-normal text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                  boxShadow: `0 4px 14px rgba(15,157,88,0.28)`,
                }}
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile right controls */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:+918874744756"
                className="w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  background: PRIMARY_LIGHT,
                }}
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMenuOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#F5F5F5", color: TEXT }}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so page content doesn't hide under fixed bar */}

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

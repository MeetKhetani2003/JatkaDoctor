"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  Tags,
  ChevronLeft,
  Settings,
  MapPin,
  Truck,
  Activity,
  Menu,
  X,
  BookOpen,
  LogOut,
  CreditCard,
  History,
  UserPlus,
  PhoneCall,
  XOctagon,
  Package,
  Bell,
  MessageCircle,
  Home,
  HeartPulse
} from "lucide-react";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, isNotification: true },
  { label: "Health Cards & 360°", href: "/admin/health-cards", icon: CreditCard },
  { label: "Camp Management", href: "/admin/camps", icon: Activity },
  { label: "Bookings", href: "/admin/appointments", icon: CalendarCheck },
  { label: "ICU at Home", href: "/admin/icu-requests", icon: Activity },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Staff Directory", href: "/admin/staff", icon: UserPlus },
  { label: "Patient History", href: "/admin/patients", icon: History },
  { label: "Followup Tracker", href: "/admin/followups", icon: PhoneCall },
  { label: "Cancellations", href: "/admin/cancellations", icon: XOctagon },
  { label: "Medical Bios", href: "/admin/doctors", icon: Users },
  { label: "Ambulance Services", href: "/admin/service-cards", icon: Activity },
  { label: "Ambulance Partners", href: "/admin/ambulances", icon: Truck },
  { label: "Ambulance Packages", href: "/admin/ambulance-packages", icon: Package },
  { label: "Home Care Services", href: "/admin/home-care-master", icon: Home },
  { label: "Home Care Bookings", href: "/admin/home-care-bookings", icon: CalendarCheck },
  { label: "Nursing Care Services", href: "/admin/nursing-care-master", icon: HeartPulse },
  { label: "Nursing Care Bookings", href: "/admin/nursing-care-bookings", icon: CalendarCheck },
  { label: "Physio Centers", href: "/admin/physio-centers", icon: MapPin },
  { label: "Physio Master Data", href: "/admin/physio-master", icon: Activity },
  { label: "Physio Bookings", href: "/admin/physio-bookings", icon: CalendarCheck },
  { label: "Physio Patients", href: "/admin/physio-patients", icon: Users },
  { label: "Physio Concessions", href: "/admin/physio-concessions", icon: CreditCard },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Join Requests", href: "/admin/partners", icon: UserCog },
  { label: "Gallery", href: "/admin/gallery", icon: Tags },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === "granted");
      if (permission === "granted") {
        new Notification("Dr Jhatka Medicare", {
          body: "Push notifications enabled for new booking leads!",
          icon: "/Dr.Jhatka.png"
        });
      }
    }
  };

  // Poll notifications every 6 seconds
  useEffect(() => {
    let lastSeenId = null;

    const checkNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications?limit=5");
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.unreadCounts?.all || 0);
          setRecentNotifs(data.data || []);

          // Trigger browser notification for fresh leads
          if (data.data && data.data.length > 0) {
            const newest = data.data[0];
            if (lastSeenId && newest._id !== lastSeenId && !newest.isRead) {
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                new Notification(`🔔 ${newest.title || 'New Booking Lead Received'}`, {
                  body: `${newest.patientName} | ${newest.service} | ${newest.phone}`,
                  icon: "/Dr.Jhatka.png"
                });
              }
            }
            lastSeenId = newest._id;
          }
        }
      } catch (err) {
        // silent fail on network blips
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-normal text-black tracking-tight text-lg">
            Dr Jhatka Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isNotif = link.isNotification;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-normal transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {isNotif && unreadCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-white text-emerald-700" : "bg-rose-500 text-white"
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-normal text-gray-500 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-lg font-normal text-black tracking-tight capitalize">
            {sidebarLinks.find((l) => l.href === pathname)?.label ||
              "Dashboard"}
          </h2>
          <div className="flex items-center gap-3 relative">
            {/* Browser push permission helper if not granted */}
            {!hasPermission && (
              <button
                onClick={requestNotificationPermission}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                title="Enable desktop notifications for new bookings"
              >
                <Bell className="w-3.5 h-3.5 animate-pulse" />
                Enable Push Alerts
              </button>
            )}

            {/* Notification Bell with Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(prev => !prev)}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-xl transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Quick Dropdown */}
              {notifDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setNotifDropdownOpen(false)}
                >
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <Link
                      href="/admin/notifications"
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                    {recentNotifs.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-400">
                        No recent notifications
                      </div>
                    ) : (
                      recentNotifs.map((n) => (
                        <Link
                          key={n._id}
                          href="/admin/notifications"
                          className={`block p-3 hover:bg-gray-50 transition-colors ${
                            !n.isRead ? "bg-emerald-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-gray-900 line-clamp-1">
                              {n.title || "New Booking Lead"}
                            </span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {n.bookingId}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {n.patientName} • {n.service}
                          </p>
                          <div className="flex items-center justify-between mt-1.5 text-[11px]">
                            <span className="text-gray-400">{n.preferredDate || "Today"}</span>
                            <span className={`px-2 py-0.2 rounded font-semibold text-[10px] ${
                              n.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              n.paymentStatus === 'Failed' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {n.paymentStatus || 'Pending'}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-3 border-t border-gray-100 text-center">
                    <Link
                      href="/admin/notifications"
                      className="block w-full py-1.5 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      Open Full Notification Center &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-8 pb-24 md:pb-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-100 flex md:hidden justify-around items-center p-2 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {sidebarLinks.slice(0, 4).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all ${
                isActive
                  ? "text-primary scale-110"
                  : "text-gray-400 hover:text-primary/70"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-primary/10" : "bg-transparent"}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-all ${isActive ? "opacity-100" : "opacity-70"}`}
              >
                {link.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all text-gray-400 hover:text-primary/70`}
        >
          <div className="p-1.5 rounded-xl bg-transparent transition-colors">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium opacity-70">
            Menu
          </span>
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <aside className="w-64 bg-white h-full shadow-xl flex flex-col relative z-[61] overflow-hidden transform transition-transform">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="font-normal text-black tracking-tight text-lg">
                  Admin
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-normal transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100 shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-red-500 hover:bg-red-50 rounded-xl transition-colors mb-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-normal text-gray-500 hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Website
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

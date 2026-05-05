"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Activity
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Medical Staff', href: '/admin/doctors', icon: Users },
  { label: 'Ambulance Hub', href: '/admin/ambulances', icon: Truck },
  { label: 'Service Cards', href: '/admin/service-cards', icon: Activity },


  { label: 'Physio Centers', href: '/admin/physio-centers', icon: MapPin },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Appointments', href: '/admin/appointments', icon: CalendarCheck },
];


export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-normal text-black tracking-tight text-lg">Dr Jhatka Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-normal transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
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
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-normal text-black tracking-tight capitalize">
            {sidebarLinks.find(l => l.href === pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-100 flex md:hidden justify-around items-center p-2 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${
                isActive ? 'text-primary scale-110' : 'text-gray-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {link.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </nav>


    </div>
  );
}

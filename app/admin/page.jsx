"use client";
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    categories: 0,
  });

  useEffect(() => {
    // Mock fetching stats or real fetch
    const fetchStats = async () => {
      try {
        const [docs, appts, cats] = await Promise.all([
          fetch('/api/doctors').then(res => res.json()),
          fetch('/api/appointments').then(res => res.json()),
          fetch('/api/categories').then(res => res.json()),
        ]);
        setStats({
          doctors: Array.isArray(docs) ? docs.length : 0,
          appointments: Array.isArray(appts) ? appts.length : 0,
          categories: Array.isArray(cats) ? cats.length : 0,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Doctors', value: stats.doctors, icon: Users, color: 'bg-blue-500' },
    { label: 'New Appointments', value: stats.appointments, icon: CalendarCheck, color: 'bg-primary' },
    { label: 'Service Categories', value: stats.categories, icon: Activity, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-500 text-sm font-normal">Here's what's happening in your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${card.color.split('-')[1]}/20`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-normal uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-normal text-black tracking-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-normal text-black tracking-tight mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Doctor', href: '/admin/doctors', color: 'text-blue-600' },
              { label: 'Create Category', href: '/admin/categories', color: 'text-amber-600' },
              { label: 'Review Appointments', href: '/admin/appointments', color: 'text-primary' },
            ].map((action) => (
              <Link 
                key={action.label} 
                href={action.href}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-primary/5 transition-colors"
              >
                <span className={`text-sm font-normal ${action.color}`}>{action.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* System Health / Recent Activity */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-normal text-black tracking-tight mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" /> Recent System Logs
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-normal text-gray-800">Database connection re-established successfully.</p>
                  <p className="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

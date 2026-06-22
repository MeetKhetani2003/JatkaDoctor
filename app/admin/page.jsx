"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  TrendingUp,
  Clock,
  ArrowRight,
  IndianRupee,
  CheckCircle,
  XCircle,
  FileDown,
  Loader2,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load statistics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDownloadBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dr-jhatka-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate database backup");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating backup file");
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const widgets = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarCheck, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
    { label: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: Clock, color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
    { label: 'Completed Bookings', value: stats?.completedBookings || 0, icon: CheckCircle, color: 'bg-green-600', shadow: 'shadow-green-600/20' },
    { label: 'Cancelled Bookings', value: stats?.cancelledBookings || 0, icon: XCircle, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: 'bg-primary', shadow: 'shadow-primary/20' },
  ];



  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-normal text-black tracking-tight mb-1">Welcome Back, Admin</h1>
          <p className="text-gray-500 text-sm font-normal">Here's a breakdown of Dr Jhatka Medicare metrics today.</p>
        </div>
        
        {/* Backup Database Button (Phase 15) */}
        <button
          onClick={handleDownloadBackup}
          disabled={backupLoading}
          className="px-5 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-2 text-xs shadow-md shadow-primary/15"
        >
          {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          Backup Database JSON
        </button>
      </div>

      {/* Stats Widgets Grid (Phase 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {widgets.map((w) => {
          const Icon = w.icon;
          return (
            <div key={w.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`${w.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${w.shadow} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider truncate">{w.label}</p>
                <p className="text-lg font-black text-gray-900 tracking-tight truncate">{w.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs Grid (Phase 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Monthly Revenue (Last 6 Months)</h3>
            <p className="text-xs text-gray-400">Total generated payment volumes from successful gateway receipts</p>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyRevenueGraph || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                  tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Trend Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Booking Intake Trend (Last 14 Days)</h3>
            <p className="text-xs text-gray-400">Total patient request velocity across all care segments</p>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.bookingTrendGraph || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} 
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                  allowDecimals={false}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Service Wise Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Service Wise Intake Summary
          </h3>
          
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-xs text-left text-gray-500">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Service Name</th>
                  <th className="px-4 py-3 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.serviceStats || []).map((stat, i) => (
                  <tr key={i} className="hover:bg-gray-50/20">
                    <td className="px-4 py-3 font-medium text-gray-900">{stat.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{stat.count} requests</td>
                  </tr>
                ))}
                {(!stats?.serviceStats || stats.serviceStats.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                      No service stats recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">System Navigation Shortcuts</h3>
          <div className="space-y-3">
            {[
              { label: 'Register New Staff Member', href: '/admin/staff', color: 'text-blue-600' },
              { label: 'Manage Medical Doctor Bios', href: '/admin/doctors', color: 'text-amber-600' },
              { label: 'Review Bookings & Assign Staff', href: '/admin/appointments', color: 'text-primary' },
              { label: 'Manual Refund Management', href: '/admin/cancellations', color: 'text-red-500' },
            ].map((action) => (
              <Link 
                key={action.label} 
                href={action.href}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-primary/5 transition-colors"
              >
                <span className={`text-xs font-bold ${action.color}`}>{action.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

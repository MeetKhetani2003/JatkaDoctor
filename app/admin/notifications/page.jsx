"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Phone,
  Mail,
  Eye,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Clock,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  XCircle,
  MessageCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { buildPrefilledMessage, getWhatsAppActionUrl, getEmailActionUrl, getCallActionUrl } from "@/lib/notificationActions";

export default function AdminNotificationCenter() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({ all: 0, leads: 0, payments: 0, system: 0 });
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch(`/api/admin/notifications?tab=${encodeURIComponent(activeTab)}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
        if (data.unreadCounts) {
          setUnreadCounts(data.unreadCounts);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchNotifications(false);
    // Auto-polling every 7 seconds for real-time lead updates
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 7000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'markRead' })
      });
      fetchNotifications(true);
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      });
      fetchNotifications(true);
    } catch (err) {
      console.error("Error marking all read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleRetryChannel = async (id, channel) => {
    const key = `${id}-${channel}`;
    try {
      setRetryingId(key);
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, channel })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${channel} notification retried and sent successfully!`);
      } else {
        alert(`Retry failed: ${data.errorDetails || data.error || 'Server error'}`);
      }
      fetchNotifications(true);
    } catch (err) {
      alert(`Error retrying ${channel}: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  const tabs = [
    { name: "All", count: unreadCounts.all },
    { name: "Booking Leads", count: unreadCounts.leads },
    { name: "Payments", count: unreadCounts.payments },
    { name: "System", count: unreadCounts.system }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
              {unreadCounts.all > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500 text-white animate-bounce">
                  {unreadCounts.all} New
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Real-time booking leads, payment logs &amp; instant one-click actions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchNotifications(false)}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCounts.all === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.name
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>{tab.name}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.name
                  ? "bg-white/20 text-white font-bold"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading && notifications.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading live notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
          <p className="text-sm text-gray-500">
            When a patient submits a booking enquiry or makes a payment, real-time alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const prefilledText = buildPrefilledMessage({
              patientName: notif.patientName,
              bookingId: notif.bookingId,
              service: notif.service,
              problem: notif.problem,
              date: notif.preferredDate,
              time: notif.preferredTime,
              location: notif.location,
              paymentStatus: notif.paymentStatus
            });

            const waUrl = getWhatsAppActionUrl(notif.phone, prefilledText);
            const callUrl = getCallActionUrl(notif.phone);
            const mailUrl = getEmailActionUrl(notif.email, notif.bookingId, prefilledText);

            // Payment status styles
            let paymentBadgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
            let paymentDot = "bg-amber-500";
            if (notif.paymentStatus === 'Paid') {
              paymentBadgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
              paymentDot = "bg-emerald-500";
            } else if (notif.paymentStatus === 'Failed') {
              paymentBadgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
              paymentDot = "bg-rose-500";
            }

            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                  notif.isRead
                    ? "border-gray-200 opacity-95"
                    : "border-emerald-300 ring-1 ring-emerald-400/20 bg-gradient-to-r from-emerald-50/20 via-white to-white"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-base">
                          {notif.title || "New Booking Lead Received"}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {notif.source || "Website"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : 'Just now'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!notif.isRead ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        Unread
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Read</span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Booking ID:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {notif.bookingId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Patient Name:</span>
                    <span className="font-semibold text-gray-900">{notif.patientName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Mobile:</span>
                    <span className="font-mono text-gray-900 font-semibold">{notif.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Service:</span>
                    <span className="font-semibold text-gray-800">{notif.service}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Problem:</span>
                    <span className="text-gray-700 italic truncate max-w-[200px]" title={notif.problem}>
                      {notif.problem || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Schedule:</span>
                    <span className="text-gray-700">
                      {notif.preferredDate || "Today"} | {notif.preferredTime || "Flexible"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Location:</span>
                    <span className="text-gray-700 truncate max-w-[220px]" title={notif.location}>
                      {notif.location || "Lucknow"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Payment:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${paymentBadgeStyle}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${paymentDot}`}></span>
                      {notif.paymentStatus || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium min-w-[100px]">Email:</span>
                    <span className="text-gray-700 truncate max-w-[200px]" title={notif.email}>
                      {notif.email || "Not Provided"}
                    </span>
                  </div>
                </div>

                {/* Channel Logs & Statuses */}
                {notif.channels && notif.channels.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-gray-50/70 p-3 rounded-xl">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-semibold text-gray-500">Channels:</span>
                      {notif.channels.map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-600">{ch.channel}:</span>
                          {ch.status === 'Sent' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                            </span>
                          ) : ch.status === 'Failed' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-rose-600 font-semibold flex items-center gap-0.5" title={ch.errorDetails}>
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetryChannel(notif._id, ch.channel);
                                }}
                                disabled={retryingId === `${notif._id}-${ch.channel}`}
                                className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold flex items-center gap-1 text-[11px] transition-colors"
                              >
                                <RotateCcw className={`w-3 h-3 ${retryingId === `${notif._id}-${ch.channel}` ? 'animate-spin' : ''}`} />
                                Retry
                              </button>
                            </div>
                          ) : (
                            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {notif.channels.some(c => c.status === 'Failed' && c.errorDetails) && (
                      <div className="text-[11px] text-rose-600 font-medium italic truncate max-w-sm" title={notif.channels.find(c => c.status === 'Failed')?.errorDetails}>
                        Note: {notif.channels.find(c => c.status === 'Failed')?.errorDetails.slice(0, 75)}...
                      </div>
                    )}
                  </div>
                )}

                {/* One-Click Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* 1. WhatsApp Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                    title="Open WhatsApp chat with pre-filled message"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  {/* 2. Direct Call Button */}
                  <a
                    href={callUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-600/20 active:scale-95"
                    title={`Call ${notif.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>

                  {/* 3. Direct Email Button */}
                  <a
                    href={mailUrl}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white font-semibold text-xs transition-all shadow-sm active:scale-95 ${
                      notif.email
                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                        : "bg-gray-300 cursor-not-allowed pointer-events-none"
                    }`}
                    title={notif.email ? `Send email to ${notif.email}` : "No email available"}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>

                  {/* 4. View Booking Details Page */}
                  <Link
                    href={`/admin/appointments?search=${encodeURIComponent(notif.bookingId)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-sm shadow-black/10 active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Booking</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Grid for Appointments (Better for status tracking) */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-normal text-black tracking-tight mb-1">
            No appointments yet
          </h3>
          <p className="text-gray-400 text-sm font-normal">
            New bookings will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 pb-0 flex justify-between items-start">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-normal uppercase tracking-wider ${
                    appt.status === "Pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-green-50 text-primary"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-normal text-black tracking-tight">
                    {appt.patientName}
                  </h4>
                  <p className="text-primary text-xs font-normal mt-0.5">
                    {appt.category} • {appt.doctor}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                    <Calendar className="w-4 h-4 text-gray-400" />{" "}
                    {appt.createdAt?.slice(0, 10) || "Not specified"}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                    <Phone className="w-4 h-4 text-gray-400" /> {appt.phone}
                  </div>
                  {appt.notes && (
                    <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-600 italic">
                      "{appt.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <a
                  href={`tel:${appt.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-[11px] font-normal active:scale-95 transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/91${appt.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 text-gray-700 rounded-2xl text-[11px] font-normal active:scale-95 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-green-500" />{" "}
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

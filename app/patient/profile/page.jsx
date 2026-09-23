"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Calendar, CheckCircle2, XCircle, Clock, LogOut,
  ChevronDown, ChevronUp, Activity, AlertCircle, PhoneCall,
  Mail, MapPin, Hash, TrendingUp
} from "lucide-react";

function AttendanceBadge({ status }) {
  if (!status) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400">Pending</span>;
  const map = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Holiday: "bg-amber-100 text-amber-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status]}`}>{status}</span>;
}

function SessionProgressBar({ sessions }) {
  const total = sessions.length;
  const present = sessions.filter(s => s.attendanceStatus === "Present").length;
  const absent = sessions.filter(s => s.attendanceStatus === "Absent").length;
  const holiday = sessions.filter(s => s.attendanceStatus === "Holiday").length;
  const pending = total - present - absent - holiday;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">Session Progress</span>
        <span className="text-sm font-bold text-blue-600">{present}/{total} sessions</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
        <div className="bg-green-500 h-full transition-all" style={{ width: `${(present / total) * 100}%` }} />
        <div className="bg-red-400 h-full transition-all" style={{ width: `${(absent / total) * 100}%` }} />
        <div className="bg-amber-400 h-full transition-all" style={{ width: `${(holiday / total) * 100}%` }} />
      </div>
      <div className="flex gap-4 mt-2 text-[10px]">
        <span className="text-green-600">✅ Present: {present}</span>
        <span className="text-red-500">❌ Absent: {absent}</span>
        <span className="text-amber-600">🏖️ Holiday: {holiday}</span>
        <span className="text-gray-400">⏳ Pending: {pending}</span>
      </div>
    </div>
  );
}

function BookingCard({ item }) {
  const { booking, plan, sessions } = item;
  const [open, setOpen] = useState(false);

  const statusColor = {
    "New": "bg-gray-100 text-gray-700",
    "Assigned": "bg-blue-100 text-blue-700",
    "In Progress": "bg-purple-100 text-purple-700",
    "Completed": "bg-green-100 text-green-700",
    "Cancelled": "bg-red-100 text-red-700",
  };

  const payColor = {
    "Paid": "bg-green-100 text-green-700",
    "Pending": "bg-amber-100 text-amber-700",
    "Partial": "bg-blue-100 text-blue-700",
  };

  // Expiration logic
  let isExpired = false;
  let expiresAt = null;
  if (booking.packageId?.validityDays) {
    expiresAt = new Date(new Date(booking.createdAt).getTime() + booking.packageId.validityDays * 24 * 60 * 60 * 1000);
    isExpired = new Date() > expiresAt;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{booking.bookingId}</p>
            <p className="text-xs text-gray-500">{booking.departmentId?.name || "General"} • {booking.packageId?.title || "Per Session"}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {booking.preferredDate} at {booking.preferredTime}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor[booking.status] || "bg-gray-100 text-gray-700"}`}>
            {booking.status}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${payColor[booking.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
            {booking.paymentStatus}
          </span>
          {isExpired && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Expired
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 mt-1" />}
        </div>
      </div>

      {/* Expanded: Sessions */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          {/* Payment info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Total Amount</p>
              <p className="font-bold text-gray-800">₹ {booking.totalAmount?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Paid Amount</p>
              <p className="font-bold text-gray-800">₹ {booking.paidAmount?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Expiration Banner */}
          {expiresAt && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${isExpired ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
              <Calendar className="w-4 h-4" />
              {isExpired ? (
                <span>Booking time is expired. Package was valid until {expiresAt.toLocaleDateString()}</span>
              ) : (
                <span>Package is valid until {expiresAt.toLocaleDateString()} ({booking.packageId.validityDays} Days)</span>
              )}
            </div>
          )}

          {/* Session Progress */}
          {sessions.length > 0 && (
            <>
              <SessionProgressBar sessions={sessions} />
              <div className="space-y-2 mt-3">
                {sessions.map(s => (
                  <div
                    key={s._id}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm border ${
                      s.attendanceStatus === "Present" ? "bg-green-50 border-green-100" :
                      s.attendanceStatus === "Absent" ? "bg-red-50 border-red-100" :
                      s.attendanceStatus === "Holiday" ? "bg-amber-50 border-amber-100" :
                      "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-6">#{s.sessionNumber}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{s.sessionDate || s.scheduledDate}</p>
                        {s.notes && <p className="text-[10px] text-gray-400">{s.notes}</p>}
                      </div>
                    </div>
                    <AttendanceBadge status={s.attendanceStatus} />
                  </div>
                ))}
              </div>
            </>
          )}

          {sessions.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No sessions scheduled yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PatientProfilePage() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patient/bookings");
      if (res.status === 401) {
        router.push("/patient/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setPatient(data.patient);
        setBookings(data.data);
      }
    } catch {
      router.push("/patient/login");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/patient-session", { method: "DELETE" });
    router.push("/patient/login");
  };

  const totalSessions = bookings.reduce((acc, item) => acc + item.sessions.length, 0);
  const presentCount = bookings.reduce((acc, item) => acc + item.sessions.filter(s => s.attendanceStatus === "Present").length, 0);
  const pendingAmount = bookings.reduce((acc, item) => acc + ((item.booking.totalAmount || 0) - (item.booking.paidAmount || 0)), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <a href="/" className="text-blue-200 text-sm hover:text-white transition-colors">← Dr Jhatka Medicare</a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>

          {/* Profile header */}
          <div className="flex items-center gap-4">
            {patient?.avatar ? (
              <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white/80" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{patient?.name || "Patient"}</h1>
              <p className="text-blue-200 text-sm">{patient?.email}</p>
              {patient?.patientDbId && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Hash className="w-3 h-3 text-blue-300" />
                  <span className="text-xs text-blue-200 font-mono">{patient.patientDbId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Extra Details */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {patient?.mobile && !patient.mobile.startsWith('google_') && (
              <span className="flex items-center gap-1 text-xs text-blue-100 bg-white/10 px-2 py-1 rounded-md">
                <PhoneCall className="w-3 h-3" /> {patient.mobile}
              </span>
            )}
            {patient?.age && (
              <span className="flex items-center gap-1 text-xs text-blue-100 bg-white/10 px-2 py-1 rounded-md">
                <User className="w-3 h-3" /> {patient.age} yrs
              </span>
            )}
            {patient?.gender && (
              <span className="flex items-center gap-1 text-xs text-blue-100 bg-white/10 px-2 py-1 rounded-md capitalize">
                {patient.gender}
              </span>
            )}
            {patient?.address && (
              <span className="flex items-center gap-1 text-xs text-blue-100 bg-white/10 px-2 py-1 rounded-md">
                <MapPin className="w-3 h-3" /> {patient.address} {patient.pincode ? `(${patient.pincode})` : ""}
              </span>
            )}
          </div>


          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-[10px] text-blue-200 mt-0.5">Bookings</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{presentCount}<span className="text-sm font-normal text-blue-200">/{totalSessions}</span></p>
              <p className="text-[10px] text-blue-200 mt-0.5">Sessions Done</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">₹{pendingAmount > 0 ? pendingAmount.toLocaleString() : "0"}</p>
              <p className="text-[10px] text-blue-200 mt-0.5">Pending Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          My Bookings & Sessions
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No bookings found</p>
            <p className="text-gray-300 text-sm mt-1">Your bookings will appear here once scheduled.</p>
          </div>
        ) : (
          bookings.map((item, i) => (
            <BookingCard key={i} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

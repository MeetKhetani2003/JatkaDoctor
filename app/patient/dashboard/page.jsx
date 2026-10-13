"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  User,
  Users,
  Calendar,
  CalendarCheck,
  Activity,
  Receipt,
  Percent,
  Award,
  Clock,
  Bell,
  LogOut,
  Edit,
  Plus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Heart,
  Stethoscope,
  KeyRound,
  Download
} from "lucide-react";
import HealthCard from "@/components/HealthCard";
import { usePatientAuth } from "@/context/PatientAuthContext";

function PatientDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "card";
  const { patient: sessionPatient, loggedIn, loading: authLoading, logout, refresh } = usePatientAuth();

  // Active Tab: card | profile | family | bookings | health | payments | offers | rewards | followups | notifications
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sub-data states
  const [familyData, setFamilyData] = useState({ family: null, members: [] });
  const [campVisits, setCampVisits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Medical Camps State
  const [campsList, setCampsList] = useState([]);
  const [registeredCampIds, setRegisteredCampIds] = useState([]);
  const [campRegisteringId, setCampRegisteringId] = useState(null);
  const [campFeedbackMsg, setCampFeedbackMsg] = useState("");

  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showChangeMobile, setShowChangeMobile] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  // Add Family Member Form State
  const [familyForm, setFamilyForm] = useState({
    name: "",
    relation: "Spouse",
    mobile: "",
    age: "",
    gender: "Female",
    bloodGroup: "",
  });
  const [familyLoading, setFamilyLoading] = useState(false);
  const [familyMsg, setFamilyMsg] = useState("");

  // Change Mobile OTP State
  const [newMobile, setNewMobile] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const [mobileMsg, setMobileMsg] = useState("");

  // Load Patient Profile & 360 data
  const loadPatientProfile = async () => {
    try {
      setLoading(true);
      // Fetch session or current patient
      const sessRes = await fetch("/api/auth/patient-session");
      const sessData = await sessRes.json();

      if (!sessData.loggedIn || !sessData.patient) {
        router.push("/patient/login");
        return;
      }

      const pId = sessData.patient.patientDbId || sessData.patient.patientId;
      
      // Fetch full 360 profile
      const res = await fetch(`/api/admin/health-cards/${pId}`);
      const data = await res.json();

      if (data.success && data.patient) {
        setPatientData(data.patient);
        setEditForm({ ...data.patient });
        setCampVisits(data.campVisits || []);
        setBookings([
          ...(data.appointments || []),
          ...(data.physioBookings || []),
          ...(data.icuRequests || []).map(r => ({
            bookingId: r.requestId,
            category: "ICU at Home",
            service: r.careType,
            date: r.startDate,
            time: r.duration,
            status: r.status,
            paymentStatus: r.paymentStatus,
            doctor: r.condition,
            isIcu: true,
            icuData: r
          }))
        ]);
        setPayments(data.payments || []);
        setNotifications(data.notifications || []);
        
        // Fetch family
        if (data.patient.familyId) {
          const famRes = await fetch(`/api/health-card/family?familyId=${data.patient.familyId}`);
          const famData = await famRes.json();
          if (famData.success) {
            setFamilyData({ family: famData.family, members: famData.members || [] });
          }
        }

        // Fetch upcoming & active medical camps
        try {
          const campPId = data.patient.patientId;
          const campsRes = await fetch(`/api/camps?patientId=${campPId}`);
          const campsData = await campsRes.json();
          if (campsData.success) {
            setCampsList(campsData.camps || []);
            setRegisteredCampIds(campsData.registeredCampIds || []);
          }
        } catch (cErr) {
          console.error("Fetch camps error:", cErr);
        }
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Camp Registration Handler
  const handleRegisterForCamp = async (campId) => {
    if (!patientData) return;
    setCampRegisteringId(campId);
    setCampFeedbackMsg("");
    try {
      const res = await fetch("/api/camps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campId,
          patientId: patientData.patientId,
          name: patientData.name,
          mobile: patientData.mobile,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredCampIds((prev) => [...prev, campId]);
        setCampFeedbackMsg("🎉 Registration Successful! Your Health Card ID is your Camp Entry Pass.");
        setTimeout(() => setCampFeedbackMsg(""), 5000);
      } else {
        setCampFeedbackMsg(data.message || "Camp registration failed");
      }
    } catch {
      setCampFeedbackMsg("Failed to register for camp. Please try again.");
    } finally {
      setCampRegisteringId(null);
    }
  };

  useEffect(() => {
    loadPatientProfile();
  }, []);

  // Open Edit Modal with complete Health Card & Profile form values
  const handleOpenEditModal = () => {
    const p = patientData || {};
    const card = p.healthCardDetails || {};
    const effectivePhoto = card.photo || p.photo || "";
    setEditForm({
      name: card.name || p.name || "",
      email: p.email || "",
      gender: card.gender || p.gender || "Male",
      dob: card.dob || p.dob || "",
      age: card.age !== undefined && card.age !== null ? card.age : (p.age !== undefined ? p.age : ""),
      mobile: p.mobile || "",
      whatsappNumber: card.whatsappNumber || p.whatsappNumber || p.mobile || "",
      sameAsMobile: !card.whatsappNumber || card.whatsappNumber === p.mobile,
      bloodGroup: card.bloodGroup || p.bloodGroup || "",
      city: card.city || p.city || "Lucknow",
      area: card.area || p.area || "",
      address: card.address || p.address || "",
      pincode: card.pincode || p.pincode || "",
      emergencyContactName: card.emergencyContactName || p.emergencyContactName || "",
      emergencyContactPhone: card.emergencyContactPhone || p.emergencyContactPhone || "",
      emergencyContactRelation: card.emergencyContactRelation || p.emergencyContactRelation || "Spouse",
      existingConditions: card.existingConditions || p.existingConditions || "",
      allergies: card.allergies || p.allergies || "",
      photo: effectivePhoto,
    });
    setPhotoPreview(effectivePhoto || null);
    setPhotoError("");
    setEditMsg("");
    setShowEditProfile(true);
  };

  // Handle Save Health Card & Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditMsg("");

    try {
      const res = await fetch("/api/health-card/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientData.patientId,
          ...editForm,
          whatsappNumber: editForm.sameAsMobile ? editForm.mobile : editForm.whatsappNumber,
          updatedBy: "Patient Self-Service",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPatientData(data.patient);
        setEditMsg("Health Card & Profile updated successfully!");
        setTimeout(() => {
          setShowEditProfile(false);
          setEditMsg("");
        }, 1800);
      } else {
        setEditMsg(data.message || "Failed to update details");
      }
    } catch (err) {
      setEditMsg("Error updating profile and health card");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Add Family Member
  const handleAddFamilyMember = async (e) => {
    e.preventDefault();
    if (!familyForm.name.trim()) return;

    setFamilyLoading(true);
    setFamilyMsg("");

    try {
      const res = await fetch("/api/health-card/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryPatientId: patientData.patientId,
          familyId: patientData.familyId,
          ...familyForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFamilyMsg(`Family member added with Permanent ID ${data.member.patientId}!`);
        // Refresh family
        const famRes = await fetch(`/api/health-card/family?familyId=${patientData.familyId}`);
        const famData = await famRes.json();
        if (famData.success) setFamilyData({ family: famData.family, members: famData.members });

        setTimeout(() => {
          setShowAddFamily(false);
          setFamilyMsg("");
          setFamilyForm({ name: "", relation: "Spouse", mobile: "", age: "", gender: "Female", bloodGroup: "" });
        }, 2000);
      } else {
        setFamilyMsg(data.message || "Failed to add family member");
      }
    } catch {
      setFamilyMsg("Error adding member");
    } finally {
      setFamilyLoading(false);
    }
  };

  // Handle Change Mobile Number with OTP
  const handleSendMobileOtp = async () => {
    const clean = newMobile.replace(/[^0-9]/g, "").slice(-10);
    if (clean.length < 10) {
      setMobileMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setMobileOtpLoading(true);
    setMobileMsg("");
    try {
      const res = await fetch("/api/health-card/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: clean }),
      });
      const data = await res.json();
      if (data.success) {
        setMobileOtpSent(true);
        setMobileMsg(`OTP sent to new mobile: ${clean}. (Instant code: ${data.otp || "123456"})`);
      } else {
        setMobileMsg(data.message || "Error sending OTP");
      }
    } catch {
      setMobileMsg("Failed to send OTP");
    } finally {
      setMobileOtpLoading(false);
    }
  };

  const handleVerifyNewMobile = async () => {
    const clean = newMobile.replace(/[^0-9]/g, "").slice(-10);
    if (!mobileOtp || mobileOtp.length < 4) {
      setMobileMsg("Please enter the verification OTP");
      return;
    }

    setMobileOtpLoading(true);
    setMobileMsg("");

    try {
      const verifyRes = await fetch("/api/health-card/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: clean, otp: mobileOtp }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setMobileMsg(verifyData.message || "Invalid OTP code");
        setMobileOtpLoading(false);
        return;
      }

      // OTP verified! Now update the patient record
      const updateRes = await fetch("/api/health-card/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientData.patientId,
          mobile: clean,
          updatedBy: "Patient Mobile Change Verified",
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        setPatientData(updateData.patient);
        setMobileMsg("Mobile number updated successfully! Permanent Patient ID remains unchanged.");
        setTimeout(() => {
          setShowChangeMobile(false);
          setMobileOtpSent(false);
          setNewMobile("");
          setMobileOtp("");
          setMobileMsg("");
        }, 2000);
      } else {
        setMobileMsg(updateData.message || "Failed to update mobile");
      }
    } catch {
      setMobileMsg("Verification error");
    } finally {
      setMobileOtpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#006837] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-600">Loading your Patient Portal...</p>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Patient Profile Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">Please log in with your registered mobile number.</p>
          <button
            onClick={() => router.push("/patient/login")}
            className="w-full py-2.5 bg-[#006837] text-white rounded-xl text-xs font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "card", label: "My Health Card", icon: CreditCard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "camps", label: "Free Health Camps", icon: Stethoscope, badge: campsList.length || null, highlight: "Free Camps" },
    { id: "family", label: "My Family", icon: Users, badge: familyData.members.length || null },
    { id: "bookings", label: "My Bookings", icon: CalendarCheck, badge: bookings.length || null },
    { id: "health", label: "My Health Records", icon: Activity, badge: campVisits.length || null },
    { id: "payments", label: "My Payments", icon: Receipt },
    { id: "offers", label: "My Offers", icon: Percent },
    { id: "rewards", label: "My Rewards", icon: Award, highlight: `${patientData.rewardCoinsBalance || 0} Coins` },
    { id: "followups", label: "My Follow-ups", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notifications.length || null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Top Header Strip */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Brand & Patient Identification */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center">
              <img src="/Dr.Jhatka.png" alt="Dr Jhatka Medicare" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                  {patientData.name}
                </h1>
                <span className="bg-[#004d26] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                  {patientData.patientId}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Family ID: <strong>{patientData.familyId || "N/A"}</strong> • Lifetime Free Health Card
              </p>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-[#006837] px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{patientData.rewardCoinsBalance || 0} Health Coins</span>
            </div>

            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold text-gray-600 transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition whitespace-nowrap border-b-2 ${
                  isSelected
                    ? "border-[#006837] text-[#006837] bg-emerald-50/60"
                    : "border-transparent text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="px-1.5 py-0.2 bg-gray-200 text-gray-700 text-[10px] rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
                {tab.highlight ? (
                  <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9.5px] rounded-full">
                    {tab.highlight}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ============================================================== */}
        {/* TAB 1: MY HEALTH CARD */}
        {/* ============================================================== */}
        {activeTab === "card" && (
          <div className="space-y-6">
            {/* Upcoming Camp Highlight Banner */}
            {campsList.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-800 via-[#006837] to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-500 text-white text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full">
                        📢 UPCOMING FREE CAMP
                      </span>
                      <span className="text-xs font-extrabold text-emerald-100">
                        {campsList[0].city || "Lucknow"}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black leading-snug">
                      {campsList[0].name}
                    </h4>
                    <p className="text-xs text-emerald-100/90 mt-0.5">
                      📅 {campsList[0].date} ({campsList[0].time}) • 📍 {campsList[0].location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab("camps")}
                    className="px-4 py-2.5 bg-white text-[#006837] hover:bg-emerald-50 rounded-xl text-xs font-black shadow-sm transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>View Camps & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <span>Dr Jhatka Medicare Digital Health Card</span>
                  <span className="text-xs bg-emerald-100 text-[#006837] px-2 py-0.5 rounded-full font-bold">
                    V{patientData.cardVersion || 1}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Permanent Lifetime ID: <strong>{patientData.patientId}</strong>. Use at any Dr Jhatka Medicare Clinic, Camp, or Home Visit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEditModal}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006837] rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update Card Info</span>
                </button>
              </div>
            </div>

            {/* Health Card Component */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
              <HealthCard patient={patientData} showActions={true} onUpdate={loadPatientProfile} />
            </div>

            {/* Card Version History */}
            {patientData.cardHistory && patientData.cardHistory.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Card Version History
                </h3>
                <div className="space-y-2 text-xs">
                  {patientData.cardHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-none">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">Version {h.version}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{h.updatedFields?.join(", ") || "Update"}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(h.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MY PROFILE */}
        {/* ============================================================== */}
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upcoming Camp Highlight in Profile */}
            {campsList.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-800 via-[#006837] to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-500 text-white text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full">
                        📢 UPCOMING FREE CAMP
                      </span>
                      <span className="text-xs font-extrabold text-emerald-100">
                        {campsList[0].city || "Lucknow"}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black leading-snug">
                      {campsList[0].name}
                    </h4>
                    <p className="text-xs text-emerald-100/90 mt-0.5">
                      📅 {campsList[0].date} ({campsList[0].time}) • 📍 {campsList[0].location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab("camps")}
                    className="px-4 py-2.5 bg-white text-[#006837] hover:bg-emerald-50 rounded-xl text-xs font-black shadow-sm transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>View Camps & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personal & Healthcare Profile</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your permanent record is linked to ID: <strong className="text-[#006837]">{patientData.patientId}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChangeMobile(true)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Change Mobile</span>
                </button>
                <button
                  onClick={handleOpenEditModal}
                  className="px-4 py-1.5 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update Card & Profile</span>
                </button>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Full Name</span>
                <span className="text-sm font-bold text-gray-900">{patientData.name}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Permanent Patient ID</span>
                <span className="text-sm font-black font-mono text-[#006837]">{patientData.patientId}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Family ID</span>
                <span className="text-sm font-bold text-gray-800">{patientData.familyId || "None"}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Primary Mobile</span>
                <span className="text-sm font-bold text-gray-900">+91 {patientData.mobile}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">WhatsApp Number</span>
                <span className="text-sm font-bold text-gray-900">+91 {patientData.whatsappNumber || patientData.mobile}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Email Address</span>
                <span className="text-sm font-medium text-gray-900">
                  {patientData.email || <span className="text-amber-600 font-semibold italic">Not added yet</span>}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Age & Gender</span>
                <span className="text-sm font-medium text-gray-900">
                  {patientData.age ? `${patientData.age} Years` : "Not specified"} • {patientData.gender || "Not specified"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Blood Group</span>
                <span className="text-sm font-bold text-red-600">
                  {patientData.bloodGroup || <span className="text-gray-400 font-normal italic">Not added yet</span>}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Senior Citizen Status</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                  patientData.isSeniorCitizen ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                }`}>
                  {patientData.isSeniorCitizen ? "Eligible (70+ Benefit Active)" : "Not Eligible"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">City & Area</span>
                <span className="text-sm font-medium text-gray-900">
                  {patientData.area ? `${patientData.area}, ` : ""}{patientData.city || "Lucknow"}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Address</span>
                <span className="text-sm font-medium text-gray-900">
                  {patientData.address || <span className="text-gray-400 italic">No street address saved</span>}
                </span>
              </div>

              <div className="sm:col-span-3 pt-3 border-t border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Emergency Contact</span>
                <span className="text-sm font-medium text-gray-900">
                  {patientData.emergencyContactName ? (
                    <>
                      <strong>{patientData.emergencyContactName}</strong> ({patientData.emergencyContactRelation || "Relative"}) — +91 {patientData.emergencyContactPhone}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">No emergency contact saved yet</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: FREE HEALTH CAMPS */}
        {/* ============================================================== */}
        {activeTab === "camps" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-gray-900">Dr Jhatka Free Medical Camps</h2>
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Free Community Service
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  100% Free Blood Pressure, Sugar, BMI checks, Physiotherapy Consultations & Free Digital Health Card for all Lucknow residents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:+918874744756"
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006837] rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Camp Helpline: 8874744756</span>
                </a>
              </div>
            </div>

            {campFeedbackMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006837] shrink-0" />
                <span>{campFeedbackMsg}</span>
              </div>
            )}

            {/* SECTION 1: UPCOMING & ACTIVE CAMPS LIST */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#006837]" />
                  <span>Upcoming & Active Camps in Lucknow</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {campsList.length} Camp{campsList.length === 1 ? "" : "s"} scheduled
                </span>
              </div>

              {campsList.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-400">
                  <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-600" />
                  <p className="text-sm font-bold text-gray-700">No active camps scheduled right now</p>
                  <p className="text-xs text-gray-500 mt-1">Check back soon! Dr Jhatka Medicare organizes regular health check-up camps across Lucknow.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {campsList.map((c) => {
                    const isRegistered = registeredCampIds.includes(c.campId);
                    const isRegistering = campRegisteringId === c.campId;
                    return (
                      <div
                        key={c.campId}
                        className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Camp Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  c.status === "Active" ? "bg-red-500 text-white" : "bg-emerald-100 text-[#006837]"
                                }`}>
                                  {c.status === "Active" ? "LIVE TODAY" : "UPCOMING"}
                                </span>
                                <span className="text-[11px] font-mono text-gray-400 font-bold">
                                  {c.campId}
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                                {c.name}
                              </h4>
                            </div>
                            {isRegistered && (
                              <span className="shrink-0 bg-emerald-100 text-[#006837] text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Pass Active</span>
                              </span>
                            )}
                          </div>

                          {/* Camp Date, Time, Venue */}
                          <div className="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-4 text-xs">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4 text-[#006837] shrink-0" />
                              <span className="font-extrabold">{c.date}</span>
                              <span className="text-gray-400">•</span>
                              <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                              <span>{c.time}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-gray-900">{c.location}</span>
                                {c.address && (
                                  <p className="text-[11px] text-gray-500 leading-tight">{c.address}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Free checks included */}
                          <div className="mb-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                              Free Screenings & Consultations:
                            </p>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                                Free BP Check
                              </span>
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                                Free Sugar (RBS)
                              </span>
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                                Free BMI Check
                              </span>
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                                Physio Consultation
                              </span>
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                                Permanent Health Card
                              </span>
                            </div>
                          </div>

                          {/* Staff on Duty */}
                          {c.assignedStaff && c.assignedStaff.length > 0 && (
                            <div className="mb-4 text-xs">
                              <span className="text-[11px] font-bold text-gray-400 block mb-1">Attending Doctors & Staff:</span>
                              <div className="flex flex-wrap gap-2">
                                {c.assignedStaff.map((st, idx) => (
                                  <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                                    👨‍⚕️ <strong>{st.name}</strong> ({st.role})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                          <span className="text-[11px] text-gray-500">
                            {c.totalRegistered || 0} registered • 100% Free
                          </span>

                          {isRegistered ? (
                            <button
                              onClick={() => setActiveTab("card")}
                              className="px-4 py-2 bg-emerald-50 text-[#006837] border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Show Health Card ID at Camp</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegisterForCamp(c.campId)}
                              disabled={isRegistering}
                              className="px-5 py-2.5 bg-[#006837] hover:bg-[#00502a] text-white rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                            >
                              {isRegistering ? (
                                <span>Registering...</span>
                              ) : (
                                <>
                                  <span>1-Click Register for Camp</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: ATTENDED CAMP VISITS & HEALTH VITALS RECORD */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#006837]" />
                  <span>My Attended Camp Health Checkup Records</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {campVisits.length} record{campVisits.length === 1 ? "" : "s"}
                </span>
              </div>

              {campVisits.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-400">
                  <Activity className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-600" />
                  <p className="text-sm font-bold text-gray-700">No Camp Health Records Yet</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    When you attend any Dr Jhatka Medicare Free Camp, your Blood Pressure, Sugar, BMI and doctor notes will be recorded here automatically under your Health Card ID ({patientData.patientId}).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campVisits.map((v, i) => (
                    <div key={i} className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-gray-900">{v.campName || v.campId}</h4>
                            <span className="bg-emerald-100 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Camp Checkup Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {new Date(v.visitDate).toLocaleDateString()} • {v.location || "Lucknow"} • Staff: {v.registeredBy || "Camp Medical Staff"}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-400">
                          {v.campId}
                        </span>
                      </div>

                      {/* Vitals Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs mb-4">
                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">Blood Pressure</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic} mmHg` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">Sugar (RBS)</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.sugarRBS ? `${v.sugarRBS} mg/dL` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">SpO2 Oxygen</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.spo2 ? `${v.spo2}%` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">Pulse Rate</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.pulse ? `${v.pulse} bpm` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">Weight / Height</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.weight ? `${v.weight} kg` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] text-gray-500 font-bold block">Body Mass Index</span>
                          <span className="text-sm font-black text-gray-900">
                            {v.bmi || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Doctor & Physiotherapy Advice */}
                      {(v.physiotherapyAdvice || v.doctorNotes) && (
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs space-y-1">
                          {v.physiotherapyAdvice && (
                            <p className="text-emerald-950">
                              <strong>Physiotherapy Advice:</strong> {v.physiotherapyAdvice}
                            </p>
                          )}
                          {v.doctorNotes && (
                            <p className="text-gray-700">
                              <strong>Doctor Notes:</strong> {v.doctorNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MY FAMILY */}
        {/* ============================================================== */}
        {activeTab === "family" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Family Account</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Family ID: <strong className="text-[#006837]">{patientData.familyId}</strong> • Each member has their own separate Permanent Patient ID.
                </p>
              </div>
              <button
                onClick={() => setShowAddFamily(true)}
                className="px-4 py-2 bg-[#006837] hover:bg-[#004d26] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Family Member</span>
              </button>
            </div>

            {/* Family Members List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Primary Head Card */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400 shadow-sm relative">
                <div className="absolute top-3 right-3 bg-emerald-100 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Primary / Head
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#006837] flex items-center justify-center font-bold mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">{patientData.name}</h3>
                <p className="text-xs text-[#006837] font-mono font-bold mt-0.5">{patientData.patientId}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <p>Mobile: +91 {patientData.mobile}</p>
                  <p>Blood Group: <strong>{patientData.bloodGroup || "Not added"}</strong></p>
                  <p>Card Status: <span className="text-emerald-700 font-bold">{patientData.cardStatus}</span></p>
                </div>
              </div>

              {/* Linked Members */}
              {familyData.members
                .filter((m) => m.patientId !== patientData.patientId)
                .map((m) => (
                  <div key={m.patientId} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative">
                    <div className="absolute top-3 right-3 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {m.relation}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-900">{m.name}</h3>
                    <p className="text-xs text-[#006837] font-mono font-bold mt-0.5">{m.patientId}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                      <p>Age: {m.age ? `${m.age} Yrs` : "N/A"} • {m.gender || "N/A"}</p>
                      <p>Blood Group: <strong>{m.bloodGroup || "N/A"}</strong></p>
                      <p>Card Status: <span className="text-emerald-700 font-bold">{m.cardStatus || "ACTIVE"}</span></p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
                      <a
                        href={`/verify-card/${m.qrToken || m.patientId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#006837] font-bold hover:underline"
                      >
                        View Verification Card →
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MY BOOKINGS & SERVICES */}
        {/* ============================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Appointments & Services</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  All clinical visits, doctor consultations, physiotherapy sessions, and home care linked to ID: <strong>{patientData.patientId}</strong>
                </p>
              </div>
              <Link
                href="/services"
                className="px-4 py-2 bg-[#006837] text-white rounded-xl text-xs font-bold hover:bg-[#004d26] transition"
              >
                Book New Service
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
                <CalendarCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-gray-600">No active bookings found</p>
                <p className="text-xs mt-1">Book home physiotherapy, doctor visit, or ambulance anytime.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{b.bookingId || `BK-${i + 1}`}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {b.category || b.departmentId?.name || "Medical Service"}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1">
                        Date: <strong>{b.date || b.preferredDate || b.appointmentDate || "Scheduled"}</strong> at {b.time || b.preferredTime || b.appointmentTime || "Daytime"}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Assigned: {b.doctor || b.doctorAssigned || b.assignedTherapistId?.name || "Dr Jhatka Team"}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status || b.bookingStatus || "Confirmed"}
                      </span>
                      <span className="text-gray-500 font-semibold">
                        Payment: <strong className="text-gray-800">{b.paymentStatus || "Pending"}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MY HEALTH RECORDS */}
        {/* ============================================================== */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Health Checkup Records & Vitals</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Vitals and physician advice recorded at Dr Jhatka Medicare Medical Camps and clinic visits.
              </p>
            </div>

            {campVisits.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-gray-600">No camp health check records yet</p>
                <p className="text-xs mt-1">Participate in our free community health checkup camps to get your vitals tracked here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campVisits.map((v, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900">{v.campName || v.campId}</h3>
                        <p className="text-[11px] text-gray-500">
                          {new Date(v.visitDate).toLocaleDateString()} • {v.location || "Lucknow"}
                        </p>
                      </div>
                      <span className="bg-emerald-100 text-[#006837] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs mb-4">
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">Blood Pressure</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic}` : "N/A"}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">Sugar (RBS)</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.sugarRBS ? `${v.sugarRBS} mg/dL` : "N/A"}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">SpO2</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.spo2 ? `${v.spo2}%` : "N/A"}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">Pulse Rate</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.pulse ? `${v.pulse} bpm` : "N/A"}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">Weight</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.weight ? `${v.weight} kg` : "N/A"}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400 font-bold block">BMI</span>
                        <span className="text-sm font-black text-gray-900">
                          {v.bmi || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Advice Notes */}
                    {(v.physiotherapyAdvice || v.doctorNotes) && (
                      <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-xs space-y-1">
                        {v.physiotherapyAdvice && (
                          <p className="text-emerald-950">
                            <strong>Physiotherapy Advice:</strong> {v.physiotherapyAdvice}
                          </p>
                        )}
                        {v.doctorNotes && (
                          <p className="text-gray-700">
                            <strong>Doctor Notes:</strong> {v.doctorNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: MY PAYMENTS */}
        {/* ============================================================== */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Payment & Billing History</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                All receipts, UPI payments, and invoices linked to ID: <strong>{patientData.patientId}</strong>
              </p>
            </div>

            {payments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
                <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-gray-600">No payment transactions found</p>
                <p className="text-xs mt-1">Receipts for future clinic treatments or physiotherapy sessions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-sm text-gray-900">INR {p.amount}</p>
                      <p className="text-gray-500 text-[11px]">Booking ID: {p.bookingId} • Method: {p.paymentMethod || "UPI"}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {p.status || "Paid"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: MY OFFERS & BENEFITS */}
        {/* ============================================================== */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Cardholder Offers & Benefits</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Exclusive privileges for Dr Jhatka Medicare Free Health Card members.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Senior Citizen Privilege */}
              <div className={`p-6 rounded-3xl border ${
                patientData.isSeniorCitizen ? "bg-amber-50/70 border-amber-300" : "bg-white border-gray-200 opacity-70"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-sm text-gray-900">Senior Citizen Care Benefit (70+)</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Free quarterly clinic screening and 15% discount on selected home physiotherapy packages for elderly citizens aged 70 and above.
                </p>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  patientData.isSeniorCitizen ? "bg-amber-200 text-amber-900" : "bg-gray-100 text-gray-500"
                }`}>
                  {patientData.isSeniorCitizen ? "Active for your Account" : "Eligibility: Age 70+"}
                </span>
              </div>

              {/* Free Medical Camp Privilege */}
              <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#006837]" />
                  <h3 className="font-bold text-sm text-gray-900">Free Health Checkup Camps</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Zero waiting registration and free vitals screening at all Dr Jhatka Medicare Community Camps with your Permanent Patient ID.
                </p>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900">
                  Active for Lifetime
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: MY REWARDS */}
        {/* ============================================================== */}
        {activeTab === "rewards" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#004d26] to-[#006837] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider block mb-1">
                  Loyalty Rewards Wallet
                </span>
                <h2 className="text-3xl sm:text-4xl font-black">
                  {patientData.rewardCoinsBalance || 0} <span className="text-base font-normal">Coins</span>
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  1 Coin = 1 INR discount redeemable against physiotherapy sessions and lab bookings.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs">
                <p className="font-bold text-white">How to earn more coins:</p>
                <ul className="text-emerald-100 mt-1 space-y-0.5 text-[11px]">
                  <li>• Attend Health Camp: +20 Coins</li>
                  <li>• Repeat Bookings: +50 Coins</li>
                  <li>• Refer a Family Member: +50 Coins</li>
                </ul>
              </div>
            </div>

            {/* History */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Coins Transaction Log
              </h3>
              <div className="space-y-2 text-xs">
                {(patientData.rewardHistory || []).map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-none">
                    <div>
                      <span className="font-bold text-gray-900">{r.reason}</span>
                      <span className="text-[11px] text-gray-400 block">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`font-black text-sm ${r.type === "Earned" ? "text-emerald-600" : "text-red-500"}`}>
                      {r.type === "Earned" ? `+${r.coins}` : `-${r.coins}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: MY FOLLOW-UPS */}
        {/* ============================================================== */}
        {activeTab === "followups" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Care Follow-up Timeline</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Current Care Status: <strong className="text-[#006837]">{patientData.followupStatus || "Active"}</strong>
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs text-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-500">Next Scheduled Check:</span>
                <span className="font-bold text-gray-900">
                  {patientData.followupDate ? new Date(patientData.followupDate).toLocaleDateString() : "Routine care as needed"}
                </span>
              </div>
              {patientData.followupNotes && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-bold block mb-1">Clinical Remarks</span>
                  <p className="text-gray-700">{patientData.followupNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: NOTIFICATIONS */}
        {/* ============================================================== */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Notifications & Alerts</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Important updates regarding your health card, camp checkups, and booking confirmations.
              </p>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-gray-600">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#006837] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900">{n.title}</h4>
                        <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT PROFILE / ADD MISSING INFORMATION */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* MODAL 1: EDIT PROFILE & HEALTH CARD (ALL OPTIONS) */}
      {/* ============================================================== */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Update Health Card & Profile</h3>
                <p className="text-[11px] text-gray-500">
                  Permanent Patient ID: <strong className="text-[#006837]">{patientData.patientId}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {editMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{editMsg}</span>
              </div>
            )}

            {photoError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Basic Information</span>
                </h4>

                {/* Full Name */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. Rahul Kumar Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                  />
                </div>

                {/* Gender & Age & DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Gender</label>
                    <select
                      value={editForm.gender || "Male"}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Date of Birth (DOB)</label>
                    <input
                      type="date"
                      value={editForm.dob || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const birthYear = new Date(val).getFullYear();
                        const calculatedAge = !isNaN(birthYear) ? new Date().getFullYear() - birthYear : editForm.age;
                        setEditForm({ ...editForm, dob: val, age: calculatedAge });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={editForm.age ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      placeholder="e.g. 28"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>

                {/* Mobile & WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Mobile</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        disabled
                        value={editForm.mobile ? `+91 ${editForm.mobile}` : ""}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-xs font-mono font-bold cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      To change primary mobile, use the "Change Mobile" button.
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">WhatsApp Number</label>
                      <label className="flex items-center gap-1 cursor-pointer text-[11px] text-emerald-800 font-medium">
                        <input
                          type="checkbox"
                          checked={editForm.sameAsMobile ?? true}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEditForm({
                              ...editForm,
                              sameAsMobile: checked,
                              whatsappNumber: checked ? editForm.mobile : editForm.whatsappNumber,
                            });
                          }}
                          className="rounded text-[#006837] focus:ring-[#006837]"
                        />
                        <span>Same as Mobile</span>
                      </label>
                    </div>

                    <input
                      type="tel"
                      disabled={editForm.sameAsMobile}
                      maxLength={10}
                      value={editForm.sameAsMobile ? (editForm.mobile || "") : (editForm.whatsappNumber || "")}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          whatsappNumber: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      placeholder="e.g. 9876543210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs ${
                        editForm.sameAsMobile ? "bg-gray-50 text-gray-500" : "focus:ring-2 focus:ring-[#006837]/30"
                      }`}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                  />
                </div>

                {/* Passport Size Photo Upload */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Passport Size Photo <span className="text-gray-400 font-normal">(Max 30KB)</span>
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    {photoPreview ? (
                      <div className="w-14 h-16 rounded-xl overflow-hidden border border-emerald-300 bg-white shrink-0 shadow-xs relative">
                        <img
                          src={photoPreview.startsWith('/') ? photoPreview : photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-16 rounded-xl border border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 shrink-0">
                        <User className="w-6 h-6 text-gray-300" />
                        <span className="text-[8px] font-bold mt-0.5">NO PHOTO</span>
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-[#006837] hover:file:bg-emerald-200 transition-all cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          if (file.size > 30 * 1024) {
                            setPhotoError("Image size must be less than 30KB. Please compress your image.");
                            e.target.value = "";
                            return;
                          }

                          setPhotoError("");
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhotoPreview(reader.result);
                            setEditForm({ ...editForm, photo: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setEditForm({ ...editForm, photo: "" });
                          }}
                          className="text-[10px] text-red-600 hover:underline font-semibold block"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LOCATION DETAILS */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Location Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city || ""}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      placeholder="Lucknow"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Area / Locality</label>
                    <input
                      type="text"
                      value={editForm.area || ""}
                      onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                      placeholder="e.g. Gomti Nagar, Aliganj"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editForm.pincode || ""}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="e.g. 226010"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Address (Optional)</label>
                  <input
                    type="text"
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="House / Flat / Street address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                  />
                </div>
              </div>

              {/* SECTION 3: HEALTH & EMERGENCY CONTACT */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Health & Emergency Contact</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                    <select
                      value={editForm.bloodGroup || ""}
                      onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    >
                      <option value="">Don't know / Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Emergency Contact Relation</label>
                    <select
                      value={editForm.emergencyContactRelation || "Spouse"}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContactRelation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={editForm.emergencyContactName || ""}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContactName: e.target.value })}
                      placeholder="e.g. Suman Devi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Emergency Phone Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={editForm.emergencyContactPhone || ""}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContactPhone: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Existing Medical Conditions (Optional)</label>
                    <input
                      type="text"
                      value={editForm.existingConditions || ""}
                      onChange={(e) => setEditForm({ ...editForm, existingConditions: e.target.value })}
                      placeholder="e.g. Hypertension, Diabetes, None"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Known Allergies (Optional)</label>
                    <input
                      type="text"
                      value={editForm.allergies || ""}
                      onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Dust, None"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
                    />
                  </div>
                </div>
              </div>

              {/* Informative Note */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Updating these options will instantly synchronize both your <strong>Digital Health Card</strong> and your permanent healthcare record.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 bg-[#006837] text-white rounded-xl font-bold hover:bg-[#004d26] transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{editLoading ? "Updating..." : "Save & Update Health Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD FAMILY MEMBER */}
      {/* ============================================================== */}
      {showAddFamily && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">+ Add Family Member</h3>
                <p className="text-[11px] text-gray-500">Linked to Family ID: <strong>{patientData.familyId}</strong></p>
              </div>
              <button onClick={() => setShowAddFamily(false)} className="text-gray-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            {familyMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {familyMsg}
              </div>
            )}

            <form onSubmit={handleAddFamilyMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Member Full Name *</label>
                <input
                  type="text"
                  required
                  value={familyForm.name}
                  onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
                  placeholder="e.g. Suman Devi"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Relationship *</label>
                  <select
                    value={familyForm.relation}
                    onChange={(e) => setFamilyForm({ ...familyForm, relation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={familyForm.gender}
                    onChange={(e) => setFamilyForm({ ...familyForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={familyForm.age}
                    onChange={(e) => setFamilyForm({ ...familyForm, age: e.target.value })}
                    placeholder="e.g. 28"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={familyForm.bloodGroup}
                    onChange={(e) => setFamilyForm({ ...familyForm, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="">Optional</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Member Mobile (Optional)</label>
                <input
                  type="tel"
                  value={familyForm.mobile}
                  onChange={(e) => setFamilyForm({ ...familyForm, mobile: e.target.value })}
                  placeholder="Leave empty for minor child"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <p className="text-[11px] text-gray-400">
                🔒 Every family member receives their own unique Permanent Patient ID and Free Health Card!
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={familyLoading}
                  className="px-5 py-2 bg-[#006837] text-white rounded-xl font-bold hover:bg-[#004d26] transition disabled:opacity-50"
                >
                  {familyLoading ? "Adding..." : "Add Member & Generate ID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CHANGE MOBILE NUMBER WITH OTP */}
      {/* ============================================================== */}
      {showChangeMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Change Mobile Number</h3>
                <p className="text-[11px] text-gray-500">Current: +91 {patientData.mobile}</p>
              </div>
              <button onClick={() => setShowChangeMobile(false)} className="text-gray-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            {mobileMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {mobileMsg}
              </div>
            )}

            {!mobileOtpSent ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">New 10-Digit Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <button
                  onClick={handleSendMobileOtp}
                  disabled={mobileOtpLoading || newMobile.length < 10}
                  className="w-full py-2.5 bg-[#006837] text-white rounded-xl font-bold hover:bg-[#004d26] transition disabled:opacity-50"
                >
                  {mobileOtpLoading ? "Sending..." : "Send Verification OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Enter OTP sent to +91 {newMobile}</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-center tracking-widest text-base font-black"
                  />
                </div>
                <button
                  onClick={handleVerifyNewMobile}
                  disabled={mobileOtpLoading || mobileOtp.length < 4}
                  className="w-full py-2.5 bg-[#006837] text-white rounded-xl font-bold hover:bg-[#004d26] transition disabled:opacity-50"
                >
                  {mobileOtpLoading ? "Verifying..." : "Verify & Update Mobile"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006837] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PatientDashboardContent />
    </Suspense>
  );
}

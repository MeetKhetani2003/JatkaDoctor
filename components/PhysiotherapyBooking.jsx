"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  MapPin, 
  Calendar as CalIcon, 
  Clock, 
  HelpCircle,
  Stethoscope,
  Activity,
  UserPlus,
  CheckCircle,
  Sparkles,
  FileText,
  Baby,
  HeartPulse,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBookingModal } from '@/context/BookingModalContext';
import { usePatientAuth } from '@/context/PatientAuthContext';

export const getEffectivePrice = (pkg) => {
  if (!pkg) return 0;
  if (pkg.offerPrice && pkg.basePrice && pkg.offerPrice < pkg.basePrice) {
    return pkg.offerPrice;
  }
  return pkg.offerPrice || pkg.basePrice || 0;
};

// Render department photo uploaded by admin, or specialty-specific thematic icon
const renderDepartmentVisual = (dept) => {
  const imgSrc = dept?.icon || dept?.image;
  const isImageFile = imgSrc && (
    imgSrc.startsWith("http") ||
    imgSrc.startsWith("data:") ||
    imgSrc.startsWith("/uploads") ||
    imgSrc.startsWith("/api") ||
    imgSrc.includes(".png") ||
    imgSrc.includes(".jpg") ||
    imgSrc.includes(".jpeg") ||
    imgSrc.includes(".webp") ||
    imgSrc.includes(".svg")
  );

  if (isImageFile) {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-emerald-100 shadow-xs bg-emerald-50/50 mb-3 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <img
          src={imgSrc}
          alt={dept.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  const name = dept?.name?.toLowerCase() || "";
  let iconComp = <Stethoscope size={28} className="text-[#006837]" />;
  let bgClass = "bg-emerald-50 border-emerald-100";

  if (name.includes("pediatric") || name.includes("child")) {
    iconComp = <Baby size={28} className="text-pink-600" />;
    bgClass = "bg-pink-50 border-pink-100";
  } else if (name.includes("women") || name.includes("gynec") || name.includes("maternity")) {
    iconComp = <HeartPulse size={28} className="text-purple-600" />;
    bgClass = "bg-purple-50 border-purple-100";
  } else if (name.includes("neuro") || name.includes("paralysis") || name.includes("stroke")) {
    iconComp = <Activity size={28} className="text-indigo-600" />;
    bgClass = "bg-indigo-50 border-indigo-100";
  } else if (name.includes("sport") || name.includes("fitness")) {
    iconComp = <Activity size={28} className="text-amber-600" />;
    bgClass = "bg-amber-50 border-amber-100";
  } else if (name.includes("geriatric") || name.includes("elderly")) {
    iconComp = <HeartPulse size={28} className="text-teal-600" />;
    bgClass = "bg-teal-50 border-teal-100";
  }

  return (
    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-xs mb-3 group-hover:scale-105 transition-transform ${bgClass}`}>
      {iconComp}
    </div>
  );
};

// Render condition photo uploaded by admin, or specialty-specific thematic icon
const renderConditionVisual = (condition) => {
  const imgSrc = condition?.image || condition?.icon;
  const isImageFile = imgSrc && (
    imgSrc.startsWith("http") ||
    imgSrc.startsWith("data:") ||
    imgSrc.startsWith("/uploads") ||
    imgSrc.startsWith("/api") ||
    imgSrc.includes(".png") ||
    imgSrc.includes(".jpg") ||
    imgSrc.includes(".jpeg") ||
    imgSrc.includes(".webp") ||
    imgSrc.includes(".svg")
  );

  if (isImageFile) {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-emerald-100/90 shadow-xs bg-emerald-50/50 shrink-0 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={condition.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  const name = condition?.name?.toLowerCase() || "";
  let iconComp = <Activity size={22} className="text-[#006837]" />;
  let bgClass = "bg-emerald-50 text-[#006837] border-emerald-100";

  if (name.includes("neck") || name.includes("cervical")) {
    iconComp = <Activity size={22} className="text-teal-600" />;
    bgClass = "bg-teal-50 border-teal-100";
  } else if (name.includes("back") || name.includes("spine") || name.includes("sciatica") || name.includes("disc")) {
    iconComp = <HeartPulse size={22} className="text-blue-600" />;
    bgClass = "bg-blue-50 border-blue-100";
  } else if (name.includes("knee") || name.includes("joint") || name.includes("arthritis")) {
    iconComp = <Activity size={22} className="text-purple-600" />;
    bgClass = "bg-purple-50 border-purple-100";
  } else if (name.includes("shoulder") || name.includes("frozen")) {
    iconComp = <Activity size={22} className="text-amber-600" />;
    bgClass = "bg-amber-50 border-amber-100";
  } else if (name.includes("paralysis") || name.includes("stroke") || name.includes("facial")) {
    iconComp = <HeartPulse size={22} className="text-indigo-600" />;
    bgClass = "bg-indigo-50 border-indigo-100";
  }

  return (
    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${bgClass}`}>
      {iconComp}
    </div>
  );
};

export default function PhysiotherapyBooking({ initialPackage = null, onClose = null }) {
  const router = useRouter();
  const { closeModal } = useBookingModal();
  const { patient, loggedIn, loading: authLoading } = usePatientAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [problemInput, setProblemInput] = useState("");

  const detectDepartment = (text) => {
    if (!text || !text.trim()) return null;
    const lower = text.toLowerCase();
    const list = (data.departments && data.departments.length > 0) ? data.departments : defaultFallbackDepartments;

    if (lower.match(/knee|back|spine|bone|joint|shoulder|hip|cervical|slip disc|fracture|ortho|arthritis|spondylitis|sciatica|neck|tendon|post surgery|pain|elbow|ankle|wrist/)) {
      return list.find(d => d.name.toLowerCase().includes("ortho")) || list[0];
    }
    if (lower.match(/stroke|paralysis|nerve|neuro|brain|facial|bell|parkinson|hemiplegia|neuropathy|weakness/)) {
      return list.find(d => d.name.toLowerCase().includes("neuro")) || list[1];
    }
    if (lower.match(/elderly|old age|senior|balance|walk|fall|bedridden|aging|age/)) {
      return list.find(d => d.name.toLowerCase().includes("geriatric") || d.name.toLowerCase().includes("elderly")) || list[2];
    }
    if (lower.match(/sport|ligament|acl|pcl|tear|sprain|strain|gym|athlet|runner|muscle|fitness/)) {
      return list.find(d => d.name.toLowerCase().includes("sport")) || list[3];
    }
    if (lower.match(/breath|chest|cardio|heart|lung|covid|asthma|copd/)) {
      return list.find(d => d.name.toLowerCase().includes("cardio")) || list[4];
    }
    return list.find(d => d.name.toLowerCase().includes("general") || d.name.toLowerCase().includes("rehab")) || list[5] || list[0];
  };

  const handleProblemSubmit = (e) => {
    if (e) e.preventDefault();
    if (!problemInput.trim()) return;

    const matched = detectDepartment(problemInput);
    setSelection(prev => ({
      ...prev,
      department: matched,
      conditionNotes: problemInput.trim(),
      condition: { _id: 'custom', name: problemInput.trim() }
    }));

    if (!data.packages || data.packages.length === 0) {
      setData(d => ({ ...d, packages: defaultFallbackPackages }));
    }
    setStep(4);
  };

  const [data, setData] = useState({
    departments: [],
    groups: [],
    conditions: [],
    packages: [],
  });

  const [selection, setSelection] = useState({
    department: null,
    group: null,
    condition: null,
    conditionNotes: "",
    pkg: null,
    date: "",
    time: "",
    address: "",
    patientName: patient?.name || "",
    mobile: patient?.mobile && !patient.mobile.startsWith('google_') ? patient.mobile : "",
  });

  // Re-sync if patient context loads after initial mount
  useEffect(() => {
    if (patient) {
      setSelection(prev => ({
        ...prev,
        patientName: prev.patientName || patient.name || "",
        mobile: prev.mobile || (patient.mobile && !patient.mobile.startsWith('google_') ? patient.mobile : ""),
        address: prev.address || patient.address || "",
      }));
    }
  }, [patient]);

  // Fetch initial departments & packages
  useEffect(() => {
    fetch('/api/admin/physio-departments')
      .then(res => res.json())
      .then(res => setData(d => ({ ...d, departments: res.data || [] })))
      .catch(() => {});

    fetch('/api/admin/physio-packages')
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(d => ({ ...d, packages: res.data }));
        } else {
          setData(d => ({ ...d, packages: defaultFallbackPackages }));
        }
      })
      .catch(() => {
        setData(d => ({ ...d, packages: defaultFallbackPackages }));
      });
  }, []);

  const handleDepartmentSelect = async (dept) => {
    setSelection({ ...selection, department: dept });
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/physio-problem-groups?departmentId=${dept._id}`);
      const json = await res.json();
      setData(d => ({ ...d, groups: json.data || [] }));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = async (group) => {
    setSelection({ ...selection, group });
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/physio-conditions?groupId=${group._id}`);
      const json = await res.json();
      setData(d => ({ ...d, conditions: json.data || [] }));
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const defaultFallbackDepartments = [
    { _id: "6ab4f00115c3070c8dd00301", name: "Orthopedic", description: "Joint, bone, spine, fracture & post-surgery recovery." },
    { _id: "6ab4f00215c3070c8dd00302", name: "Neurological", description: "Stroke, paralysis, nerve weakness & brain injury rehabilitation." },
    { _id: "6ab4f00315c3070c8dd00303", name: "Geriatric / Elderly", description: "Balance, walking mobility & age-related pain." },
    { _id: "6ab4f00415c3070c8dd00304", name: "Sports Rehabilitation", description: "Ligament tears, athletic injuries, muscle pulls & sprains." },
    { _id: "6ab4f00515c3070c8dd00305", name: "Cardiopulmonary", description: "Post-COVID recovery, breathing therapy & cardiac wellness." },
    { _id: "6ab4f00615c3070c8dd00306", name: "General Home Rehab", description: "Daily pain management & full-body physical therapy." },
  ];

  const defaultFallbackPackages = [
    {
      _id: "6ab4f8d33bfd99ffe7298f2a",
      title: "1 Session Home Physiotherapy",
      description: "One home physiotherapy session by a qualified physiotherapist.",
      sessionsCount: 1,
      validityDays: 1,
      basePrice: 499,
      offerPrice: 499,
      isRecommended: false
    },
    {
      _id: "6ab4f9ec15c3070c8dd003d8",
      title: "3 Days Trial Home Physiotherapy",
      description: "3-day trial home physiotherapy package for new patients.",
      sessionsCount: 3,
      validityDays: 3,
      basePrice: 1299,
      offerPrice: 1299,
      isRecommended: false
    },
    {
      _id: "6ab4fad115c3070c8dd003db",
      title: "5 Days Home Physiotherapy",
      description: "5-day home physiotherapy package for pain relief and early recovery.",
      sessionsCount: 5,
      validityDays: 5,
      basePrice: 2199,
      offerPrice: 2199,
      isRecommended: false
    },
    {
      _id: "6ab4fb7b8334897e58911ea3",
      title: "7 Days Home Physiotherapy",
      description: "7-day home physiotherapy package for acute pain and early rehabilitation.",
      sessionsCount: 7,
      validityDays: 7,
      basePrice: 2999,
      offerPrice: 2999,
      isRecommended: false
    },
    {
      _id: "6ab4fca080f8ff3292106b0f",
      title: "10 Days Home Physiotherapy",
      description: "10-day home physiotherapy package for faster recovery and rehabilitation.",
      sessionsCount: 10,
      validityDays: 10,
      basePrice: 3999,
      offerPrice: 3999,
      isRecommended: false
    },
    {
      _id: "6ab4fd543bfd99ffe7298f2d",
      title: "15 Days Home Physiotherapy",
      description: "15-day home physiotherapy package for complete pain relief and rehabilitation.",
      sessionsCount: 15,
      validityDays: 15,
      basePrice: 5999,
      offerPrice: 5999,
      isRecommended: true
    },
    {
      _id: "6ab51639bedc59957e4dcd6f",
      title: "30 Days Home Physiotherapy",
      description: "30-day Home Physiotherapy Package for complete rehabilitation.",
      sessionsCount: 30,
      validityDays: 30,
      basePrice: 11999,
      offerPrice: 11999,
      isRecommended: true
    }
  ];

  // Auto-resolve initialPackage if provided
  useEffect(() => {
    if (initialPackage) {
      let matched = null;
      if (typeof initialPackage === 'object' && initialPackage?.title) {
        matched = initialPackage;
      } else if (typeof initialPackage === 'string') {
        const pool = (data.packages && data.packages.length > 0) ? data.packages : defaultFallbackPackages;
        const found = pool.find(
          p => p.title.toLowerCase() === initialPackage.toLowerCase() || 
               p.title.toLowerCase().includes(initialPackage.toLowerCase()) ||
               initialPackage.toLowerCase().includes(p.title.toLowerCase()) ||
               p._id === initialPackage
        );
        matched = found || {
          title: initialPackage,
          basePrice: 499,
          offerPrice: 499,
          sessionsCount: initialPackage.toLowerCase().includes("1 session") ? 1 : 
                        initialPackage.includes("3") ? 3 :
                        initialPackage.includes("5") ? 5 :
                        initialPackage.includes("7") ? 7 :
                        initialPackage.includes("10") ? 10 :
                        initialPackage.includes("15") ? 15 :
                        initialPackage.includes("30") ? 30 : 1,
          validityDays: initialPackage.toLowerCase().includes("1 session") ? 1 : 
                        initialPackage.includes("3") ? 3 :
                        initialPackage.includes("5") ? 5 :
                        initialPackage.includes("7") ? 7 :
                        initialPackage.includes("10") ? 10 :
                        initialPackage.includes("15") ? 15 :
                        initialPackage.includes("30") ? 30 : 1,
        };
      }
      if (matched) {
        setSelection(prev => ({
          ...prev,
          pkg: matched
        }));
        // Booking starts from Step 1
      }
    }
  }, [initialPackage, data.packages]);

  const handleConditionSelect = async (condition) => {
    setSelection({ ...selection, condition });
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/physio-packages`);
      const json = await res.json();
      const list = json.data && json.data.length > 0 ? json.data : defaultFallbackPackages;
      setData(d => ({ ...d, packages: list }));
      setStep(4);
    } catch {
      setData(d => ({ ...d, packages: defaultFallbackPackages }));
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelection({ ...selection, pkg });
    setStep(5);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const effectivePrice = getEffectivePrice(selection.pkg);

      const payload = {
        name: selection.patientName,
        mobile: selection.mobile,
        totalAmount: effectivePrice,
        preferredDate: selection.date,
        preferredTime: selection.time,
        address: selection.address || 'Lucknow',
        notes: selection.conditionNotes || '',
      };
      
      // Only send valid MongoDB ObjectIds (24 hex characters) to avoid CastError 400s
      const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
      
      if (isValidObjectId(selection.department?._id)) payload.departmentId = selection.department._id;
      if (isValidObjectId(selection.group?._id)) payload.groupId = selection.group._id;
      if (isValidObjectId(selection.condition?._id)) payload.conditionId = selection.condition._id;
      if (isValidObjectId(selection.pkg?._id)) payload.packageId = selection.pkg._id;

      // 1. Link to existing patient or create new
      let finalPatientId = null;
      
      if (loggedIn && (patient?._id || patient?.id)) {
        finalPatientId = patient._id || patient.id;
      } else {
        const patientRes = await fetch('/api/admin/physio-patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: selection.patientName, 
            mobile: selection.mobile,
            address: selection.address || ''
          })
        });
        const patientData = await patientRes.json();
        if (patientData.success && patientData.data?._id) {
          finalPatientId = patientData.data._id;
        } else {
          // If already exists (409), look up existing patient by mobile
          const searchRes = await fetch(`/api/admin/physio-patients?search=${selection.mobile}`);
          const searchData = await searchRes.json();
          if (searchData.success && searchData.data?.[0]?._id) {
            finalPatientId = searchData.data[0]._id;
          } else {
            throw new Error(patientData.message || "Failed to create patient");
          }
        }
      }
      
      if (finalPatientId) {
         payload.patientId = finalPatientId;
         
         const bookRes = await fetch('/api/admin/physio-bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         const bookData = await bookRes.json();
         
         if (bookData.success) {
            // Close the modal and redirect to payment
            if (onClose) onClose();
            else if (closeModal) closeModal();
            const paymentUrl = `/payment?bookingId=${bookData.data.bookingId}&amount=${bookData.data.totalAmount}&type=physio`;
            router.push(paymentUrl);
         } else {
            throw new Error(bookData.message || "Failed to create booking");
         }
      }

    } catch(err) {
       console.error("Booking failed", err);
       alert(err.message || "Booking Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
      <ArrowLeft size={18} /> Back
    </button>
  );

  return (
    <div className="bg-transparent py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
          
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white transition-colors duration-300 ${
              step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          {/* STEP 1: DEPARTMENTS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-green-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Physiotherapy Services</h1>
                <p className="text-gray-500">Select the department that best matches your problem.</p>
              </div>

              {/* Problem Explanation Text Box */}
              <div className="bg-gradient-to-br from-green-50/90 via-emerald-50/50 to-indigo-50/40 border border-green-200/80 rounded-2xl p-5 mb-8 shadow-xs">
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xs shrink-0 mt-0.5 border border-green-100">
                    <FileText size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Not sure what you need?</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Explain your problem or pain in your own words, and we'll suggest the right service.</p>
                  </div>
                </div>

                <form onSubmit={handleProblemSubmit} className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      placeholder="Type your problem here (e.g., severe back pain, knee arthritis, post-stroke weakness, difficulty walking, neck stiffness)..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none text-gray-900 placeholder:text-gray-400 font-normal"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    {problemInput.trim() ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                        <Sparkles size={14} className="text-emerald-700 shrink-0" />
                        <span>
                          Suggested: <strong>{detectDepartment(problemInput)?.name || "Physiotherapy Specialist"}</strong>
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400">Describe your symptoms to continue directly to therapy plans</span>
                    )}

                    <button
                      type="submit"
                      disabled={!problemInput.trim()}
                      className="px-5 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 flex items-center justify-center gap-2 shadow-sm self-end sm:self-auto"
                    >
                      <span>Continue with this Problem</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Department Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Or Select Department Directly</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {((data.departments && data.departments.length > 0) ? data.departments : defaultFallbackDepartments).map(dept => (
                  <button
                    key={dept._id}
                    onClick={() => handleDepartmentSelect(dept)}
                    className="flex flex-col items-center text-center p-4 sm:p-5 bg-white border-2 border-gray-100 hover:border-[#006837] rounded-2xl hover:bg-emerald-50/20 hover:shadow-md transition-all group active:scale-[0.98]"
                  >
                    {renderDepartmentVisual(dept)}
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#006837] transition-colors mb-1 leading-snug line-clamp-2">
                      {dept.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2">
                      {dept.description || "Specialized care and rehabilitation."}
                    </p>
                    <span className="mt-2.5 text-[10px] font-bold text-[#006837] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 group-hover:bg-[#006837] group-hover:text-white transition-colors">
                      <span>Select</span>
                      <ArrowRight size={10} />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: GROUPS */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
              <BackButton onClick={() => setStep(1)} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selection.department?.name}</h2>
              <p className="text-gray-500 mb-8">Where are you experiencing the problem?</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.groups.length > 0 ? (
                  data.groups.map(group => (
                    <button
                      key={group._id}
                      onClick={() => handleGroupSelect(group)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{group.name}</h3>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <HelpCircle size={32} />
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-1">No specific areas listed yet</h3>
                    <p className="text-gray-500 text-sm mb-6">Our doctors treat all problems under this department.</p>
                  </div>
                )}
                
                {/* Fallback Option */}
                <button
                  onClick={() => handleGroupSelect({ _id: 'other', name: 'Other / Not Listed' })}
                  className="p-4 border border-dashed border-gray-300 rounded-xl hover:border-primary hover:shadow-md transition-all text-left bg-gray-50 flex items-center gap-3"
                >
                  <HelpCircle size={20} className="text-gray-400" />
                  <h3 className="font-semibold text-gray-700">Other Problem</h3>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONDITIONS */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
              <BackButton onClick={() => setStep(2)} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Specific Condition</h2>
              <p className="text-gray-500 mb-8">Select the condition you need treatment for.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {data.conditions.length > 0 ? (
                  data.conditions.map(condition => (
                    <button
                      key={condition._id}
                      onClick={() => handleConditionSelect(condition)}
                      className="flex items-center justify-between gap-3 p-3.5 sm:p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#006837] hover:shadow-md transition-all text-left group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {renderConditionVisual(condition)}
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#006837] transition-colors leading-snug">
                            {condition.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {condition.shortDescription || "Specialized therapy & pain relief"}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-50 text-gray-400 group-hover:text-[#006837] flex items-center justify-center shrink-0 transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 text-sm mb-4">No specific conditions listed for this area yet.</p>
                  </div>
                )}
                
                {/* Fallback Option */}
                <button
                    onClick={() => handleConditionSelect({ _id: 'other', name: 'Other Condition', shortDescription: 'Consult with our doctors' })}
                    className="flex items-center justify-between gap-3 p-3.5 sm:p-4 border border-dashed border-gray-300 rounded-2xl hover:border-[#006837] hover:shadow-md transition-all text-left bg-gray-50 col-span-full sm:col-span-1 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-xl flex-shrink-0 flex items-center justify-center text-[#006837] shadow-xs border border-gray-200">
                        <HelpCircle size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900">Other Problem</h3>
                        <p className="text-xs text-gray-500">I don't see my condition listed here.</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white text-gray-400 group-hover:text-[#006837] flex items-center justify-center shrink-0">
                      <ChevronRight size={18} />
                    </div>
                  </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PACKAGES */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-gray-50">
              <BackButton onClick={() => setStep((selection.condition && selection.condition._id !== 'custom') ? 3 : (selection.group ? 2 : 1))} />
              {selection.conditionNotes && (
                <div className="max-w-xl mx-auto mb-6 p-3.5 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles size={16} className="text-emerald-600 shrink-0" />
                    <span className="truncate">Your problem: <strong>"{selection.conditionNotes}"</strong> ({selection.department?.name || 'Physiotherapy'})</span>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-emerald-700 hover:text-emerald-900 underline text-xs font-bold shrink-0 ml-3">Edit</button>
                </div>
              )}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Treatment Package</h2>
                <p className="text-gray-500">For optimal recovery, consistency is key.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.packages.length > 0 ? (
                  data.packages.map((pkg, i) => {
                    const isSelected = selection.pkg && (
                      selection.pkg._id === pkg._id || 
                      selection.pkg.title?.toLowerCase() === pkg.title?.toLowerCase()
                    );

                    return (
                      <div 
                        key={pkg._id} 
                        className={`bg-white rounded-2xl border-2 transition-all ${
                          isSelected 
                            ? 'border-primary ring-2 ring-primary/30 shadow-lg relative transform md:-translate-y-2' 
                            : pkg.isRecommended 
                              ? 'border-primary shadow-lg relative transform md:-translate-y-4' 
                              : 'border-gray-100 hover:border-gray-300'
                        } p-6 flex flex-col`}
                      >
                        {isSelected ? (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <CheckCircle size={12} /> Selected Plan
                          </div>
                        ) : pkg.isRecommended ? (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Recommended
                          </div>
                        ) : null}
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
                        <p className="text-sm text-gray-500 mb-6">{pkg.sessionsCount} Sessions included</p>
                        
                        <div className="mt-auto mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-900">
                              ₹{getEffectivePrice(pkg)}
                            </span>
                            {pkg.offerPrice && pkg.basePrice && pkg.offerPrice < pkg.basePrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{pkg.basePrice}
                              </span>
                            )}
                          </div>
                          {pkg.offerPrice && pkg.basePrice && pkg.offerPrice < pkg.basePrice && (
                            <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                              Save ₹{pkg.basePrice - pkg.offerPrice}
                            </span>
                          )}
                          <p className="text-xs text-green-600 font-medium mt-1">Valid for {pkg.validityDays} Days</p>
                        </div>
                        
                        <button 
                          onClick={() => handlePackageSelect(pkg)}
                          className={`w-full py-3 rounded-xl font-bold transition-colors ${
                            isSelected || pkg.isRecommended 
                              ? 'bg-primary text-white hover:bg-primary-dark shadow-sm' 
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected ? 'Continue with this Plan' : 'Select Package'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 text-sm mb-2">No specific packages listed yet.</p>
                    <p className="text-gray-400 text-xs mb-6">Please contact us or book a standard trial session.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => handlePackageSelect({ _id: 'custom', title: 'Standard Trial Session', sessionsCount: 1, basePrice: 499, validityDays: 1 })}
                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                      >
                        Book Trial Session (₹499)
                      </button>
                      <button
                        onClick={() => handlePackageSelect({ _id: 'custom-consult', title: 'Standard Consultation', sessionsCount: 1, basePrice: 800, validityDays: 7 })}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
                      >
                        Book Consultation (₹800)
                      </button>
                    </div>
                    <p className="text-xs text-primary mt-4 font-medium">
                      💡 To add custom packages, go to Admin → Physio Packages
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* STEP 5: PATIENT DETAILS & CONFIRM */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
              <BackButton onClick={() => setStep(4)} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Details</h2>
                  <form id="booking-form" onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" required
                        value={selection.patientName}
                        onChange={e => setSelection({...selection, patientName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="Patient Full Name" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <input 
                        type="tel" required
                        value={selection.mobile}
                        onChange={e => setSelection({...selection, mobile: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="10-digit mobile number" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Visit Address (Lucknow) *</label>
                      <input 
                        type="text" required
                        value={selection.address}
                        onChange={e => setSelection({...selection, address: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="House/Flat No., Area (e.g. Gomti Nagar, Indira Nagar, Aliganj)..." 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Problem / Pain Area (Optional)</label>
                      <input 
                        type="text"
                        value={selection.conditionNotes || (selection.condition?.name || "")}
                        onChange={e => setSelection({...selection, conditionNotes: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="e.g. Back Pain, Knee Rehab, Cervical, Stroke Recovery..." 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                        <input 
                          type="date" required
                          value={selection.date}
                          onChange={e => setSelection({...selection, date: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                        <select
                          required
                          value={selection.time}
                          onChange={e => setSelection({...selection, time: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">Select Slot</option>
                          <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                          <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                          <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                
                {/* Summary Card */}
                <div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-6">
                    <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
                    
                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Service</span>
                        <span className="font-medium text-gray-900 text-right">
                          {selection.department?.name || 'Physiotherapy at Home'}<br/>
                          <span className="text-xs text-gray-500 font-normal">
                            {selection.condition?.name || selection.conditionNotes || 'Home Rehabilitation'}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Selected Plan</span>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 block">{selection.pkg?.title || 'Home Visit Plan'}</span>
                          {selection.pkg?.sessionsCount && (
                            <span className="text-xs text-primary font-medium block">
                              {selection.pkg?.sessionsCount} Sessions ({selection.pkg?.validityDays} Days)
                            </span>
                          )}
                          <button 
                            type="button" 
                            onClick={() => {
                              if (data.packages.length === 0) {
                                setData(d => ({ ...d, packages: defaultFallbackPackages }));
                              }
                              setStep(4);
                            }}
                            className="text-[11px] text-primary hover:underline font-semibold mt-0.5 inline-block"
                          >
                            Change Plan →
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium text-gray-900 flex items-center gap-1"><MapPin size={14}/> Home Service (Lucknow)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-baseline mb-8">
                      <span className="font-bold text-gray-900">Total Payable</span>
                      <div className="text-right">
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="text-2xl font-black text-primary">
                            ₹{getEffectivePrice(selection.pkg)}
                          </span>
                          {selection.pkg?.offerPrice && selection.pkg?.basePrice && selection.pkg.offerPrice < selection.pkg.basePrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{selection.pkg.basePrice}
                            </span>
                          )}
                        </div>
                        {selection.pkg?.offerPrice && selection.pkg?.basePrice && selection.pkg.offerPrice < selection.pkg.basePrice && (
                          <span className="text-xs text-green-600 font-semibold block">
                            Save ₹{selection.pkg.basePrice - selection.pkg.offerPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      type="submit" form="booking-form"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                      {loading ? "Processing..." : "Confirm & Pay"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 6 && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Your Physiotherapy treatment plan has been created. A therapist will be assigned to you shortly.</p>
              
              <Link href="/" className="inline-block px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Return to Home
              </Link>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}


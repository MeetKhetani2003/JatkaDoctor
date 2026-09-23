"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar as CalIcon, 
  Clock, 
  Mic, 
  HelpCircle,
  Stethoscope,
  Activity,
  UserPlus,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBookingModal } from '@/context/BookingModalContext';
import { usePatientAuth } from '@/context/PatientAuthContext';

export default function PhysiotherapyBooking() {
  const router = useRouter();
  const { closeModal } = useBookingModal();
  const { patient, loggedIn, profileComplete, loading: authLoading } = usePatientAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in or profile is incomplete
  useEffect(() => {
    if (authLoading) return;
    if (!loggedIn) {
      closeModal();
      router.push("/patient/login");
    } else if (!profileComplete) {
      closeModal();
      router.push("/patient/complete-profile");
    }
  }, [loggedIn, profileComplete, authLoading, router, closeModal]);

  
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
    pkg: null,
    date: "",
    time: "",
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
      }));
    }
  }, [patient]);

  // Fetch initial departments
  useEffect(() => {
    fetch('/api/admin/physio-departments')
      .then(res => res.json())
      .then(res => setData(d => ({ ...d, departments: res.data || [] })));
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

  const handleConditionSelect = async (condition) => {
    setSelection({ ...selection, condition });
    setLoading(true);
    try {
      // If we want specific packages for a condition, pass conditionId. 
      // For now, fetch all active packages as per the model.
      const res = await fetch(`/api/admin/physio-packages`);
      const json = await res.json();
      setData(d => ({ ...d, packages: json.data || [] }));
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
      // Auto-create patient and booking via our new endpoint
      const payload = {
        name: selection.patientName,
        mobile: selection.mobile,
        totalAmount: selection.pkg.basePrice,
        preferredDate: selection.date,
        preferredTime: selection.time,
      };
      
      // Only send valid MongoDB ObjectIds (24 hex characters) to avoid CastError 400s
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      
      if (isValidObjectId(selection.department?._id)) payload.departmentId = selection.department._id;
      if (isValidObjectId(selection.group?._id)) payload.groupId = selection.group._id;
      if (isValidObjectId(selection.condition?._id)) payload.conditionId = selection.condition._id;
      if (isValidObjectId(selection.pkg?._id)) payload.packageId = selection.pkg._id;

      // 1. Link to existing patient or create new
      let finalPatientId = null;
      
      if (loggedIn && patient?.patientId) {
        finalPatientId = patient.patientId;
      } else {
        const patientRes = await fetch('/api/admin/physio-patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: selection.patientName, mobile: selection.mobile })
        });
        const patientData = await patientRes.json();
        if (patientData.success) {
          finalPatientId = patientData.data._id;
        } else {
          throw new Error("Failed to create patient");
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
         
         if(bookData.success) {
            // Close the modal and redirect to payment
            closeModal();
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

              {/* Voice Search Promo */}
              <div className="bg-gradient-to-r from-green-50 to-indigo-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4 mb-8 cursor-pointer hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <Mic size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Not sure what you need?</h3>
                  <p className="text-sm text-primary-dark">Tell us your problem and we'll suggest the right service.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.departments.map(dept => (
                  <button
                    key={dept._id}
                    onClick={() => handleDepartmentSelect(dept)}
                    className="flex flex-col items-center text-center p-6 border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-green-50/50 transition-all group"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm mb-4 transition-all">
                       <Stethoscope size={28} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{dept.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{dept.description || "Specialized care and rehabilitation."}</p>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.conditions.length > 0 ? (
                  data.conditions.map(condition => (
                    <button
                      key={condition._id}
                      onClick={() => handleConditionSelect(condition)}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{condition.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{condition.shortDescription}</p>
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
                    className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-xl hover:border-primary hover:shadow-md transition-all text-left bg-gray-50 col-span-full sm:col-span-1"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center text-primary shadow-sm">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Other Problem</h3>
                      <p className="text-xs text-gray-500">I don't see my condition listed here.</p>
                    </div>
                  </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PACKAGES */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-gray-50">
              <BackButton onClick={() => setStep(3)} />
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Treatment Package</h2>
                <p className="text-gray-500">For optimal recovery, consistency is key.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.packages.length > 0 ? (
                  data.packages.map((pkg, i) => (
                    <div key={pkg._id} className={`bg-white rounded-2xl border-2 ${pkg.isRecommended ? 'border-primary shadow-lg relative transform md:-translate-y-4' : 'border-gray-100 hover:border-gray-300'} p-6 flex flex-col`}>
                      {pkg.isRecommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Recommended
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
                      <p className="text-sm text-gray-500 mb-6">{pkg.sessionsCount} Sessions included</p>
                      
                      <div className="mt-auto mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900">₹{pkg.basePrice}</span>
                        </div>
                        <p className="text-xs text-green-600 font-medium">Valid for {pkg.validityDays} Days</p>
                      </div>
                      
                      <button 
                        onClick={() => handlePackageSelect(pkg)}
                        className={`w-full py-3 rounded-xl font-bold transition-colors ${pkg.isRecommended ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                      >
                        Select Package
                      </button>
                    </div>
                  ))
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" required
                        value={selection.patientName}
                        onChange={e => setSelection({...selection, patientName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input 
                        type="tel" required
                        value={selection.mobile}
                        onChange={e => setSelection({...selection, mobile: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="10-digit mobile number" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input 
                          type="date" required
                          value={selection.date}
                          onChange={e => setSelection({...selection, date: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input 
                          type="time" required
                          value={selection.time}
                          onChange={e => setSelection({...selection, time: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                        />
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
                        <span className="font-medium text-gray-900 text-right">{selection.department?.name} <br/> {selection.condition?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Package</span>
                        <span className="font-medium text-gray-900">{selection.pkg?.title}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium text-gray-900 flex items-center gap-1"><MapPin size={14}/> Home Service</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-gray-900">Total Payable</span>
                      <span className="text-2xl font-black text-primary">₹{selection.pkg?.basePrice}</span>
                    </div>
                    
                    <button 
                      type="submit" form="booking-form"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                      {loading ? "Processing..." : "Confirm & Pay"}
                    </button>
                    
                    <div className="mt-4 text-center">
                      <button className="text-sm font-medium text-gray-500 hover:text-primary underline">Request Financial Assistance</button>
                    </div>
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


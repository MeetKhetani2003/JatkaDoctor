"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Phone, 
  FileCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { usePatientAuth } from "@/context/PatientAuthContext";

export default function PrescriptionUploadModal({ isOpen, onClose }) {
  const { patient, loggedIn } = usePatientAuth();

  // Form states
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadSource, setUploadSource] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [notes, setNotes] = useState("");
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Hidden inputs for file triggers
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // Family members list if logged in
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    if (loggedIn && patient) {
      setPatientName(patient.name || "");
      setPatientPhone(patient.mobile || "");
      setSelectedPatientId(patient.patientId || "");

      // Fetch family members for the patient if available
      const pId = patient.patientDbId || patient.patientId;
      if (pId) {
        fetch(`/api/admin/health-cards/${pId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && Array.isArray(data.familyMembers)) {
              setFamilyMembers(data.familyMembers);
            }
          })
          .catch(() => {});
      }
    }
  }, [loggedIn, patient, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e, source) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG, or PDF file.");
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit.");
      return;
    }

    setFile(selectedFile);
    setUploadSource(source);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview(event.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handlePatientSelectChange = (e) => {
    const val = e.target.value;
    if (val === "self" || val === "") {
      setPatientName(patient?.name || "");
      setPatientPhone(patient?.mobile || "");
      setSelectedPatientId(patient?.patientId || "");
    } else {
      const selectedMem = familyMembers.find(m => m.patientId === val || m._id === val);
      if (selectedMem) {
        setPatientName(selectedMem.name);
        setPatientPhone(selectedMem.mobile || patient?.mobile || "");
        setSelectedPatientId(selectedMem.patientId || "");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select or capture a prescription file first.");
      return;
    }

    if (!patientName.trim()) {
      setError("Please enter the patient's name.");
      return;
    }

    if (!patientPhone.trim() || patientPhone.replace(/[^0-9]/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientName", patientName.trim());
      formData.append("patientPhone", patientPhone.trim());
      if (selectedPatientId) formData.append("patientId", selectedPatientId);
      if (bookingId.trim()) formData.append("bookingId", bookingId.trim());
      if (notes.trim()) formData.append("notes", notes.trim());
      formData.append("uploadSource", uploadSource || "Web Upload");

      const res = await fetch("/api/prescriptions/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload prescription");
      }

      setSuccessData(data);
    } catch (err) {
      setError(err.message || "An error occurred while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview(null);
    setUploadSource("");
    setNotes("");
    setBookingId("");
    setError("");
    setSuccessData(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Inputs */}
        <input 
          ref={cameraInputRef}
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          onChange={(e) => handleFileChange(e, "Take Photo")}
        />
        <input 
          ref={galleryInputRef}
          type="file" 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden" 
          onChange={(e) => handleFileChange(e, "Gallery")}
        />
        <input 
          ref={pdfInputRef}
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          onChange={(e) => handleFileChange(e, "Upload PDF")}
        />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Upload Doctor Prescription
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Encrypted & securely linked with your patient profile
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successData ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Prescription Uploaded Successfully!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Reference ID: <strong className="text-emerald-700 font-mono text-sm">{successData.prescriptionId}</strong>
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-left text-xs text-gray-700 space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">Patient:</span>
                  <span className="font-semibold">{successData.prescription?.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">File Name:</span>
                  <span className="font-semibold truncate max-w-[200px]">{successData.prescription?.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Under Medical Review
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Our care coordinator will review the prescription and assist you with doctor visits, medicines, or physiotherapy.
              </p>

              <div className="pt-3 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Upload Another
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Upload Source Buttons */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Select Upload Method (JPG / PNG / PDF)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Take Photo</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Use Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Gallery</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">JPG / PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Upload PDF</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Doc / E-Rx</span>
                  </button>
                </div>
              </div>

              {/* Selected File Card */}
              {file && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    {filePreview ? (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-12 h-12 object-cover rounded-xl border border-emerald-300" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-200 shrink-0">
                        PDF
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB · Method: {uploadSource}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      setUploadSource("");
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Patient Information */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. Patient Details
                </label>

                {loggedIn && familyMembers.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Select Patient
                    </label>
                    <select
                      onChange={handlePatientSelectChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:bg-white outline-none"
                    >
                      <option value="self">Self: {patient?.name}</option>
                      {familyMembers.map((m) => (
                        <option key={m._id} value={m.patientId || m._id}>
                          {m.name} ({m.relation})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Patient Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        required
                        className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="10-digit number"
                        maxLength={13}
                        required
                        className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Existing Booking ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      placeholder="e.g. BK-202610-001"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:bg-white outline-none uppercase placeholder:normal-case"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Optional Note for Doctor / Admin
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Prescribed for Knee Physiotherapy"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading & Securing Prescription...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Submit Prescription</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by HIPAA-grade healthcare data security</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Download,
  Share2,
  Printer,
  Send,
  RotateCw,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Globe,
  MapPin,
  Heart,
  Stethoscope,
  Activity,
  Percent,
  Users,
  Award,
  AlertTriangle,
  Mail,
  Layers,
  Sparkles
} from "lucide-react";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export default function HealthCard({ patient, showActions = true, onUpdate = null }) {
  const [side, setSide] = useState("front"); // 'front' | 'back' | 'both'
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [sendingWa, setSendingWa] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const frontRef = useRef(null);
  const backRef = useRef(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.drjhatka.com";
  const verifyUrl = `${baseUrl}/verify-card/${patient?.qrToken || patient?.patientId || "DJM-PT-000001"}`;

  // Generate QR Code on mount or patient change
  useEffect(() => {
    if (patient) {
      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: "#004d26",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code Error:", err));
    }
  }, [patient, verifyUrl]);

  if (!patient) return null;

  const isActive = patient.cardStatus !== "INACTIVE";

  // 1. Download Digital Card (PNG)
  const handleDownloadDigital = async () => {
    try {
      setDownloading(true);
      setStatusMsg("Generating high-resolution digital card...");
      
      const targetEl = side === "back" ? backRef.current : frontRef.current;
      if (!targetEl) return;

      const dataUrl = await htmlToImage.toPng(targetEl, {
        pixelRatio: 3,
        quality: 1,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `Dr_Jhatka_HealthCard_${patient.patientId}_${side}.png`;
      link.href = dataUrl;
      link.click();
      setStatusMsg("Card downloaded successfully!");
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg("Download failed. Please try printing directly.");
    } finally {
      setDownloading(false);
    }
  };

  // 2. Download for PVC Printing (Print-Ready PDF with Front & Back at exact 85.60 × 53.98 mm)
  const handleDownloadPVC = async () => {
    try {
      setDownloading(true);
      setStatusMsg("Generating print-ready PVC card (85.60 × 53.98 mm)...");

      if (!frontRef.current || !backRef.current) return;

      const frontImg = await htmlToImage.toPng(frontRef.current, { pixelRatio: 4, cacheBust: true });
      const backImg = await htmlToImage.toPng(backRef.current, { pixelRatio: 4, cacheBust: true });

      // Create PDF in landscape matching standard CR80 PVC dimensions (85.6mm x 53.98mm)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      // Page 1: Front
      pdf.addImage(frontImg, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");

      // Page 2: Back
      pdf.addPage([85.6, 53.98], "landscape");
      pdf.addImage(backImg, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");

      pdf.save(`Dr_Jhatka_PVC_Card_${patient.patientId}.pdf`);
      setStatusMsg("PVC Print-Ready PDF downloaded!");
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg("PVC generation error: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // 3. Share Card
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dr Jhatka Medicare Free Health Card - ${patient.name}`,
          text: `Here is my official Dr Jhatka Medicare Free Health Card (Patient ID: ${patient.patientId}). Verify at: ${verifyUrl}`,
          url: verifyUrl,
        });
      } catch (e) {
        console.log("Share canceled", e);
      }
    } else {
      navigator.clipboard.writeText(verifyUrl);
      setStatusMsg("Card verification link copied to clipboard!");
      setTimeout(() => setStatusMsg(""), 3500);
    }
  };

  // 4. Send on WhatsApp
  const handleSendWhatsApp = async () => {
    try {
      setSendingWa(true);
      setStatusMsg("Sending card to WhatsApp...");

      const res = await fetch("/api/health-card/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.patientId, channel: "whatsapp" }),
      });
      const data = await res.json();
      
      // Also open WhatsApp web as instant fallback for user
      const waText = encodeURIComponent(
        `*Dr Jhatka Medicare - Free Health Card*\n\n` +
        `Patient Name: *${patient.name}*\n` +
        `Permanent Patient ID: *${patient.patientId}*\n` +
        `Family ID: *${patient.familyId || "N/A"}*\n` +
        `Status: *${patient.cardStatus || "ACTIVE"}*\n\n` +
        `View & Download Digital Card: ${verifyUrl}\n\n` +
        `Helpline: +91 87077 90677 | www.drjhatka.com`
      );
      window.open(`https://wa.me/91${(patient.whatsappNumber || patient.mobile).replace(/[^0-9]/g, "").slice(-10)}?text=${waText}`, "_blank");

      setStatusMsg("Card sent via WhatsApp!");
      setTimeout(() => setStatusMsg(""), 3500);
      if (onUpdate) onUpdate();
    } catch (err) {
      setStatusMsg("Failed to send WhatsApp message");
    } finally {
      setSendingWa(false);
    }
  };

  // 5. Send on Email
  const handleSendEmail = async () => {
    if (!patient.email) {
      setStatusMsg("No email address saved on profile. Please add email in My Profile.");
      setTimeout(() => setStatusMsg(""), 4000);
      return;
    }
    try {
      setSendingEmail(true);
      setStatusMsg(`Sending card to ${patient.email}...`);

      const res = await fetch("/api/health-card/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.patientId, channel: "email" }),
      });
      const data = await res.json();
      setStatusMsg(`Card successfully emailed to ${patient.email}!`);
      setTimeout(() => setStatusMsg(""), 3500);
      if (onUpdate) onUpdate();
    } catch (err) {
      setStatusMsg("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  // 6. Print Card
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Controls: Flip / View selector */}
      <div className="flex items-center justify-between w-full max-w-xl mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Card View:
          </span>
          <div className="bg-gray-100 p-0.5 rounded-lg flex items-center text-xs font-medium">
            <button
              onClick={() => setSide("front")}
              className={`px-3 py-1 rounded-md transition-all ${
                side === "front"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => setSide("back")}
              className={`px-3 py-1 rounded-md transition-all ${
                side === "back"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Back Side
            </button>
            <button
              onClick={() => setSide("both")}
              className={`px-3 py-1 rounded-md transition-all ${
                side === "both"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Both Sides
            </button>
          </div>
        </div>

        {/* Card Version & Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            Version {patient.cardVersion || 1}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
              isActive
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {isActive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                ACTIVE
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                INACTIVE
              </>
            )}
          </span>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div className="mb-4 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* The Printable / Renderable Cards Container */}
      <div className={`w-full flex flex-col md:flex-row items-center justify-center gap-6 my-2 ${side === "both" ? "md:flex-wrap" : ""}`}>
        
        {/* ============================================================== */}
        {/* FRONT SIDE CARD (PVC Ratio: 85.60 × 53.98 mm = approx 540 × 340 px) */}
        {/* ============================================================== */}
        {(side === "front" || side === "both") && (
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              Front Side
            </span>
            <div
              ref={frontRef}
              id="drjhatka-health-card-front"
              className="relative w-[340px] sm:w-[480px] md:w-[520px] aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white text-gray-900 select-none transition-transform"
              style={{
                fontFamily: "var(--font-poppins, 'Inter', -apple-system, sans-serif)",
                background: "linear-gradient(135deg, #ffffff 0%, #f6fbf8 60%, #e7f7ee 100%)",
              }}
            >
              {/* Subtle wave graphics in background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-10 left-0 w-80 h-32 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Top Bar: Brand Logo + "FREE HEALTH CARD" */}
              <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-3.5 pb-2">
                <div className="flex items-center gap-2.5">
                  {/* Logo Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white shadow-sm border border-emerald-100 p-1 flex items-center justify-center">
                    <img
                      src="/Dr.Jhatka.png"
                      alt="Dr Jhatka Medicare"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-[#006837] leading-none">
                      Dr Jhatka
                    </h2>
                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-800 tracking-wider uppercase leading-tight">
                      MEDICARE
                    </p>
                    <p className="text-[7.5px] sm:text-[8.5px] text-gray-500 font-medium leading-none">
                      Speed, Care & Trust — All in One
                    </p>
                  </div>
                </div>

                {/* Top-Right Badge: FREE HEALTH CARD */}
                <div className="bg-[#006837] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-bl-2xl rounded-tr-xl shadow-md flex flex-col items-center justify-center -mr-4 sm:-mr-6 -mt-3.5">
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-emerald-200 uppercase leading-none">
                    LIFETIME
                  </span>
                  <span className="text-xs sm:text-sm font-black tracking-wide uppercase leading-tight">
                    FREE HEALTH CARD
                  </span>
                </div>
              </div>

              {/* Main Body: Photo + Patient Details + QR Code */}
              <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-6 pt-1 pb-2">
                
                {/* Left: Patient Avatar/Photo */}
                <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-start">
                  <div className="w-16 h-18 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-[#006837] bg-emerald-50 shadow-sm flex items-center justify-center">
                    {patient.photo ? (
                      <img
                        src={patient.photo.startsWith('/') ? `${baseUrl}${patient.photo}` : patient.photo}
                        crossOrigin="anonymous"
                        alt={patient.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-emerald-800">
                        <Users className="w-8 h-8 opacity-70" />
                        <span className="text-[8px] font-bold uppercase mt-1">DJM ID</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle: Patient Dynamic Information */}
                <div className="col-span-5 sm:col-span-5 flex flex-col justify-center text-[9px] sm:text-[10px] space-y-1 sm:space-y-1.5 text-gray-800 font-medium">
                  
                  {/* Grid for Label : Value layout */}
                  <div className="grid grid-cols-[60px_5px_1fr] sm:grid-cols-[70px_8px_1fr] items-center gap-y-1 sm:gap-y-1.5">
                    
                    {/* Name */}
                    <div className="text-gray-600">Name</div>
                    <div>:</div>
                    <div className="font-extrabold text-gray-900 truncate">
                      {patient.name}
                    </div>

                    {/* Patient ID */}
                    <div className="text-gray-600">Patient ID</div>
                    <div>:</div>
                    <div>
                      <span className="inline-block bg-[#dcfce7] text-[#006837] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wide">
                        {patient.patientId}
                      </span>
                    </div>

                    {/* Family ID (Only if available) */}
                    {patient.familyId && (
                      <>
                        <div className="text-gray-600">Family ID</div>
                        <div>:</div>
                        <div>
                          <span className="inline-block bg-[#dcfce7] text-[#006837] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wide">
                            {patient.familyId}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Mobile */}
                    {patient.mobile && (
                      <>
                        <div className="text-gray-600">Mobile</div>
                        <div>:</div>
                        <div className="font-bold">
                          +91 {patient.mobile.slice(-10)}
                        </div>
                      </>
                    )}

                    {/* Age */}
                    {patient.age && (
                      <>
                        <div className="text-gray-600">Age</div>
                        <div>:</div>
                        <div className="font-bold">{patient.age} {isNaN(Number(patient.age)) ? "" : "Years"}</div>
                      </>
                    )}

                    {/* Gender */}
                    {patient.gender && (
                      <>
                        <div className="text-gray-600">Gender</div>
                        <div>:</div>
                        <div className="font-bold">{patient.gender}</div>
                      </>
                    )}

                    {/* Blood Group */}
                    {patient.bloodGroup && (
                      <>
                        <div className="text-gray-600">Blood Group</div>
                        <div>:</div>
                        <div className="font-bold">{patient.bloodGroup}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Unique QR Code Box + Status Badge */}
                <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center">
                  <div className="bg-white p-1 rounded-xl shadow border border-gray-200 flex flex-col items-center relative">
                    {qrDataUrl ? (
                      <div className="relative w-18 h-18 sm:w-22 sm:h-22">
                        <img
                          src={qrDataUrl}
                          alt="Patient Verification QR"
                          className="w-full h-full object-contain"
                        />
                        {/* Center Emblem on QR */}
                        <div className="absolute inset-0 m-auto w-5 h-5 bg-white rounded-full p-0.5 shadow flex items-center justify-center border border-emerald-600">
                          <img
                            src="/Dr.Jhatka.png"
                            alt="DJM"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-18 h-18 sm:w-22 sm:h-22 bg-gray-100 flex items-center justify-center">
                        <span className="text-[8px] text-gray-400">Loading QR</span>
                      </div>
                    )}
                    <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-gray-600 uppercase tracking-tighter mt-0.5">
                      Scan to Verify Health Card
                    </span>
                  </div>

                  {/* Card Status Button / Badge */}
                  <div
                    className={`mt-1.5 w-full text-center py-0.5 px-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      isActive
                        ? "bg-[#006837] text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </div>
                </div>
              </div>

              {/* Bottom Feature Strip (Deep Green Banner) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#004d26] via-[#006837] to-[#004d26] text-white px-3 sm:px-5 py-1.5 flex items-center justify-between text-[7.5px] sm:text-[9px]">
                <div className="flex items-center gap-2 sm:gap-4 font-semibold tracking-tight">
                  <div className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-emerald-300" />
                    <span>Health Check-up</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-300" />
                    <span>Physiotherapy Guidance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3 text-emerald-300" />
                    <span>Special Offers</span>
                  </div>
                  {patient.isSeniorCitizen && (
                    <div className="flex items-center gap-1 bg-white/20 px-1 py-0.2 rounded text-[7.5px]">
                      <span>Senior Citizen Benefits*</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 italic text-[7.5px] sm:text-[8.5px] text-emerald-100 font-medium">
                  <span>Speed, Care & Trust — All in One</span>
                  <Activity className="w-2.5 h-2.5 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BACK SIDE CARD (PVC Ratio: 85.60 × 53.98 mm = approx 540 × 340 px) */}
        {/* ============================================================== */}
        {(side === "back" || side === "both") && (
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              Back Side
            </span>
            <div
              ref={backRef}
              id="drjhatka-health-card-back"
              className="relative w-[340px] sm:w-[480px] md:w-[520px] aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white text-gray-900 select-none transition-transform"
              style={{
                fontFamily: "var(--font-poppins, 'Inter', -apple-system, sans-serif)",
                background: "linear-gradient(135deg, #ffffff 0%, #f7fcf9 70%, #ebf9f1 100%)",
              }}
            >
              {/* Decorative background watermark */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                <img src="/Dr.Jhatka.png" alt="" className="w-64 h-64 object-contain" />
              </div>

              {/* Top Bar: Brand Logo + "Your Health Our Priority" */}
              <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-3.5 pb-2 border-b border-emerald-100/60">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white border border-emerald-100 p-1 flex items-center justify-center shadow-xs">
                    <img
                      src="/Dr.Jhatka.png"
                      alt="Dr Jhatka Medicare"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-[#006837] leading-none">
                      Dr Jhatka
                    </h3>
                    <p className="text-[10px] font-bold text-gray-800 tracking-wider uppercase leading-none">
                      MEDICARE
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 text-[#006837] border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Heart className="w-3 h-3 text-[#006837]" />
                  <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-tight">
                    Your Health Our Priority
                  </span>
                </div>
              </div>

              {/* Middle Section: Important Information + Contact Details */}
              <div className="relative z-10 grid grid-cols-12 gap-3 px-4 sm:px-6 py-2.5">
                
                {/* Important Terms (Left 7 cols) */}
                <div className="col-span-7 pr-2">
                  <h4 className="text-[9.5px] sm:text-[11px] font-extrabold text-[#004d26] mb-1 uppercase tracking-wider">
                    Important Information:
                  </h4>
                  <ol className="text-[8px] sm:text-[9.5px] text-gray-700 space-y-1 list-decimal list-inside leading-tight font-medium">
                    <li>This card is a healthcare identification & benefits card.</li>
                    <li>Benefits are subject to applicable terms.</li>
                    <li>Not a treatment guarantee or insurance card.</li>
                    <li>Please keep this card for future services.</li>
                  </ol>
                  <p className="text-[7.5px] sm:text-[8px] text-gray-400 mt-2 font-mono">
                    ID: {patient.patientId} • Lifetime Permanent
                  </p>
                </div>

                {/* Contact Helpline & Channels (Right 5 cols) */}
                <div className="col-span-5 flex flex-col justify-center border-l border-emerald-100 pl-3 space-y-2 text-[8.5px] sm:text-[10.5px]">
                  
                  {/* WhatsApp / Helpline */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                      <Phone className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-extrabold text-gray-900 block leading-tight">
                        +91 87077 90677
                      </span>
                      <span className="text-[7.5px] sm:text-[8.5px] text-gray-500 leading-none">
                        WhatsApp / Helpline
                      </span>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                      <Globe className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 block leading-tight">
                        www.drjhatka.com
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#006837] shrink-0">
                      <MapPin className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 leading-tight block">
                        Lucknow, Uttar Pradesh, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: Community statement & tagline */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#004d26] via-[#006837] to-[#004d26] text-white px-4 sm:px-6 py-1.5 flex items-center justify-between text-[7.5px] sm:text-[9px]">
                <div className="flex items-center gap-1.5 font-medium tracking-tight">
                  <Heart className="w-2.5 h-2.5 text-red-300 fill-red-300" />
                  <span>People | Care | Community | Better Health for Lucknow</span>
                </div>
                <div className="flex items-center gap-1 italic text-emerald-100">
                  <span>Speed, Care & Trust — All in One</span>
                  <Activity className="w-2.5 h-2.5 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* CARD ACTION BUTTONS */}
      {/* ============================================================== */}
      {showActions && (
        <div className="w-full max-w-2xl mt-5 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            {/* Download Digital Card */}
            <button
              onClick={handleDownloadDigital}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Card</span>
            </button>

            {/* Download for PVC Printing (CR80 Print Ready) */}
            <button
              onClick={handleDownloadPVC}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Download 85.60 × 53.98 mm Front & Back PDF for PVC Card Machine"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Download PVC Print (PDF)</span>
            </button>

            {/* Share Card */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
              <span>Share Card</span>
            </button>

            {/* Send on WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              disabled={sendingWa}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>{sendingWa ? "Sending..." : "Send on WhatsApp"}</span>
            </button>

            {/* Send on Email */}
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{sendingEmail ? "Sending..." : "Send on Email"}</span>
            </button>

            {/* Print Card */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>Print Card</span>
            </button>
          </div>

          {/* Delivery Status Summary */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-3">
              <span>
                WhatsApp:{" "}
                <strong
                  className={
                    patient.deliveryStatus?.whatsApp?.status === "Sent"
                      ? "text-emerald-700"
                      : "text-amber-600"
                  }
                >
                  {patient.deliveryStatus?.whatsApp?.status || "Pending"}
                </strong>
              </span>
              <span>•</span>
              <span>
                Email:{" "}
                <strong
                  className={
                    patient.deliveryStatus?.email?.status === "Sent"
                      ? "text-emerald-700"
                      : "text-gray-400"
                  }
                >
                  {patient.deliveryStatus?.email?.status || "Pending"}
                </strong>
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Scan QR: {verifyUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

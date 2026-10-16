/**
 * WhatsApp Integration Service Layer for Dr Jhatka Medicare
 * Uses RateHonk WhatsApp Panel API (Official Meta Cloud API Session)
 */

const BASE_URL = process.env.WHATSAPP_BASE_URL || "https://wa.ratehonk.com";
const API_KEY = process.env.WHATSAPP_API_KEY;
const SESSION_ID = process.env.WHATSAPP_SESSION_ID; // RateHonk Session ID

/**
 * Normalizes any phone number into international E.164 format without leading '+'
 * Ensures 10-digit Indian numbers get prefixed with '91'
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return "";
  let clean = String(phone).replace(/[^0-9]/g, "");
  // Remove leading zeros
  clean = clean.replace(/^0+/, "");
  // If 10 digits (standard Indian mobile), prefix with country code 91
  if (clean.length === 10) {
    clean = `91${clean}`;
  }
  return clean;
}

/**
 * Generates an instant wa.me click-to-chat fallback URL
 */
export function getDirectWhatsAppUrl(phone, text = "") {
  const formatted = formatWhatsAppNumber(phone);
  if (!formatted) return "#";
  return `https://wa.me/${formatted}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// Helper to log WhatsApp actions in development
function logWhatsAppMessage(functionName, payload, hasCredentials) {
  console.log(`[WhatsApp Service - ${functionName}]`);
  console.log(`- Status: ${hasCredentials ? 'Credentials Active (Attempting Send)' : 'No Credentials (Logging Mode)'}`);
  console.log(`- Payload:`, JSON.stringify(payload, null, 2));
}

// Low-level helper to send messages to RateHonk API
export async function sendWhatsAppTemplate(to, templateName, templateParams = []) {
  const formattedTo = formatWhatsAppNumber(to);
  const hasCredentials = !!(API_KEY && SESSION_ID);
  
  const payload = {
    sessionId: SESSION_ID,
    to: formattedTo,
    templateName: templateName,
    languageCode: "en",
    templateParams: templateParams
  };

  logWhatsAppMessage(templateName, payload, hasCredentials);

  if (!formattedTo || formattedTo.length < 10) {
    return { success: false, error: "Invalid recipient phone number. Must be at least 10 digits." };
  }

  if (!hasCredentials) {
    // If credentials or sessionId are absent, succeed silently without throwing
    return { 
      success: true, 
      simulated: true, 
      note: "WHATSAPP_API_KEY or WHATSAPP_SESSION_ID missing in .env.local" 
    };
  }

  try {
    const url = `${BASE_URL}/api/project/v1/messages/send-template`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`RateHonk API Error for ${templateName}:`, data);
      const errMsg = data?.error || data?.message || JSON.stringify(data);
      return { 
        success: false, 
        statusCode: response.status,
        error: errMsg 
      };
    }

    console.log(`WhatsApp message sent successfully via RateHonk:`, data);
    return { success: true, response: data };
  } catch (error) {
    console.error(`WhatsApp connection failure for ${templateName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * 1. Send Booking Confirmation to Patient
 */
export async function sendBookingConfirmation({ phone, patientName, bookingId, date, time, category }) {
  const templateParams = [
    patientName,
    bookingId,
    category || "Medical Service",
    date || "Today",
    time || "Scheduled Time"
  ];
  const res = await sendWhatsAppTemplate(phone, "booking_confirmation", templateParams);
  
  const directText = `*Dr Jhatka Medicare - Booking Confirmed*\n\n` +
    `Dear ${patientName}, your booking (ID: ${bookingId}) for ${category || "Medical Service"} is confirmed for ${date || "Today"} at ${time || "Scheduled Time"}.\n\n` +
    `Helpline: +91 87077 90677`;
  
  return {
    ...res,
    directUrl: getDirectWhatsAppUrl(phone, directText)
  };
}

/**
 * 2. Send Payment Confirmation to Patient
 */
export async function sendPaymentConfirmation({ phone, patientName, bookingId, amount, paymentMethod }) {
  const templateParams = [
    patientName,
    bookingId,
    `INR ${amount}`,
    paymentMethod || "UPI"
  ];
  const res = await sendWhatsAppTemplate(phone, "payment_confirmation", templateParams);
  
  const directText = `*Dr Jhatka Medicare - Payment Confirmation*\n\n` +
    `Dear ${patientName}, we have received your payment for Booking ID: ${bookingId}. Amount: INR ${amount} via ${paymentMethod || "UPI"}. Thank you!`;
  
  return {
    ...res,
    directUrl: getDirectWhatsAppUrl(phone, directText)
  };
}

/**
 * 3. Send Admin Alert on New Booking
 */
export async function sendAdminBookingAlert({ patientName, bookingId, phone, category }) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+918874744756";
  const templateParams = [
    bookingId,
    patientName,
    formatWhatsAppNumber(phone) || phone,
    category || "Medical Service"
  ];
  return await sendWhatsAppTemplate(adminPhone, "admin_booking_alert", templateParams);
}

/**
 * 4. Send Admin Alert on Payment Received
 */
export async function sendAdminPaymentAlert({ patientName, bookingId, amount, paymentMethod }) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+918874744756";
  const templateParams = [
    bookingId,
    patientName,
    `INR ${amount}`,
    paymentMethod || "UPI"
  ];
  return await sendWhatsAppTemplate(adminPhone, "admin_payment_alert", templateParams);
}

/**
 * 5. Send Feedback & Review Request to Patient (+5 days followup)
 */
export async function sendFeedbackRequest({ phone, patientName, bookingId }) {
  const templateParams = [
    patientName,
    bookingId
  ];
  return await sendWhatsAppTemplate(phone, "feedback_request", templateParams);
}

/**
 * 6. Send Session Reminder to Patient
 */
export async function sendSessionReminder({ phone, patientName, sessionNumber, scheduledDate, scheduledTime, bookingId }) {
  const templateParams = [
    patientName,
    String(sessionNumber),
    scheduledDate || "Today",
    scheduledTime || "Scheduled Time",
    bookingId
  ];
  const res = await sendWhatsAppTemplate(phone, "session_reminder", templateParams);
  
  const directText = `*Dr Jhatka Medicare - Physio Session Reminder*\n\n` +
    `Hello ${patientName}, reminder for your Session #${sessionNumber} on ${scheduledDate || "Today"} at ${scheduledTime || "Scheduled Time"} (Booking ID: ${bookingId}).`;
  
  return {
    ...res,
    directUrl: getDirectWhatsAppUrl(phone, directText)
  };
}

/**
 * 7. Send Free Health Card Delivery via WhatsApp
 */
export async function sendHealthCardWhatsApp({ phone, patientName, patientId, cardUrl }) {
  const viewUrl = cardUrl || "https://www.drjhatka.com/patient/dashboard";
  const templateParams = [
    patientName,
    patientId,
    viewUrl,
    "+91 87077 90677"
  ];
  const res = await sendWhatsAppTemplate(phone, "health_card_issued", templateParams);
  
  const directText = `*Dr Jhatka Medicare - Free Digital Health Card*\n\n` +
    `Dear ${patientName},\n` +
    `Your Lifetime Free Health Card (Patient ID: ${patientId}) is issued!\n\n` +
    `View & Download Card: ${viewUrl}\n\n` +
    `Helpline: +91 87077 90677 | Lucknow`;

  return {
    ...res,
    directUrl: getDirectWhatsAppUrl(phone, directText),
    directText
  };
}

/**
 * Diagnostic tool to check WhatsApp credentials, session status, and template availability
 */
export async function checkWhatsAppStatus() {
  const report = {
    configured: !!(API_KEY && SESSION_ID),
    baseUrl: BASE_URL,
    sessionId: SESSION_ID,
    sessionDetails: null,
    sessionStatus: "UNKNOWN",
    approvedTemplates: [],
    missingTemplates: [],
    issues: []
  };

  if (!API_KEY) {
    report.issues.push("WHATSAPP_API_KEY is missing from environment variables.");
    return report;
  }

  try {
    const sRes = await fetch(`${BASE_URL}/api/project/v1/sessions`, {
      headers: { "X-API-Key": API_KEY }
    });
    
    if (sRes.ok) {
      const sessions = await sRes.json();
      const current = Array.isArray(sessions)
        ? (sessions.find(s => s.sessionId === SESSION_ID || s.id === SESSION_ID) || sessions[0])
        : null;

      if (current) {
        report.sessionDetails = {
          id: current.id,
          sessionId: current.sessionId,
          status: current.status,
          displayPhoneNumber: current.deviceInfo?.displayPhoneNumber,
          apiPhoneNumberId: current.deviceInfo?.apiPhoneNumberId,
          codeVerificationStatus: current.deviceInfo?.codeVerificationStatus,
          qualityRating: current.deviceInfo?.qualityRating,
          lastActive: current.lastActive
        };
        report.sessionStatus = current.status;
        
        if (current.deviceInfo?.codeVerificationStatus !== "VERIFIED") {
          report.issues.push(
            `Phone number ${current.deviceInfo?.displayPhoneNumber || ""} is marked as "${current.deviceInfo?.codeVerificationStatus || "NOT_VERIFIED"}". Meta requires the 2-step verification code to be completed.`
          );
        }
      } else {
        report.issues.push("Configured WHATSAPP_SESSION_ID does not match any session in RateHonk.");
      }
    } else {
      report.issues.push(`Failed to fetch RateHonk sessions: HTTP ${sRes.status}`);
    }

    const tRes = await fetch(`${BASE_URL}/api/project/v1/templates`, {
      headers: { "X-API-Key": API_KEY }
    });

    if (tRes.ok) {
      const templates = await tRes.json();
      const approved = Array.isArray(templates)
        ? templates.filter(t => t.status === "APPROVED").map(t => t.name)
        : [];
      report.approvedTemplates = approved;

      const required = [
        "booking_confirmation",
        "payment_confirmation",
        "admin_booking_alert",
        "admin_payment_alert",
        "feedback_request",
        "health_card_issued",
        "session_reminder"
      ];
      report.missingTemplates = required.filter(r => !approved.includes(r));
      if (report.missingTemplates.length > 0) {
        report.issues.push(`Missing approved templates on RateHonk: ${report.missingTemplates.join(", ")}`);
      }
    }
  } catch (err) {
    report.issues.push(`Connection error: ${err.message}`);
  }

  return report;
}


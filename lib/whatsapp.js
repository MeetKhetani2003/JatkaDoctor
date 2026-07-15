/**
 * WhatsApp Integration Service Layer for Dr Jhatka Medicare
 * Uses RateHonk WhatsApp Panel API
 */

const BASE_URL = process.env.WHATSAPP_BASE_URL || "https://wa.ratehonk.com";
const API_KEY = process.env.WHATSAPP_API_KEY;
const SESSION_ID = process.env.WHATSAPP_SESSION_ID; // Must be added to .env.local

// Helper to log WhatsApp actions in development
function logWhatsAppMessage(functionName, payload, hasCredentials) {
  console.log(`[WhatsApp Service - ${functionName}]`);
  console.log(`- Status: ${hasCredentials ? 'Credentials Active (Attempting Send)' : 'No Credentials (Logging Mode)'}`);
  console.log(`- Payload:`, JSON.stringify(payload, null, 2));
}

// Low-level helper to send messages to RateHonk API
async function sendWhatsAppTemplate(to, templateName, templateParams = []) {
  const hasCredentials = !!(API_KEY && SESSION_ID);
  
  const payload = {
    sessionId: SESSION_ID,
    to: to.replace(/[^0-9]/g, ""), // Keep only numbers
    templateName: templateName,
    languageCode: "en",
    templateParams: templateParams
  };

  logWhatsAppMessage(templateName, payload, hasCredentials);

  if (!hasCredentials) {
    // If credentials or sessionId are absent, succeed silently without throwing
    return { success: true, simulated: true, note: "Add WHATSAPP_SESSION_ID to .env.local to send real messages" };
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

    const data = await response.json();
    if (!response.ok) {
      console.error(`RateHonk API Error for ${templateName}:`, data);
      return { success: false, error: data };
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
  return await sendWhatsAppTemplate(phone, "booking_confirmation", templateParams);
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
  return await sendWhatsAppTemplate(phone, "payment_confirmation", templateParams);
}

/**
 * 3. Send Admin Alert on New Booking
 */
export async function sendAdminBookingAlert({ patientName, bookingId, phone, category }) {
  // Admin alert number can be set via env or fallback
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+918874744756";
  const templateParams = [
    bookingId,
    patientName,
    phone,
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

/**
 * WhatsApp Integration Service Layer for Dr Jhatka Medicare
 * Uses Meta's WhatsApp Cloud API
 */

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Helper to log WhatsApp actions in development
function logWhatsAppMessage(functionName, payload, hasCredentials) {
  console.log(`[WhatsApp Service - ${functionName}]`);
  console.log(`- Status: ${hasCredentials ? 'Credentials Active (Attempting Send)' : 'No Credentials (Logging Mode)'}`);
  console.log(`- Payload:`, JSON.stringify(payload, null, 2));
}

// Low-level helper to send messages to WhatsApp API
async function sendWhatsAppTemplate(to, templateName, components) {
  const hasCredentials = !!(PHONE_NUMBER_ID && ACCESS_TOKEN);
  const payload = {
    messaging_product: "whatsapp",
    to: to.replace(/[^0-9]/g, ""), // Keep only numbers
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en"
      },
      components: components
    }
  };

  logWhatsAppMessage(templateName, payload, hasCredentials);

  if (!hasCredentials) {
    // If credentials are absent, succeed silently without throwing
    return { success: true, simulated: true };
  }

  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`WhatsApp Cloud API Error for ${templateName}:`, data);
      return { success: false, error: data };
    }

    console.log(`WhatsApp message sent successfully via API:`, data);
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
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: patientName },
        { type: "text", text: bookingId },
        { type: "text", text: category || "Medical Service" },
        { type: "text", text: date || "Today" },
        { type: "text", text: time || "Scheduled Time" }
      ]
    }
  ];
  return await sendWhatsAppTemplate(phone, "booking_confirmation", components);
}

/**
 * 2. Send Payment Confirmation to Patient
 */
export async function sendPaymentConfirmation({ phone, patientName, bookingId, amount, paymentMethod }) {
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: patientName },
        { type: "text", text: bookingId },
        { type: "text", text: `INR ${amount}` },
        { type: "text", text: paymentMethod || "UPI" }
      ]
    }
  ];
  return await sendWhatsAppTemplate(phone, "payment_confirmation", components);
}

/**
 * 3. Send Admin Alert on New Booking
 */
export async function sendAdminBookingAlert({ patientName, bookingId, phone, category }) {
  // Admin alert number can be set via env or fallback
  const adminPhone = "+918874744756";
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: bookingId },
        { type: "text", text: patientName },
        { type: "text", text: phone },
        { type: "text", text: category || "Medical Service" }
      ]
    }
  ];
  return await sendWhatsAppTemplate(adminPhone, "admin_booking_alert", components);
}

/**
 * 4. Send Admin Alert on Payment Received
 */
export async function sendAdminPaymentAlert({ patientName, bookingId, amount, paymentMethod }) {
  const adminPhone = "+918874744756";
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: bookingId },
        { type: "text", text: patientName },
        { type: "text", text: `INR ${amount}` },
        { type: "text", text: paymentMethod || "UPI" }
      ]
    }
  ];
  return await sendWhatsAppTemplate(adminPhone, "admin_payment_alert", components);
}

/**
 * 5. Send Feedback & Review Request to Patient (+5 days followup)
 */
export async function sendFeedbackRequest({ phone, patientName, bookingId }) {
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: patientName },
        { type: "text", text: bookingId }
      ]
    }
  ];
  return await sendWhatsAppTemplate(phone, "feedback_request", components);
}

/**
 * Client-safe helpers for building notification URLs and pre-filled messages
 */

export function buildPrefilledMessage({
  patientName = 'Patient',
  bookingId = 'DJM-0000',
  service = 'Healthcare Service',
  problem = 'General Consultation',
  date = '',
  time = '',
  location = 'Lucknow',
  paymentStatus = 'Pending'
}) {
  return `Hello ${patientName} ji,

Dr Jhatka Medicare se aapki booking enquiry receive hui hai.

Booking ID: ${bookingId}
Service: ${service}
Problem: ${problem || 'General Consultation'}
Date: ${date || 'Today'}
Time: ${time || 'Scheduled Slot'}
Location: ${location || 'Lucknow'}
Payment Status: ${paymentStatus}

Kya aap apni booking confirm karna chahenge?`;
}

export function getWhatsAppActionUrl(phone, message) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

export function getEmailActionUrl(email, bookingId, message) {
  if (!email) return '#';
  const subject = `New Booking Enquiry - ${bookingId} | Dr Jhatka Medicare`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export function getCallActionUrl(phone) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `tel:+91${cleanPhone.slice(-10)}`;
}

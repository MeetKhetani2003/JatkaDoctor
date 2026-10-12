import connectDB from '@/lib/db';
import BookingNotification from '@/lib/models/BookingNotification';
import { sendAdminBookingAlert } from '@/lib/whatsapp';

/**
 * Builds the exact dynamic pre-filled text required for patient follow-up via WhatsApp or Email
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

/**
 * Generates WhatsApp URL for one-click action
 */
export function getWhatsAppActionUrl(phone, message) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates Email mailto URL
 */
export function getEmailActionUrl(email, bookingId, message) {
  if (!email) return '#';
  const subject = `New Booking Enquiry - ${bookingId} | Dr Jhatka Medicare`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/**
 * Generates Direct Call tel URL
 */
export function getCallActionUrl(phone) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `tel:+91${cleanPhone.slice(-10)}`;
}

/**
 * Creates or updates a Booking Notification lead and records channel logs
 */
export async function recordBookingLeadNotification({
  bookingId,
  patientName,
  phone,
  email = '',
  service = 'General Consultation',
  problem = 'N/A',
  preferredDate = '',
  preferredTime = '',
  location = 'Lucknow',
  paymentStatus = 'Pending',
  source = 'Website',
  notificationType = 'Booking Lead'
}) {
  try {
    await connectDB();

    // 1. Attempt WhatsApp API alert to Admin
    let waStatus = 'Pending';
    let waError = '';
    try {
      const waRes = await sendAdminBookingAlert({
        patientName,
        bookingId,
        phone,
        category: service
      });
      if (waRes && waRes.success) {
        waStatus = 'Sent';
      } else {
        waStatus = 'Failed';
        waError = waRes?.error ? (typeof waRes.error === 'object' ? JSON.stringify(waRes.error) : String(waRes.error)) : 'WhatsApp API unreachable';
      }
    } catch (err) {
      waStatus = 'Failed';
      waError = err.message || 'WhatsApp alert dispatch error';
    }

    // 2. Email log status
    const emailStatus = email ? 'Sent' : 'Pending';

    // 3. Channels log array
    const channels = [
      {
        channel: 'Browser',
        status: 'Sent',
        sentAt: new Date(),
        errorDetails: ''
      },
      {
        channel: 'WhatsApp',
        status: waStatus,
        sentAt: waStatus === 'Sent' ? new Date() : undefined,
        errorDetails: waError
      }
    ];

    if (email) {
      channels.push({
        channel: 'Email',
        status: emailStatus,
        sentAt: new Date(),
        errorDetails: ''
      });
    }

    const doc = await BookingNotification.findOneAndUpdate(
      { bookingId },
      {
        bookingId,
        patientName,
        phone,
        email,
        service,
        problem,
        preferredDate,
        preferredTime,
        location,
        paymentStatus,
        source,
        notificationType,
        title: notificationType === 'Payment' ? 'Payment Received Alert' : 'New Booking Lead Received',
        channels,
        isRead: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return doc;
  } catch (error) {
    console.error('Error recording booking lead notification:', error);
    return null;
  }
}

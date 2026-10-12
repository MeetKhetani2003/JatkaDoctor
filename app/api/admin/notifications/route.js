import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BookingNotification from '@/lib/models/BookingNotification';
import { sendAdminBookingAlert } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/mail';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'All';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let filter = {};
    if (tab === 'Booking Leads') {
      filter.notificationType = 'Booking Lead';
    } else if (tab === 'Payments') {
      filter.notificationType = 'Payment';
    } else if (tab === 'System') {
      filter.notificationType = 'System';
    }

    const notifications = await BookingNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Calculate unread counts
    const [totalUnread, leadUnread, paymentUnread, systemUnread] = await Promise.all([
      BookingNotification.countDocuments({ isRead: false }),
      BookingNotification.countDocuments({ isRead: false, notificationType: 'Booking Lead' }),
      BookingNotification.countDocuments({ isRead: false, notificationType: 'Payment' }),
      BookingNotification.countDocuments({ isRead: false, notificationType: 'System' })
    ]);

    const counts = {
      all: totalUnread,
      leads: leadUnread,
      payments: paymentUnread,
      system: systemUnread
    };

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCounts: counts
    });
  } catch (error) {
    console.error('Error in GET /api/admin/notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, action } = body;

    if (action === 'markAllRead') {
      await BookingNotification.updateMany({ isRead: false }, { isRead: true });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (action === 'markRead' && id) {
      const updated = await BookingNotification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ error: 'Invalid PATCH action' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH /api/admin/notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, channel } = body;

    if (!id || !channel) {
      return NextResponse.json({ error: 'Notification ID and channel required' }, { status: 400 });
    }

    const notification = await BookingNotification.findById(id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    let retrySuccess = false;
    let errorDetails = '';

    if (channel === 'WhatsApp') {
      try {
        const waRes = await sendAdminBookingAlert({
          patientName: notification.patientName,
          bookingId: notification.bookingId,
          phone: notification.phone,
          category: notification.service
        });
        if (waRes && waRes.success) {
          retrySuccess = true;
        } else {
          errorDetails = waRes?.error ? (typeof waRes.error === 'object' ? JSON.stringify(waRes.error) : String(waRes.error)) : 'WhatsApp API failed';
        }
      } catch (err) {
        errorDetails = err.message || 'WhatsApp error';
      }
    } else if (channel === 'Email' && notification.email) {
      try {
        await sendEmail({
          to: notification.email,
          subject: `Follow-up: Booking Enquiry ${notification.bookingId} | Dr Jhatka Medicare`,
          text: `Dear ${notification.patientName},\n\nWe have received your enquiry for ${notification.service}.\nBooking ID: ${notification.bookingId}\nStatus: ${notification.paymentStatus}\n\nOur team is ready to assist you.`
        });
        retrySuccess = true;
      } catch (err) {
        errorDetails = err.message || 'Email delivery failed';
      }
    }

    // Update channel log
    let channelItem = notification.channels.find(c => c.channel === channel);
    if (!channelItem) {
      channelItem = { channel, status: 'Pending', retryCount: 0 };
      notification.channels.push(channelItem);
    }

    channelItem.status = retrySuccess ? 'Sent' : 'Failed';
    channelItem.sentAt = retrySuccess ? new Date() : channelItem.sentAt;
    channelItem.errorDetails = errorDetails;
    channelItem.retryCount = (channelItem.retryCount || 0) + 1;

    await notification.save();

    return NextResponse.json({
      success: retrySuccess,
      channel,
      status: channelItem.status,
      errorDetails,
      notification
    });
  } catch (error) {
    console.error('Error in POST /api/admin/notifications (retry):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

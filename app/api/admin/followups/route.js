import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FollowupTask from '@/lib/models/FollowupTask';
import { verifyAdmin } from '@/lib/adminAuth';
import { sendFeedbackRequest } from '@/lib/whatsapp';

export async function GET(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tasks = await FollowupTask.find({}).sort({ scheduledDate: 1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { bookingId, patientName, phone, type, scheduledDate, remarks } = body;

    if (!bookingId || !patientName || !phone || !type || !scheduledDate) {
      return NextResponse.json({ error: 'Missing required followup fields' }, { status: 400 });
    }

    const task = new FollowupTask({
      bookingId,
      patientName,
      phone,
      type,
      scheduledDate: new Date(scheduledDate),
      remarks: remarks || '',
      status: 'Pending'
    });

    await task.save();
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { id, status, remarks, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
    }

    let update = {};
    if (status) update.status = status;
    if (remarks !== undefined) update.remarks = remarks;
    if (type) update.type = type;

    const task = await FollowupTask.findByIdAndUpdate(id, update, { returnDocument: 'after' });

    if (!task) {
      return NextResponse.json({ error: 'Followup task not found' }, { status: 404 });
    }

    // If marked as Completed, trigger the mock WhatsApp notification
    if (status === 'Completed') {
      try {
        await sendFeedbackRequest({
          phone: task.phone,
          patientName: task.patientName,
          bookingId: task.bookingId
        });
      } catch (waError) {
        console.error("WhatsApp feedback alert failed:", waError);
      }
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

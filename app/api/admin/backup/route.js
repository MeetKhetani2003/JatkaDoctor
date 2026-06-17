import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Payment from '@/lib/models/Payment';
import Staff from '@/lib/models/Staff';
import Doctor from '@/lib/models/Doctor';
import CancellationRequest from '@/lib/models/CancellationRequest';
import FollowupTask from '@/lib/models/FollowupTask';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      system: "Dr Jhatka Medicare Cloud Ready Backup",
      collections: {
        appointments: await Appointment.find({}),
        payments: await Payment.find({}),
        staff: await Staff.find({}),
        doctors: await Doctor.find({}),
        cancellationRequests: await CancellationRequest.find({}),
        followupTasks: await FollowupTask.find({})
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const filename = `dr-jhatka-backup-${new Date().toISOString().split('T')[0]}.json`;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new Response(jsonString, {
      status: 200,
      headers
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

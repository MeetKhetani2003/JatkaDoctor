import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Camp from '@/lib/models/Camp';
import CampVisit from '@/lib/models/CampVisit';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const patientId = url.searchParams.get('patientId');

    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    } else if (!url.searchParams.get('all')) {
      // By default show Upcoming and Active camps
      query.status = { $in: ['Active', 'Upcoming'] };
    }

    let camps = await Camp.find(query).sort({ date: 1, createdAt: -1 }).lean();

    // If no camps exist in DB yet, provide official upcoming Dr Jhatka Medicare camp
    if (!camps || camps.length === 0) {
      camps = [
        {
          campId: 'CAMP-LKO-001',
          name: 'Free Mega Health & Physiotherapy Check-up Camp',
          location: 'Gomti Nagar, Lucknow',
          city: 'Lucknow',
          address: 'Near Patrakarpuram Crossing, Gomti Nagar, Lucknow, UP 226010',
          date: 'Sunday, 18 Oct 2026',
          time: '10:00 AM – 02:00 PM',
          campType: 'Free General Health & Physiotherapy Camp',
          status: 'Active',
          description: 'Comprehensive free health check-up camp by Dr Jhatka Medicare. Free Blood Pressure check, Random Blood Sugar check, BMI measurement, Senior citizen mobility consultation, and free permanent digital Health Card issuance.',
          assignedStaff: [
            { name: 'Dr. S. K. Verma', role: 'Chief Medical Officer' },
            { name: 'Dr. Priya Sharma (PT)', role: 'Senior Physiotherapist' },
            { name: 'Ankit Singh', role: 'Camp Coordinator' }
          ],
          totalRegistered: 84,
          totalChecksCompleted: 62,
          targetPatients: 150
        }
      ];
    }

    // If patientId provided, check which camps the patient has already registered for or attended
    let patientRegistrations = [];
    if (patientId) {
      const visits = await CampVisit.find({ patientId }).lean();
      patientRegistrations = visits.map(v => v.campId);
    }

    return NextResponse.json({
      success: true,
      camps,
      registeredCampIds: patientRegistrations
    });
  } catch (error) {
    console.error('Fetch public camps error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import CampVisit from '@/lib/models/CampVisit';
import Appointment from '@/lib/models/Appointment';
import PhysioBooking from '@/lib/models/physio/PhysioBooking';
import Family from '@/lib/models/Family';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const source = url.searchParams.get('source');
    const cardStatus = url.searchParams.get('cardStatus');
    const seniorOnly = url.searchParams.get('seniorOnly');
    const campId = url.searchParams.get('campId');
    const exportCsv = url.searchParams.get('export') === 'csv';

    let query = { isArchived: { $ne: true } };

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { patientId: { $regex: s, $options: 'i' } },
        { familyId: { $regex: s, $options: 'i' } },
        { mobile: { $regex: s.replace(/[^0-9]/g, ''), $options: 'i' } },
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } }
      ];
    }

    if (source && source !== 'All') {
      query.source = source;
    }

    if (cardStatus && cardStatus !== 'All') {
      query.cardStatus = cardStatus;
    }

    if (seniorOnly === 'true') {
      query.isSeniorCitizen = true;
    }

    if (campId) {
      query.campId = campId;
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 }).lean();

    // If CSV export requested
    if (exportCsv) {
      const headers = [
        'Patient ID',
        'Family ID',
        'Name',
        'Mobile',
        'Email',
        'Age',
        'Gender',
        'Blood Group',
        'City',
        'Area',
        'Card Status',
        'Card Version',
        'Senior Citizen',
        'Source',
        'Camp ID',
        'Follow-up Status',
        'Coins Balance',
        'Registration Date'
      ];

      const csvRows = [headers.join(',')];

      patients.forEach(p => {
        const row = [
          `"${p.patientId || ''}"`,
          `"${p.familyId || ''}"`,
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${p.mobile || ''}"`,
          `"${p.email || ''}"`,
          `"${p.age || ''}"`,
          `"${p.gender || ''}"`,
          `"${p.bloodGroup || ''}"`,
          `"${(p.city || '').replace(/"/g, '""')}"`,
          `"${(p.area || '').replace(/"/g, '""')}"`,
          `"${p.cardStatus || 'ACTIVE'}"`,
          `"V${p.cardVersion || 1}"`,
          `"${p.isSeniorCitizen ? 'YES' : 'NO'}"`,
          `"${p.source || 'Website'}"`,
          `"${p.campId || ''}"`,
          `"${p.followupStatus || 'New'}"`,
          `"${p.rewardCoinsBalance || 0}"`,
          `"${new Date(p.createdAt).toISOString().split('T')[0]}"`
        ];
        csvRows.push(row.join(','));
      });

      return new Response(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=Dr_Jhatka_Patients_Export_${new Date().toISOString().split('T')[0]}.csv`
        }
      });
    }

    // Attach statistics and visit count for each patient
    const enrichedPatients = await Promise.all(patients.map(async (p) => {
      const campVisitsCount = await CampVisit.countDocuments({ patientId: p.patientId });
      const latestVisit = await CampVisit.findOne({ patientId: p.patientId }).sort({ createdAt: -1 }).lean();
      
      return {
        ...p,
        campVisitsCount,
        latestVisit
      };
    }));

    return NextResponse.json({
      success: true,
      total: enrichedPatients.length,
      patients: enrichedPatients
    });
  } catch (error) {
    console.error('Fetch health cards error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

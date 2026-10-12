import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prescription from '@/lib/models/Prescription';
import Patient from '@/lib/models/physio/Patient';
import BookingNotification from '@/lib/models/BookingNotification';
import { uploadPrescriptionFile } from '@/lib/prescriptionGridfs';

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('file');
    const patientName = (formData.get('patientName') || '').trim();
    const patientPhone = (formData.get('patientPhone') || '').trim();
    const patientId = (formData.get('patientId') || '').trim();
    const bookingId = (formData.get('bookingId') || '').trim();
    const notes = (formData.get('notes') || '').trim();
    const uploadSource = formData.get('uploadSource') || 'Web Upload';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'Please select a prescription file to upload' }, { status: 400 });
    }

    if (!patientName) {
      return NextResponse.json({ success: false, error: 'Patient name is required' }, { status: 400 });
    }

    if (!patientPhone) {
      return NextResponse.json({ success: false, error: 'Patient mobile number is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file format. Please upload JPG, PNG, or PDF format only.' 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Max 15MB limit
    if (buffer.length > 15 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size exceeds 15MB limit.' 
      }, { status: 400 });
    }

    // 1. Upload to secure GridFS bucket
    const fileGridFsId = await uploadPrescriptionFile(buffer, file.name, file.type);

    // 2. Generate unique human-readable prescription ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prescriptionId = `RX-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

    // 3. Link with existing Patient profile if available
    const cleanPhone = patientPhone.replace(/[^0-9]/g, '').slice(-10);
    let linkedPatient = null;

    if (patientId) {
      linkedPatient = await Patient.findOne({ patientId });
    }
    if (!linkedPatient && cleanPhone) {
      linkedPatient = await Patient.findOne({
        $or: [
          { mobile: cleanPhone },
          { mobile: `+91${cleanPhone}` }
        ]
      });
    }

    // 4. Save Prescription record
    const newPrescription = await Prescription.create({
      prescriptionId,
      patientDbId: linkedPatient?._id || undefined,
      patientId: linkedPatient?.patientId || (patientId || undefined),
      patientName,
      patientPhone: cleanPhone,
      fileGridFsId,
      fileName: file.name,
      fileType: file.type,
      fileSize: buffer.length,
      uploadSource,
      notes,
      bookingId: bookingId || undefined,
      status: 'Pending',
    });

    // 5. Trigger live Admin Notification in BookingNotification
    try {
      await BookingNotification.create({
        bookingId: prescriptionId,
        patientName,
        phone: cleanPhone,
        email: '',
        service: 'Prescription Upload',
        category: 'Prescription',
        problem: notes ? `Notes: ${notes}` : `Uploaded via ${uploadSource} (${file.name})`,
        notificationType: 'Prescription',
        preferredDate: new Date().toLocaleDateString('en-IN'),
        preferredTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        location: linkedPatient?.city || 'Lucknow',
        paymentStatus: 'Uploaded',
        isRead: false
      });
    } catch (notifErr) {
      console.warn('Could not create admin notification for prescription:', notifErr);
    }

    return NextResponse.json({
      success: true,
      prescriptionId,
      prescription: {
        _id: newPrescription._id,
        prescriptionId,
        fileName: file.name,
        fileType: file.type,
        patientName,
        patientPhone: cleanPhone,
        status: 'Pending',
        fileUrl: `/api/prescriptions/${prescriptionId}/file`
      },
      message: 'Prescription uploaded successfully and sent for review!'
    }, { status: 201 });

  } catch (error) {
    console.error('Prescription Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

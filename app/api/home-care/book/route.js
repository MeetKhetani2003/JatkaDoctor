import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import Patient from '@/lib/models/physio/Patient';
import { generateHomeCareBookingId, generatePatientId } from '@/lib/idGenerator';
import { recordBookingLeadNotification } from '@/lib/notificationHelper';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      category = 'home-care',
      serviceId,
      serviceName,
      patientType = 'new',
      existingPatientId,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      careType,
      selectedRequirements = [],
      specialInstructions = '',
      address,
      area = '',
      city = 'Lucknow',
      pincode = '',
      mapLocation = '',
      startDate,
      startTime = '',
      duration = '',
      pricingType = 'Starting From',
      basePrice = 0,
      discountAmount = 0,
      totalAmount = 0,
      paymentMethod = 'online',
    } = body;

    if (!patientName || !patientPhone || !address || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Patient name, phone, address, and start date are required' },
        { status: 400 }
      );
    }

    // 1. Patient Deduplication & Permanent ID handling
    let patient = null;
    if (patientType === 'existing' && existingPatientId) {
      patient = await Patient.findById(existingPatientId);
      if (!patient) {
        patient = await Patient.findOne({ patientId: existingPatientId });
      }
    }

    // Search by clean 10-digit mobile if not found
    if (!patient && patientPhone) {
      const cleanPhone = patientPhone.replace(/[^0-9]/g, '').slice(-10);
      patient = await Patient.findOne({
        mobile: { $regex: cleanPhone, $options: 'i' }
      });
    }

    // Create new patient record if first time
    if (!patient) {
      const permanentId = await generatePatientId();
      patient = await Patient.create({
        patientId: permanentId,
        name: patientName.trim(),
        mobile: patientPhone.trim(),
        email: patientEmail ? patientEmail.trim() : '',
        age: patientAge ? Number(patientAge) : undefined,
        gender: patientGender || 'Other',
        city: city || 'Lucknow',
        area: area || '',
        address: address || '',
        pincode: pincode || '',
      });
    } else {
      // Update missing fields if needed
      if (!patient.address && address) patient.address = address;
      if (!patient.age && patientAge) patient.age = Number(patientAge);
      if (!patient.gender && patientGender) patient.gender = patientGender;
      await patient.save();
    }

    // 2. Generate Booking ID
    const bookingId = await generateHomeCareBookingId(category);

    // 3. Determine Initial Status
    const isQuote = paymentMethod === 'quote' || pricingType === 'Custom Quote';
    const initialBookingStatus = isQuote ? 'Quote Required' : 'New';
    const initialPaymentStatus = 'Pending';

    // 4. Create Booking
    const newBooking = await HomeCareBooking.create({
      bookingId,
      category,
      serviceId,
      serviceName: serviceName || (category === 'nursing-care' ? 'Nursing Care Service' : 'Home Care Service'),
      patientId: patient._id,
      patientPermanentId: patient.patientId,
      patientName: patient.name,
      patientAge: patient.age || (patientAge ? Number(patientAge) : undefined),
      patientGender: patient.gender || patientGender,
      patientPhone: patient.mobile,
      patientEmail: patient.email || patientEmail,
      careType: careType || '',
      selectedRequirements,
      specialInstructions,
      address,
      area,
      city,
      pincode,
      mapLocation,
      startDate,
      startTime,
      duration,
      pricingType,
      basePrice: Number(basePrice) || 0,
      discountAmount: Number(discountAmount) || 0,
      totalAmount: Number(totalAmount) || 0,
      paymentStatus: initialPaymentStatus,
      paymentMethod: paymentMethod === 'quote' ? 'Quote' : 'Online',
      bookingStatus: initialBookingStatus,
      source: 'Website',
      activityLogs: [{
        action: 'Booking Created',
        performedBy: 'Website User',
        timestamp: new Date(),
        notes: `Initial request created. Status: ${initialBookingStatus}`
      }]
    });

    // 5. Increment verified booking count on service
    if (serviceId) {
      await HomeCareService.findByIdAndUpdate(serviceId, {
        $inc: { verifiedBookingsCount: 1 }
      });
    }

    // 6. Send Admin Notification & WhatsApp alert
    try {
      await recordBookingLeadNotification({
        bookingId,
        patientName: patient.name,
        phone: patient.mobile,
        email: patient.email,
        service: `${category === 'nursing-care' ? 'Nursing Care' : 'Home Care'} - ${serviceName}`,
        problem: careType || (selectedRequirements.join(', ') || 'Home Healthcare'),
        preferredDate: startDate,
        preferredTime: startTime,
        location: `${area ? area + ', ' : ''}${city}`,
        paymentStatus: initialPaymentStatus,
        source: 'Website',
        notificationType: isQuote ? 'Quote Request' : 'New Booking Lead'
      });
    } catch (notifErr) {
      console.warn('Booking lead notification error:', notifErr.message);
    }

    return NextResponse.json({
      success: true,
      message: isQuote 
        ? 'Your request has been submitted. Our clinical coordinator will prepare a personalized quote.' 
        : 'Your booking has been initiated successfully.',
      data: {
        bookingId: newBooking.bookingId,
        id: newBooking._id,
        patientPermanentId: patient.patientId,
        patientName: patient.name,
        serviceName: newBooking.serviceName,
        totalAmount: newBooking.totalAmount,
        bookingStatus: newBooking.bookingStatus,
        paymentStatus: newBooking.paymentStatus,
        isQuote,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error in home-care booking API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

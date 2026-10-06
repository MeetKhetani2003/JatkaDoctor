import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import Family from '@/lib/models/Family';
import Camp from '@/lib/models/Camp';
import CampVisit from '@/lib/models/CampVisit';
import Notification from '@/lib/models/Notification';
import { generatePatientId, generateFamilyId, generateSecureToken } from '@/lib/idGenerator';
import { sendHealthCardWhatsApp } from '@/lib/whatsapp';
import { sendHealthCardEmail } from '@/lib/mail';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const cleanMobile = (body.mobile || '').replace(/[^0-9]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json({ success: false, message: 'Valid 10-digit mobile number is required' }, { status: 400 });
    }

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Patient Name is required' }, { status: 400 });
    }

    // 1. Check for Duplicate Patient by mobile number
    const existingPatient = await Patient.findOne({ 
      $or: [
        { mobile: cleanMobile },
        { mobile: `+91${cleanMobile}` },
        { mobile: cleanMobile.slice(-10) }
      ]
    });

    if (existingPatient) {
      // If camp visit is being logged for existing patient
      if (body.campId) {
        try {
          const camp = await Camp.findOne({ campId: body.campId });
          await CampVisit.create({
            patientId: existingPatient.patientId,
            patientName: existingPatient.name,
            campId: body.campId,
            campName: camp?.name || body.campId,
            location: camp?.location || '',
            registeredBy: body.registeredBy || 'Camp Staff',
            bpSystolic: body.bpSystolic,
            bpDiastolic: body.bpDiastolic,
            sugarRBS: body.sugarRBS,
            spo2: body.spo2,
            pulse: body.pulse,
            temperature: body.temperature,
            weight: body.weight,
            bmi: body.bmi,
            postureScreening: body.postureScreening,
            physiotherapyAdvice: body.physiotherapyAdvice,
            doctorNotes: body.doctorNotes,
            recommendedService: body.recommendedService,
            checkStatus: 'Completed',
          });

          if (camp) {
            camp.totalRegistered = (camp.totalRegistered || 0) + 1;
            camp.totalChecksCompleted = (camp.totalChecksCompleted || 0) + 1;
            await camp.save();
          }

          existingPatient.auditLogs.push({
            action: 'Camp Visit Added',
            performedBy: body.registeredBy || 'Camp Staff',
            details: `Attended Camp ${body.campId} on ${new Date().toLocaleDateString()}`
          });
          await existingPatient.save();
        } catch (e) {
          console.error('Error logging camp visit for existing patient:', e);
        }
      }

      // Return existing patient info - No duplicate patient ID is created!
      return NextResponse.json({
        success: true,
        exists: true,
        message: 'Existing Patient Found with this Mobile Number. Using Permanent Patient ID.',
        patient: existingPatient,
      });
    }

    // 2. Generate Permanent Unique Lifetime IDs
    const patientId = await generatePatientId();
    let familyId = body.familyId;
    if (!familyId) {
      familyId = await generateFamilyId();
    }
    const qrToken = generateSecureToken();

    // 3. Compute Age & Senior Citizen Eligibility
    let calculatedAge = body.age ? parseInt(body.age, 10) : undefined;
    if (!calculatedAge && body.dob) {
      const birthYear = new Date(body.dob).getFullYear();
      if (!isNaN(birthYear)) {
        calculatedAge = new Date().getFullYear() - birthYear;
      }
    }
    const isSeniorCitizen = calculatedAge ? calculatedAge >= 70 : false;

    // 4. Create New Patient Document
    const newPatient = new Patient({
      patientId,
      familyId,
      isFamilyHead: !body.familyId, // First member is family head
      familyRelation: body.familyRelation || 'Self',
      name: body.name.trim(),
      mobile: cleanMobile.slice(-10),
      whatsappNumber: (body.whatsappNumber || cleanMobile).slice(-10),
      email: body.email ? body.email.trim().toLowerCase() : undefined,
      dob: body.dob || undefined,
      age: calculatedAge,
      gender: body.gender || undefined,
      city: body.city || 'Lucknow',
      area: body.area || undefined,
      address: body.address || undefined,
      pincode: body.pincode || undefined,
      photo: body.photo || undefined,
      
      // Emergency Contact
      emergencyContactName: body.emergencyContactName || undefined,
      emergencyContactPhone: body.emergencyContactPhone || undefined,
      emergencyContactRelation: body.emergencyContactRelation || undefined,

      // Health details
      bloodGroup: body.bloodGroup || undefined,
      bloodGroupStatus: 'Self-reported',
      existingConditions: body.existingConditions || undefined,
      allergies: body.allergies || undefined,

      // Health Card Status
      cardStatus: 'ACTIVE',
      cardVersion: 1,
      cardIssuedAt: new Date(),
      qrToken,
      deliveryStatus: {
        whatsApp: { status: 'Pending' },
        email: { status: 'Pending' }
      },
      cardHistory: [{
        version: 1,
        generatedAt: new Date(),
        updatedFields: ['Initial Generation'],
        generatedBy: body.registeredBy || 'Self Registration'
      }],

      // Senior citizen
      isSeniorCitizen,
      seniorCitizenBenefitActive: isSeniorCitizen,

      // Source tracking
      source: body.source || (body.campId ? 'Camp' : 'Website'),
      campId: body.campId || undefined,
      registeredBy: body.registeredBy || 'Self',

      // Consents
      healthDataConsent: body.healthDataConsent ?? true,
      termsAccepted: body.termsAccepted ?? true,
      communicationConsent: body.communicationConsent ?? true,
      marketingConsent: body.marketingConsent ?? false,
      consentTimestamp: new Date(),

      // Reward Welcome Bonus
      rewardCoinsBalance: 50,
      rewardHistory: [{
        coins: 50,
        type: 'Earned',
        reason: 'Free Health Card Registration Welcome Bonus',
        date: new Date()
      }],

      auditLogs: [{
        action: 'Patient Registered & Health Card Issued',
        performedBy: body.registeredBy || 'Self',
        details: `Initial Free Health Card V1 created with Permanent ID ${patientId}`,
        timestamp: new Date()
      }]
    });

    await newPatient.save();

    // 5. Create or Update Family record
    let family = await Family.findOne({ familyId });
    if (!family) {
      family = await Family.create({
        familyId,
        familyName: `${newPatient.name.split(' ')[0]}'s Family`,
        primaryPatientId: patientId,
        primaryPhone: newPatient.mobile,
        members: [{
          patientId,
          name: newPatient.name,
          relation: 'Self',
          mobile: newPatient.mobile,
          gender: newPatient.gender,
          age: newPatient.age,
          isMinor: (newPatient.age && newPatient.age < 18) || false,
          addedAt: new Date()
        }]
      });
    } else {
      family.members.push({
        patientId,
        name: newPatient.name,
        relation: newPatient.familyRelation || 'Family Member',
        mobile: newPatient.mobile,
        gender: newPatient.gender,
        age: newPatient.age,
        isMinor: (newPatient.age && newPatient.age < 18) || false,
        addedAt: new Date()
      });
      await family.save();
    }

    // 6. If registered through Camp, create CampVisit record
    if (body.campId) {
      try {
        const camp = await Camp.findOne({ campId: body.campId });
        await CampVisit.create({
          patientId,
          patientName: newPatient.name,
          campId: body.campId,
          campName: camp?.name || body.campId,
          location: camp?.location || '',
          registeredBy: body.registeredBy || 'Camp Staff',
          bpSystolic: body.bpSystolic,
          bpDiastolic: body.bpDiastolic,
          sugarRBS: body.sugarRBS,
          spo2: body.spo2,
          pulse: body.pulse,
          temperature: body.temperature,
          weight: body.weight,
          bmi: body.bmi,
          postureScreening: body.postureScreening,
          physiotherapyAdvice: body.physiotherapyAdvice,
          doctorNotes: body.doctorNotes,
          recommendedService: body.recommendedService,
          checkStatus: 'Completed'
        });

        if (camp) {
          camp.totalRegistered = (camp.totalRegistered || 0) + 1;
          if (body.bpSystolic || body.sugarRBS) {
            camp.totalChecksCompleted = (camp.totalChecksCompleted || 0) + 1;
          }
          await camp.save();
        }
      } catch (err) {
        console.error('Camp visit record creation error:', err);
      }
    }

    // 7. Create welcome notification
    await Notification.create({
      patientId,
      title: 'Free Health Card Issued!',
      message: `Welcome to Dr Jhatka Medicare. Your Permanent Lifetime Patient ID is ${patientId}. You received 50 Welcome Coins!`,
      type: 'Card',
      actionUrl: '/patient/dashboard'
    });

    // 8. Auto-send WhatsApp & Email
    const cardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.drjhatka.com'}/health-card/view/${newPatient.patientId}`;
    
    // Asynchronous send WhatsApp
    (async () => {
      try {
        const waResult = await sendHealthCardWhatsApp({
          phone: newPatient.whatsappNumber || newPatient.mobile,
          patientName: newPatient.name,
          patientId: newPatient.patientId,
          cardUrl
        });
        await Patient.updateOne(
          { patientId: newPatient.patientId },
          { 
            $set: { 
              'deliveryStatus.whatsApp.status': waResult?.success ? 'Sent' : 'Failed',
              'deliveryStatus.whatsApp.sentAt': new Date(),
              'deliveryStatus.whatsApp.error': waResult?.error ? JSON.stringify(waResult.error) : null
            }
          }
        );
      } catch (waErr) {
        console.error('Background WhatsApp dispatch error:', waErr);
      }
    })();

    // Asynchronous send Email (if provided)
    if (newPatient.email) {
      (async () => {
        try {
          await sendHealthCardEmail({
            email: newPatient.email,
            patientName: newPatient.name,
            patientId: newPatient.patientId,
            cardUrl
          });
          await Patient.updateOne(
            { patientId: newPatient.patientId },
            { 
              $set: { 
                'deliveryStatus.email.status': 'Sent',
                'deliveryStatus.email.sentAt': new Date()
              }
            }
          );
        } catch (emailErr) {
          console.error('Background Email dispatch error:', emailErr);
          await Patient.updateOne(
            { patientId: newPatient.patientId },
            { 
              $set: { 
                'deliveryStatus.email.status': 'Failed',
                'deliveryStatus.email.error': emailErr.message
              }
            }
          );
        }
      })();
    }

    // 9. Set patient_session cookie
    const sessionPayload = JSON.stringify({
      patientId: newPatient._id.toString(),
      patientDbId: newPatient.patientId,
      name: newPatient.name,
      email: newPatient.email || '',
      mobile: newPatient.mobile,
      profileComplete: true,
    });

    const response = NextResponse.json({
      success: true,
      exists: false,
      message: 'New Permanent Patient ID and Free Health Card Generated Successfully!',
      patient: newPatient,
    });

    response.cookies.set('patient_session', Buffer.from(sessionPayload).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Health card registration error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

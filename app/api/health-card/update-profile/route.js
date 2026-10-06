import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import Notification from '@/lib/models/Notification';
import { sendHealthCardEmail } from '@/lib/mail';
import { sendHealthCardWhatsApp } from '@/lib/whatsapp';

export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { patientId } = body;
    if (!patientId) {
      return NextResponse.json({ success: false, message: 'Patient ID is required' }, { status: 400 });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Check if mobile number is being changed
    if (body.mobile && body.mobile !== patient.mobile) {
      const cleanMobile = body.mobile.replace(/[^0-9]/g, '').slice(-10);
      const existing = await Patient.findOne({ mobile: cleanMobile, patientId: { $ne: patientId } });
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          message: 'This mobile number is already linked to another patient profile.' 
        }, { status: 409 });
      }
      patient.mobile = cleanMobile;
      if (!body.whatsappNumber) {
        patient.whatsappNumber = cleanMobile;
      }
    }

    // Track updated fields for Card Versioning
    const updatedFields = [];
    if (body.name && body.name !== patient.name) {
      patient.name = body.name.trim();
      updatedFields.push('Name');
    }
    if (body.email !== undefined && body.email !== patient.email) {
      patient.email = body.email ? body.email.trim().toLowerCase() : '';
      patient.emailVerified = true;
      updatedFields.push('Email');
    }
    if (body.whatsappNumber) {
      patient.whatsappNumber = body.whatsappNumber.replace(/[^0-9]/g, '').slice(-10);
      updatedFields.push('WhatsApp');
    }
    if (body.dob) {
      patient.dob = body.dob;
      const birthYear = new Date(body.dob).getFullYear();
      if (!isNaN(birthYear)) {
        patient.age = new Date().getFullYear() - birthYear;
        patient.isSeniorCitizen = patient.age >= 70;
      }
      updatedFields.push('DOB/Age');
    } else if (body.age !== undefined) {
      patient.age = parseInt(body.age, 10);
      patient.isSeniorCitizen = patient.age >= 70;
      updatedFields.push('Age');
    }
    if (body.gender) {
      patient.gender = body.gender;
      updatedFields.push('Gender');
    }
    if (body.bloodGroup !== undefined) {
      patient.bloodGroup = body.bloodGroup;
      patient.bloodGroupStatus = body.bloodGroupVerified ? 'Verified' : 'Self-reported';
      updatedFields.push('Blood Group');
    }
    if (body.address !== undefined) {
      patient.address = body.address;
      updatedFields.push('Address');
    }
    if (body.area !== undefined) patient.area = body.area;
    if (body.city !== undefined) patient.city = body.city;
    if (body.pincode !== undefined) patient.pincode = body.pincode;
    if (body.photo !== undefined) patient.photo = body.photo;
    
    // Emergency contact
    if (body.emergencyContactName !== undefined) patient.emergencyContactName = body.emergencyContactName;
    if (body.emergencyContactPhone !== undefined) patient.emergencyContactPhone = body.emergencyContactPhone;
    if (body.emergencyContactRelation !== undefined) patient.emergencyContactRelation = body.emergencyContactRelation;
    if (body.emergencyContactName || body.emergencyContactPhone) updatedFields.push('Emergency Contact');

    // Health conditions & Allergies
    if (body.existingConditions !== undefined) patient.existingConditions = body.existingConditions;
    if (body.allergies !== undefined) patient.allergies = body.allergies;

    // Senior citizen manual override if provided by admin
    if (body.isSeniorCitizen !== undefined) {
      patient.isSeniorCitizen = !!body.isSeniorCitizen;
    }
    if (body.seniorCitizenBenefitActive !== undefined) {
      patient.seniorCitizenBenefitActive = !!body.seniorCitizenBenefitActive;
    }

    // CARD VERSIONING LOGIC:
    // Increment card version when profile changes (V1 -> V2 -> V3...)
    // Patient ID REMAINS PERMANENT!
    if (updatedFields.length > 0) {
      patient.cardVersion = (patient.cardVersion || 1) + 1;
      patient.cardHistory.push({
        version: patient.cardVersion,
        generatedAt: new Date(),
        updatedFields,
        generatedBy: body.updatedBy || 'Patient Self-Service'
      });

      patient.auditLogs.push({
        action: `Profile Updated (Card V${patient.cardVersion})`,
        performedBy: body.updatedBy || 'Patient',
        details: `Updated fields: ${updatedFields.join(', ')}`,
        timestamp: new Date()
      });

      await Notification.create({
        patientId,
        title: `Health Card Updated (V${patient.cardVersion})`,
        message: `Your Dr Jhatka Medicare Free Health Card has been updated with latest information (${updatedFields.join(', ')}). Your Permanent ID ${patientId} remains the same.`,
        type: 'Card',
        actionUrl: '/patient/dashboard'
      });

      // If email added or updated, trigger email delivery
      if (patient.email && updatedFields.includes('Email')) {
        const cardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.drjhatka.com'}/health-card/view/${patient.patientId}`;
        sendHealthCardEmail({
          email: patient.email,
          patientName: patient.name,
          patientId: patient.patientId,
          cardUrl
        }).catch(e => console.error('Email resend on update error:', e));
      }
    }

    await patient.save();

    return NextResponse.json({
      success: true,
      message: `Profile updated and Health Card Version ${patient.cardVersion} generated successfully!`,
      patient,
      cardVersion: patient.cardVersion,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

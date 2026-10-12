import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import Notification from '@/lib/models/Notification';
import { sendHealthCardEmail } from '@/lib/mail';
import { sendHealthCardWhatsApp } from '@/lib/whatsapp';
import { uploadToGridFS } from '@/lib/gridfs';

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

    // Process Base64 photo upload if provided
    let photoUrl = body.photo;
    if (body.photo && body.photo.startsWith('data:image')) {
      try {
        const match = body.photo.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          const contentType = match[1];
          const base64Data = match[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const fileId = await uploadToGridFS(buffer, `passport_${Date.now()}`, contentType);
          photoUrl = `/api/images/${fileId}`;
        }
      } catch (err) {
        console.error('GridFS upload error in update-profile:', err);
      }
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

    // Track updated fields
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
    } else if (body.age !== undefined && body.age !== '') {
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
    if (photoUrl !== undefined) {
      patient.photo = photoUrl;
      updatedFields.push('Photo');
    }
    
    // Emergency contact
    if (body.emergencyContactName !== undefined) patient.emergencyContactName = body.emergencyContactName;
    if (body.emergencyContactPhone !== undefined) patient.emergencyContactPhone = body.emergencyContactPhone;
    if (body.emergencyContactRelation !== undefined) patient.emergencyContactRelation = body.emergencyContactRelation;
    if (body.emergencyContactName || body.emergencyContactPhone || body.emergencyContactRelation) {
      updatedFields.push('Emergency Contact');
    }

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

    // Synchronize Health Card details so the card reflects the updated options
    if (!patient.healthCardDetails) {
      patient.healthCardDetails = {};
    }
    if (patient.name) patient.healthCardDetails.name = patient.name;
    if (patient.mobile) patient.healthCardDetails.mobile = patient.mobile;
    if (patient.whatsappNumber) patient.healthCardDetails.whatsappNumber = patient.whatsappNumber;
    if (patient.dob) patient.healthCardDetails.dob = patient.dob;
    if (patient.age !== undefined) patient.healthCardDetails.age = patient.age;
    if (patient.gender) patient.healthCardDetails.gender = patient.gender;
    if (patient.bloodGroup !== undefined) patient.healthCardDetails.bloodGroup = patient.bloodGroup;
    if (patient.photo) patient.healthCardDetails.photo = patient.photo;
    if (patient.city) patient.healthCardDetails.city = patient.city;
    if (patient.area !== undefined) patient.healthCardDetails.area = patient.area;
    if (patient.address !== undefined) patient.healthCardDetails.address = patient.address;
    if (patient.pincode !== undefined) patient.healthCardDetails.pincode = patient.pincode;
    if (patient.emergencyContactName !== undefined) patient.healthCardDetails.emergencyContactName = patient.emergencyContactName;
    if (patient.emergencyContactPhone !== undefined) patient.healthCardDetails.emergencyContactPhone = patient.emergencyContactPhone;
    if (patient.emergencyContactRelation !== undefined) patient.healthCardDetails.emergencyContactRelation = patient.emergencyContactRelation;
    if (patient.existingConditions !== undefined) patient.healthCardDetails.existingConditions = patient.existingConditions;
    if (patient.allergies !== undefined) patient.healthCardDetails.allergies = patient.allergies;

    // Logging & Notification
    if (updatedFields.length > 0) {
      patient.auditLogs.push({
        action: 'Health Card & Profile Updated',
        performedBy: body.updatedBy || 'Patient',
        details: `Updated fields: ${updatedFields.join(', ')}`,
        timestamp: new Date()
      });

      await Notification.create({
        patientId,
        title: 'Health Card & Profile Updated',
        message: `Your Dr Jhatka Medicare Free Health Card & profile have been updated with latest information (${updatedFields.join(', ')}). Permanent ID ${patientId} remains active.`,
        type: 'Card',
        actionUrl: '/patient/dashboard'
      });
    }

    await patient.save();

    return NextResponse.json({
      success: true,
      message: 'Health Card & profile updated successfully!',
      patient,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

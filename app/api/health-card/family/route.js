import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/physio/Patient';
import Family from '@/lib/models/Family';
import { generatePatientId, generateSecureToken } from '@/lib/idGenerator';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const familyId = url.searchParams.get('familyId');
    const patientId = url.searchParams.get('patientId');

    if (!familyId && !patientId) {
      return NextResponse.json({ success: false, message: 'familyId or patientId required' }, { status: 400 });
    }

    let targetFamilyId = familyId;
    if (!targetFamilyId && patientId) {
      const patient = await Patient.findOne({ patientId }).lean();
      if (!patient || !patient.familyId) {
        return NextResponse.json({ success: true, family: null, members: [] });
      }
      targetFamilyId = patient.familyId;
    }

    const family = await Family.findOne({ familyId: targetFamilyId }).lean();
    
    // Find all patients with this familyId to get full profile & card data
    const memberPatients = await Patient.find({ 
      familyId: targetFamilyId,
      isArchived: { $ne: true } 
    }).lean();

    return NextResponse.json({
      success: true,
      familyId: targetFamilyId,
      family,
      members: memberPatients.map(m => ({
        patientId: m.patientId,
        familyId: m.familyId,
        name: m.name,
        relation: m.familyRelation || 'Member',
        mobile: m.mobile,
        gender: m.gender,
        age: m.age,
        bloodGroup: m.bloodGroup,
        cardStatus: m.cardStatus,
        cardVersion: m.cardVersion,
        qrToken: m.qrToken,
        isMinor: (m.age && m.age < 18) || false,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch family error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { 
      primaryPatientId, 
      familyId, 
      name, 
      relation, 
      mobile, 
      age, 
      dob, 
      gender, 
      bloodGroup,
      existingConditions,
      allergies 
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Family Member Name is required' }, { status: 400 });
    }
    if (!relation) {
      return NextResponse.json({ success: false, message: 'Relationship is required' }, { status: 400 });
    }

    // Determine target Family ID
    let targetFamilyId = familyId;
    if (!targetFamilyId && primaryPatientId) {
      const primary = await Patient.findOne({ patientId: primaryPatientId });
      if (primary) {
        targetFamilyId = primary.familyId;
      }
    }

    if (!targetFamilyId) {
      return NextResponse.json({ success: false, message: 'Family ID could not be identified' }, { status: 400 });
    }

    // Calculate age / isMinor
    let calculatedAge = age ? parseInt(age, 10) : undefined;
    if (!calculatedAge && dob) {
      const birthYear = new Date(dob).getFullYear();
      if (!isNaN(birthYear)) calculatedAge = new Date().getFullYear() - birthYear;
    }
    const isMinor = (calculatedAge && calculatedAge < 18) || false;

    // Use member's mobile if provided, otherwise primary's mobile with index
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : undefined;

    // RULE: Every family member gets their own separate Permanent Patient ID!
    const memberPatientId = await generatePatientId();
    const qrToken = generateSecureToken();
    const isSenior = calculatedAge ? calculatedAge >= 70 : false;

    const newMemberPatient = new Patient({
      patientId: memberPatientId,
      familyId: targetFamilyId,
      isFamilyHead: false,
      familyRelation: relation,
      name: name.trim(),
      mobile: cleanMobile || `${memberPatientId.slice(-6)}`, // Fallback unique identifier if minor doesn't have mobile
      whatsappNumber: cleanMobile,
      age: calculatedAge,
      dob: dob || undefined,
      gender: gender || undefined,
      bloodGroup: bloodGroup || undefined,
      existingConditions: existingConditions || undefined,
      allergies: allergies || undefined,
      cardStatus: 'ACTIVE',
      cardVersion: 1,
      cardIssuedAt: new Date(),
      qrToken,
      isSeniorCitizen: isSenior,
      seniorCitizenBenefitActive: isSenior,
      source: 'Website',
      registeredBy: `Family Head (${primaryPatientId || 'Self'})`,
      cardHistory: [{
        version: 1,
        generatedAt: new Date(),
        updatedFields: ['Family Member Added'],
        generatedBy: `Added by ${primaryPatientId || 'Primary'}`
      }],
      auditLogs: [{
        action: 'Family Member Registered',
        performedBy: primaryPatientId || 'Family Head',
        details: `Created under Family ID ${targetFamilyId} with Permanent ID ${memberPatientId}`,
        timestamp: new Date()
      }]
    });

    await newMemberPatient.save();

    // Update Family document
    let family = await Family.findOne({ familyId: targetFamilyId });
    if (family) {
      family.members.push({
        patientId: memberPatientId,
        name: newMemberPatient.name,
        relation,
        mobile: cleanMobile || '',
        gender: newMemberPatient.gender,
        age: calculatedAge,
        isMinor,
        addedAt: new Date()
      });
      await family.save();
    }

    return NextResponse.json({
      success: true,
      message: `Family member registered with Permanent ID ${memberPatientId}!`,
      member: newMemberPatient,
      familyId: targetFamilyId,
    });
  } catch (error) {
    console.error('Add family member error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

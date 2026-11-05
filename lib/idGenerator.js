import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Counter from '@/lib/models/Counter';
import Patient from '@/lib/models/physio/Patient';
import Family from '@/lib/models/Family';

/**
 * Atomically generates next sequential ID with prefix and padding
 */
export async function getNextSequence(sequenceName, initialSeq = 1) {
  await dbConnect();
  
  // Find and increment atomically
  const counter = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return counter.seq;
}

/**
 * Generates Permanent Lifetime Patient ID (e.g. DJM-PT-000125)
 * Guaranteed unique and never changes
 */
export async function generatePatientId() {
  await dbConnect();

  // If counter is 0 or less, ensure it is at least higher than current max patient count
  const existingCounter = await Counter.findOne({ id: 'patientId' });
  if (!existingCounter) {
    const count = await Patient.countDocuments();
    const nextSeq = Math.max(count, 124) + 1; // Start cleanly or from 000125
    await Counter.create({ id: 'patientId', seq: nextSeq });
    return `DJM-PT-${nextSeq.toString().padStart(6, '0')}`;
  }

  const seq = await getNextSequence('patientId');
  return `DJM-PT-${seq.toString().padStart(6, '0')}`;
}

/**
 * Generates Permanent Family ID (e.g. DJM-FAM-000125)
 */
export async function generateFamilyId() {
  await dbConnect();

  const existingCounter = await Counter.findOne({ id: 'familyId' });
  if (!existingCounter) {
    const nextSeq = 125;
    await Counter.create({ id: 'familyId', seq: nextSeq });
    return `DJM-FAM-${nextSeq.toString().padStart(6, '0')}`;
  }

  const seq = await getNextSequence('familyId');
  return `DJM-FAM-${seq.toString().padStart(6, '0')}`;
}

/**
 * Ensures a patient has a valid Permanent Family ID and Family record
 */
export async function ensurePatientFamilyId(patient) {
  if (!patient) return null;
  if (patient.familyId) return patient.familyId;

  try {
    await dbConnect();
    const familyId = await generateFamilyId();
    patient.familyId = familyId;
    patient.isFamilyHead = true;

    if (typeof patient.save === 'function') {
      await patient.save();
    } else if (patient._id) {
      await Patient.findByIdAndUpdate(patient._id, { familyId, isFamilyHead: true });
    }

    const existingFamily = await Family.findOne({ familyId });
    if (!existingFamily) {
      await Family.create({
        familyId,
        familyName: `${patient.name || 'Member'}'s Family`,
        primaryPatientId: patient.patientId || 'DJM-PT-000001',
        primaryPhone: patient.mobile || 'Not provided',
        members: [{
          patientId: patient.patientId || 'DJM-PT-000001',
          name: patient.name || 'Primary Member',
          relation: 'Self',
          mobile: patient.mobile || '',
          gender: patient.gender,
          age: patient.age,
          isMinor: false,
        }],
        notes: 'Primary family account'
      });
    }

    return familyId;
  } catch (err) {
    console.error('ensurePatientFamilyId error:', err);
    return patient.familyId || null;
  }
}

/**
 * Generates Camp ID (e.g. CAMP-0001)
 */
export async function generateCampId() {
  await dbConnect();

  const seq = await getNextSequence('campId');
  return `CAMP-${seq.toString().padStart(4, '0')}`;
}

/**
 * Generates Home Care or Nursing Care Booking ID (e.g. DJM-HC-000101 or DJM-NC-000101)
 */
export async function generateHomeCareBookingId(category = 'home-care') {
  await dbConnect();
  const isNursing = category === 'nursing-care' || category === 'nursing';
  const seqName = isNursing ? 'nursingCareBookingId' : 'homeCareBookingId';
  const prefix = isNursing ? 'DJM-NC' : 'DJM-HC';
  const seq = await getNextSequence(seqName, 101);
  return `${prefix}-${seq.toString().padStart(6, '0')}`;
}

/**
 * Generates cryptographically secure QR token
 */
export function generateSecureToken() {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomBytes(4).toString('hex');
}

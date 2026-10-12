import mongoose from 'mongoose';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const uri = "mongodb://mkdigital:Meet2003@ac-awpv0ex-shard-00-00.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-01.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-02.pmw3ac4.mongodb.net:27017/?ssl=true&replicaSet=atlas-107ryv-shard-0&authSource=admin&appName=Cluster0";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Departments
  const deptCount = await db.collection('physiodepartments').countDocuments({ name: 'Orthopedic' });
  let orthoId, neuroId, cardioId;

  if (deptCount === 0) {
    const d1 = await db.collection('physiodepartments').insertOne({
      name: 'Orthopedic',
      shortDescription: 'Bone, joint & musculoskeletal rehabilitation',
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    orthoId = d1.insertedId;

    const d2 = await db.collection('physiodepartments').insertOne({
      name: 'Neurological',
      shortDescription: 'Brain, spine and nerve disorder rehab',
      order: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    neuroId = d2.insertedId;

    const d3 = await db.collection('physiodepartments').insertOne({
      name: 'Cardiopulmonary',
      shortDescription: 'Heart and lung rehabilitation',
      order: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    cardioId = d3.insertedId;
  } else {
    const o = await db.collection('physiodepartments').findOne({ name: 'Orthopedic' });
    orthoId = o._id;
    const n = await db.collection('physiodepartments').findOne({ name: 'Neurological' });
    neuroId = n?._id;
  }

  // 2. Problem Groups
  let orthoGroupId;
  const groupCount = await db.collection('physioproblemgroups').countDocuments({ departmentId: orthoId });
  if (groupCount === 0 && orthoId) {
    const g1 = await db.collection('physioproblemgroups').insertOne({
      departmentId: orthoId,
      name: 'Joint & Muscle Pain',
      shortDescription: 'Pain and stiffness management',
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    orthoGroupId = g1.insertedId;
  } else if (orthoId) {
    const g = await db.collection('physioproblemgroups').findOne({ departmentId: orthoId });
    orthoGroupId = g?._id;
  }

  // 3. Conditions
  const condCount = await db.collection('physioconditions').countDocuments();
  if (condCount === 0 && orthoGroupId) {
    await db.collection('physioconditions').insertMany([
      {
        groupId: orthoGroupId,
        name: 'Knee Pain',
        shortDescription: 'Arthritis, ligament injury & post-op knee stiffness',
        isPopular: true,
        isRecommended: true,
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: orthoGroupId,
        name: 'Back Pain',
        shortDescription: 'Lower back ache, slip disc & posture correction',
        isPopular: true,
        isRecommended: true,
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: orthoGroupId,
        name: 'Frozen Shoulder',
        shortDescription: 'Shoulder mobility loss & rotator cuff rehab',
        isPopular: true,
        isRecommended: false,
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: orthoGroupId,
        name: 'Cervical Spondylosis',
        shortDescription: 'Neck stiffness, radiating nerve pain & headache',
        isPopular: true,
        isRecommended: false,
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: orthoGroupId,
        name: 'Sciatica',
        shortDescription: 'Shooting leg pain & nerve compression treatment',
        isPopular: true,
        isRecommended: true,
        order: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  // 4. Categories
  const catCount = await db.collection('categories').countDocuments();
  if (catCount === 0) {
    await db.collection('categories').insertMany([
      { name: 'Physiotherapy', slug: 'physiotherapy', description: 'At-home Physiotherapy and Rehabilitation' },
      { name: 'Ambulance Service', slug: 'ambulance', description: '24/7 Emergency and ICU Ambulance Transport' },
      { name: 'Doctor Visit at Home', slug: 'doctor', description: 'General Physicians and Specialists Home Visits' },
      { name: 'ICU at Home', slug: 'icu', description: 'Critical Care ICU Setup with Ventilator and Nursing' },
      { name: 'Nursing Care', slug: 'nursing', description: 'Day and Night Qualified Nursing Care' },
      { name: 'Lab Test at Home', slug: 'lab-test', description: 'Diagnostic Blood Tests and Health Checkups' },
      { name: 'Equipment Rental', slug: 'equipment', description: 'Hospital Beds, Oxygen Concentrators & Wheelchairs' }
    ]);
  }

  // 5. Service Packages
  const pkgCount = await db.collection('servicepackages').countDocuments();
  if (pkgCount === 0) {
    await db.collection('servicepackages').insertMany([
      {
        serviceType: 'ambulance',
        title: 'Emergency Normal Ambulance',
        description: 'Standard emergency transfer (24x7 in Lucknow)',
        icon: 'Ambulance',
        price: 1199,
        originalPrice: 1499,
        badge: 'Fast 15-20 Min',
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceType: 'ambulance',
        title: 'ICU Ventilator Ambulance',
        description: 'Advanced life support with medical staff',
        icon: 'Monitor',
        price: 4999,
        originalPrice: 5999,
        badge: 'Critical Care',
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceType: 'doctor',
        title: 'Doctor Consultation at Home',
        description: 'Comprehensive physical examination & prescription',
        icon: 'Stethoscope',
        price: 999,
        originalPrice: 1299,
        badge: 'MBBS/MD Doctors',
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceType: 'physiotherapy',
        title: 'Home Physiotherapy Trial Session',
        description: 'Initial assessment & pain relief treatment',
        icon: 'Activity',
        price: 499,
        originalPrice: 999,
        badge: 'Trial Offer',
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceType: 'icu',
        title: 'ICU Setup at Home (Per Day)',
        description: 'Monitor, Oxygen, Syringe Pump & Critical Care',
        icon: 'Bed',
        price: 2999,
        originalPrice: 3999,
        badge: '24x7 Care',
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  console.log("Database seeded successfully!");
  await mongoose.disconnect();
}

run().catch(console.error);

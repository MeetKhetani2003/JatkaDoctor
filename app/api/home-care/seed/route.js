import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';

const initialHomeCareServices = [
  {
    name: 'Patient Attendant / Caregiver',
    slug: 'patient-attendant-caregiver',
    category: 'home-care',
    shortDescription: 'Daily living support and personal care at home.',
    fullDescription: 'Our trained caregivers provide daily living support, personal care, mobility assistance and compassionate companionship for patients recovering at home.',
    mainImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    icon: 'UserCheck',
    pricingType: 'Starting From',
    price: 399,
    priceUnit: 'day',
    duration: 'Day Care / 8-24 Hours',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.8,
    reviewCount: 38,
    verifiedBookingsCount: 184,
    badge: 'Most Booked',
    displayOrder: 1,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      'Personal Care & Hygiene',
      'Mobility Assistance',
      'Feeding Assistance',
      'Medication Reminders',
      'Doctor Visit Coordination',
    ],
    targetPatients: [
      'Elderly Individuals',
      'Post-Surgery Recovery Patients',
      'Bedridden Patients',
      'Patients needing assistance with daily tasks'
    ],
    faqs: [
      { question: 'What duties does a caregiver perform?', answer: 'Caregivers assist with bathing, dressing, feeding, mobility, and medication reminders. They maintain patient hygiene and support daily living.' },
      { question: 'Are staff background verified?', answer: 'Yes, 100% of Dr Jhatka Medicare attendants are police-verified and medically trained.' }
    ]
  },
  {
    name: 'Elderly Care',
    slug: 'elderly-care',
    category: 'home-care',
    shortDescription: 'Compassionate companionship and assistance for senior citizens.',
    fullDescription: 'Specialized home care program dedicated to senior citizens, focusing on emotional support, routine health monitoring, daily comfort, and gentle assistance.',
    mainImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    icon: 'HeartHandshake',
    pricingType: 'Starting From',
    price: 499,
    priceUnit: 'day',
    duration: 'Flexible / Day Care',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.9,
    reviewCount: 44,
    verifiedBookingsCount: 220,
    badge: 'Popular',
    displayOrder: 2,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      'Companionship & Emotional Support',
      'Vitals Check (BP, Pulse, Sugar)',
      'Medication Administration Assistance',
      'Personal Hygiene & Bathing Support',
      'Diet & Meal Supervision'
    ],
    targetPatients: [
      'Senior citizens living alone',
      'Elderly with chronic age-related issues',
      'Dementia & Alzheimer patients'
    ]
  },
  {
    name: 'Post-Surgery Care',
    slug: 'post-surgery-care',
    category: 'home-care',
    shortDescription: 'Dedicated home recovery support following surgery.',
    fullDescription: 'Comprehensive post-operative recovery support to prevent complications, ensure timely medication, manage comfort, and assist with progressive mobilization.',
    mainImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    pricingType: 'Starting From',
    price: 599,
    priceUnit: 'day',
    duration: '8 - 12 Hours / Daily',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.8,
    reviewCount: 29,
    verifiedBookingsCount: 142,
    badge: 'Specialized Care',
    displayOrder: 3,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      'Wound Inspection & Hygiene',
      'Pain Relief Medication Assistance',
      'Safe Mobility & Bed Transfers',
      'Vital Sign Records',
      'Dietary Adherence'
    ]
  },
  {
    name: 'Bedridden Patient Care',
    slug: 'bedridden-patient-care',
    category: 'home-care',
    shortDescription: 'Dedicated bedbound care, pressure sore prevention, and hygiene.',
    fullDescription: 'Compassionate assistance for non-ambulatory patients. Regular repositioning, sponge baths, back care, catheter hygiene, and continuous monitoring.',
    mainImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    icon: 'Bed',
    pricingType: 'Starting From',
    price: 499,
    priceUnit: 'day',
    duration: '12 - 24 Hours',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.9,
    reviewCount: 31,
    verifiedBookingsCount: 165,
    badge: '24x7 Available',
    displayOrder: 4,
    showOnWebsite: true,
    isPopular: false,
    includedServices: [
      '2-Hour Repositioning & Back Care',
      'Sponge Bath & Oral Hygiene',
      'Feeding & Hydration Support',
      'Diaper Changing & Skin Barrier Care',
      'Vital Signs Record'
    ]
  },
  {
    name: 'Vital Monitoring',
    slug: 'vital-monitoring',
    category: 'home-care',
    shortDescription: 'Regular tracking of BP, Blood Sugar, SpO2, and Pulse.',
    fullDescription: 'A certified care assistant visits your home to record blood pressure, pulse, SpO2, temperature, and random blood sugar, sharing digital logs with your family.',
    mainImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=800&q=80',
    icon: 'HeartPulse',
    pricingType: 'Per Visit',
    price: 299,
    priceUnit: 'visit',
    duration: '30 - 45 Minutes',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.8,
    reviewCount: 22,
    verifiedBookingsCount: 95,
    badge: 'Quick & Reliable',
    displayOrder: 5,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['BP Check', 'SpO2 & Pulse', 'Temperature', 'Blood Sugar Test (Strip extra)']
  },
  {
    name: 'Wound / Dressing Care',
    slug: 'wound-dressing-care',
    category: 'home-care',
    shortDescription: 'Sterile surgical and chronic wound dressing at home.',
    fullDescription: 'Aseptic wound dressing for surgical incisions, bedsores, diabetic foot ulcers, and minor burns done by certified staff using sterile protocol.',
    mainImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    icon: 'Bandage',
    pricingType: 'Per Visit',
    price: 399,
    priceUnit: 'visit',
    duration: '30 - 45 Minutes',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 35,
    verifiedBookingsCount: 178,
    badge: 'Clinical Protocol',
    displayOrder: 6,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Aseptic Dressing', 'Suture Check', 'Antiseptic Cleaning', 'Sterile Pack Usage']
  },
  {
    name: 'Injection / Medication Assistance',
    slug: 'injection-medication-assistance',
    category: 'home-care',
    shortDescription: 'Timely IV/IM injections and medicine administration at home.',
    fullDescription: 'Qualified medical assistant or nurse administers prescribed injections (IV/IM/SC), insulin, or IV fluids as directed by your treating physician.',
    mainImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    icon: 'Syringe',
    pricingType: 'Per Visit',
    price: 299,
    priceUnit: 'visit',
    duration: '30 Minutes',
    requiredStaffType: 'Nurse',
    rating: 4.8,
    reviewCount: 27,
    verifiedBookingsCount: 130,
    badge: 'Available in ~30 min',
    displayOrder: 7,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['IM / IV Injections', 'Saline / IV Cannula Support', 'Prescription Verification']
  },
  {
    name: 'Catheter Care',
    slug: 'catheter-care',
    category: 'home-care',
    shortDescription: 'Safe Foley catheter insertion, hygiene, and bag management.',
    fullDescription: 'Professional catheterization, cleaning, and bag replacement following sterile hospital protocols to prevent urinary tract infections.',
    mainImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    icon: 'ShieldCheck',
    pricingType: 'Per Visit',
    price: 499,
    priceUnit: 'visit',
    duration: '45 Minutes',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 19,
    verifiedBookingsCount: 88,
    badge: 'Safe & Hygienic',
    displayOrder: 8,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Foley Catheter Replacement', 'Urine Bag Maintenance', 'Sterile Drainage Protocol']
  },
  {
    name: 'Feeding Assistance',
    slug: 'feeding-assistance',
    category: 'home-care',
    shortDescription: 'Support for oral feeding, Ryles tube, and dietary intake.',
    fullDescription: 'Assistance for patients struggling to swallow or eat independently, including Ryles tube feeding hygiene and careful positioning to prevent aspiration.',
    mainImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    icon: 'Utensils',
    pricingType: 'Starting From',
    price: 399,
    priceUnit: 'day',
    duration: 'Daily / Per Session',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.7,
    reviewCount: 14,
    verifiedBookingsCount: 65,
    badge: '',
    displayOrder: 9,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Ryles Tube Nutrition Protocol', 'Choking Prevention', 'Hydration Records']
  },
  {
    name: 'Personal Care & Hygiene',
    slug: 'personal-care-hygiene',
    category: 'home-care',
    shortDescription: 'Assistance with bathing, grooming, and clothing.',
    fullDescription: 'Respectful, gentle assistance with daily grooming, bathing, hair wash, nail care, and clean clothes, maintaining dignifying comfort.',
    mainImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    icon: 'Smile',
    pricingType: 'Starting From',
    price: 349,
    priceUnit: 'day',
    duration: 'Per Session / Day Care',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.8,
    reviewCount: 18,
    verifiedBookingsCount: 92,
    badge: '',
    displayOrder: 10,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Bed Sponge / Shower Support', 'Dressing & Grooming', 'Oral Hygiene']
  },
  {
    name: 'Doctor Coordination',
    slug: 'doctor-coordination',
    category: 'home-care',
    shortDescription: 'Liaison with treating doctor, teleconsults, and prescription review.',
    fullDescription: 'Care manager coordinates directly with your consultant doctor, updates progress charts, and schedules home or video consults when vitals deviate.',
    mainImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    icon: 'Stethoscope',
    pricingType: 'Starting From',
    price: 499,
    priceUnit: 'visit',
    duration: 'On Demand',
    requiredStaffType: 'Doctor',
    rating: 4.9,
    reviewCount: 25,
    verifiedBookingsCount: 110,
    badge: 'Expert Review',
    displayOrder: 11,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Progress Chart Sharing', 'Prescription Updates', 'Emergency Escalation']
  },
  {
    name: 'Physiotherapy Support',
    slug: 'physiotherapy-support',
    category: 'home-care',
    shortDescription: 'Assisted mobility, gentle limb movement, and walking practice.',
    fullDescription: 'Under physiotherapist supervision, our attendant assists the patient with prescribed limb exercises, gentle walking, and joint mobility drills.',
    mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    pricingType: 'Starting From',
    price: 499,
    priceUnit: 'visit',
    duration: '45 - 60 Minutes',
    requiredStaffType: 'Physiotherapist',
    rating: 4.9,
    reviewCount: 30,
    verifiedBookingsCount: 140,
    badge: 'Recovery Support',
    displayOrder: 12,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Assisted Gait & Walking', 'Passive Range of Motion', 'Fall Prevention Support']
  },
  {
    name: 'Other Home Care Services',
    slug: 'other-home-care-services',
    category: 'home-care',
    shortDescription: 'Customized healthcare and rehabilitation services tailored to your needs.',
    fullDescription: 'Do you have specific healthcare requirements not listed above? Request a custom quote and our clinical manager will build a tailored care plan for you.',
    mainImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    icon: 'PlusCircle',
    pricingType: 'Custom Quote',
    price: 0,
    priceUnit: 'session',
    duration: 'Custom Duration',
    requiredStaffType: 'Caregiver / Attendant',
    rating: 4.8,
    reviewCount: 12,
    verifiedBookingsCount: 50,
    badge: 'Custom Plan',
    displayOrder: 13,
    showOnWebsite: true,
    isPopular: false,
    includedServices: ['Free Clinical Assessment', 'Tailored Care Plan', 'Flexible Timings']
  }
];

const initialNursingCareServices = [
  {
    name: 'Short Visit Nursing',
    slug: 'short-visit-nursing',
    category: 'nursing-care',
    shortDescription: 'Professional nursing care at home for short clinical visits.',
    fullDescription: 'Short visit nursing care is ideal for patients who need basic clinical support, vital monitoring, medication assistance, wound care, or post-surgery care at home.',
    mainImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    icon: 'Clock',
    pricingType: 'Starting From',
    price: 499,
    priceUnit: 'visit',
    duration: '1-2 Hours',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 52,
    verifiedBookingsCount: 320,
    badge: 'Available in ~30 min',
    displayOrder: 1,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      'Vital Monitoring (BP, SpO2, Temperature)',
      'Medication Assistance',
      'Injection Assistance (IV/IM)',
      'Wound / Dressing Care',
      'Catheter Care',
      'Doctor Coordination'
    ],
    targetPatients: [
      'Post-surgery recovery patients',
      'Patients needing IV fluids or injections',
      'Chronic patients needing regular dressing'
    ],
    faqs: [
      { question: 'What is included in a short nursing visit?', answer: 'Our registered nurse will check all vitals, administer prescribed medications/injections, dress surgical wounds, and document observations in your medical chart.' },
      { question: 'How quickly can a nurse arrive?', answer: 'In major areas of Lucknow, a verified nurse can arrive within 30 to 60 minutes of booking confirmation.' }
    ]
  },
  {
    name: '8 Hour Nursing Care',
    slug: '8-hour-nursing-care',
    category: 'nursing-care',
    shortDescription: 'Dedicated day care nursing support for recovering patients.',
    fullDescription: 'Continuous 8-hour daytime clinical nursing by a registered nurse. Covers continuous vitals, scheduled IV/oral medications, nebulization, hygiene, and physician coordination.',
    mainImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    icon: 'Sun',
    pricingType: 'Starting From',
    price: 1499,
    priceUnit: 'day',
    duration: '8 Hours',
    requiredStaffType: 'Nurse',
    rating: 4.8,
    reviewCount: 36,
    verifiedBookingsCount: 210,
    badge: 'Available Today',
    displayOrder: 2,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      'Vital Signs Charting',
      'All Prescribed Injections & Medicines',
      'Feeding Tube / Catheter Care',
      'Nebulization & Oxygen Management',
      'Mobility & Hygiene Assistance'
    ],
    targetPatients: [
      'Recent hospital discharges',
      'Post-operative monitoring',
      'Patients on multiple medications'
    ]
  },
  {
    name: '12 Hour Nursing Care',
    slug: '12-hour-nursing-care',
    category: 'nursing-care',
    shortDescription: 'Extended day or night shift nursing care at home.',
    fullDescription: 'Comprehensive 12-hour nursing shift (Day or Night) providing intensive patient monitoring, suctioning, catheter hygiene, and complex nursing interventions.',
    mainImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
    icon: 'Moon',
    pricingType: 'Starting From',
    price: 1999,
    priceUnit: 'day',
    duration: '12 Hours',
    requiredStaffType: 'Nurse',
    rating: 4.8,
    reviewCount: 28,
    verifiedBookingsCount: 160,
    badge: 'Day / Night Shifts',
    displayOrder: 3,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      '12-Hour Continuous Care',
      'Night-time Patient Monitoring',
      'Pain Management & Medications',
      'Respiratory Support & Suctioning',
      'Doctor Updates'
    ]
  },
  {
    name: '24 Hour Nursing Care',
    slug: '24-hour-nursing-care',
    category: 'nursing-care',
    shortDescription: 'Round-the-clock intensive nursing care at home.',
    fullDescription: '24x7 residential nursing support by qualified nurses on rotating shifts. Complete clinical management, emergency preparedness, ICU step-down support, and comfort care.',
    mainImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    icon: 'Shield',
    pricingType: 'Starting From',
    price: 2999,
    priceUnit: 'day',
    duration: '24 Hours',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 45,
    verifiedBookingsCount: 240,
    badge: 'Most Popular',
    displayOrder: 4,
    showOnWebsite: true,
    isPopular: true,
    includedServices: [
      '24x7 Nurse Presence (Rotating shifts)',
      'Continuous Vital & Cardiac Monitoring',
      'ICU Step-down Nursing Protocols',
      'Bed Sore Prevention & Care',
      'Emergency Doctor Escalation'
    ]
  },
  {
    name: 'Post-Surgery Nursing Care',
    slug: 'post-surgery-nursing-care',
    category: 'nursing-care',
    shortDescription: 'Clinical post-operative care, drain maintenance, and wound dressing.',
    fullDescription: 'Specialized nursing after major abdominal, orthopedic, or cardiac surgeries. Monitoring for signs of infection, managing surgical drains, pain relief, and sterile dressings.',
    mainImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    pricingType: 'Starting From',
    price: 1499,
    priceUnit: 'day',
    duration: 'Custom Duration',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 33,
    verifiedBookingsCount: 155,
    badge: 'Specialized Care',
    displayOrder: 5,
    showOnWebsite: true,
    isPopular: false,
    includedServices: [
      'Surgical Wound Dressing',
      'Drain & Stoma Care',
      'Anti-coagulant Injection Support',
      'Infection Vigilance'
    ]
  },
  {
    name: 'Bedridden Patient Nursing',
    slug: 'bedridden-patient-nursing',
    category: 'nursing-care',
    shortDescription: 'Complete clinical nursing support for chronic bedbound patients.',
    fullDescription: 'Comprehensive clinical care for immobile patients. Tracheostomy care, Ryles tube insertion/feeding, catheter changes, and advanced pressure injury healing.',
    mainImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    icon: 'Bed',
    pricingType: 'Starting From',
    price: 1499,
    priceUnit: 'day',
    duration: 'Custom Duration',
    requiredStaffType: 'Nurse',
    rating: 4.7,
    reviewCount: 24,
    verifiedBookingsCount: 125,
    badge: '',
    displayOrder: 6,
    showOnWebsite: true,
    isPopular: false,
    includedServices: [
      'Catheterization & Bag Hygiene',
      'Tracheostomy & Oxygen Management',
      'Grade 1-4 Bed Sore Care',
      'Air Mattress Management'
    ]
  },
  {
    name: 'Critical Patient Nursing Support',
    slug: 'critical-patient-nursing-support',
    category: 'nursing-care',
    shortDescription: 'ICU-level home nursing support for high-dependency patients.',
    fullDescription: 'Critical care trained nurse experienced with ventilator/BiPAP support, infusion pumps, cardiac monitors, tracheostomy suctioning, and arterial line monitoring at home.',
    mainImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    icon: 'AlertCircle',
    pricingType: 'Starting From',
    price: 2499,
    priceUnit: 'day',
    duration: '12 - 24 Hours',
    requiredStaffType: 'Nurse',
    rating: 4.9,
    reviewCount: 39,
    verifiedBookingsCount: 180,
    badge: 'ICU-Level Care',
    displayOrder: 7,
    showOnWebsite: true,
    isPopular: false,
    includedServices: [
      'BiPAP / Ventilator Assistance',
      'Syringe Infusion Pumps Support',
      'Endotracheal / Trach Suctioning',
      'ABG & Critical Parameter Tracking'
    ]
  }
];

export async function GET() {
  try {
    await dbConnect();

    // Check existing
    const existingCount = await HomeCareService.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${existingCount} services. Use POST with { force: true } to re-seed.`,
        count: existingCount
      });
    }

    // Seed both
    await HomeCareService.insertMany([...initialHomeCareServices, ...initialNursingCareServices]);

    return NextResponse.json({
      success: true,
      message: 'Initial Home Care and Nursing Care services seeded successfully!',
      homeCareCount: initialHomeCareServices.length,
      nursingCareCount: initialNursingCareServices.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    if (body.force) {
      await HomeCareService.deleteMany({});
    }

    const allServices = [...initialHomeCareServices, ...initialNursingCareServices];
    for (const svc of allServices) {
      await HomeCareService.findOneAndUpdate(
        { slug: svc.slug },
        { $set: svc },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seeded / Updated all Home Care and Nursing Care services successfully.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

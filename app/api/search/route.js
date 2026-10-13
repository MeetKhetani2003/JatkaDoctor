import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PhysioCondition from '@/lib/models/physio/PhysioCondition';
import PhysioDepartment from '@/lib/models/physio/PhysioDepartment';
import PhysioProblemGroup from '@/lib/models/physio/PhysioProblemGroup';
import Category from '@/lib/models/Category';
import ServicePackage from '@/lib/models/ServicePackage';

// Predefined core services with comprehensive patient language / Hindi aliases
const CORE_SERVICES = [
  {
    title: "Ambulance Service",
    aliases: [
      "ambulance", "emergency", "oxygen ambulance", "icu ambulance", "dead body ambulance", "mortuary",
      "shav vahan", "freezer box", "hospital le jana", "serious", "critical patient", "ambulance no",
      "ambulance number", "accident", "turant ambulance", "road transfer", "ventilator ambulance"
    ],
    subtitle: "24/7 Emergency & ICU Road Transfer in Lucknow",
    category: "Emergency Service",
    url: "/services/ambulance",
    type: "service",
    icon: "Ambulance"
  },
  {
    title: "Physiotherapy at Home",
    aliases: [
      "physiotherapy", "physio", "physical therapy", "exercise", "rehabilitation", "rehab",
      "kamar dard", "kamar me dard", "ghutna dard", "ghutne me dard", "knee pain", "back pain",
      "cervical", "gardan dard", "gardan me dard", "lakwa", "falij", "paralysis", "stroke",
      "slip disc", "sciatica", "frozen shoulder", "sandhiwat", "jod dard", "pain relief",
      "chalne me dikkat", "hath pair me dard", "reedh ki haddi", "shoulder pain"
    ],
    subtitle: "Doctor-Certified Expert Physiotherapists at Home",
    category: "Home Care",
    url: "/services/physiotherapy",
    type: "service",
    icon: "Activity"
  },
  {
    title: "Doctor Visit at Home",
    aliases: [
      "doctor", "physician", "home doctor", "consultation", "mbbs", "general physician", "clinic",
      "bukhar", "fever", "sardi", "jukham", "khansi", "cough", "cold", "doctor ghar par", "doctor call",
      "dawai", "prescription", "sugar doctor", "bp doctor", "blood pressure", "headache", "sar dard"
    ],
    subtitle: "Qualified MD / MBBS Doctors at Your Doorstep",
    category: "Clinical Care",
    url: "/services/doctor",
    type: "service",
    icon: "Stethoscope"
  },
  {
    title: "ICU at Home",
    aliases: [
      "icu", "ventilator", "critical care", "cardiac monitor", "oxygen setup", "hospital setup",
      "icu at home", "ventilator bed", "suction", "infusion pump", "bipap", "cpap", "bed par mareez",
      "serious care", "tracheostomy", "coma", "oxygen ki kami", "saas lene me takleef"
    ],
    subtitle: "Full Hospital ICU Setup & 24/7 Critical Nursing",
    category: "Critical Care",
    url: "/icu-at-home",
    type: "service",
    icon: "Bed"
  },
  {
    title: "Nursing Care at Home",
    aliases: [
      "nurse", "nursing", "injection", "dressing", "attendant", "home nurse", "patti", "drip",
      "glucose", "saline", "catheter", "ryles tube", "wound care", "injection lagwana", "female nurse",
      "male nurse", "dawa pilana", "bed bath", "wound dressing", "bandage"
    ],
    subtitle: "Trained 12h & 24h Certified Nursing Staff",
    category: "Home Care",
    url: "/services/nursing",
    type: "service",
    icon: "UserPlus"
  },
  {
    title: "Lab Test at Home",
    aliases: [
      "lab test", "blood test", "blood checkup", "sample collection", "thyroid", "cbct", "cbc",
      "sugar check", "diabetes", "khoon ki janch", "peshab janch", "urine test", "kft", "lft",
      "lipid", "dengue test", "malaria test", "widal", "typhoid test", "vitamin d", "vitamin b12",
      "hba1c", "blood sample", "test ghar par"
    ],
    subtitle: "NABL Certified Home Sample Collection (60 Mins)",
    category: "Diagnostics",
    url: "/services/lab-test",
    type: "service",
    icon: "TestTube"
  },
  {
    title: "Equipment Rental",
    aliases: [
      "equipment", "wheelchair", "oxygen concentrator", "hospital bed", "bipap", "cpap", "rent",
      "kiraye par", "wheelchair rent", "oxygen cylinder", "air mattress", "air bed", "walker",
      "baisakhi", "suction machine", "patient bed", "electric bed", "oxygen machine"
    ],
    subtitle: "Medical Equipment on Affordable Rent in Lucknow",
    category: "Medical Equipment",
    url: "/services/equipment",
    type: "service",
    icon: "Accessibility"
  },
  {
    title: "Home Care Services",
    aliases: [
      "home care", "elderly care", "patient care", "attendant", "caregiver", "ayah",
      "bujurg ki dekhbhal", "paralytic patient care", "old age care", "24 ghante attendant", "12 ghante attendant"
    ],
    subtitle: "Comprehensive Daily Support & Attendant Care",
    category: "Home Care",
    url: "/services/home-care",
    type: "service",
    icon: "Home"
  },
  {
    title: "Lifetime Free Health Card",
    aliases: [
      "health card", "card", "free health card", "discount card", "ayushman", "member card",
      "digital card", "djm card", "smart card", "free card", "discount"
    ],
    subtitle: "Apply for 100% Free Lifetime Healthcare Card & Discounts",
    category: "Membership & Benefits",
    url: "/health-card",
    type: "service",
    icon: "CreditCard"
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();

    await dbConnect();

    // If query is empty, return popular suggestions
    if (!query) {
      // Fetch popular conditions
      const popularConditions = await PhysioCondition.find({ isActive: true, isPopular: true })
        .populate({
          path: 'groupId',
          populate: { path: 'departmentId' }
        })
        .limit(6)
        .lean();

      const defaultResults = [
        ...CORE_SERVICES.slice(0, 4).map(s => ({
          id: s.url,
          title: s.title,
          subtitle: s.subtitle,
          category: s.category,
          type: "service",
          url: s.url
        })),
        ...popularConditions.map(c => ({
          id: String(c._id),
          title: c.name,
          subtitle: `Physiotherapy → ${c.groupId?.departmentId?.name || 'Orthopedic'} → ${c.groupId?.name || 'Rehab'}`,
          category: "Physiotherapy Condition",
          type: "condition",
          url: `/services/physiotherapy?condition=${encodeURIComponent(c.name)}&conditionId=${c._id}`
        }))
      ];

      return NextResponse.json({ success: true, results: defaultResults });
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // 1. Search in Core Services
    const matchedServices = CORE_SERVICES.filter(s => 
      regex.test(s.title) || 
      regex.test(s.category) ||
      s.aliases.some(a => regex.test(a))
    ).map(s => ({
      id: s.url,
      title: s.title,
      subtitle: s.subtitle,
      category: s.category,
      type: "service",
      url: s.url
    }));

    // 2. Search in Physiotherapy Conditions (with Group & Department hierarchy)
    const matchedConditions = await PhysioCondition.find({
      isActive: true,
      $or: [
        { name: regex },
        { shortDescription: regex }
      ]
    })
      .populate({
        path: 'groupId',
        populate: { path: 'departmentId' }
      })
      .limit(10)
      .lean();

    const formattedConditions = matchedConditions.map(c => {
      const deptName = c.groupId?.departmentId?.name || 'Orthopedic';
      const groupName = c.groupId?.name || '';
      return {
        id: String(c._id),
        title: c.name,
        subtitle: `Physiotherapy → ${deptName}${groupName ? ` → ${groupName}` : ''}`,
        category: "Physiotherapy Condition",
        type: "condition",
        url: `/services/physiotherapy?condition=${encodeURIComponent(c.name)}&conditionId=${c._id}`
      };
    });

    // 3. Search in Physiotherapy Departments
    const matchedDepartments = await PhysioDepartment.find({
      isActive: true,
      $or: [
        { name: regex },
        { shortDescription: regex }
      ]
    }).limit(5).lean();

    const formattedDepartments = matchedDepartments.map(d => ({
      id: String(d._id),
      title: `${d.name} Department`,
      subtitle: `Physiotherapy → ${d.name} Specialization`,
      category: "Department",
      type: "department",
      url: `/services/physiotherapy?department=${encodeURIComponent(d.name)}&deptId=${d._id}`
    }));

    // 4. Search in Categories
    const matchedCategories = await Category.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    }).limit(5).lean();

    const formattedCategories = matchedCategories.map(cat => ({
      id: String(cat._id),
      title: cat.name,
      subtitle: cat.description || `Browse all ${cat.name} services`,
      category: "Category",
      type: "category",
      url: `/services?category=${encodeURIComponent(cat.slug || cat.name)}`
    }));

    // 5. Search in Service Packages
    const matchedPackages = await ServicePackage.find({
      $or: [
        { title: regex },
        { description: regex },
        { serviceType: regex }
      ]
    }).limit(6).lean();

    const formattedPackages = matchedPackages.map(p => {
      const serviceSlug = p.serviceType === 'physiotherapy' ? 'physiotherapy' : p.serviceType;
      return {
        id: String(p._id),
        title: p.title,
        subtitle: `${p.serviceType?.toUpperCase()} · ₹${p.price}${p.period ? ` (${p.period})` : ''}`,
        category: "Service Package",
        type: "package",
        url: `/services/${serviceSlug}?package=${encodeURIComponent(p.title)}`
      };
    });

    // Merge and deduplicate results
    let combined = [
      ...formattedConditions,
      ...matchedServices,
      ...formattedDepartments,
      ...formattedPackages,
      ...formattedCategories
    ];

    // Priority sorting: exact match first, then starts-with, then others
    combined.sort((a, b) => {
      const aLower = a.title.toLowerCase();
      const bLower = b.title.toLowerCase();
      const qLower = query.toLowerCase();

      if (aLower === qLower) return -1;
      if (bLower === qLower) return 1;
      if (aLower.startsWith(qLower) && !bLower.startsWith(qLower)) return -1;
      if (!aLower.startsWith(qLower) && bLower.startsWith(qLower)) return 1;
      return 0;
    });

    // If no direct results found, generate smart "Related Services"
    let isFallback = false;
    if (combined.length === 0) {
      isFallback = true;
      const q = query.toLowerCase();

      let relatedPick = [];
      if (q.includes("dard") || q.includes("pain") || q.includes("haddi") || q.includes("joint") || q.includes("bone")) {
        relatedPick = ["Physiotherapy at Home", "Doctor Visit at Home", "Nursing Care at Home"];
      } else if (q.includes("saas") || q.includes("breath") || q.includes("oxygen") || q.includes("emergency") || q.includes("serious")) {
        relatedPick = ["Ambulance Service", "ICU at Home", "Equipment Rental"];
      } else if (q.includes("blood") || q.includes("janch") || q.includes("check") || q.includes("sugar") || q.includes("test")) {
        relatedPick = ["Lab Test at Home", "Doctor Visit at Home"];
      } else if (q.includes("care") || q.includes("nurse") || q.includes("attendant") || q.includes("help") || q.includes("ghar")) {
        relatedPick = ["Nursing Care at Home", "Home Care Services", "Doctor Visit at Home"];
      } else {
        // Universal related recommendation
        relatedPick = ["Doctor Visit at Home", "Physiotherapy at Home", "Ambulance Service", "Nursing Care at Home", "Lab Test at Home"];
      }

      combined = CORE_SERVICES.filter(s => relatedPick.includes(s.title)).map(s => ({
        id: s.url,
        title: s.title,
        subtitle: `Related Care: ${s.subtitle}`,
        category: "Related Recommendation",
        type: "service",
        url: s.url,
        isRelated: true
      }));
    }

    return NextResponse.json({
      success: true,
      query,
      isFallback,
      results: combined.slice(0, 12)
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

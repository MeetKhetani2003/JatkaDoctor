import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PhysioCondition from '@/lib/models/physio/PhysioCondition';
import PhysioDepartment from '@/lib/models/physio/PhysioDepartment';
import PhysioProblemGroup from '@/lib/models/physio/PhysioProblemGroup';
import Category from '@/lib/models/Category';
import ServicePackage from '@/lib/models/ServicePackage';

// Predefined core services for fast matching & fallback
const CORE_SERVICES = [
  {
    title: "Ambulance Service",
    aliases: ["ambulance", "emergency", "oxygen ambulance", "icu ambulance", "dead body ambulance", "mortuary"],
    subtitle: "24/7 Emergency & ICU Road Transfer",
    category: "Emergency Service",
    url: "/services/ambulance",
    type: "service",
    icon: "Ambulance"
  },
  {
    title: "Physiotherapy at Home",
    aliases: ["physiotherapy", "physio", "physical therapy", "exercise", "rehabilitation", "rehab"],
    subtitle: "Doctor-Certified Expert Physiotherapists at Home",
    category: "Home Care",
    url: "/services/physiotherapy",
    type: "service",
    icon: "Activity"
  },
  {
    title: "Doctor Visit at Home",
    aliases: ["doctor", "physician", "home doctor", "consultation", "mbbs", "general physician", "clinic"],
    subtitle: "Qualified MD / MBBS Doctors at Your Doorstep",
    category: "Clinical Care",
    url: "/services/doctor",
    type: "service",
    icon: "Stethoscope"
  },
  {
    title: "ICU at Home",
    aliases: ["icu", "ventilator", "critical care", "cardiac monitor", "oxygen setup", "hospital setup"],
    subtitle: "Full Hospital ICU Setup & 24/7 Critical Nursing",
    category: "Critical Care",
    url: "/icu-at-home",
    type: "service",
    icon: "Bed"
  },
  {
    title: "Nursing Care at Home",
    aliases: ["nurse", "nursing", "injection", "dressing", "attendant", "home nurse"],
    subtitle: "Trained 12h & 24h Certified Nursing Staff",
    category: "Home Care",
    url: "/services/nursing",
    type: "service",
    icon: "UserPlus"
  },
  {
    title: "Lab Test at Home",
    aliases: ["lab test", "blood test", "blood checkup", "sample collection", "thyroid", "cbct", "cbc"],
    subtitle: "NABL Certified Home Sample Collection (60 Mins)",
    category: "Diagnostics",
    url: "/services/lab-test",
    type: "service",
    icon: "TestTube"
  },
  {
    title: "Equipment Rental",
    aliases: ["equipment", "wheelchair", "oxygen concentrator", "hospital bed", "bipap", "cpap", "rent"],
    subtitle: "Medical Equipment on Affordable Rent in Lucknow",
    category: "Medical Equipment",
    url: "/services/equipment",
    type: "service",
    icon: "Accessibility"
  },
  {
    title: "Home Care Services",
    aliases: ["home care", "elderly care", "patient care", "attendant"],
    subtitle: "Comprehensive Daily Support & Attendant Care",
    category: "Home Care",
    url: "/services/home-care",
    type: "service",
    icon: "Home"
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
    const combined = [
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

    return NextResponse.json({
      success: true,
      query,
      results: combined.slice(0, 12)
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

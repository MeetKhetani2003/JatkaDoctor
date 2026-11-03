import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import ServicePackage from '@/lib/models/ServicePackage';

// Default mockups-matched popular services for Lucknow home healthcare
const DEFAULT_POPULAR_SERVICES = [
  {
    id: "physiotherapy-home",
    serviceType: "physiotherapy",
    serviceCategory: "physiotherapy",
    title: "Physiotherapy at Home",
    shortDescription: "Certified physiotherapist visits your home for back, neck, knee pain, neuro & post-surgery rehabilitation.",
    badge: "👑 Most Booked",
    badgeColor: "bg-emerald-600 text-white",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "500+ Bookings",
    rating: 4.9,
    reviewCount: "320+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 499,
    originalPrice: 599,
    priceUnit: "session",
    savings: 100,
    serviceName: "Physiotherapy at Home",
    link: "/services/physiotherapy",
  },
  {
    id: "doctor-visit-home",
    serviceType: "doctor",
    serviceCategory: "doctor",
    title: "Doctor Visit at Home",
    shortDescription: "Qualified MBBS & MD doctors visit your home with full diagnostic medical kit for consultation & prescription.",
    badge: "⚡ Quick & Reliable",
    badgeColor: "bg-[#006837] text-white",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "300+ Bookings",
    rating: 4.8,
    reviewCount: "200+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 599,
    originalPrice: 799,
    priceUnit: "visit",
    savings: 200,
    serviceName: "Doctor Visit at Home",
    link: "/services/doctor",
  },
  {
    id: "nursing-at-home",
    serviceType: "nursing",
    serviceCategory: "nursing",
    title: "Nursing at Home",
    shortDescription: "Experienced registered nurses for IV drips, injections, wound dressing, catheterization & post-operative care.",
    badge: "🛡️ Safe & Hygienic",
    badgeColor: "bg-teal-600 text-white",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "200+ Bookings",
    rating: 4.8,
    reviewCount: "150+ Reviews",
    features: ["⚡ Arrives in 30 Min", "🏠 Home Visit"],
    price: 699,
    originalPrice: 899,
    priceUnit: "visit",
    savings: 200,
    serviceName: "Nursing Care at Home",
    link: "/services/nursing",
  },
  {
    id: "patient-attendant-care",
    serviceType: "home-care",
    serviceCategory: "home-care",
    title: "Patient Attendant / Elderly Care",
    shortDescription: "Compassionate, 100% background-verified caregivers for elderly assistance, daily living support & mobility.",
    badge: "🤝 Compassionate Care",
    badgeColor: "bg-amber-600 text-white",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "180+ Bookings",
    rating: 4.8,
    reviewCount: "180+ Reviews",
    features: ["⚡ Same Day Availability", "🏠 Home Visit"],
    price: 399,
    originalPrice: 599,
    priceUnit: "day",
    savings: 200,
    serviceName: "Home Care Services",
    link: "/services/home-care",
  },
  {
    id: "icu-at-home",
    serviceType: "icu",
    serviceCategory: "icu",
    title: "Complete ICU Setup at Home",
    shortDescription: "Hospital-grade ventilator, BiPAP, monitor and round-the-clock ICU nurse support in your home bedroom.",
    badge: "🏥 Critical Care",
    badgeColor: "bg-purple-600 text-white",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "120+ Bookings",
    rating: 4.9,
    reviewCount: "95+ Reviews",
    features: ["⏱️ 24/7 Setup Support", "🏠 Home Setup"],
    price: 2999,
    originalPrice: 4500,
    priceUnit: "day",
    savings: 1501,
    serviceName: "ICU at Home",
    link: "/icu-at-home",
  },
  {
    id: "ambulance-emergency",
    serviceType: "ambulance",
    serviceCategory: "ambulance",
    title: "24/7 Emergency Ambulance",
    shortDescription: "Lucknow's fastest emergency response ambulance equipped with oxygen, ventilator, defibrillator & paramedic team.",
    badge: "🚨 15-20 Min Express",
    badgeColor: "bg-red-600 text-white",
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    bookingsCount: "1,200+ Trips",
    rating: 4.9,
    reviewCount: "450+ Reviews",
    features: ["⏱️ 15-20 Min Response", "🚑 GPS Tracked"],
    price: 1199,
    originalPrice: 1699,
    priceUnit: "trip",
    savings: 500,
    serviceName: "Ambulance Service",
    isAmbulance: true,
    link: "/services/ambulance",
  }
];

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch popular services configured by admin in HomeCareService
    const adminHomeCarePopular = await HomeCareService.find({
      isPopular: true,
      status: 'Active',
      showOnWebsite: true,
    }).lean();

    // 2. Fetch popular service packages configured in ServicePackage
    const adminPackagesPopular = await ServicePackage.find({
      isPopular: true,
    }).lean();

    const formattedAdminServices = [
      ...adminHomeCarePopular.map((s) => {
        const effectivePrice = s.hasOffer && s.discountValue > 0
          ? s.discountType === 'Percentage'
            ? Math.round(s.price * (1 - s.discountValue / 100))
            : Math.max(0, s.price - s.discountValue)
          : s.price;
        const originalPrice = s.hasOffer && s.discountValue > 0 ? s.price : Math.round(s.price * 1.25);
        const savings = Math.max(0, originalPrice - effectivePrice);

        return {
          id: `hc-${s._id}`,
          serviceType: s.category === 'nursing-care' ? 'nursing' : 'home-care',
          serviceCategory: s.category || 'home-care',
          title: s.name,
          shortDescription: s.shortDescription,
          badge: s.badge || '👑 Popular Service',
          badgeColor: 'bg-[#006837] text-white',
          image: s.mainImage || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
          bookingsCount: `${s.verifiedBookingsCount || 100}+ Bookings`,
          rating: s.rating || 4.8,
          reviewCount: `${s.reviewCount || 25}+ Reviews`,
          features: ['⚡ Arrives in 30 Min', '🏠 Home Visit'],
          price: effectivePrice,
          originalPrice,
          priceUnit: s.priceUnit || 'day',
          savings,
          serviceName: s.name,
          slug: s.slug,
          link: `/services/home-care/${s.slug}`,
          isAdminSelected: true,
        };
      }),
      ...adminPackagesPopular.map((p) => {
        const effectivePrice = p.price;
        const originalPrice = p.originalPrice || Math.round(p.price * 1.3);
        const savings = Math.max(0, originalPrice - effectivePrice);

        return {
          id: `pkg-${p._id}`,
          serviceType: p.serviceType,
          serviceCategory: p.serviceType,
          title: p.title,
          shortDescription: p.description || '',
          badge: p.badge || '⭐ Admin Recommended',
          badgeColor: 'bg-emerald-700 text-white',
          image: p.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
          bookingsCount: '150+ Bookings',
          rating: 4.8,
          reviewCount: '80+ Reviews',
          features: p.features && p.features.length > 0 ? p.features.slice(0, 2) : ['⚡ Arrives in 30 Min', '🏠 Home Visit'],
          price: effectivePrice,
          originalPrice,
          priceUnit: p.period || 'session',
          savings,
          serviceName: p.title,
          link: `/services/${p.serviceType}`,
          isAdminSelected: true,
        };
      }),
    ];

    // Combine admin-selected popular items first, followed by default popular items not already covered
    const existingTitles = new Set(formattedAdminServices.map((s) => s.title.toLowerCase()));
    const remainingDefaults = DEFAULT_POPULAR_SERVICES.filter(
      (def) => !existingTitles.has(def.title.toLowerCase())
    );

    const merged = [...formattedAdminServices, ...remainingDefaults];

    return NextResponse.json({
      success: true,
      data: merged,
      adminCount: formattedAdminServices.length,
    });
  } catch (error) {
    console.error('Fetch popular services error:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_POPULAR_SERVICES,
      adminCount: 0,
      fallback: true,
    });
  }
}


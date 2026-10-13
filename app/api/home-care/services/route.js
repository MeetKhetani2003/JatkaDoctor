import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // 'home-care' | 'nursing-care'
    const popularOnly = searchParams.get('popular') === 'true';

    const query = {
      status: 'Active',
      showOnWebsite: true,
    };
    if (category) query.category = category;
    if (popularOnly) query.isPopular = true;

    const services = await HomeCareService.find(query)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    // Dynamically enrich booking count from actual HomeCareBooking collection if available
    const enrichedServices = await Promise.all(
      services.map(async (svc) => {
        const actualBookings = await HomeCareBooking.countDocuments({
          serviceId: svc._id,
          bookingStatus: { $nin: ['Cancelled', 'Rejected'] }
        });

        // Combined actual booking count + base verified count
        const displayBookings = Math.max(svc.verifiedBookingsCount || 0, actualBookings);

        return {
          ...svc,
          actualBookingCount: displayBookings,
          effectivePrice: svc.hasOffer && svc.discountValue > 0
            ? svc.discountType === 'Percentage'
              ? Math.round(svc.price * (1 - svc.discountValue / 100))
              : Math.max(0, svc.price - svc.discountValue)
            : svc.price,
        };
      })
    );

    return NextResponse.json({ success: true, data: enrichedServices });
  } catch (error) {
    console.error('Error in public home-care services API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

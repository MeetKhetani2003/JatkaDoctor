import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { slug } = await context.params;

    const service = await HomeCareService.findOne({
      slug: slug,
      status: 'Active',
      showOnWebsite: true,
    }).lean();

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const actualBookings = await HomeCareBooking.countDocuments({
      serviceId: service._id,
      bookingStatus: { $nin: ['Cancelled', 'Rejected'] }
    });

    const displayBookings = Math.max(service.verifiedBookingsCount || 0, actualBookings);

    const effectivePrice = service.hasOffer && service.discountValue > 0
      ? service.discountType === 'Percentage'
        ? Math.round(service.price * (1 - service.discountValue / 100))
        : Math.max(0, service.price - service.discountValue)
      : service.price;

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        actualBookingCount: displayBookings,
        effectivePrice,
      }
    });
  } catch (error) {
    console.error('Error fetching single service by slug:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

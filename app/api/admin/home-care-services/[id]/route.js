import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';
import HomeCareBooking from '@/lib/models/homeCare/HomeCareBooking';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const service = await HomeCareService.findById(id).lean();
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();

    const updated = await HomeCareService.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // Check if there are bookings linked to this service
    const bookingCount = await HomeCareBooking.countDocuments({ serviceId: id });
    if (bookingCount > 0) {
      // Archive instead of hard delete to preserve historical bookings and patient records
      const archived = await HomeCareService.findByIdAndUpdate(
        id, 
        { status: 'Archived', showOnWebsite: false },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: 'Service has existing bookings; marked as Archived instead of deleting to preserve history.',
        data: archived,
      });
    }

    const deleted = await HomeCareService.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted permanently' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

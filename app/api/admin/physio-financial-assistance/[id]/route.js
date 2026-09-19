import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FinancialAssistance from "@/lib/models/physio/FinancialAssistance";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    const faRequest = await FinancialAssistance.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!faRequest) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    
    // If approved, update the related booking
    if (body.status === 'Approved' && body.finalPrice !== undefined) {
        const booking = await PhysioBooking.findById(faRequest.bookingId);
        if (booking) {
            booking.concessionAmount = booking.totalAmount - body.finalPrice;
            booking.totalAmount = body.finalPrice;
            
            // If 100% Free Treatment (final price is 0)
            if (body.finalPrice === 0) {
                booking.paymentStatus = 'Paid';
            }
            
            await booking.save();
        }
    }
    
    return NextResponse.json({ success: true, data: faRequest });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

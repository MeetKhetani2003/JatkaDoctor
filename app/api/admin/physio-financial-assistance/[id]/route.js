import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FinancialAssistance from "@/lib/models/physio/FinancialAssistance";
import PhysioBooking from "@/lib/models/physio/PhysioBooking";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json(); // Should include status (Approved/Rejected) and approvedPrice
    
    const faRequest = await FinancialAssistance.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!faRequest) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    
    // If approved, update the related booking
    if (body.status === 'Approved' && body.approvedPrice !== undefined) {
        const booking = await PhysioBooking.findById(faRequest.bookingId);
        if (booking) {
            booking.concessionAmount = booking.totalAmount - body.approvedPrice;
            booking.totalAmount = body.approvedPrice; // Override with new requested price as total payable
            await booking.save();
        }
    }
    
    return NextResponse.json({ success: true, data: faRequest });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

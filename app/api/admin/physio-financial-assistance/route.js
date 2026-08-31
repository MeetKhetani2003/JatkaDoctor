import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FinancialAssistance from "@/lib/models/physio/FinancialAssistance";

export async function GET(req) {
  try {
    await dbConnect();
    const requests = await FinancialAssistance.find()
        .populate('patientId', 'name mobile')
        .populate('bookingId', 'bookingId totalAmount paymentStatus')
        .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const faRequest = await FinancialAssistance.create(body);
    return NextResponse.json({ success: true, data: faRequest });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

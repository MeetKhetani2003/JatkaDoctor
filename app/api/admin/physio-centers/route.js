import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioCenter from "@/lib/models/PhysioCenter";

export async function GET(req) {
  try {
    await dbConnect();
    const centers = await PhysioCenter.find({ isArchived: { $ne: true } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .populate('departments', 'name')
        .populate('assignedTherapists', 'name specialization');
    return NextResponse.json({ success: true, data: centers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const center = await PhysioCenter.create(body);
    return NextResponse.json({ success: true, data: center });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

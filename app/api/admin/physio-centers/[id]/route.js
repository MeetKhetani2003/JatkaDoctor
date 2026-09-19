import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioCenter from "@/lib/models/PhysioCenter";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const center = await PhysioCenter.findById(id)
        .populate('departments', 'name')
        .populate('assignedTherapists', 'name');
    if (!center) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: center });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const center = await PhysioCenter.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!center) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: center });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    // Archive instead of delete
    const center = await PhysioCenter.findByIdAndUpdate(id, { isArchived: true }, { returnDocument: 'after' });
    if (!center) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Archived successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

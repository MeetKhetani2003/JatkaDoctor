import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioCondition from "@/lib/models/physio/PhysioCondition";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const condition = await PhysioCondition.findById(id).populate('groupId', 'name');
    if (!condition) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: condition });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const condition = await PhysioCondition.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!condition) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: condition });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const condition = await PhysioCondition.findByIdAndDelete(id);
    if (!condition) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

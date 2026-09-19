import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioProblemGroup from "@/lib/models/physio/PhysioProblemGroup";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const group = await PhysioProblemGroup.findById(id).populate('departmentId', 'name');
    if (!group) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const group = await PhysioProblemGroup.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!group) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const group = await PhysioProblemGroup.findByIdAndDelete(id);
    if (!group) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

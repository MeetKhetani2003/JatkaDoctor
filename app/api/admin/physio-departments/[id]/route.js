import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioDepartment from "@/lib/models/physio/PhysioDepartment";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const department = await PhysioDepartment.findById(id);
    if (!department) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const department = await PhysioDepartment.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!department) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const department = await PhysioDepartment.findByIdAndDelete(id);
    if (!department) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

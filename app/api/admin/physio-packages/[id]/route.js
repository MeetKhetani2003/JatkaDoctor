import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioPackage from "@/lib/models/physio/PhysioPackage";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const physioPackage = await PhysioPackage.findById(id).populate('conditionId', 'name');
    if (!physioPackage) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: physioPackage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const physioPackage = await PhysioPackage.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!physioPackage) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: physioPackage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const physioPackage = await PhysioPackage.findByIdAndDelete(id);
    if (!physioPackage) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

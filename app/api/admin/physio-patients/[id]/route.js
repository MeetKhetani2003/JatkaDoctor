import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/physio/Patient";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const patient = await Patient.findById(id);
    if (!patient) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const patient = await Patient.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
    if (!patient) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const patient = await Patient.findByIdAndUpdate(id, { isArchived: true }, { returnDocument: 'after' });
    if (!patient) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Archived successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

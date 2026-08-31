import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioDepartment from "@/lib/models/physio/PhysioDepartment";

export async function GET() {
  try {
    await dbConnect();
    const departments = await PhysioDepartment.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const department = await PhysioDepartment.create(body);
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

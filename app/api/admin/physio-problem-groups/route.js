import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioProblemGroup from "@/lib/models/physio/PhysioProblemGroup";

export async function GET(req) {
  try {
    await dbConnect();
    // Allow filtering by departmentId if provided
    const url = new URL(req.url);
    const departmentId = url.searchParams.get('departmentId');
    const query = departmentId ? { departmentId } : {};
    
    const groups = await PhysioProblemGroup.find(query).populate('departmentId', 'name').sort({ order: 1 });
    return NextResponse.json({ success: true, data: groups });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const group = await PhysioProblemGroup.create(body);
    return NextResponse.json({ success: true, data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

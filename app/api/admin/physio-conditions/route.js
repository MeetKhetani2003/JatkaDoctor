import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioCondition from "@/lib/models/physio/PhysioCondition";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const groupId = url.searchParams.get('groupId');
    const query = groupId ? { groupId } : {};
    
    const conditions = await PhysioCondition.find(query).populate('groupId', 'name').sort({ order: 1 });
    return NextResponse.json({ success: true, data: conditions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const condition = await PhysioCondition.create(body);
    return NextResponse.json({ success: true, data: condition });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

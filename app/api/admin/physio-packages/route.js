import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioPackage from "@/lib/models/physio/PhysioPackage";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const conditionId = url.searchParams.get('conditionId');
    const query = conditionId ? { conditionId } : {};
    
    const packages = await PhysioPackage.find(query).populate('conditionId', 'name').sort({ order: 1 });
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const physioPackage = await PhysioPackage.create(body);
    return NextResponse.json({ success: true, data: physioPackage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

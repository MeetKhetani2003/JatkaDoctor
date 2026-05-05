import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ambulance from '@/lib/models/Ambulance';

export async function GET() {
  await dbConnect();
  try {
    const ambulances = await Ambulance.find({}).sort({ createdAt: 1 });
    return NextResponse.json(ambulances);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const ambulance = await Ambulance.create(body);
    return NextResponse.json(ambulance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

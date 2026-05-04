import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/lib/models/Staff';

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find({});
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const staffMember = await Staff.create(body);
    return NextResponse.json(staffMember);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

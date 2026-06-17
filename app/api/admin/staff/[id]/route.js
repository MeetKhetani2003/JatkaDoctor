import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/lib/models/Staff';
import { verifyAdmin } from '@/lib/adminAuth';
import { Types } from 'mongoose';

export async function PATCH(req, { params }) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Staff ID' }, { status: 400 });
    }

    const body = await req.json();
    const staff = await Staff.findByIdAndUpdate(id, body, { returnDocument: 'after' });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Staff ID' }, { status: 400 });
    }

    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Staff member deleted successfully', staff });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

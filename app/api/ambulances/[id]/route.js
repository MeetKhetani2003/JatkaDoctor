import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ambulance from '@/lib/models/Ambulance';

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await request.json();
    const updatedAmbulance = await Ambulance.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedAmbulance);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    await Ambulance.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

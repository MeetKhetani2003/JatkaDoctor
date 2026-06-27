import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/lib/models/Staff';
import { verifyAdmin } from '@/lib/adminAuth';
import { Types } from 'mongoose';
import { uploadToGridFS, deleteFromGridFS } from '@/lib/gridfs';

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

    let updates = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      // Extract fields from formData
      for (const [key, value] of formData.entries()) {
        if (key !== 'image') {
          updates[key] = value;
        }
      }

      const file = formData.get('image');
      if (file && typeof file !== 'string' && file.size > 0) {
        // Upload new image
        const buffer = Buffer.from(await file.arrayBuffer());
        const newImageFileId = await uploadToGridFS(buffer, file.name, file.type);
        updates.imageFileId = newImageFileId;
        updates.image = `/api/images/${newImageFileId}`;

        // Get old staff to delete old image from GridFS
        const oldStaff = await Staff.findById(id);
        if (oldStaff && oldStaff.imageFileId) {
          try {
            await deleteFromGridFS(oldStaff.imageFileId);
          } catch (e) {
            console.error('Failed to delete old staff image from GridFS:', e);
          }
        }
      }
    } else {
      updates = await req.json();
    }

    const staff = await Staff.findByIdAndUpdate(id, updates, { returnDocument: 'after' });

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

    if (staff.imageFileId) {
      try {
        await deleteFromGridFS(staff.imageFileId);
      } catch (e) {
        console.error('Failed to delete staff image from GridFS on delete:', e);
      }
    }

    return NextResponse.json({ message: 'Staff member deleted successfully', staff });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

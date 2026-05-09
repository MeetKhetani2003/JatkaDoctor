import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { deleteFromGridFS } from '@/lib/gridfs';

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // If it's a photo, we also need to delete the image from GridFS
    if (item.type === 'photo' && item.url.startsWith('/api/images/')) {
      const imageId = item.url.split('/').pop();
      try {
        await deleteFromGridFS(imageId);
      } catch (err) {
         console.error('Error deleting image from GridFS:', err);
         // Continue deleting the item from database even if GridFS delete fails
      }
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Gallery DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

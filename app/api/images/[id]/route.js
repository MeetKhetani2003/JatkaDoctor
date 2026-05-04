import { NextResponse } from 'next/server';
import { getGridFSBucket } from '@/lib/gridfs';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const bucket = await getGridFSBucket();
    const _id = new ObjectId(id);

    const files = await bucket.find({ _id }).toArray();
    if (!files || files.length === 0) {
      return new Response('Image not found', { status: 404 });
    }

    const file = files[0];
    const stream = bucket.openDownloadStream(_id);

    // Convert the Node.js Readable stream to a Web ReadableStream for Next.js response
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
      cancel() {
        stream.destroy();
      }
    });

    return new Response(webStream, {
      headers: {
        'Content-Type': file.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image Fetch Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

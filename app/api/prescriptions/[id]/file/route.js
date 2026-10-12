import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prescription from '@/lib/models/Prescription';
import { getPrescriptionFileStream } from '@/lib/prescriptionGridfs';

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === '1';

    await dbConnect();

    // Find prescription by prescriptionId or MongoDB _id
    let prescription = null;
    if (id.startsWith('RX-')) {
      prescription = await Prescription.findOne({ prescriptionId: id }).lean();
    } else {
      prescription = await Prescription.findById(id).lean();
    }

    if (!prescription) {
      return new Response('Prescription record not found', { status: 404 });
    }

    const fileStreamData = await getPrescriptionFileStream(prescription.fileGridFsId);
    if (!fileStreamData) {
      return new Response('Prescription file not found in storage', { status: 404 });
    }

    const { fileInfo, stream } = fileStreamData;

    // Convert Node readable stream to Web ReadableStream
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

    const headers = new Headers();
    headers.set('Content-Type', prescription.fileType || fileInfo.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    if (isDownload) {
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(prescription.fileName)}"`);
    } else {
      headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(prescription.fileName)}"`);
    }

    return new Response(webStream, { headers });
  } catch (error) {
    console.error('Prescription File Fetch Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

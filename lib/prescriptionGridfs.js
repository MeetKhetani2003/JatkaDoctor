import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let bucket;

export async function getPrescriptionBucket() {
  if (bucket) return bucket;
  await client.connect();
  const db = client.db();
  bucket = new GridFSBucket(db, {
    bucketName: 'prescriptions',
  });
  return bucket;
}

export async function uploadPrescriptionFile(buffer, filename, contentType) {
  const b = await getPrescriptionBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = b.openUploadStream(filename, {
      contentType,
    });
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
    uploadStream.on('error', reject);
  });
}

export async function getPrescriptionFileStream(id) {
  const b = await getPrescriptionBucket();
  const _id = new ObjectId(id);
  const files = await b.find({ _id }).toArray();
  if (!files || files.length === 0) return null;
  return {
    fileInfo: files[0],
    stream: b.openDownloadStream(_id),
  };
}

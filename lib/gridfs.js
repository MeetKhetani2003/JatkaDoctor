import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let bucket;

export async function getGridFSBucket() {
  if (bucket) return bucket;
  await client.connect();
  const db = client.db();
  bucket = new GridFSBucket(db, {
    bucketName: 'images',
  });
  return bucket;
}

export async function uploadToGridFS(buffer, filename, contentType) {
  const bucket = await getGridFSBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
    uploadStream.on('error', reject);
  });
}

export async function deleteFromGridFS(id) {
  const bucket = await getGridFSBucket();
  await bucket.delete(new ObjectId(id));
}

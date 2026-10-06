/**
 * Full Database Backup Script
 * - Uses EJSON (Extended JSON) to preserve ALL BSON types: Binary, ObjectId, Date, Decimal128, etc.
 * - Handles GridFS image chunks (binary blob data)
 * - Backs up EVERY collection in EVERY database
 *
 * Usage: node scripts/backup-srv-db.mjs
 */

import pkg from 'mongodb';
const { MongoClient, BSON } = pkg;
const { EJSON } = BSON;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRV_URI = 'mongodb+srv://mkdigital:Meet2003@cluster0.fhbeqyk.mongodb.net/?appName=Cluster0';

const BACKUP_ROOT = path.join(__dirname, '..', 'database-backup');

// Wipe old backup folder fresh
if (fs.existsSync(BACKUP_ROOT)) {
  fs.rmSync(BACKUP_ROOT, { recursive: true, force: true });
  console.log('🗑  Cleared old backup folder\n');
}

async function backup() {
  console.log('🔌 Connecting to SRV cluster...');
  const client = new MongoClient(SRV_URI, {
    // Large timeout for big binary chunks
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 120000,
  });

  try {
    await client.connect();
    console.log('✅ Connected!\n');

    const adminDb = client.db('admin');
    const { databases } = await adminDb.admin().listDatabases();

    console.log(`📦 Found ${databases.length} database(s):`);
    databases.forEach(db =>
      console.log(`   • ${db.name}  (${(db.sizeOnDisk / 1024).toFixed(1)} KB)`)
    );
    console.log('');

    let totalDocs = 0;
    let totalFiles = 0;

    for (const { name: dbName } of databases) {
      // Skip internal MongoDB system databases
      if (['admin', 'local', 'config'].includes(dbName)) {
        console.log(`⏭  Skipping system db: ${dbName}`);
        continue;
      }

      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      if (collections.length === 0) {
        console.log(`📂 ${dbName} — empty, skipping\n`);
        continue;
      }

      const dbFolder = path.join(BACKUP_ROOT, dbName);
      fs.mkdirSync(dbFolder, { recursive: true });

      console.log(`\n📂 Database: "${dbName}"  (${collections.length} collections)`);
      console.log('─'.repeat(55));

      let dbDocCount = 0;

      for (const col of collections) {
        const colName = col.name;

        try {
          // Fetch ALL documents (no limit)
          const documents = await db.collection(colName).find({}).toArray();

          // EJSON.stringify properly handles:
          //   Binary (images), ObjectId, Date, Decimal128, Long, etc.
          const ejsonStr = EJSON.stringify(documents, { relaxed: false }, 2);

          const filePath = path.join(dbFolder, `${colName}.json`);
          fs.writeFileSync(filePath, ejsonStr, 'utf-8');

          const fileSizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);
          console.log(`   ✓ ${colName}.json  —  ${documents.length} docs  (${fileSizeKB} KB)`);

          dbDocCount += documents.length;
          totalDocs += documents.length;
          totalFiles++;
        } catch (colErr) {
          console.error(`   ✗ ${colName} — ERROR: ${colErr.message}`);
        }
      }

      // Write manifest
      const manifest = {
        database: dbName,
        backedUpAt: new Date().toISOString(),
        totalDocuments: dbDocCount,
        collections: collections.map(c => c.name),
        sourceUri: SRV_URI.replace(/:([^@]+)@/, ':***@'),
      };
      fs.writeFileSync(
        path.join(dbFolder, '_manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf-8'
      );

      console.log(`   📄 _manifest.json written  |  ${dbDocCount} total docs`);
    }

    console.log('\n' + '='.repeat(55));
    console.log(`🎉 Backup complete!`);
    console.log(`   Total collections backed up : ${totalFiles}`);
    console.log(`   Total documents backed up   : ${totalDocs}`);
    console.log(`   Saved to: ${BACKUP_ROOT}`);
    console.log('='.repeat(55) + '\n');
  } catch (err) {
    console.error('\n❌ Backup failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

backup();

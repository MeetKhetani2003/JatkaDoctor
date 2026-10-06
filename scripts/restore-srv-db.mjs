/**
 * Full Database Restore Script
 * - Reads local EJSON files from database-backup/
 * - Parses BSON types correctly (Images, ObjectIds, Dates, etc.)
 * - Uploads to the Client's MongoDB Cluster
 *
 * Usage: node scripts/restore-srv-db.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'mongodb';
const { MongoClient, BSON } = pkg;
const { EJSON } = BSON;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLIENT_URI = 'mongodb://drjhatkamedicare_db_user:BcOVs7yfzzUX4NHS@ac-2d5ze2s-shard-00-00.g4gnylx.mongodb.net:27017,ac-2d5ze2s-shard-00-01.g4gnylx.mongodb.net:27017,ac-2d5ze2s-shard-00-02.g4gnylx.mongodb.net:27017/?ssl=true&replicaSet=atlas-s3vqaj-shard-0&authSource=admin&appName=Cluster0';
const BACKUP_ROOT = path.join(__dirname, '..', 'database-backup');

async function restore() {
  console.log('🔌 Connecting to Client MongoDB cluster...');
  const client = new MongoClient(CLIENT_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 120000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Client Cluster!\n');

    if (!fs.existsSync(BACKUP_ROOT)) {
      throw new Error(`Backup directory not found at ${BACKUP_ROOT}`);
    }

    const databases = fs.readdirSync(BACKUP_ROOT, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (databases.length === 0) {
      console.log('No databases found to restore.');
      return;
    }

    let totalDocsRestored = 0;
    let totalColsRestored = 0;

    for (const dbName of databases) {
      console.log(`\n📂 Restoring Database: "${dbName}"`);
      console.log('─'.repeat(55));

      const targetDb = client.db(dbName);
      const dbFolder = path.join(BACKUP_ROOT, dbName);
      const files = fs.readdirSync(dbFolder).filter(f => f.endsWith('.json') && f !== '_manifest.json');

      for (const file of files) {
        const colName = file.replace('.json', '');
        const filePath = path.join(dbFolder, file);

        try {
          console.log(`   ⏳ Reading ${colName}.json...`);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          
          // EJSON.parse converts it back to actual Binary, ObjectId, Date, etc.
          const documents = EJSON.parse(fileContent);

          if (documents.length === 0) {
            console.log(`   ⏭  Skipped ${colName} (Empty)`);
            continue;
          }

          const targetCollection = targetDb.collection(colName);
          
          // Clear target collection before inserting to avoid duplicates during migration
          await targetCollection.deleteMany({});
          
          // Insert in chunks to avoid max BSON size limits on huge image collections
          const chunkSize = 50; 
          for (let i = 0; i < documents.length; i += chunkSize) {
            const chunk = documents.slice(i, i + chunkSize);
            await targetCollection.insertMany(chunk);
          }

          console.log(`   ✓ Restored ${colName} — ${documents.length} docs`);
          totalDocsRestored += documents.length;
          totalColsRestored++;
        } catch (colErr) {
          console.error(`   ✗ Error restoring ${colName}: ${colErr.message}`);
        }
      }
    }

    console.log('\n' + '='.repeat(55));
    console.log(`🎉 Full Restore Complete!`);
    console.log(`   Total collections restored : ${totalColsRestored}`);
    console.log(`   Total documents restored   : ${totalDocsRestored}`);
    console.log('='.repeat(55) + '\n');
  } catch (err) {
    console.error('\n❌ Restore failed:', err.message);
  } finally {
    await client.close();
  }
}

restore();

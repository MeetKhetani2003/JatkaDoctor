import mongoose from 'mongoose';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const uri = "mongodb://mkdigital:Meet2003@ac-awpv0ex-shard-00-00.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-01.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-02.pmw3ac4.mongodb.net:27017/?ssl=true&replicaSet=atlas-107ryv-shard-0&authSource=admin&appName=Cluster0";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  for (const col of ['physiodepartments', 'physioproblemgroups', 'physioconditions', 'servicepackages', 'categories', 'doctors', 'patients', 'appointments']) {
    const count = await db.collection(col).countDocuments();
    console.log(`${col}: ${count}`);
  }
  await mongoose.disconnect();
}
run();

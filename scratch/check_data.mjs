import mongoose from 'mongoose';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const uri = "mongodb://mkdigital:Meet2003@ac-awpv0ex-shard-00-00.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-01.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-02.pmw3ac4.mongodb.net:27017/?ssl=true&replicaSet=atlas-107ryv-shard-0&authSource=admin&appName=Cluster0";

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const conditions = await db.collection('physioconditions').find({}).limit(5).toArray();
  console.log("Sample conditions:", conditions.map(c => ({ name: c.name, groupId: c.groupId })));

  const departments = await db.collection('physiodepartments').find({}).limit(5).toArray();
  console.log("Sample departments:", departments.map(d => ({ name: d.name })));

  const packages = await db.collection('servicepackages').find({}).limit(5).toArray();
  console.log("Sample packages:", packages.map(p => ({ title: p.title, type: p.serviceType })));

  await mongoose.disconnect();
}
check().catch(console.error);

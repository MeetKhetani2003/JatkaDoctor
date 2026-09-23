import mongoose from 'mongoose';
import PhysioPackage from './lib/models/physio/PhysioPackage.js';

async function seed() {
  await mongoose.connect('mongodb://mkdigital:Meet2003@ac-awpv0ex-shard-00-00.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-01.pmw3ac4.mongodb.net:27017,ac-awpv0ex-shard-00-02.pmw3ac4.mongodb.net:27017/?ssl=true&replicaSet=atlas-107ryv-shard-0&authSource=admin&appName=Cluster0');

  const packages = [
    {
      title: "1 Session (Trial)",
      sessionsCount: 1,
      validityDays: 7,
      basePrice: 499,
      isRecommended: false,
      order: 1
    },
    {
      title: "7 Days Package",
      sessionsCount: 7,
      validityDays: 14,
      basePrice: 2999,
      isRecommended: false,
      order: 2
    },
    {
      title: "15 Days Package",
      sessionsCount: 15,
      validityDays: 30,
      basePrice: 5499,
      isRecommended: true,
      order: 3
    },
    {
      title: "30 Days Package",
      sessionsCount: 30,
      validityDays: 60,
      basePrice: 9999,
      isRecommended: false,
      order: 4
    },
    {
      title: "Emergency Visit",
      sessionsCount: 1,
      validityDays: 1,
      basePrice: 799,
      isRecommended: false,
      order: 5
    }
  ];

  await PhysioPackage.deleteMany({});
  await PhysioPackage.insertMany(packages);
  console.log("Packages seeded successfully!");
  process.exit();
}

seed();

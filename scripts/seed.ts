import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { User, ModuleModel } from '../src/models';
import { modulesData } from '../src/lib/seedData';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';

async function seed() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to primary MongoDB successfully.');
    } catch {
      console.warn('Could not connect to primary MONGODB_URI (IP whitelist/network). Using MongoMemoryServer for seed...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to MongoMemoryServer at:', memUri);
    }

    await ModuleModel.deleteMany({});
    console.log('Cleared existing modules.');

    const insertedModules = await ModuleModel.insertMany(modulesData);
    console.log(`Seeded ${insertedModules.length} modules successfully.`);

    const adminEmail = 'admin@elearning.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      await User.create({
        name: 'Portal Administrator',
        email: adminEmail,
        passwordHash,
        isAdmin: true,
        isAuthorized: true,
      });
      console.log('Created default admin user: admin@elearning.com / admin123456');
    } else {
      console.log('Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

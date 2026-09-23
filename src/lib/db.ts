import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, ModuleModel } from '@/models';
import { modulesData } from '@/lib/seedData';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

interface MongoMemoryServerLike {
  getUri(): string;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
  var mongoMemoryServer: MongoMemoryServerLike | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, seeded: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function seedDefaultData() {
  try {
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
      console.log('Auto-seeded default admin user: admin@elearning.com');
    }

    const count = await ModuleModel.countDocuments();
    if (count < modulesData.length) {
      await ModuleModel.deleteMany({});
      await ModuleModel.insertMany(modulesData);
      console.log(`Auto-seeded ${modulesData.length} course modules.`);
    }
  } catch (err) {
    console.error('Error auto-seeding default data:', err);
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    if (!cached.seeded) {
      await seedDefaultData();
      cached.seeded = true;
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached.promise = (async () => {
      try {
        const m = await mongoose.connect(uri, opts);
        return m;
      } catch (err) {
        console.warn('Could not connect to primary MongoDB URI, falling back to MongoMemoryServer...', err);
        let mongod = global.mongoMemoryServer;
        if (!mongod) {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          global.mongoMemoryServer = mongod;
        }
        const memUri = mongod.getUri();
        const m = await mongoose.connect(memUri);
        return m;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.seeded) {
      await seedDefaultData();
      cached.seeded = true;
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

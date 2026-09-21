import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ModuleModel, User } from '@/models';
import { modulesData } from '@/lib/seedData';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mongod?: any;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function ensureSeedData() {
  try {
    const count = await ModuleModel.countDocuments();
    if (count === 0) {
      await ModuleModel.insertMany(modulesData);
    }

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
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
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
        await ensureSeedData();
        return m;
      } catch {
        console.warn('Could not connect to MongoDB URI. Starting local MongoMemoryServer fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.mongod) {
          cached.mongod = await MongoMemoryServer.create({
            instance: {
              port: 27017,
              dbName: 'elearning',
            },
          });
        }
        const memUri = cached.mongod.getUri();
        const m = await mongoose.connect(memUri, { bufferCommands: false });
        await ensureSeedData();
        return m;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, ModuleModel } from '@/models';
import { modulesData } from '@/lib/seedData';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mongod?: any;
  seeded?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  mongod: null,
  seeded: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function ensureSeeded() {
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
      console.log('Auto-seeded default admin user: admin@elearning.com / admin123456');
    }

    const moduleCount = await ModuleModel.countDocuments();
    if (moduleCount === 0) {
      await ModuleModel.insertMany(modulesData);
      console.log(`Auto-seeded ${modulesData.length} course modules successfully.`);
    }
  } catch (err) {
    console.error('Error auto-seeding database:', err);
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    if (!cached.seeded) {
      await ensureSeeded();
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

    cached.promise = mongoose
      .connect(uri, opts)
      .catch(async (err) => {
        console.warn('Could not connect to primary MONGODB_URI. Falling back to MongoMemoryServer...', err.message);
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.mongod) {
          cached.mongod = await MongoMemoryServer.create();
        }
        const memUri = cached.mongod.getUri();
        return mongoose.connect(memUri, { bufferCommands: false });
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.seeded) {
      await ensureSeeded();
      cached.seeded = true;
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

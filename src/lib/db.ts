import mongoose from 'mongoose';
import { ensureDefaultData } from './seed';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connect() {
  const uri = MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 2000,
  };

  try {
    const conn = await mongoose.connect(uri, opts);
    return conn;
  } catch {
    console.warn('Failed to connect to primary MongoDB. Falling back to MongoMemoryServer...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    return conn;
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connect();
  }

  try {
    cached.conn = await cached.promise;
    await ensureDefaultData();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

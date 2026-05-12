import mongoose, { type Mongoose } from 'mongoose';

import { env } from '@/lib/env';

/**
 * Mongoose connection cache for serverless environments.
 *
 * Without this, Next.js dev HMR or serverless cold starts create a new
 * connection per request, exhausting MongoDB's connection limit.
 */
type GlobalWithMongoose = typeof globalThis & {
  __bh_mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

const g = globalThis as GlobalWithMongoose;

if (!g.__bh_mongoose) {
  g.__bh_mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<Mongoose> {
  const cache = g.__bh_mongoose!;

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => m);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}

export async function disconnectDB(): Promise<void> {
  const cache = g.__bh_mongoose!;
  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}

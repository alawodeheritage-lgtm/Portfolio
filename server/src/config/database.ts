import mongoose from 'mongoose';
import { env } from './env.js';

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(env.mongodbUri)
    .then(() => {
      console.info('MongoDB connected successfully');
    })
    .catch((error: unknown) => {
      console.error('MongoDB connection failed', error);
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
}
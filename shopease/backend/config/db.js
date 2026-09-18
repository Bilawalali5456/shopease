import mongoose from 'mongoose';

/**
 * Cached connection for Vercel serverless (reuse across warm invocations)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    cached.lastError = 'MONGO_URI is not set';
    console.error('❌ MONGO_URI is not set');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        cached.lastError = null;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        cached.lastError = error.message;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.lastError = error.message;
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return null;
  }
};

export const getDbStatus = () => ({
  readyState: mongoose.connection.readyState,
  lastError: cached?.lastError || null,
  mongoUriSet: Boolean(process.env.MONGO_URI),
});

export default connectDB;

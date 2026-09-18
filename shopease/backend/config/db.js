import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't crash the whole serverless process on Vercel — let requests return errors
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

export default connectDB;

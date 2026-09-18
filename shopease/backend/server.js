import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// ES Modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// --------------- Security Middleware ---------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ensure MongoDB is connected before API routes (important on Vercel)
app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api') || req.path === '/api') {
    return next();
  }
  try {
    const conn = await connectDB();
    if (!conn) {
      return res.status(500).json({
        message: 'Database not connected. Check MONGO_URI in Vercel Environment Variables.',
        mongoUriSet: Boolean(process.env.MONGO_URI),
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Database connection failed: ${error.message}`,
      mongoUriSet: Boolean(process.env.MONGO_URI),
    });
  }
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health check — shows DB status for debugging
app.get('/api', async (req, res) => {
  let db = 'disconnected';
  try {
    await connectDB();
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    db = states[mongoose.connection.readyState] || 'unknown';
  } catch (error) {
    db = `error: ${error.message}`;
  }

  res.json({
    message: 'API running',
    db,
    mongoUriSet: Boolean(process.env.MONGO_URI),
  });
});

app.use('/api/users/login', loginLimiter);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

if (!process.env.VERCEL) {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

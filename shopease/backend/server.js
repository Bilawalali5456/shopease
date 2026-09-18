import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Security Middleware ---------------
// Helmet sets various HTTP security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate limiting for login endpoint (max 10 per 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --------------- General Middleware ---------------
// Parse JSON request bodies
app.use(express.json());

// Enable CORS for frontend requests (Vercel + local)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin requests, local, and configured CLIENT_URL
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// HTTP request logger (dev format)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --------------- Routes ---------------
// Base API route - health check
app.get('/api', (req, res) => {
  res.json({ message: 'API running' });
});

// Apply rate limiter to login
app.use('/api/users/login', loginLimiter);

// Route mounts
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// ─────────────────────────────────────────────────────────────
// 1. Load env vars first — everything depends on them
// ─────────────────────────────────────────────────────────────
dotenv.config();

// ─────────────────────────────────────────────────────────────
// 2. Validate required environment variables on startup
//    Prevents deploying with missing configuration accidentally
// ─────────────────────────────────────────────────────────────
const checkRequiredEnvVars = () => {
  const required = ['JWT_SECRET', 'PORT'];
  const missing = required.filter((key) => !process.env[key]);

  if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
    missing.push('MONGODB_URI or DATABASE_URL');
  }

  if (missing.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missing.join(', ')}`);
    console.error('[FATAL] Server cannot start. Please set MONGODB_URI or DATABASE_URL, JWT_SECRET, and PORT.');
    process.exit(1);
  }
};

checkRequiredEnvVars();

// ─────────────────────────────────────────────────────────────
// 3. Create Express app
// ─────────────────────────────────────────────────────────────
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─────────────────────────────────────────────────────────────
// 4. Security Headers (helmet)
//    Prevents XSS, clickjacking, MIME sniffing, etc.
// ─────────────────────────────────────────────────────────────
app.use(helmet());

// ─────────────────────────────────────────────────────────────
// 5. Request Logging
//    'combined' in production (Apache format) for log aggregators
//    'dev' in development (compact, colorized)
// ─────────────────────────────────────────────────────────────
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─────────────────────────────────────────────────────────────
// 6. CORS — strict allowlist for production
//    Allows any origin in development, only whitelisted in prod
// ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean); // remove undefined/null entries

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, whitelisted, or any Vercel domain
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ─────────────────────────────────────────────────────────────
// 7. Body Parser with size limit
//    Prevents memory exhaustion / DoS via oversized payloads
// ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─────────────────────────────────────────────────────────────
// 8. MongoDB Injection Protection (express-mongo-sanitize)
//    Strips $ and . from req.body, req.query, req.params
//    Prevents NoSQL injection attacks like { email: { $gt: '' } }
// ─────────────────────────────────────────────────────────────
app.use(mongoSanitize());

// ─────────────────────────────────────────────────────────────
// 9. Rate Limiting
//    General: 100 requests per 15 minutes per IP
//    Auth: 10 requests per 15 minutes (brute-force protection)
// ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  skipSuccessfulRequests: true, // Only count failed attempts
});

// Apply general limiter to all /api routes
app.use('/api/', generalLimiter);

// Apply strict auth limiter to auth routes
app.use('/api/auth/', authLimiter);

// ─────────────────────────────────────────────────────────────
// 10. Mount Routers
// ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ─────────────────────────────────────────────────────────────
// 11. Health Check Endpoint
// ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: NODE_ENV,
  });
});

// ─────────────────────────────────────────────────────────────
// 12. 404 Handler for unmatched routes
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────────────────────
// 13. Global Error Handler (must be last middleware)
// ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────
// 14. Start Server
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Atlas first
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} in ${NODE_ENV} mode`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (error) => {
    console.error(`Server listen error: ${error.message}`);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Railway should provide a unique PORT env var.`);
    }
    process.exit(1);
  });

  // ─────────────────────────────────────────────────────────────
  // 15. Graceful Shutdown
  //     Closes server + DB connection cleanly on OS signals.
  //     Railway and other hosts send SIGTERM before stopping a container.
  // ─────────────────────────────────────────────────────────────
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Server shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        const mongoose = await import('mongoose');
        await mongoose.default.connection.close();
        console.log('MongoDB connection closed.');
      } catch (err) {
        console.error('Error closing MongoDB connection:', err.message);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Catch unhandled promise rejections (programming bugs)
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();

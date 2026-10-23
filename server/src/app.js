import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.js';
import transformRoutes from './routes/transform.js';
import adminRoutes from './routes/admin.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Disable X-Powered-By to prevent fingerprinting
app.disable('x-powered-by');

// 1. Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS Configuration
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, unit tests, mobile native) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS.`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours preflight cache
}));

// 3. Request Size Limit (Protect against large payload attacks)
app.use(express.json({ limit: '50kb' }));

// 4. General Rate Limiter for all routes
app.use(generalLimiter);

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 5. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/transform', transformRoutes);
app.use('/api/admin', adminRoutes);

// Optional unified production hosting: serve client build if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 6. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server if executed directly
const PORT = process.env.PORT || 5000;
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectExecution && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[OttoPersona AI] Server running on port ${PORT}`);
    console.log(`[Security] Helmet enabled | Rate limiting enabled | Origin: ${allowedOrigins.join(', ')}`);
  });
}

export default app;

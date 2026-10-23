import express from 'express';
import { requireAdminAuth, verifyPassword } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * GET /api/admin/status
 * Protected administrative diagnostics
 */
router.get('/status', authLimiter, requireAdminAuth, (req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    success: true,
    data: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      environment: process.env.NODE_ENV || 'development',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
      securityHeaders: 'Helmet CSP, HSTS, X-Content-Type-Options active',
      rateLimiting: 'Active (general: 150/15m, transform: 30/15m, auth: 10/15m)'
    }
  });
});

/**
 * POST /api/admin/login
 * Verify admin password using bcrypt
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Password is required.' }
      });
    }

    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminHash) {
      return res.status(403).json({
        success: false,
        error: { code: 'ADMIN_DISABLED', message: 'Admin login is not configured on this host.' }
      });
    }

    const isMatch = await verifyPassword(password, adminHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid administrative password.' }
      });
    }

    // Return the secret key token for subsequent requests
    const token = process.env.ADMIN_SECRET_KEY;
    return res.status(200).json({
      success: true,
      data: {
        token,
        message: 'Administrative authentication successful.'
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;

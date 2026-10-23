import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter (150 requests per 15 minutes)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait a moment before trying again.'
    }
  }
});

/**
 * Strict limiter for AI transformation endpoint (30 requests per 15 minutes per IP)
 */
export const transformLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Transformation rate limit reached. Please wait a few moments before submitting more requests.'
    }
  }
});

/**
 * Strict limiter for admin authentication attempts (10 attempts per 15 minutes)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Too many authentication attempts. Please try again later.'
    }
  }
});


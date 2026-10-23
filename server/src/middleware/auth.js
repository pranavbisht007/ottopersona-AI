import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Admin authentication middleware
 * Expects Authorization: Bearer <ADMIN_SECRET_KEY>
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret || adminSecret === 'change_me_to_a_secure_random_string_32_chars') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'ADMIN_NOT_CONFIGURED',
        message: 'Admin access is not configured on this server.'
      }
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header. Bearer token required.'
      }
    });
  }

  const token = authHeader.slice(7).trim();
  if (!safeCompare(token, adminSecret)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid administrative credentials.'
      }
    });
  }

  next();
}

/**
 * Helper to hash a password using bcrypt with salt rounds 10
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Helper to verify password against hash
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

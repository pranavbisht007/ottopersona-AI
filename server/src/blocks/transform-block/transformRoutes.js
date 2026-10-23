import express from 'express';
import { validateTransformRequest } from './transformValidator.js';
import { transformMessage } from '../ai-block/aiService.js';
import { transformLimiter } from '../security-block/rateLimiterMiddleware.js';

const router = express.Router();

/**
 * POST /api/transform
 * Context-aware AI message transformation
 */
router.post('/', transformLimiter, async (req, res, next) => {
  try {
    // 1. Validate and sanitize request payload
    const validation = validateTransformRequest(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // 2. Call AI Service with validated context
    const result = await transformMessage(validation.sanitized);

    // 3. Return structured success response
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;


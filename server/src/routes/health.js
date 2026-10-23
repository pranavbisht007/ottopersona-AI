import express from 'express';

const router = express.Router();

/**
 * Health check endpoint
 * Never exposes secrets, internal environment keys, or user data.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'OttoPersona AI Backend',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

export default router;

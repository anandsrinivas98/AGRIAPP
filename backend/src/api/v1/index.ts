import { Router } from 'express';

// Import route modules
import authRoutes from './auth/routes';
import farmRoutes from './farm/routes';
import aiRoutes from './ai/routes';
import communityRoutes from './community/routes';
import marketRoutes from './market/routes';
import planningRoutes from './planning/routes';

const router = Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API Status
 *     description: Returns the status of the API v1
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.json({
    message: 'AgriSense API v1 is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      farm: '/api/v1/farm',
      ai: '/api/v1/ai',
      community: '/api/v1/community',
      market: '/api/v1/market',
      planning: '/api/v1/planning'
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/farm', farmRoutes);
router.use('/ai', aiRoutes);
router.use('/community', communityRoutes);
router.use('/market', marketRoutes);
router.use('/planning', planningRoutes);

export default router;
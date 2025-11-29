import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/predict/yield:
 *   post:
 *     summary: Predict crop yield
 *     tags: [Yield Prediction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               crop:
 *                 type: string
 *               area:
 *                 type: number
 *               avgRainfall:
 *                 type: number
 *               pesticideUsage:
 *                 type: number
 *               temperature:
 *                 type: number
 *     responses:
 *       200:
 *         description: Yield prediction
 */
router.post('/yield', auth, async (req, res): Promise<void> => {
  try {
    const { crop, area, avgRainfall, pesticideUsage, temperature } = req.body;
    
    // Mock yield prediction
    const baseYield = area * 2.5; // Mock calculation
    const predictedYield = baseYield * (1 + (avgRainfall / 1000) - (pesticideUsage / 100));
    
    res.json({
      success: true,
      data: {
        predictedYield: Math.round(predictedYield * 100) / 100,
        confidenceInterval: {
          lower: Math.round((predictedYield * 0.85) * 100) / 100,
          upper: Math.round((predictedYield * 1.15) * 100) / 100
        },
        confidence: 0.78,
        inputParameters: { crop, area, avgRainfall, pesticideUsage, temperature }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
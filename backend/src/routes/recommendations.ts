import { Router } from 'express';
import { auth } from '../middleware/auth';
import axios from 'axios';

const router = Router();

// ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * @swagger
 * /api/recommend:
 *   post:
 *     summary: Get crop recommendations from ML service
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               N:
 *                 type: number
 *               P:
 *                 type: number
 *               K:
 *                 type: number
 *               pH:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               rainfall:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop recommendations
 */
router.post('/', async (req, res): Promise<void> => {
  try {
    const { N, P, K, pH, temperature, humidity, rainfall, location } = req.body;
    
    // Validate input
    if (N === undefined || P === undefined || K === undefined || pH === undefined ||
        temperature === undefined || humidity === undefined || rainfall === undefined) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
      return;
    }

    try {
      // Forward request to ML service
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/recommend/crop`, {
        N,
        P,
        K,
        pH,
        temperature,
        humidity,
        rainfall,
        location: location || 'Unknown'
      }, {
        timeout: 10000 // 10 second timeout
      });

      // Format response for frontend
      const recommendations = mlResponse.data.recommendations?.map((rec: any) => ({
        crop: rec.crop,
        confidence: Math.round(rec.confidence * 100),
        yield: rec.yield_estimate || 'N/A',
        profit: rec.profit_potential || 'Medium'
      })) || [];

      const reasons = mlResponse.data.reasons || [
        'Based on your soil nutrient levels',
        'Suitable for current weather conditions',
        'Good market demand expected'
      ];

      res.json({
        success: true,
        data: {
          recommendations,
          reasons
        }
      });

    } catch (mlError: any) {
      console.error('ML Service error:', mlError.message);
      
      // Fallback to mock data if ML service is unavailable
      const mockRecommendations = [
        { 
          crop: 'Rice', 
          confidence: 85, 
          yield: '25 quintals/acre', 
          profit: 'High' 
        },
        { 
          crop: 'Wheat', 
          confidence: 72, 
          yield: '20 quintals/acre', 
          profit: 'Medium' 
        },
        { 
          crop: 'Corn', 
          confidence: 68, 
          yield: '30 quintals/acre', 
          profit: 'Medium' 
        }
      ];

      const mockReasons = [
        'Soil nutrient levels are suitable for these crops',
        'Weather conditions favor these crop types',
        'Good market demand expected for these crops'
      ];

      res.json({
        success: true,
        data: {
          recommendations: mockRecommendations,
          reasons: mockReasons
        },
        note: 'Using fallback data - ML service unavailable'
      });
    }

  } catch (error: any) {
    console.error('Recommendation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate recommendations',
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /api/recommend/crop:
 *   post:
 *     summary: Get crop recommendations (legacy endpoint)
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nitrogen:
 *                 type: number
 *               phosphorus:
 *                 type: number
 *               potassium:
 *                 type: number
 *               ph:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               rainfall:
 *                 type: number
 *               season:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop recommendations
 */
router.post('/crop', auth, async (req, res): Promise<void> => {
  try {
    const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, season } = req.body;
    
    // Mock recommendations for now
    const recommendations = [
      { crop: 'Rice', confidence: 0.85, reason: 'High humidity and rainfall suitable for rice cultivation' },
      { crop: 'Wheat', confidence: 0.72, reason: 'Good soil nutrients for wheat growth' },
      { crop: 'Corn', confidence: 0.68, reason: 'Adequate temperature and pH levels' }
    ];

    res.json({
      success: true,
      data: {
        recommendations,
        inputParameters: { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, season }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
import express from 'express';
import { cropGuideService, CropGuideRequest } from '../services/cropGuideService';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for crop guide generation (more generous than chat)
const cropGuideRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes per IP
  message: {
    error: 'Too many crop guide requests. Please try again in 15 minutes.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /api/crop-guide/generate:
 *   post:
 *     summary: Generate comprehensive crop cultivation guide
 *     tags: [Crop Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cropName
 *             properties:
 *               cropName:
 *                 type: string
 *                 description: Name of the crop
 *                 example: "Tomato"
 *               region:
 *                 type: string
 *                 description: Geographic region
 *                 example: "Maharashtra, India"
 *               season:
 *                 type: string
 *                 description: Growing season
 *                 example: "Kharif"
 *               farmSize:
 *                 type: string
 *                 description: Size of the farm
 *                 example: "2 acres"
 *               soilType:
 *                 type: string
 *                 description: Type of soil
 *                 example: "Clay loam"
 *               climateZone:
 *                 type: string
 *                 description: Climate zone
 *                 example: "Tropical"
 *     responses:
 *       200:
 *         description: Crop guide generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Complete crop cultivation guide
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post('/generate', authenticate, cropGuideRateLimit, async (req, res) => {
  try {
    const { cropName, region, season, farmSize, soilType, climateZone } = req.body;

    // Validate required fields
    if (!cropName || typeof cropName !== 'string' || cropName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Crop name is required and must be a non-empty string'
      });
    }

    // Prepare request
    const request: CropGuideRequest = {
      cropName: cropName.trim(),
      region: region?.trim(),
      season: season?.trim(),
      farmSize: farmSize?.trim(),
      soilType: soilType?.trim(),
      climateZone: climateZone?.trim()
    };

    console.log(`🌱 Generating crop guide for: ${request.cropName}`);

    // Generate crop guide using Gemini AI
    const cropGuide = await cropGuideService.generateCropGuide(request);

    return res.json({
      success: true,
      data: cropGuide,
      message: `Crop guide for ${cropName} generated successfully`
    });

  } catch (error: any) {
    console.error('Error in crop guide generation:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate crop guide',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @swagger
 * /api/crop-guide/popular-crops:
 *   get:
 *     summary: Get list of popular crops
 *     tags: [Crop Guide]
 *     responses:
 *       200:
 *         description: List of popular crops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/popular-crops', async (req, res) => {
  try {
    const popularCrops = cropGuideService.getPopularCrops();
    
    res.json({
      success: true,
      data: popularCrops
    });
  } catch (error: any) {
    console.error('Error fetching popular crops:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular crops'
    });
  }
});

/**
 * @swagger
 * /api/crop-guide/quick-generate/{cropName}:
 *   get:
 *     summary: Quick generate crop guide for common crops
 *     tags: [Crop Guide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cropName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the crop
 *         example: "rice"
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Geographic region
 *         example: "India"
 *     responses:
 *       200:
 *         description: Crop guide generated successfully
 *       400:
 *         description: Invalid crop name
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/quick-generate/:cropName', authenticate, cropGuideRateLimit, async (req, res) => {
  try {
    const { cropName } = req.params;
    const { region } = req.query;

    if (!cropName || cropName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Crop name is required'
      });
    }

    const request: CropGuideRequest = {
      cropName: cropName.trim(),
      region: region as string
    };

    console.log(`🌱 Quick generating crop guide for: ${request.cropName}`);

    const cropGuide = await cropGuideService.generateCropGuide(request);

    return res.json({
      success: true,
      data: cropGuide,
      message: `Crop guide for ${cropName} generated successfully`
    });

  } catch (error: any) {
    console.error('Error in quick crop guide generation:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate crop guide'
    });
  }
});

export default router;
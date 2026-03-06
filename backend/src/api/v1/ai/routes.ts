import { Router } from 'express';
import { AIController } from './controller';
import { auth } from '../../../middleware/auth';
import { validateYieldPrediction, validateCropRecommendation, validateDiseaseDetection } from './validators';

const router = Router();
const aiController = new AIController();

// Apply authentication middleware to all AI routes
router.use(auth);

/**
 * @swagger
 * /api/v1/ai/crop-recommendations:
 *   post:
 *     summary: Get crop recommendations based on soil and weather data
 *     tags: [AI Services]
 */
router.post('/crop-recommendations', validateCropRecommendation, aiController.getCropRecommendations);

/**
 * @swagger
 * /api/v1/ai/yield-predictions:
 *   post:
 *     summary: Predict crop yield
 *     tags: [AI Services]
 */
router.post('/yield-predictions', validateYieldPrediction, aiController.predictYield);

/**
 * @swagger
 * /api/v1/ai/yield-predictions:
 *   get:
 *     summary: Get user's yield prediction history
 *     tags: [AI Services]
 */
router.get('/yield-predictions', aiController.getYieldPredictions);

/**
 * @swagger
 * /api/v1/ai/yield-predictions/{id}:
 *   get:
 *     summary: Get specific yield prediction
 *     tags: [AI Services]
 */
router.get('/yield-predictions/:id', aiController.getYieldPrediction);

/**
 * @swagger
 * /api/v1/ai/yield-predictions/{id}:
 *   delete:
 *     summary: Delete yield prediction
 *     tags: [AI Services]
 */
router.delete('/yield-predictions/:id', aiController.deleteYieldPrediction);

/**
 * @swagger
 * /api/v1/ai/disease-detection:
 *   post:
 *     summary: Detect plant diseases from images
 *     tags: [AI Services]
 */
router.post('/disease-detection', validateDiseaseDetection, aiController.detectDisease);

/**
 * @swagger
 * /api/v1/ai/crop-guide:
 *   post:
 *     summary: Generate comprehensive crop guide
 *     tags: [AI Services]
 */
router.post('/crop-guide', aiController.generateCropGuide);

/**
 * @swagger
 * /api/v1/ai/crop-guide/quick/{cropName}:
 *   get:
 *     summary: Quick generate crop guide for common crops
 *     tags: [AI Services]
 */
router.get('/crop-guide/quick/:cropName', aiController.quickGenerateCropGuide);

/**
 * @swagger
 * /api/v1/ai/crop-guide/popular-crops:
 *   get:
 *     summary: Get list of popular crops
 *     tags: [AI Services]
 */
router.get('/crop-guide/popular-crops', aiController.getPopularCrops);

/**
 * @swagger
 * /api/v1/ai/stats/summary:
 *   get:
 *     summary: Get AI service usage statistics
 *     tags: [AI Services]
 */
router.get('/stats/summary', aiController.getAIStats);

export default router;
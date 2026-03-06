import { Router } from 'express';
import { MarketController } from './controller';
import { auth } from '../../../middleware/auth';

const router = Router();
const marketController = new MarketController();

/**
 * @swagger
 * /api/v1/market/prices:
 *   get:
 *     summary: Get crop prices
 *     tags: [Market Data]
 */
router.get('/prices', marketController.getCropPrices);

/**
 * @swagger
 * /api/v1/market/weather:
 *   get:
 *     summary: Get weather data
 *     tags: [Market Data]
 */
router.get('/weather', marketController.getWeatherData);

// Protected routes
router.use(auth);

/**
 * @swagger
 * /api/v1/market/labour-alerts:
 *   get:
 *     summary: Get labour alerts
 *     tags: [Market Data]
 */
router.get('/labour-alerts', marketController.getLabourAlerts);

/**
 * @swagger
 * /api/v1/market/labour-alerts:
 *   post:
 *     summary: Create labour alert
 *     tags: [Market Data]
 */
router.post('/labour-alerts', marketController.createLabourAlert);

export default router;
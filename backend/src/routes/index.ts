import { Router } from 'express';
import authRoutes from './auth';
import recommendationRoutes from './recommendations';
import yieldRoutes from './yield';
import diseaseRoutes from './disease';
import priceRoutes from './prices';
import weatherRoutes from './weather';
import calendarRoutes from './calendar';
import forumRoutes from './forum';
import labourRoutes from './labour';
import chatRoutes from './chat';
import marketplaceRoutes from './marketplace';
import chatbotRoutes from './chatbot';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API Status
 *     description: Returns the status of the API
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get('/', (req, res) => {
  res.json({
    message: 'AgriSense API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/recommend', recommendationRoutes);
router.use('/predict', yieldRoutes);
router.use('/detect', diseaseRoutes);
router.use('/prices', priceRoutes);
router.use('/weather', weatherRoutes);
router.use('/calendar', calendarRoutes);
router.use('/forum', forumRoutes);
router.use('/labour', labourRoutes);
router.use('/chat', chatRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;
import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/prices:
 *   get:
 *     summary: Get crop prices
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *         description: Crop name
 *       - in: query
 *         name: market
 *         schema:
 *           type: string
 *         description: Market name
 *     responses:
 *       200:
 *         description: Crop prices
 */
router.get('/', async (req, res): Promise<void> => {
  try {
    const { crop, market } = req.query;
    
    // Mock price data
    const mockPrices = [
      { crop: 'Rice', market: 'Delhi', price: 2500, unit: 'quintal', date: new Date().toISOString() },
      { crop: 'Wheat', market: 'Mumbai', price: 2200, unit: 'quintal', date: new Date().toISOString() },
      { crop: 'Corn', market: 'Bangalore', price: 1800, unit: 'quintal', date: new Date().toISOString() },
      { crop: 'Tomato', market: 'Chennai', price: 3000, unit: 'quintal', date: new Date().toISOString() }
    ];
    
    let filteredPrices = mockPrices;
    
    if (crop) {
      filteredPrices = filteredPrices.filter(p => p.crop.toLowerCase().includes(crop.toString().toLowerCase()));
    }
    
    if (market) {
      filteredPrices = filteredPrices.filter(p => p.market.toLowerCase().includes(market.toString().toLowerCase()));
    }
    
    res.json({
      success: true,
      data: filteredPrices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/prices/trends:
 *   get:
 *     summary: Get price trends
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: crop
 *         required: true
 *         schema:
 *           type: string
 *         description: Crop name
 *     responses:
 *       200:
 *         description: Price trends
 */
router.get('/trends', async (req, res): Promise<void> => {
  try {
    const { crop } = req.query;
    
    if (!crop) {
      res.status(400).json({ success: false, message: 'Crop parameter is required' });
      return;
    }
    
    // Mock trend data
    const trends = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 2000 + Math.random() * 1000,
      volume: Math.floor(Math.random() * 1000) + 100
    }));
    
    res.json({
      success: true,
      data: {
        crop,
        trends,
        summary: {
          currentPrice: trends[trends.length - 1].price,
          change: trends[trends.length - 1].price - trends[trends.length - 2].price,
          changePercent: ((trends[trends.length - 1].price - trends[trends.length - 2].price) / trends[trends.length - 2].price * 100).toFixed(2)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
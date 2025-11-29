import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/labour/alerts:
 *   get:
 *     summary: Get labour alerts
 *     tags: [Labour]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: labourType
 *         schema:
 *           type: string
 *         description: Type of labour needed
 *     responses:
 *       200:
 *         description: Labour alerts
 */
router.get('/alerts', async (req, res): Promise<void> => {
  try {
    const { location, labourType } = req.query;
    
    // Mock labour alerts
    const mockAlerts = [
      {
        id: '1',
        title: 'Harvesting Help Needed',
        description: 'Need 10 workers for wheat harvesting',
        labourType: 'harvesting',
        workersNeeded: 10,
        payRate: 500,
        location: 'Punjab, India',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        contact: { name: 'Farmer Singh', phone: '+91-9876543210' }
      },
      {
        id: '2',
        title: 'Planting Season Workers',
        description: 'Looking for experienced workers for rice planting',
        labourType: 'planting',
        workersNeeded: 15,
        payRate: 400,
        location: 'Haryana, India',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        contact: { name: 'Ram Kumar', phone: '+91-9876543211' }
      }
    ];
    
    let filteredAlerts = mockAlerts;
    
    if (location) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.location.toLowerCase().includes(location.toString().toLowerCase())
      );
    }
    
    if (labourType) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.labourType.toLowerCase().includes(labourType.toString().toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: filteredAlerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/labour/alerts:
 *   post:
 *     summary: Create a labour alert
 *     tags: [Labour]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               labourType:
 *                 type: string
 *               workersNeeded:
 *                 type: number
 *               payRate:
 *                 type: number
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Labour alert created
 */
router.post('/alerts', auth, async (req, res): Promise<void> => {
  try {
    const { title, description, labourType, workersNeeded, payRate, location, startDate, endDate } = req.body;
    
    const newAlert = {
      id: Date.now().toString(),
      title,
      description,
      labourType,
      workersNeeded,
      payRate,
      location,
      startDate,
      endDate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
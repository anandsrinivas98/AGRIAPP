import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/calendar/tasks:
 *   get:
 *     summary: Get calendar tasks
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *     responses:
 *       200:
 *         description: Calendar tasks
 */
router.get('/tasks', auth, async (req, res): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock tasks
    const mockTasks = [
      {
        id: '1',
        title: 'Watering Schedule',
        description: 'Water the tomato plants',
        taskType: 'IRRIGATION',
        crop: 'Tomato',
        startDate: new Date().toISOString(),
        priority: 'HIGH',
        completed: false
      },
      {
        id: '2',
        title: 'Fertilizer Application',
        description: 'Apply NPK fertilizer to wheat field',
        taskType: 'FERTILIZATION',
        crop: 'Wheat',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        completed: false
      }
    ];
    
    res.json({
      success: true,
      data: mockTasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/calendar/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Calendar]
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
 *               taskType:
 *                 type: string
 *               crop:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/tasks', auth, async (req, res): Promise<void> => {
  try {
    const { title, description, taskType, crop, startDate, priority } = req.body;
    
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      taskType,
      crop,
      startDate,
      priority: priority || 'MEDIUM',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
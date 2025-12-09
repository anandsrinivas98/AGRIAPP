import express, { Response } from 'express';
import { body, query } from 'express-validator';
import labourSchedulingService from '../services/labourSchedulingService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AuthRequest } from '../types/auth';

const router = express.Router();

// Workers
router.post(
  '/workers',
  authenticate,
  [
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('phone').notEmpty().trim(),
    body('skills').isArray(),
    body('hourlyRate').isFloat({ min: 0 }),
    body('availability').isObject(),
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const worker = await labourSchedulingService.createWorker(req.user!.userId, req.body);
      res.json(worker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/workers', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const workers = await labourSchedulingService.getWorkers(req.user!.userId, req.query);
    res.json(workers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Tasks
router.post(
  '/tasks',
  authenticate,
  [
    body('title').notEmpty().trim(),
    body('taskType').notEmpty().trim(),
    body('location').notEmpty().trim(),
    body('requiredWorkers').isInt({ min: 1 }),
    body('estimatedHours').isFloat({ min: 0 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const task = await labourSchedulingService.createTask(req.user!.userId, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await labourSchedulingService.getTasks(req.user!.userId, req.query);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Shifts
router.post(
  '/shifts',
  authenticate,
  [
    body('workerId').notEmpty(),
    body('taskId').notEmpty(),
    body('date').isISO8601(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const shift = await labourSchedulingService.createShift(req.body);
      res.json(shift);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch('/shifts/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const shift = await labourSchedulingService.updateShiftStatus(
      req.params.id,
      req.body.status,
      req.body.actualTimes
    );
    res.json(shift);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Alerts
router.get('/alerts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await labourSchedulingService.getAlerts(req.user!.userId, req.query);
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/alerts/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const alert = await labourSchedulingService.markAlertRead(req.params.id);
    res.json(alert);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics
router.get('/analytics/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const dateRange = req.query.start && req.query.end
      ? { start: new Date(req.query.start as string), end: new Date(req.query.end as string) }
      : undefined;
    
    const analytics = await labourSchedulingService.getDashboardAnalytics(req.user!.userId, dateRange);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/recommendations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const recommendations = await labourSchedulingService.getOptimizationRecommendations(req.user!.userId);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

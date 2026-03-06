import { Router } from 'express';
import { PlanningController } from './controller';
import { auth } from '../../../middleware/auth';

const router = Router();
const planningController = new PlanningController();

// Apply authentication middleware to all planning routes
router.use(auth);

/**
 * @swagger
 * /api/v1/planning/calendar/tasks:
 *   get:
 *     summary: Get calendar tasks
 *     tags: [Planning]
 */
router.get('/calendar/tasks', planningController.getCalendarTasks);

/**
 * @swagger
 * /api/v1/planning/calendar/tasks:
 *   post:
 *     summary: Create calendar task
 *     tags: [Planning]
 */
router.post('/calendar/tasks', planningController.createCalendarTask);

/**
 * @swagger
 * /api/v1/planning/calendar/tasks/{id}:
 *   put:
 *     summary: Update calendar task
 *     tags: [Planning]
 */
router.put('/calendar/tasks/:id', planningController.updateCalendarTask);

/**
 * @swagger
 * /api/v1/planning/calendar/tasks/{id}:
 *   delete:
 *     summary: Delete calendar task
 *     tags: [Planning]
 */
router.delete('/calendar/tasks/:id', planningController.deleteCalendarTask);

/**
 * @swagger
 * /api/v1/planning/labour-scheduling:
 *   get:
 *     summary: Get labour scheduling data
 *     tags: [Planning]
 */
router.get('/labour-scheduling', planningController.getLabourScheduling);

export default router;
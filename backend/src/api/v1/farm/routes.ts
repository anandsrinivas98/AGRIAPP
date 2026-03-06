import { Router } from 'express';
import { FarmController } from './controller';
import { auth } from '../../../middleware/auth';

const router = Router();
const farmController = new FarmController();

// Apply authentication middleware to all farm routes
router.use(auth);

/**
 * @swagger
 * /api/v1/farm:
 *   get:
 *     summary: Get user's farms
 *     tags: [Farm Management]
 */
router.get('/', farmController.getFarms);

/**
 * @swagger
 * /api/v1/farm:
 *   post:
 *     summary: Create a new farm
 *     tags: [Farm Management]
 */
router.post('/', farmController.createFarm);

/**
 * @swagger
 * /api/v1/farm/{id}:
 *   get:
 *     summary: Get specific farm
 *     tags: [Farm Management]
 */
router.get('/:id', farmController.getFarm);

/**
 * @swagger
 * /api/v1/farm/{id}:
 *   put:
 *     summary: Update farm
 *     tags: [Farm Management]
 */
router.put('/:id', farmController.updateFarm);

/**
 * @swagger
 * /api/v1/farm/{id}:
 *   delete:
 *     summary: Delete farm
 *     tags: [Farm Management]
 */
router.delete('/:id', farmController.deleteFarm);

export default router;
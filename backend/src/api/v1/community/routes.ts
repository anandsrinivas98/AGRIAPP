import { Router } from 'express';
import { CommunityController } from './controller';
import { auth } from '../../../middleware/auth';

const router = Router();
const communityController = new CommunityController();

// Apply authentication middleware to all community routes
router.use(auth);

/**
 * @swagger
 * /api/v1/community/forum/posts:
 *   get:
 *     summary: Get forum posts
 *     tags: [Community]
 */
router.get('/forum/posts', communityController.getForumPosts);

/**
 * @swagger
 * /api/v1/community/forum/posts:
 *   post:
 *     summary: Create forum post
 *     tags: [Community]
 */
router.post('/forum/posts', communityController.createForumPost);

/**
 * @swagger
 * /api/v1/community/forum/posts/{id}/comments:
 *   get:
 *     summary: Get post comments
 *     tags: [Community]
 */
router.get('/forum/posts/:id/comments', communityController.getPostComments);

/**
 * @swagger
 * /api/v1/community/forum/posts/{id}/comments:
 *   post:
 *     summary: Add comment to post
 *     tags: [Community]
 */
router.post('/forum/posts/:id/comments', communityController.addComment);

/**
 * @swagger
 * /api/v1/community/chat:
 *   post:
 *     summary: Send chat message
 *     tags: [Community]
 */
router.post('/chat', communityController.sendChatMessage);

export default router;
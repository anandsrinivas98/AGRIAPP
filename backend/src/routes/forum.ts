import express, { Response } from 'express';
import { body, query } from 'express-validator';
import forumService from '../services/forumService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AuthRequest } from '../types/auth';

const router = express.Router();

// ==================== CATEGORIES ====================

router.get('/categories', async (req, res: Response) => {
  try {
    const categories = await forumService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== THREADS ====================

router.get('/threads', async (req, res: Response) => {
  try {
    const filters = {
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined
    };
    const threads = await forumService.getThreads(filters);
    res.json(threads);
  } catch (error: any) {
    console.error('Error getting threads:', error);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

router.get('/threads/:slug', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thread = await forumService.getThreadBySlug(
      req.params.slug,
      req.user?.userId
    );
    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }
    res.json(thread);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/threads',
  authenticate,
  [
    body('title').notEmpty().trim().isLength({ min: 10, max: 200 }),
    body('content').notEmpty().trim().isLength({ min: 20 }),
    body('categoryId').notEmpty(),
    body('tags').optional().isArray(),
    body('images').optional().isArray(),
    body('location').optional().trim()
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const thread = await forumService.createThread(req.user!.userId, req.body);
      res.status(201).json(thread);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  '/threads/:id',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const thread = await forumService.updateThread(
        req.params.id,
        req.user!.userId,
        req.body
      );
      res.json(thread);
    } catch (error: any) {
      res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
    }
  }
);

router.delete(
  '/threads/:id',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      await forumService.deleteThread(req.params.id, req.user!.userId);
      res.json({ message: 'Thread deleted successfully' });
    } catch (error: any) {
      res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
    }
  }
);

// ==================== REPLIES ====================

router.post(
  '/replies',
  authenticate,
  [
    body('threadId').notEmpty(),
    body('content').notEmpty().trim().isLength({ min: 10 }),
    body('parentId').optional(),
    body('images').optional().isArray()
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const reply = await forumService.createReply(req.user!.userId, req.body);
      res.status(201).json(reply);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  '/replies/:id/best-answer',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const reply = await forumService.markBestAnswer(
        req.params.id,
        req.user!.userId
      );
      res.json(reply);
    } catch (error: any) {
      res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
    }
  }
);

// ==================== LIKES ====================

router.post(
  '/likes',
  authenticate,
  [
    body('threadId').optional(),
    body('replyId').optional()
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await forumService.toggleLike(req.user!.userId, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ==================== MARKETPLACE ====================

router.get('/marketplace', async (req, res: Response) => {
  try {
    const filters = {
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined
    };
    const listings = await forumService.getMarketplaceListings(filters);
    res.json(listings);
  } catch (error: any) {
    console.error('Error getting marketplace:', error);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

router.post(
  '/marketplace',
  authenticate,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('category').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('location').notEmpty().trim(),
    body('images').optional().isArray(),
    body('contactPhone').optional().trim()
  ],
  validate,
  async (req: AuthRequest, res: Response) => {
    try {
      const listing = await forumService.createMarketplaceListing(
        req.user!.userId,
        req.body
      );
      res.status(201).json(listing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  '/marketplace/:id',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const listing = await forumService.updateMarketplaceListing(
        req.params.id,
        req.user!.userId,
        req.body
      );
      res.json(listing);
    } catch (error: any) {
      res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
    }
  }
);

// ==================== KNOWLEDGE ARTICLES ====================

router.get('/knowledge', async (req, res: Response) => {
  try {
    const filters = {
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };
    const articles = await forumService.getKnowledgeArticles(filters);
    res.json(articles);
  } catch (error: any) {
    console.error('Error getting knowledge articles:', error);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

router.get('/knowledge/:slug', async (req, res: Response): Promise<void> => {
  try {
    const article = await forumService.getArticleBySlug(req.params.slug);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXPERT SESSIONS ====================

router.get('/expert-sessions', async (req, res: Response) => {
  try {
    const filters = {
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };
    const sessions = await forumService.getExpertSessions(filters);
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/expert-sessions/:id/register',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const registration = await forumService.registerForSession(
        req.params.id,
        req.user!.userId
      );
      res.status(201).json(registration);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ==================== REPUTATION ====================

router.get('/reputation/:userId', async (req, res: Response) => {
  try {
    const reputation = await forumService.getUserReputation(req.params.userId);
    res.json(reputation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATS ====================

router.get('/stats', async (req, res: Response) => {
  try {
    const stats = await forumService.getForumStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

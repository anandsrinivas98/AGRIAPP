import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/forum/posts:
 *   get:
 *     summary: Get forum posts
 *     tags: [Forum]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Post category
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Forum posts
 */
router.get('/posts', async (req, res): Promise<void> => {
  try {
    const { category, page = 1 } = req.query;
    
    // Mock forum posts
    const mockPosts = [
      {
        id: '1',
        title: 'Best practices for organic farming',
        content: 'I would like to share some tips for organic farming...',
        category: 'Organic Farming',
        tags: ['organic', 'sustainable', 'tips'],
        author: { firstName: 'John', lastName: 'Farmer' },
        likes: 15,
        views: 120,
        createdAt: new Date().toISOString(),
        commentsCount: 5
      },
      {
        id: '2',
        title: 'Dealing with pest control in monsoon',
        content: 'During monsoon season, pest control becomes challenging...',
        category: 'Pest Control',
        tags: ['pest', 'monsoon', 'control'],
        author: { firstName: 'Sarah', lastName: 'Green' },
        likes: 8,
        views: 85,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        commentsCount: 3
      }
    ];
    
    let filteredPosts = mockPosts;
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase().includes(category.toString().toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: {
        posts: filteredPosts,
        pagination: {
          page: parseInt(page as string),
          totalPages: 1,
          totalPosts: filteredPosts.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/forum/posts:
 *   post:
 *     summary: Create a new forum post
 *     tags: [Forum]
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
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/posts', auth, async (req, res): Promise<void> => {
  try {
    const { title, content, category, tags } = req.body;
    
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags: tags || [],
      author: { firstName: 'User', lastName: 'Name' },
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      commentsCount: 0
    };
    
    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
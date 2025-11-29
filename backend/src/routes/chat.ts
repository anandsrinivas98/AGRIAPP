import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Send a chat message to AI assistant
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               language:
 *                 type: string
 *                 default: en
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 */
router.post('/message', auth, async (req, res): Promise<void> => {
  try {
    const { message, language = 'en', sessionId } = req.body;
    
    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }
    
    // Mock AI responses based on keywords
    let response = "I'm here to help you with your farming questions. Could you please provide more details?";
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('recommend')) {
      response = "For crop recommendations, I need information about your soil conditions, climate, and farming goals. What type of soil do you have and what's your location?";
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('pest')) {
      response = "I can help identify plant diseases and pests. Please describe the symptoms you're seeing or upload an image of the affected plant.";
    } else if (lowerMessage.includes('weather')) {
      response = "I can provide weather information and farming advice based on weather conditions. What's your location and what specific weather information do you need?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      response = "I can help you with current market prices and trends. Which crops are you interested in and which markets?";
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      response = "For fertilizer recommendations, I need to know your crop type, soil test results, and growth stage. What crop are you growing?";
    }
    
    const chatResponse = {
      id: Date.now().toString(),
      message,
      response,
      language,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: chatResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Chat history
 */
router.get('/history', auth, async (req, res): Promise<void> => {
  try {
    const { sessionId } = req.query;
    
    // Mock chat history
    const mockHistory = [
      {
        id: '1',
        message: 'What crops should I plant this season?',
        response: 'Based on your location and soil conditions, I recommend considering rice, wheat, or corn. Could you provide more details about your farm?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        message: 'My tomato plants have yellow leaves',
        response: 'Yellow leaves on tomato plants could indicate several issues like overwatering, nutrient deficiency, or disease. Can you describe the pattern of yellowing?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: {
        sessionId: sessionId || 'default_session',
        history: mockHistory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { geminiService } from '../services/geminiService';
import { vectorService } from '../services/vectorService';
import { chatHistoryService } from '../services/chatHistoryService';

// Extend Express Request type to include user (matches AuthRequest)
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role?: string;
    };
  }
}

const router = Router();

// Initialize vector service
vectorService.initialize().catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

/**
 * Agricultural Knowledge Base for RAG
 * In production, this would be a vector database with embeddings
 */
const agriculturalKnowledge = {
  crops: {
    wheat: {
      soilRequirements: 'Well-drained loamy soil with pH 6.0-7.5',
      climate: 'Cool season crop, optimal temperature 15-25°C',
      waterNeeds: 'Moderate, 450-650mm rainfall',
      diseases: ['Rust', 'Smut', 'Leaf blight'],
      pests: ['Aphids', 'Armyworms', 'Stem borers']
    },
    rice: {
      soilRequirements: 'Clay or clay loam soil with pH 5.5-6.5',
      climate: 'Warm humid climate, 20-35°C',
      waterNeeds: 'High, requires flooding or consistent moisture',
      diseases: ['Blast', 'Bacterial blight', 'Sheath blight'],
      pests: ['Stem borers', 'Leaf folders', 'Brown plant hopper']
    },
    corn: {
      soilRequirements: 'Well-drained fertile soil with pH 5.8-7.0',
      climate: 'Warm season crop, 18-32°C',
      waterNeeds: 'Moderate to high, 500-800mm',
      diseases: ['Corn smut', 'Leaf blight', 'Rust'],
      pests: ['Corn borers', 'Armyworms', 'Rootworms']
    }
  },
  diseases: {
    'leaf blight': {
      symptoms: 'Brown spots on leaves, yellowing, wilting',
      causes: 'Fungal infection, high humidity, poor air circulation',
      treatment: 'Remove infected leaves, apply fungicide, improve drainage',
      prevention: 'Crop rotation, resistant varieties, proper spacing'
    },
    'powdery mildew': {
      symptoms: 'White powdery coating on leaves and stems',
      causes: 'Fungal infection, warm days and cool nights',
      treatment: 'Sulfur-based fungicides, neem oil spray',
      prevention: 'Good air circulation, avoid overhead watering'
    },
    'root rot': {
      symptoms: 'Wilting, yellowing, stunted growth, dark roots',
      causes: 'Overwatering, poor drainage, soil-borne pathogens',
      treatment: 'Improve drainage, reduce watering, apply fungicide',
      prevention: 'Well-draining soil, proper irrigation management'
    }
  },
  soil: {
    nitrogen: {
      role: 'Promotes leaf growth and green color',
      deficiency: 'Yellowing of older leaves, stunted growth',
      excess: 'Excessive vegetative growth, delayed maturity',
      sources: 'Urea, ammonium nitrate, compost, legumes'
    },
    phosphorus: {
      role: 'Root development, flowering, fruiting',
      deficiency: 'Purple leaves, poor root growth, delayed maturity',
      excess: 'Reduced micronutrient availability',
      sources: 'Rock phosphate, bone meal, superphosphate'
    },
    potassium: {
      role: 'Disease resistance, water regulation, fruit quality',
      deficiency: 'Brown leaf edges, weak stems, poor fruit',
      excess: 'Reduced calcium and magnesium uptake',
      sources: 'Potash, wood ash, kelp meal'
    }
  },
  pests: {
    aphids: {
      identification: 'Small soft-bodied insects, green or black',
      damage: 'Suck plant sap, transmit viruses, honeydew secretion',
      control: 'Neem oil, insecticidal soap, ladybugs, lacewings',
      prevention: 'Companion planting, reflective mulches'
    },
    'stem borers': {
      identification: 'Larvae bore into stems, causing dead hearts',
      damage: 'Wilting, stem breakage, reduced yield',
      control: 'Remove and destroy infested plants, pheromone traps',
      prevention: 'Early planting, resistant varieties, crop rotation'
    }
  },
  weather: {
    irrigation: {
      hot_dry: 'Increase irrigation frequency, mulch to retain moisture',
      rainy: 'Reduce irrigation, ensure proper drainage',
      cold: 'Reduce watering, protect sensitive crops',
      windy: 'Avoid spraying, stake tall plants'
    },
    planting: {
      spring: 'Cool season crops: lettuce, peas, spinach',
      summer: 'Warm season crops: tomatoes, peppers, corn',
      fall: 'Cool season crops: broccoli, cabbage, carrots',
      winter: 'Protected cultivation, winter wheat, cover crops'
    }
  }
};

/**
 * Enhanced RAG Function: Retrieve relevant knowledge with fuzzy matching
 */
function retrieveRelevantKnowledge(query: string): string {
  const lowerQuery = query.toLowerCase();
  let relevantInfo: string[] = [];
  let matchScore = 0;

  // Fuzzy matching for common misspellings and variations
  const normalizeQuery = (q: string) => {
    return q
      .replace(/tomatos?/gi, 'tomato')
      .replace(/wheats?/gi, 'wheat')
      .replace(/rices?/gi, 'rice')
      .replace(/corns?/gi, 'corn')
      .replace(/yellowing|yellow|yello/gi, 'yellow')
      .replace(/dieing|dying/gi, 'dying')
      .replace(/fertiliser/gi, 'fertilizer')
      .replace(/watering|waters/gi, 'water');
  };

  const normalizedQuery = normalizeQuery(lowerQuery);

  // Search crops with fuzzy matching
  Object.entries(agriculturalKnowledge.crops).forEach(([crop, info]) => {
    if (normalizedQuery.includes(crop) || lowerQuery.includes(crop.substring(0, 3))) {
      matchScore++;
      relevantInfo.push(`\n🌾 **${crop.charAt(0).toUpperCase() + crop.slice(1)} Growing Guide:**`);
      relevantInfo.push(`• Best soil: ${info.soilRequirements}`);
      relevantInfo.push(`• Climate needs: ${info.climate}`);
      relevantInfo.push(`• Water requirements: ${info.waterNeeds}`);
      relevantInfo.push(`• Watch out for: ${info.diseases.slice(0, 2).join(', ')}`);
      relevantInfo.push(`• Common pests: ${info.pests.slice(0, 2).join(', ')}`);
    }
  });

  // Search diseases with symptom matching
  Object.entries(agriculturalKnowledge.diseases).forEach(([disease, info]) => {
    const diseaseWords = disease.split(' ');
    const hasMatch = diseaseWords.some(word => normalizedQuery.includes(word)) ||
                     normalizedQuery.includes(disease);
    
    if (hasMatch) {
      matchScore++;
      relevantInfo.push(`\n🔬 **${disease.charAt(0).toUpperCase() + disease.slice(1)}:**`);
      relevantInfo.push(`• What to look for: ${info.symptoms}`);
      relevantInfo.push(`• Why it happens: ${info.causes}`);
      relevantInfo.push(`• How to treat: ${info.treatment}`);
      relevantInfo.push(`• Prevention tips: ${info.prevention}`);
    }
  });

  // Search soil nutrients with variations
  const nutrientKeywords = ['nitrogen', 'n', 'npk', 'urea', 'fertilizer', 'nutrient'];
  if (nutrientKeywords.some(k => normalizedQuery.includes(k))) {
    matchScore++;
    const n = agriculturalKnowledge.soil.nitrogen;
    relevantInfo.push(`\n🌱 **Nitrogen (N) - For Leaf Growth:**`);
    relevantInfo.push(`• What it does: ${n.role}`);
    relevantInfo.push(`• Signs of shortage: ${n.deficiency}`);
    relevantInfo.push(`• Where to get it: ${n.sources}`);
  }

  const phosphorusKeywords = ['phosphorus', 'p', 'npk', 'root', 'flower'];
  if (phosphorusKeywords.some(k => normalizedQuery.includes(k))) {
    matchScore++;
    const p = agriculturalKnowledge.soil.phosphorus;
    relevantInfo.push(`\n🌱 **Phosphorus (P) - For Roots & Flowers:**`);
    relevantInfo.push(`• What it does: ${p.role}`);
    relevantInfo.push(`• Signs of shortage: ${p.deficiency}`);
    relevantInfo.push(`• Where to get it: ${p.sources}`);
  }

  const potassiumKeywords = ['potassium', 'k', 'npk', 'fruit', 'quality'];
  if (potassiumKeywords.some(k => normalizedQuery.includes(k))) {
    matchScore++;
    const k = agriculturalKnowledge.soil.potassium;
    relevantInfo.push(`\n🌱 **Potassium (K) - For Strong Plants:**`);
    relevantInfo.push(`• What it does: ${k.role}`);
    relevantInfo.push(`• Signs of shortage: ${k.deficiency}`);
    relevantInfo.push(`• Where to get it: ${k.sources}`);
  }

  // Search pests with fuzzy matching
  Object.entries(agriculturalKnowledge.pests).forEach(([pest, info]) => {
    const pestWords = pest.split(' ');
    const hasMatch = pestWords.some(word => normalizedQuery.includes(word)) ||
                     normalizedQuery.includes('bug') || 
                     normalizedQuery.includes('insect') ||
                     normalizedQuery.includes('eating');
    
    if (hasMatch) {
      matchScore++;
      relevantInfo.push(`\n🐛 **${pest.charAt(0).toUpperCase() + pest.slice(1)}:**`);
      relevantInfo.push(`• How to spot them: ${info.identification}`);
      relevantInfo.push(`• What they do: ${info.damage}`);
      relevantInfo.push(`• How to control: ${info.control}`);
      relevantInfo.push(`• Prevention: ${info.prevention}`);
    }
  });

  // If no specific match, provide general guidance based on keywords
  if (matchScore === 0) {
    if (normalizedQuery.includes('water') || normalizedQuery.includes('irrigation')) {
      relevantInfo.push(`\n💧 **Watering Tips:**`);
      relevantInfo.push(`• Water early morning or evening to reduce evaporation`);
      relevantInfo.push(`• Water deeply but less frequently for strong roots`);
      relevantInfo.push(`• Check soil moisture before watering - stick finger 2 inches deep`);
      relevantInfo.push(`• Use drip irrigation to save water and prevent disease`);
    }
    
    if (normalizedQuery.includes('organic') || normalizedQuery.includes('natural')) {
      relevantInfo.push(`\n🌿 **Organic Farming Tips:**`);
      relevantInfo.push(`• Use compost and cow dung for natural fertilizer`);
      relevantInfo.push(`• Neem oil spray for pest control`);
      relevantInfo.push(`• Crop rotation prevents soil depletion`);
      relevantInfo.push(`• Companion planting (marigolds repel pests)`);
    }
  }

  return relevantInfo.length > 0 
    ? `\n\n📚 **Knowledge Base:**\n${relevantInfo.join('\n')}`
    : '';
}

/**
 * Analyze user intent for smart response routing
 */
function analyzeUserIntent(message: string): {
  type: 'greeting' | 'vague' | 'farming_query' | 'general';
  hasUploadedContent: boolean;
  needsDetailedResponse: boolean;
} {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for greetings
  const greetings = ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'good morning', 'good evening'];
  if (greetings.some(g => lowerMessage === g || lowerMessage.startsWith(g + ' '))) {
    return { type: 'greeting', hasUploadedContent: false, needsDetailedResponse: false };
  }
  
  // Check for vague queries
  if (lowerMessage.length < 5 || ['tell me', 'help', 'help me', 'what', 'how'].includes(lowerMessage)) {
    return { type: 'vague', hasUploadedContent: false, needsDetailedResponse: false };
  }
  
  // Check for farming-related content
  const farmingKeywords = [
    'crop', 'plant', 'grow', 'farm', 'cultivation', 'seed', 'soil', 'fertilizer', 'pest', 'disease',
    'irrigation', 'harvest', 'yield', 'wheat', 'rice', 'corn', 'tomato', 'potato', 'onion', 'banana',
    'mango', 'cotton', 'sugarcane', 'vegetable', 'fruit', 'organic', 'npk', 'urea', 'compost'
  ];
  
  const isFarmingQuery = farmingKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check if detailed response is needed (cultivation guides, step-by-step processes)
  const detailKeywords = ['how to', 'steps', 'guide', 'cultivation', 'farming', 'complete', 'detailed'];
  const needsDetailedResponse = detailKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isFarmingQuery) {
    return { type: 'farming_query', hasUploadedContent: false, needsDetailedResponse };
  }
  
  return { type: 'general', hasUploadedContent: false, needsDetailedResponse: false };
}

/**
 * Generate AI response using Gemini API
 * RAG is ONLY used when image or file is uploaded
 */
async function generateAIResponse(
  message: string,
  conversationHistory: any[],
  ragContext: string,
  imageAnalysis?: string,
  fileContent?: string
): Promise<string> {
  try {
    // Analyze user intent
    const intent = analyzeUserIntent(message);
    
    // Check if Gemini is configured
    if (!geminiService.isConfigured()) {
      console.warn('⚠️ Gemini API key not configured, using fallback responses');
      return generateFallbackResponse(message, intent);
    }

    // Build context - RAG ONLY for uploaded content
    let contextForGemini = '';
    let hasUploadedContent = false;
    
    if (imageAnalysis) {
      contextForGemini += `\n\n🖼️ IMAGE ANALYSIS RESULTS:\n${imageAnalysis}`;
      hasUploadedContent = true;
    }
    
    if (fileContent) {
      contextForGemini += `\n\n📄 DOCUMENT CONTENT:\n${fileContent}`;
      hasUploadedContent = true;
    }
    
    // Add RAG context only for uploaded content
    if (hasUploadedContent && ragContext) {
      contextForGemini += `\n\n📚 RELEVANT AGRICULTURAL KNOWLEDGE:\n${ragContext}`;
    }

    // For normal text queries, use NO external context - pure Gemini intelligence
    if (!hasUploadedContent) {
      contextForGemini = '';
    }

    // Convert conversation history for context (last 6 messages)
    const chatHistory = conversationHistory.slice(-6).map((msg: any) => ({
      role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: String(msg.content)
    }));

    // Generate response using Gemini
    const response = await geminiService.generateResponse(
      message,
      contextForGemini,
      chatHistory,
      intent
    );

    return response;
  } catch (error: any) {
    console.error('AI generation error:', error);
    
    // Fallback to intelligent response
    const intent = analyzeUserIntent(message);
    return generateFallbackResponse(message, intent);
  }
}

/**
 * Fallback response when Gemini is unavailable
 */
function generateFallbackResponse(
  message: string,
  intent: { type: string; hasUploadedContent: boolean; needsDetailedResponse: boolean }
): string {
  const lowerMessage = message.toLowerCase();
  
  // Handle greetings
  if (intent.type === 'greeting') {
    return `Hello! 👋 I'm your AI farming assistant powered by advanced AI.\n\nI can help you with:\n🌾 Complete crop cultivation guides\n🔬 Disease and pest identification\n🌱 Soil health and fertilizer advice\n💧 Irrigation and water management\n📊 Yield estimation and cost planning\n\nWhat farming question do you have today?`;
  }
  
  // Handle vague queries
  if (intent.type === 'vague') {
    return `I'm ready to help with your farming needs! 🚜\n\nI can provide:\n• Step-by-step crop cultivation guides\n• Solutions for plant diseases and pests\n• Fertilizer schedules and soil management\n• Irrigation timing and techniques\n• Cost estimation and yield planning\n• Organic farming methods\n\nWhat specific farming topic would you like to discuss?`;
  }
  
  // Handle farming queries with specific crop detection
  if (intent.type === 'farming_query') {
    // Try to detect crop from message
    const crops = ['wheat', 'rice', 'corn', 'tomato', 'potato', 'onion', 'banana', 'mango', 'cotton', 'sugarcane'];
    const detectedCrop = crops.find(crop => lowerMessage.includes(crop));
    
    if (detectedCrop && intent.needsDetailedResponse) {
      return `I can provide a complete ${detectedCrop} cultivation guide! 🌾\n\n**What I'll cover:**\n• Land preparation and soil requirements\n• Seed selection and sowing methods\n• Complete fertilizer schedule with quantities\n• Irrigation timing and water management\n• Pest and disease prevention\n• Harvesting guidelines and yield estimation\n• Cost breakdown and profit analysis\n\nFor the most accurate advice, please tell me:\n• Your farm size (in acres)\n• Your location or state\n• Your experience level\n\nShall I provide the complete ${detectedCrop} farming guide?`;
    }
    
    if (detectedCrop) {
      return `I can help you with ${detectedCrop} farming! 🌱\n\nI can provide specific guidance on:\n• Growing techniques and best practices\n• Problem diagnosis and solutions\n• Fertilizer recommendations\n• Pest and disease management\n• Harvesting and post-harvest care\n\nWhat specific aspect of ${detectedCrop} farming do you need help with?`;
    }
    
    // General farming query
    return `I'm here to help with your farming question! 🚜\n\nI can provide detailed guidance on:\n• Any crop cultivation from A to Z\n• Disease and pest problem solving\n• Soil testing and fertilizer planning\n• Irrigation scheduling and water management\n• Organic farming techniques\n• Cost estimation and profit planning\n\nWhat specific farming challenge can I help you solve?`;
  }
  
  // General response
  return `I'm your AI farming assistant! 🌾\n\nI can help you with comprehensive farming guidance including crop cultivation, problem solving, and agricultural planning.\n\nWhat farming question do you have for me?`;
}

/**
 * Analyze uploaded image using Gemini Vision
 */
async function analyzeImage(imagePath: string, imageId: string): Promise<string> {
  try {
    if (!geminiService.isConfigured()) {
      return 'Image received. Please describe what you see or any concerns about the plant for better assistance.';
    }

    // Analyze image with Gemini Vision
    const analysis = await geminiService.analyzeImage(imagePath);
    
    // Store image vector in database
    await vectorService.storeImageVector(
      imageId,
      analysis,
      imagePath
    );

    return analysis;
  } catch (error) {
    console.error('Image analysis error:', error);
    return 'Image received. Based on visual inspection, this appears to be a plant/crop image. Please describe any specific concerns.';
  }
}

/**
 * Extract text from file using Gemini
 */
async function extractFileContent(filePath: string, fileType: string, fileId: string, filename: string): Promise<string> {
  try {
    if (!geminiService.isConfigured()) {
      // Basic file reading fallback
      const content = fs.readFileSync(filePath, 'utf-8').substring(0, 1000);
      return `File content preview: ${content}`;
    }

    // Extract and analyze file content with Gemini
    const extractedContent = await geminiService.extractTextFromFile(filePath, fileType);
    
    // Store file vector in database
    await vectorService.storeFileVector(
      fileId,
      extractedContent,
      filename
    );

    return extractedContent;
  } catch (error) {
    console.error('File extraction error:', error);
    return 'File received. Please describe what information you need from this document.';
  }
}

/**
 * @swagger
 * /api/chatbot:
 *   post:
 *     summary: Send message to AI chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               conversationHistory:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: AI response generated successfully
 */
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res): Promise<void> => {
  try {
    const { message, conversationHistory, sessionId, userId } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    // Generate session ID if not provided
    const chatSessionId = sessionId || `session_${userId || 'guest'}_${Date.now()}`;
    const chatUserId = userId || req.user?.userId || 'guest';

    // Get compressed conversation history from database
    let history = [];
    try {
      if (sessionId) {
        // Load from database (compressed format)
        history = await chatHistoryService.getContextHistory(sessionId, chatUserId);
      } else if (conversationHistory) {
        // Fallback to client-provided history
        history = JSON.parse(conversationHistory);
      }
    } catch (e) {
      history = [];
    }

    // Save user message to history (will be compressed automatically)
    await chatHistoryService.saveMessage(chatSessionId, chatUserId, message, 'user');

    // RAG is ONLY used for image/file uploads
    let ragContext = '';
    
    // Only fetch RAG context if image or file is uploaded
    if (files?.image || files?.file) {
      const vectorContext = await vectorService.getRelevantContext(message);
      const traditionalContext = retrieveRelevantKnowledge(message);
      ragContext = vectorContext || traditionalContext;
    }

    // Analyze image if provided
    let imageAnalysis = '';
    if (files?.image && files.image[0]) {
      const imageId = `img_${Date.now()}`;
      imageAnalysis = await analyzeImage(files.image[0].path, imageId);
      // Clean up uploaded file
      fs.unlinkSync(files.image[0].path);
    }

    // Extract file content if provided
    let fileContent = '';
    if (files?.file && files.file[0]) {
      const fileId = `file_${Date.now()}`;
      fileContent = await extractFileContent(
        files.file[0].path, 
        files.file[0].mimetype,
        fileId,
        files.file[0].originalname
      );
      // Clean up uploaded file
      fs.unlinkSync(files.file[0].path);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(
      message,
      history,
      ragContext,
      imageAnalysis,
      fileContent
    );

    // Save AI response to history (will be compressed automatically)
    await chatHistoryService.saveMessage(chatSessionId, chatUserId, aiResponse, 'assistant');

    res.json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: chatSessionId,
        timestamp: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          month: 'short',
          day: 'numeric'
        })
      }
    });
  } catch (error: any) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      error: error.message
    });
  }
});

/**
 * Get chat history for a session
 * GET /api/chatbot/history/:sessionId
 */
router.get('/history/:sessionId', async (req, res): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.userId || 'guest';

    const history = await chatHistoryService.getReadableHistory(sessionId, userId);

    res.json({
      success: true,
      data: {
        sessionId,
        history,
        count: history.length
      }
    });
  } catch (error: any) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: error.message
    });
  }
});

/**
 * Get all chat sessions for a user
 * GET /api/chatbot/sessions
 */
router.get('/sessions', async (req, res): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest';

    const sessions = await chatHistoryService.getUserSessions(userId);

    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length
      }
    });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
      error: error.message
    });
  }
});

/**
 * Clear chat history for a session
 * DELETE /api/chatbot/history/:sessionId
 */
router.delete('/history/:sessionId', async (req, res): Promise<void> => {
  try {
    const { sessionId } = req.params;

    await chatHistoryService.clearHistory(sessionId);

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error: any) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: error.message
    });
  }
});

export default router;

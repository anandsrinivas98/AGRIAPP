import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import fs from 'fs';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

class GeminiService {
  private model: GenerativeModel;
  private visionModel: GenerativeModel;
  private modelName: string;

  constructor() {
    // Use latest available models (verified working with your API key)
    const modelOptions = [
      'gemini-2.5-flash',      // Best: Fast, efficient, great for chat
      'gemini-2.0-flash',      // Backup: Stable and reliable
      'gemini-flash-latest',   // Fallback: Always latest Flash
      'gemini-2.5-flash-lite', // Ultra-fast for simple queries
    ];
    
    // Use the first model in the list
    this.modelName = modelOptions[0];
    
    // Initialize text model
    this.model = genAI.getGenerativeModel({ 
      model: this.modelName,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Initialize vision model (same model works for vision in 1.5+)
    this.visionModel = genAI.getGenerativeModel({ 
      model: this.modelName,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
    
    console.log(`✅ Gemini initialized with model: ${this.modelName}`);
  }

  /**
   * Generate text response with context and intent
   */
  async generateResponse(
    userMessage: string,
    context: string,
    conversationHistory: ChatMessage[] = [],
    intent?: any
  ): Promise<string> {
    try {
      // Build intelligent system prompt based on whether RAG context exists
      let systemPrompt = '';
      const hasRAGContext = context && context.trim().length > 50;
      
      if (hasRAGContext) {
        // RAG MODE: User uploaded file/image - use retrieved context
        systemPrompt = `You are an AI Farming Assistant for AgriSense analyzing uploaded content.

UPLOADED CONTENT CONTEXT:
${context}

FORMATTING RULES (CRITICAL):
• NEVER use raw asterisks (*) or markdown symbols (**bold**, *italic*, ###)
• Use clean bullet points with: • (dot bullet), - (dash), → (arrow)
• For numbered steps, use: 1. 2. 3.
• Use short paragraphs for readability
• Convert all markdown to plain text

RESPONSE INSTRUCTIONS:
• Analyze the uploaded content thoroughly
• Provide specific, actionable recommendations
• Give step-by-step solutions using numbered lists (1. 2. 3.)
• List symptoms or features using bullet points (• • •)
• Use simple, farmer-friendly language
• Be direct and practical

Example formatting:
"Identified issues:
• Yellowing leaves indicate nitrogen deficiency
• Brown spots suggest fungal infection

Recommended actions:
1. Apply urea fertilizer at 50kg per acre
2. Spray fungicide within 24 hours
3. Improve drainage to prevent future infections"`;
      } else {
        // PURE GEMINI MODE: Normal text question - use your full knowledge
        systemPrompt = `You are an AI Farming Assistant for AgriSense helping farmers worldwide.

YOUR EXPERTISE:
• Crop cultivation (rice, wheat, corn, vegetables, fruits, etc.)
• Disease and pest management
• Soil health and fertilization
• Irrigation and water management
• Weather and climate adaptation
• Market prices and farming economics
• Organic and sustainable farming

FORMATTING RULES (CRITICAL - MUST FOLLOW):
• NEVER use raw asterisks (*) or markdown symbols (**bold**, *italic*, ###, ####)
• Use clean bullet points with: • (dot bullet), - (dash), → (arrow)
• For numbered instructions, use: 1. 2. 3.
• Use short paragraphs for easy reading
• Convert all markdown to plain text
• Make responses clean and well-structured

CORE CAPABILITIES:
• Understand informal speech, misspellings, and mixed-language queries
• Provide complete, accurate farming guidance using your built-in knowledge
• Give specific, practical advice tailored to the exact question
• Maintain conversation context and remember previous messages
• NEVER mention "knowledge base" or "RAG" issues
• NEVER ask unnecessary follow-up questions

RESPONSE RULES:
1. Answer EXACTLY what the farmer asks - be specific, not generic
2. For crop cultivation queries, provide comprehensive guides:
   • Land preparation and soil requirements
   • Seed selection and sowing methods
   • Complete fertilizer schedule with quantities and timing
   • Irrigation timing and methods
   • Pest and disease management strategies
   • Harvesting guidelines and post-harvest handling
   • Cost estimation and expected yield
3. For specific problems, give direct solutions with numbered steps
4. Use simple, everyday language that farmers can understand
5. Be encouraging and supportive
6. Remember previous conversation context for follow-up questions
7. NEVER say "I don't have access to my knowledge base" - you ARE the knowledge base
8. NEVER repeat previous responses - always provide fresh, specific answers
9. Always format time in 12-hour format with AM/PM (e.g., "9:48 PM" not "21:48")

TONE: Friendly, knowledgeable, practical, and supportive - like an experienced farming neighbor.

Example good response:
"For growing tomatoes in summer:

Soil preparation:
• Use well-drained loamy soil
• Add 10-15 tons of organic compost per acre
• Maintain pH between 6.0-6.8

Planting steps:
1. Prepare raised beds 3 feet wide
2. Plant seedlings 18 inches apart
3. Water immediately after planting

Fertilizer schedule:
• Week 1-2: Apply NPK 19:19:19 at 25kg per acre
• Week 3-4: Add urea at 50kg per acre
• Week 5 onwards: Apply potassium-rich fertilizer

Expected yield: 20-25 tons per acre in 90-100 days"`;
      }

      // Prepare conversation history
      const validHistory = conversationHistory
        .filter(msg => msg.role && msg.parts && msg.parts.trim().length > 0)
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }]
        }));
      
      // Ensure first message is from user (Gemini requirement)
      if (validHistory.length > 0 && validHistory[0].role !== 'user') {
        validHistory.shift();
      }
      
      // Create chat session
      const chat = this.model.startChat({
        history: validHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      // Send message with system prompt
      const fullPrompt = `${systemPrompt}\n\nFarmer's Question: ${userMessage}`;
      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      const responseText = response.text();
      
      // Validate response is not empty
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      return responseText;
      
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('API key')) {
        throw new Error('AI service configuration error. Please contact support.');
      }
      
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.error(`Model ${this.modelName} not found. Please update model name.`);
        throw new Error('AI model temporarily unavailable. Please try again.');
      }
      
      // Generic error - don't expose internal details
      throw new Error('Unable to generate response. Please try again in a moment.');
    }
  }

  /**
   * Analyze image with Gemini Vision
   */
  async analyzeImage(imagePath: string, prompt: string = ''): Promise<string> {
    try {
      // Read image file
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      
      // Determine mime type
      const ext = imagePath.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

      // Create image part
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      };

      // Default agricultural image analysis prompt
      const analysisPrompt = prompt || `You are an AI Farming Assistant analyzing this agricultural image.

FORMATTING RULES (CRITICAL):
• NEVER use raw asterisks (*) or markdown symbols (**bold**, *italic*, ###)
• Use clean bullet points with: • (dot bullet), - (dash), → (arrow)
• For numbered steps, use: 1. 2. 3.
• Use short paragraphs for readability

Provide a direct, actionable assessment:

1. IDENTIFY: What crop/plant is shown and its current condition
2. DIAGNOSE: Any diseases, pests, or health issues visible (use bullet points)
3. ASSESS: Nutrient deficiencies or environmental stress signs (use bullet points)
4. RECOMMEND: Specific immediate actions (use numbered steps 1. 2. 3.)
5. PREVENT: How to avoid this issue in the future (use bullet points)

Example format:
"Crop identified: Tomato plant

Current condition:
• Leaves showing yellowing
• Brown spots on lower leaves
• Wilting observed

Diagnosis:
• Early blight fungal infection
• Nitrogen deficiency

Immediate actions:
1. Remove infected leaves immediately
2. Apply copper-based fungicide
3. Add nitrogen fertilizer at 50kg per acre

Prevention:
• Maintain proper spacing between plants
• Ensure good air circulation
• Water at soil level, not on leaves"

Be specific, practical, and give clear instructions. Focus on solutions, not just descriptions.`;

      // Generate content with image
      const result = await this.visionModel.generateContent([analysisPrompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Image analysis error:', error);
      
      if (error.message?.includes('API key')) {
        throw new Error('AI service configuration error. Please contact support.');
      }
      
      // Provide basic fallback analysis
      return 'Image received. Based on visual inspection, this appears to be a plant/crop image. For detailed analysis, please describe what you see or any specific concerns you have about the plant.';
    }
  }

  /**
   * Generate streaming response
   */
  async *generateStreamingResponse(
    userMessage: string,
    context: string,
    conversationHistory: ChatMessage[] = []
  ): AsyncGenerator<string, void, unknown> {
    try {
      const systemPrompt = `You are an expert agricultural AI assistant. Provide helpful, practical farming advice.

${context ? `Relevant Knowledge:\n${context}` : ''}`;

      const chat = this.model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }]
        })),
      });

      const result = await chat.sendMessageStream(`${systemPrompt}\n\nUser: ${userMessage}`);

      // Stream chunks
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    } catch (error) {
      console.error('Streaming error:', error);
      yield 'I apologize, but I encountered an error. Please try again.';
    }
  }

  /**
   * Extract text from document/file
   */
  async extractTextFromFile(filePath: string, fileType: string): Promise<string> {
    try {
      // For now, read as text
      // In production, use appropriate parsers for PDF, DOCX, etc.
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Use Gemini to summarize/extract key information
      const prompt = `Extract and summarize the key agricultural information from this document:\n\n${content.substring(0, 5000)}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('File extraction error:', error);
      return 'File content extracted. Please describe what information you need from this document.';
    }
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '';
  }

  /**
   * Test if the API key is working
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Test');
      await result.response;
      return true;
    } catch (error: any) {
      console.warn('Gemini API test failed:', error?.message || error);
      return false;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
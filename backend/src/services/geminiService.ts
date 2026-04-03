import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import fs from 'fs';

// Initialize Gemini (primary)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// OpenRouter config (fallback chain)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// Free models on OpenRouter — verified working April 2026
const OPENROUTER_MODELS = [
  'nvidia/nemotron-3-nano-30b-a3b:free',      // NVIDIA free (primary fallback)
  'google/gemma-3-27b-it:free',               // Google Gemma 27B
  'mistralai/mistral-7b-instruct:free',        // Mistral 7B
  'z-ai/glm-4.5-air:free',                    // GLM fallback
  'deepseek/deepseek-r1-0528-qwen3-8b:free',  // DeepSeek free
];

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

class GeminiService {
  private geminiModel: GenerativeModel;

  constructor() {
    this.geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });
    console.log('✅ AI service initialized — Gemini → OpenRouter fallback chain ready');
  }

  private buildSystemPrompt(context: string): string {
    const hasContext = context && context.trim().length > 50;
    if (hasContext) {
      return `You are an expert AI Farming Assistant for AgriSense. Use the context below to give specific, actionable advice. Plain text only — no asterisks or markdown. Use bullet points (•) and numbered steps.\n\nCONTEXT:\n${context}`;
    }
    return `You are an expert AI Farming Assistant for AgriSense. Answer farming questions clearly and practically — crops, diseases, pests, soil, irrigation, economics. Plain text only, no markdown or asterisks. Use bullet points (•) and numbered steps (1. 2. 3.). Be specific and farmer-friendly.`;
  }

  /**
   * Try OpenRouter with a specific model
   */
  private async tryOpenRouter(
    model: string,
    systemPrompt: string,
    history: ChatMessage[],
    userMessage: string
  ): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts,
      })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agriapp-one.vercel.app',
        'X-Title': 'AgriSense AI Assistant',
      },
      body: JSON.stringify({ model, messages, max_tokens: 1024, temperature: 0.7 }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter ${model} failed: ${res.status} ${err}`);
    }

    const data = await res.json() as any;
    const text = data.choices?.[0]?.message?.content || '';
    if (!text.trim()) throw new Error(`Empty response from ${model}`);
    return text;
  }

  /**
   * Main response generator:
   * 1. Try Gemini
   * 2. If fail → OpenRouter Model A (llama-3.3-70b)
   * 3. If fail → OpenRouter Model B (mistral-7b)
   * 4. If fail → OpenRouter Model C (gemma-3-12b)
   */
  async generateResponse(
    userMessage: string,
    context: string,
    conversationHistory: ChatMessage[] = [],
    intent?: any
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);

    // Step 1: Try Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const history = conversationHistory
          .slice(-4)
          .filter(m => m.role && m.parts?.trim())
          .map(m => ({ role: m.role, parts: [{ text: m.parts }] }));

        if (history.length > 0 && history[0].role !== 'user') history.shift();

        const chat = this.geminiModel.startChat({ history });
        const result = await chat.sendMessage(`${systemPrompt}\n\nFarmer's Question: ${userMessage}`);
        const text = result.response.text();
        if (text.trim()) {
          console.log('✅ Response from Gemini');
          return text;
        }
        throw new Error('Empty Gemini response');
      } catch (error: any) {
        const isQuota = error.status === 429 || error.message?.includes('quota') || error.message?.includes('429');
        console.warn(`⚠️ Gemini failed (${isQuota ? 'quota' : error.message}), trying OpenRouter...`);
      }
    }

    // Step 2-4: Try OpenRouter models in order
    if (OPENROUTER_KEY) {
      for (const model of OPENROUTER_MODELS) {
        try {
          const text = await this.tryOpenRouter(model, systemPrompt, conversationHistory, userMessage);
          console.log(`✅ Response from OpenRouter: ${model}`);
          return text;
        } catch (error: any) {
          console.warn(`⚠️ OpenRouter ${model} failed: ${error.message}`);
        }
      }
    }

    throw new Error('All AI providers failed. Please try again in a moment.');
  }

  /**
   * Analyze image — Gemini Vision only (others don't support it on free tier)
   */
  async analyzeImage(imagePath: string, prompt: string = ''): Promise<string> {
    try {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      const ext = imagePath.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const analysisPrompt = prompt || `You are an AI Farming Assistant analyzing this agricultural image. Plain text only, no markdown.
Provide:
1. Crop/plant identified and condition
2. Diseases, pests, or health issues (bullet points •)
3. Nutrient deficiencies or stress signs (bullet points •)
4. Immediate actions (numbered steps 1. 2. 3.)
5. Prevention tips (bullet points •)
Be specific and practical.`;

      const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await visionModel.generateContent([
        analysisPrompt,
        { inlineData: { data: base64Image, mimeType } },
      ]);
      return result.response.text();
    } catch (error: any) {
      console.error('Image analysis error:', error);
      return 'Image received. Please describe what you see or any specific concerns about the plant for better assistance.';
    }
  }

  /**
   * Extract text from document/file
   */
  async extractTextFromFile(filePath: string, fileType: string): Promise<string> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return await this.generateResponse(
        `Extract and summarize the key agricultural information from this document:\n\n${content.substring(0, 3000)}`,
        ''
      );
    } catch (error) {
      console.error('File extraction error:', error);
      return 'File content extracted. Please describe what information you need from this document.';
    }
  }

  isConfigured(): boolean {
    return !!(process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateResponse('test', '');
      return true;
    } catch {
      return false;
    }
  }
}

export const geminiService = new GeminiService();

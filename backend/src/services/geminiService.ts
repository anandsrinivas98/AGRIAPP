import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { PdfDetector } from './pdfDetector';
import { pdfOcrService } from './pdfOcrService';

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
    const base = `You are AgriSense AI, a friendly and expert farming assistant. Your goal is to give clear, structured, and actionable advice to farmers.

RESPONSE FORMAT RULES (always follow these):
- Start with a 1-2 sentence direct answer to the question
- Use **bold** for headings, key terms, and important values
- Use bullet points (- item) for lists of tips, symptoms, or options
- Use numbered steps (1. 2. 3.) for processes and instructions
- Add a blank line between sections for readability
- End with a short "💡 Tip:" or "⚠️ Note:" if relevant
- Keep sentences short and simple — write for farmers, not scientists
- Avoid jargon; if you must use a technical term, explain it briefly
- Maximum 3-4 bullet points per section to avoid overwhelming the user
- Never write long unbroken paragraphs

RESPONSE STRUCTURE (adapt as needed):
**[Direct Answer]**
One or two sentences answering the question directly.

**[Main Section e.g. Steps / Causes / Recommendations]**
- Point one
- Point two
- Point three

**[Secondary Section if needed]**
- Point one
- Point two

💡 Tip: [One helpful closing tip]`;

    const hasContext = context && context.trim().length > 50;
    if (hasContext) {
      return `${base}\n\nUse the following knowledge base context to give specific advice:\n\nCONTEXT:\n${context}`;
    }
    return base;
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
   * Returns detailed structured analysis to be passed as context to text models
   */
  async analyzeImage(imagePath: string, prompt: string = ''): Promise<string> {
    try {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      const ext = imagePath.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const analysisPrompt = prompt || `You are an expert agricultural AI analyzing a farm/plant image.
Provide a detailed structured analysis with these sections:

**Plant/Crop Identified**
- Name and variety if visible
- Growth stage

**Current Condition**
- Overall health status (Healthy / Stressed / Diseased / Pest-affected)
- Visual symptoms observed

**Issues Detected**
- List any diseases, pests, nutrient deficiencies, or stress signs with specific symptoms

**Recommended Actions**
1. Immediate steps to take
2. Treatment options (organic and chemical)
3. Preventive measures

**Additional Notes**
- Any other observations relevant to the farmer

Be specific, practical, and farmer-friendly.`;

      const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await visionModel.generateContent([
        analysisPrompt,
        { inlineData: { data: base64Image, mimeType } },
      ]);
      const analysis = result.response.text();
      console.log('✅ Image analyzed by Gemini Vision');
      return analysis;
    } catch (error: any) {
      console.error('Image analysis error:', error);
      // Return empty string so caller knows analysis failed
      return '';
    }
  }

  /**
   * Extract raw text from uploaded document (PDF, DOCX, TXT, CSV)
   * Returns the actual document text — no summarization, preserves all content
   */
  async extractTextFromFile(filePath: string, fileType: string): Promise<string> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let rawText = '';

      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        const detector = new PdfDetector();
        const classification = detector.classify(dataBuffer, pdfData.text, pdfData.numpages);

        if (classification.type === 'image-based' && process.env.ENABLE_OCR !== 'false') {
          try {
            const ocrResult = await pdfOcrService.extractWithOcr(dataBuffer, path.basename(filePath));
            rawText = ocrResult.text;
          } catch (err) {
            return 'Could not extract text from this document. Please ensure the scan quality is sufficient or try a different file.';
          }
        } else {
          rawText = classification.rawText;
        }
      } else if (ext === '.docx' || ext === '.doc') {
        // Proper DOCX parsing
        const result = await mammoth.extractRawText({ path: filePath });
        rawText = result.value;
      } else {
        // Plain text, CSV, TXT
        rawText = fs.readFileSync(filePath, 'utf-8');
      }

      // Clean up whitespace
      rawText = rawText.replace(/\s+/g, ' ').trim();

      if (!rawText || rawText.length < 10) {
        return 'Could not extract text from this document. Please try a different file format.';
      }

      console.log(`✅ Extracted ${rawText.length} characters from ${ext} file`);
      // Return up to 8000 chars — enough for full context without hitting token limits
      return rawText.substring(0, 8000);
    } catch (error) {
      console.error('File extraction error:', error);
      return 'Failed to read document. Please ensure the file is not corrupted.';
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

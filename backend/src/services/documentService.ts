/**
 * DocumentService — Hybrid RAG document pipeline
 *
 * Responsibilities:
 * - Extract text from PDF/DOCX/TXT/CSV
 * - Split into 400-token chunks
 * - Hash documents to avoid duplicate processing
 * - Store chunks in Redis (per session, TTL 2h)
 * - Retrieve top-N relevant chunks via keyword similarity
 * - Detect if a query is relevant to uploaded documents
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { cacheService } from './cacheService';

const CHUNK_SIZE = 400;       // ~400 words per chunk
const CHUNK_OVERLAP = 50;     // overlap between chunks for context continuity
const MAX_CHUNKS = 30;        // max chunks per document
const CHUNK_TTL = 7200;       // 2 hours in Redis
const TOP_K = 4;              // top chunks to retrieve

interface DocChunk {
  id: string;
  text: string;
  index: number;
  docHash: string;
  filename: string;
}

interface SessionDocs {
  chunks: DocChunk[];
  filenames: string[];
  hashes: string[];
}

class DocumentService {
  // In-memory fallback when Redis is unavailable
  private memoryStore = new Map<string, SessionDocs>();

  /**
   * Hash a file buffer for deduplication
   */
  hashFile(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  /**
   * Extract raw text from file based on extension
   */
  async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    // TXT, CSV, plain text
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Split text into overlapping chunks of ~CHUNK_SIZE words
   */
  chunkText(text: string, docHash: string, filename: string): DocChunk[] {
    // Normalize whitespace
    const cleaned = text.replace(/\s+/g, ' ').trim();
    const words = cleaned.split(' ');

    const chunks: DocChunk[] = [];
    let i = 0;
    let index = 0;

    while (i < words.length && chunks.length < MAX_CHUNKS) {
      const chunkWords = words.slice(i, i + CHUNK_SIZE);
      const chunkText = chunkWords.join(' ');

      if (chunkText.trim().length > 20) {
        chunks.push({
          id: `${docHash}_${index}`,
          text: chunkText,
          index,
          docHash,
          filename,
        });
        index++;
      }

      i += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
  }

  /**
   * Process a document: extract → chunk → store in Redis/memory
   * Returns false if document was already processed (duplicate)
   */
  async processDocument(
    filePath: string,
    filename: string,
    sessionId: string
  ): Promise<{ chunks: number; duplicate: boolean; hash: string }> {
    const buffer = fs.readFileSync(filePath);
    const hash = this.hashFile(buffer);

    // Check if already processed in this session
    const existing = await this.getSessionDocs(sessionId);
    if (existing.hashes.includes(hash)) {
      console.log(`⚡ Document already processed (duplicate): ${filename}`);
      return { chunks: existing.chunks.filter(c => c.docHash === hash).length, duplicate: true, hash };
    }

    // Extract text
    const rawText = await this.extractText(filePath);
    if (!rawText || rawText.trim().length < 20) {
      throw new Error('Could not extract text from document');
    }

    console.log(`📄 Extracted ${rawText.length} chars from ${filename}`);

    // Chunk the text
    const newChunks = this.chunkText(rawText, hash, filename);
    console.log(`✂️  Split into ${newChunks.length} chunks`);

    // Merge with existing session docs
    const updated: SessionDocs = {
      chunks: [...existing.chunks, ...newChunks],
      filenames: [...existing.filenames, filename],
      hashes: [...existing.hashes, hash],
    };

    await this.saveSessionDocs(sessionId, updated);

    return { chunks: newChunks.length, duplicate: false, hash };
  }

  /**
   * Retrieve top-K relevant chunks for a query using keyword scoring
   * Falls back gracefully when no vector DB is available
   */
  async retrieveRelevantChunks(query: string, sessionId: string): Promise<string> {
    const sessionDocs = await this.getSessionDocs(sessionId);

    if (sessionDocs.chunks.length === 0) {
      return '';
    }

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // Score each chunk by keyword overlap
    const scored = sessionDocs.chunks.map(chunk => {
      const chunkLower = chunk.text.toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        // Count occurrences for TF-like scoring
        const matches = (chunkLower.match(new RegExp(word, 'g')) || []).length;
        score += matches;
      }
      return { chunk, score };
    });

    // Sort by score descending, take top K
    const topChunks = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)
      .map(s => s.chunk);

    // If no keyword match, return first few chunks as fallback
    const chunksToUse = topChunks.length > 0
      ? topChunks
      : sessionDocs.chunks.slice(0, 2);

    if (chunksToUse.length === 0) return '';

    const context = chunksToUse
      .map((c, i) => `[Excerpt ${i + 1} from "${c.filename}"]\n${c.text}`)
      .join('\n\n---\n\n');

    return context;
  }

  /**
   * Determine if a query is likely related to uploaded documents
   * Uses simple heuristics — avoids an extra LLM call
   */
  async isQueryDocumentRelated(query: string, sessionId: string): Promise<boolean> {
    const sessionDocs = await this.getSessionDocs(sessionId);
    if (sessionDocs.chunks.length === 0) return false;

    const queryLower = query.toLowerCase();

    // Explicit document reference keywords
    const docKeywords = [
      'document', 'file', 'pdf', 'report', 'uploaded', 'attachment',
      'according to', 'based on', 'in the', 'from the', 'what does',
      'what is', 'summarize', 'summary', 'explain', 'tell me about',
      'mentioned', 'says', 'states', 'shows', 'data', 'table', 'chart',
    ];

    if (docKeywords.some(k => queryLower.includes(k))) return true;

    // Check if query words appear in document chunks (sample first 5 chunks)
    const sampleText = sessionDocs.chunks
      .slice(0, 5)
      .map(c => c.text.toLowerCase())
      .join(' ');

    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 4);
    const matchCount = queryWords.filter(w => sampleText.includes(w)).length;

    // If >30% of meaningful query words appear in docs, it's doc-related
    return queryWords.length > 0 && matchCount / queryWords.length > 0.3;
  }

  /**
   * Check if session has any uploaded documents
   */
  async hasDocuments(sessionId: string): Promise<boolean> {
    const docs = await this.getSessionDocs(sessionId);
    return docs.chunks.length > 0;
  }

  /**
   * Get document metadata for a session
   */
  async getSessionDocMeta(sessionId: string): Promise<{ filenames: string[]; chunkCount: number }> {
    const docs = await this.getSessionDocs(sessionId);
    return { filenames: docs.filenames, chunkCount: docs.chunks.length };
  }

  /**
   * Clear documents for a session
   */
  async clearSessionDocs(sessionId: string): Promise<void> {
    const key = this.sessionKey(sessionId);
    await cacheService.delete(key);
    this.memoryStore.delete(sessionId);
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private sessionKey(sessionId: string): string {
    return `doc_session:${sessionId}`;
  }

  private async getSessionDocs(sessionId: string): Promise<SessionDocs> {
    const key = this.sessionKey(sessionId);

    // Try Redis first
    const cached = await cacheService.get<SessionDocs>(key);
    if (cached) return cached;

    // Fallback to memory
    return this.memoryStore.get(sessionId) ?? { chunks: [], filenames: [], hashes: [] };
  }

  private async saveSessionDocs(sessionId: string, docs: SessionDocs): Promise<void> {
    const key = this.sessionKey(sessionId);

    // Save to Redis with TTL
    await cacheService.set(key, docs, CHUNK_TTL);

    // Also save to memory as fallback
    this.memoryStore.set(sessionId, docs);
  }
}

export const documentService = new DocumentService();

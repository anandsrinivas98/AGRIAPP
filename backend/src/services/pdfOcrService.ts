import { fromBuffer } from 'pdf2pic';
import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';

export interface OcrResult {
  text: string;
  pageCount: number;
  truncated: boolean;
}

const MAX_PAGES = 100;
const MIN_CHARS = 20;
const TRUNCATION_NOTICE = '\n[Document truncated: only first 100 pages were processed]';

export class PdfOcrService {
  async extractWithOcr(buffer: Buffer, filename: string): Promise<OcrResult> {
    // Respect ENABLE_OCR env flag
    if (process.env.ENABLE_OCR === 'false') {
      return { text: '', pageCount: 0, truncated: false };
    }

    // Get total page count from pdf-parse
    const parsed = await pdfParse(buffer);
    const totalPages = parsed.numpages;

    const pagesToProcess = Math.min(totalPages, MAX_PAGES);
    const truncated = totalPages > MAX_PAGES;

    // Set up pdf2pic converter
    const convert = fromBuffer(buffer, {
      density: 150,
      format: 'png',
      width: 1200,
      height: 1600,
      saveFilename: 'page',
      savePath: '/tmp',
    });

    // Create a single tesseract worker for all pages
    const worker = await Tesseract.createWorker('eng');

    const pageTexts: string[] = [];

    try {
      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        const result = await convert(pageNum, { responseType: 'base64' });
        const base64 = (result as any).base64;
        const imageData = 'data:image/png;base64,' + base64;

        const { data: { text } } = await worker.recognize(imageData);
        pageTexts.push(text);
      }
    } finally {
      await worker.terminate();
    }

    let fullText = pageTexts.join('\n');

    if (truncated) {
      fullText += TRUNCATION_NOTICE;
    }

    if (fullText.replace(TRUNCATION_NOTICE, '').trim().length < MIN_CHARS) {
      throw new Error('OCR could not extract readable text from this document');
    }

    return {
      text: fullText,
      pageCount: pagesToProcess,
      truncated,
    };
  }
}

export const pdfOcrService = new PdfOcrService();

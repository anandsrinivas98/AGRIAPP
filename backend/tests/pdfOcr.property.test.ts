// Mocks must be declared before any imports
jest.mock('pdf-parse');
jest.mock('pdf2pic', () => ({ fromBuffer: jest.fn() }));
jest.mock('tesseract.js', () => ({
  default: { createWorker: jest.fn() },
  createWorker: jest.fn(),
}));
jest.mock('../src/services/cacheService', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({}),
  })),
}));
jest.mock('fs');
jest.mock('mammoth');
jest.mock('../src/services/pdfDetector');
jest.mock('../src/services/pdfOcrService');

import * as fc from 'fast-check';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { fromBuffer } from 'pdf2pic';
import { createWorker } from 'tesseract.js';
import { PdfDetector } from '../src/services/pdfDetector';
import { pdfOcrService, PdfOcrService } from '../src/services/pdfOcrService';
import { documentService } from '../src/services/documentService';

describe('PDF OCR Support — Property-Based Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.ENABLE_OCR;
  });

  // Feature: pdf-ocr-support, Property 1: Classification threshold is consistent
  it('Property 1: classification threshold is consistent', async () => {
    // Unmock PdfDetector for this test — we test the real implementation
    jest.unmock('../src/services/pdfDetector');
    const { PdfDetector: RealPdfDetector } = jest.requireActual('../src/services/pdfDetector') as typeof import('../src/services/pdfDetector');

    const detector = new RealPdfDetector();
    const dummyBuffer = Buffer.from('dummy');

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),  // pageCount
        fc.double({ min: 0, max: 200, noNaN: true }),    // charsPerPage
        async (pageCount, charsPerPage) => {
          const text = 'a'.repeat(Math.floor(pageCount * charsPerPage));
          const result = detector.classify(dummyBuffer, text, pageCount);

          if (charsPerPage < 50) {
            expect(result.type).toBe('image-based');
          } else {
            expect(result.type).toBe('text-based');
          }
        }
      )
    );
  });

  // Feature: pdf-ocr-support, Property 2: Text-based PDFs are unaffected by OCR flag
  it('Property 2: text-based PDFs produce identical output regardless of ENABLE_OCR', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 50, maxLength: 500 }),  // text content
        async (textContent) => {
          const mockFs = fs as jest.Mocked<typeof fs>;
          const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
          const MockPdfDetector = PdfDetector as jest.MockedClass<typeof PdfDetector>;

          mockFs.readFileSync.mockReturnValue(Buffer.from('pdf') as any);
          mockPdfParse.mockResolvedValue({ text: textContent, numpages: 1 } as any);
          MockPdfDetector.prototype.classify = jest.fn().mockReturnValue({
            type: 'text-based',
            rawText: textContent,
            pageCount: 1,
          });

          process.env.ENABLE_OCR = 'true';
          const resultWithOcr = await documentService.extractText('/tmp/test.pdf');

          process.env.ENABLE_OCR = 'false';
          const resultWithoutOcr = await documentService.extractText('/tmp/test.pdf');

          expect(resultWithOcr).toBe(resultWithoutOcr);
        }
      )
    );
  });

  // Feature: pdf-ocr-support, Property 3: OCR produces non-empty output for legible pages
  it('Property 3: OCR produces non-empty output for legible pages', async () => {
    // Use the real PdfOcrService for this test
    jest.unmock('../src/services/pdfOcrService');
    const { PdfOcrService: RealPdfOcrService } = jest.requireActual('../src/services/pdfOcrService') as typeof import('../src/services/pdfOcrService');

    await fc.assert(
      fc.asyncProperty(
        // Generate strings with at least 20 non-whitespace chars (legible page text)
        fc.stringMatching(/^[a-zA-Z0-9 ]{20,200}$/).filter(s => s.trim().length >= 20),
        async (pageText) => {
          const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
          const mockFromBuffer = fromBuffer as jest.MockedFunction<typeof fromBuffer>;
          const mockCreateWorker = createWorker as jest.MockedFunction<typeof createWorker>;

          mockPdfParse.mockResolvedValue({ numpages: 1 } as any);
          const mockConvert = jest.fn().mockResolvedValue({ base64: 'abc' });
          mockFromBuffer.mockReturnValue(mockConvert as any);
          mockCreateWorker.mockResolvedValue({
            recognize: jest.fn().mockResolvedValue({ data: { text: pageText } }),
            terminate: jest.fn().mockResolvedValue(undefined),
          } as any);

          const service = new RealPdfOcrService();
          const result = await service.extractWithOcr(Buffer.from('pdf'), 'test.pdf');

          expect(result.text.trim().length).toBeGreaterThan(0);
        }
      )
    );
  });

  // Feature: pdf-ocr-support, Property 4: Duplicate detection prevents redundant OCR
  it('Property 4: duplicate PDF in same session calls OCR only once', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),  // session ID
        async (sessionId) => {
          const mockFs = fs as jest.Mocked<typeof fs>;
          const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
          const MockPdfDetector = PdfDetector as jest.MockedClass<typeof PdfDetector>;
          const mockOcrService = pdfOcrService as jest.Mocked<typeof pdfOcrService>;

          const pdfBuffer = Buffer.from('same pdf content');
          mockFs.readFileSync.mockReturnValue(pdfBuffer as any);
          mockPdfParse.mockResolvedValue({ text: '', numpages: 1 } as any);
          MockPdfDetector.prototype.classify = jest.fn().mockReturnValue({
            type: 'image-based',
            rawText: '',
            pageCount: 1,
          });
          mockOcrService.extractWithOcr = jest.fn().mockResolvedValue({
            text: 'extracted text from the scanned document',
            pageCount: 1,
            truncated: false,
          });

          // Process same document twice
          await documentService.processDocument('/tmp/scan.pdf', 'scan.pdf', sessionId);
          await documentService.processDocument('/tmp/scan.pdf', 'scan.pdf', sessionId);

          // OCR should only be called once (second call is a duplicate)
          expect(mockOcrService.extractWithOcr).toHaveBeenCalledTimes(1);

          // Clean up session
          await documentService.clearSessionDocs(sessionId);
        }
      ),
      { numRuns: 10 }  // fewer runs since this involves session state
    );
  });

  // Feature: pdf-ocr-support, Property 5: Page truncation notice is appended for long documents
  it('Property 5: PDFs with > 100 pages are truncated to 100 with notice', async () => {
    // Use the real PdfOcrService for this test
    jest.unmock('../src/services/pdfOcrService');
    const { PdfOcrService: RealPdfOcrService } = jest.requireActual('../src/services/pdfOcrService') as typeof import('../src/services/pdfOcrService');

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 101, max: 150 }),  // pageCount > 100
        async (pageCount) => {
          const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
          const mockFromBuffer = fromBuffer as jest.MockedFunction<typeof fromBuffer>;
          const mockCreateWorker = createWorker as jest.MockedFunction<typeof createWorker>;

          mockPdfParse.mockResolvedValue({ numpages: pageCount } as any);
          const mockConvert = jest.fn().mockResolvedValue({ base64: 'abc' });
          mockFromBuffer.mockReturnValue(mockConvert as any);
          mockCreateWorker.mockResolvedValue({
            recognize: jest.fn().mockResolvedValue({ data: { text: 'page text here' } }),
            terminate: jest.fn().mockResolvedValue(undefined),
          } as any);

          const service = new RealPdfOcrService();
          const result = await service.extractWithOcr(Buffer.from('pdf'), 'long.pdf');

          expect(result.pageCount).toBe(100);
          expect(result.truncated).toBe(true);
          expect(result.text).toContain('[Document truncated: only first 100 pages were processed]');
          expect(mockConvert).toHaveBeenCalledTimes(100);
        }
      )
    );
  });

  // Feature: pdf-ocr-support, Property 6: OCR error propagation is consistent
  it('Property 6: OCR error causes documentService to throw and geminiService to return fallback', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),  // error message
        async (errorMsg) => {
          const mockFs = fs as jest.Mocked<typeof fs>;
          const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
          const MockPdfDetector = PdfDetector as jest.MockedClass<typeof PdfDetector>;
          const mockOcrService = pdfOcrService as jest.Mocked<typeof pdfOcrService>;

          mockFs.readFileSync.mockReturnValue(Buffer.from('pdf') as any);
          mockPdfParse.mockResolvedValue({ text: '', numpages: 1 } as any);
          MockPdfDetector.prototype.classify = jest.fn().mockReturnValue({
            type: 'image-based',
            rawText: '',
            pageCount: 1,
          });
          mockOcrService.extractWithOcr = jest.fn().mockRejectedValue(new Error(errorMsg));

          // documentService should throw
          await expect(documentService.extractText('/tmp/scan.pdf')).rejects.toThrow(
            'Could not extract text from this document. If it is a scanned PDF, please ensure the scan quality is sufficient.'
          );

          // geminiService should return fallback string
          const { geminiService } = await import('../src/services/geminiService');
          const result = await geminiService.extractTextFromFile('/tmp/scan.pdf', 'application/pdf');
          expect(result).toBe(
            'Could not extract text from this document. Please ensure the scan quality is sufficient or try a different file.'
          );
        }
      ),
      { numRuns: 20 }
    );
  });
});

jest.mock('pdf-parse');
jest.mock('../src/services/pdfDetector');
jest.mock('../src/services/pdfOcrService');
jest.mock('fs');
// Prevent GeminiService constructor from failing due to missing API key
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({}),
  })),
}));

import fs from 'fs';
import pdfParse from 'pdf-parse';
import { PdfDetector } from '../src/services/pdfDetector';
import { pdfOcrService } from '../src/services/pdfOcrService';

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
const MockPdfDetector = PdfDetector as jest.MockedClass<typeof PdfDetector>;
const mockOcrService = pdfOcrService as jest.Mocked<typeof pdfOcrService>;

describe('GeminiService OCR integration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.ENABLE_OCR;
  });

  afterEach(() => {
    delete process.env.ENABLE_OCR;
  });

  it('returns fallback string when OCR throws — does not propagate the error', async () => {
    mockFs.readFileSync.mockReturnValue(Buffer.from('pdf content') as any);
    mockPdfParse.mockResolvedValue({ text: '', numpages: 1 } as any);

    MockPdfDetector.prototype.classify = jest.fn().mockReturnValue({
      type: 'image-based',
      rawText: '',
      pageCount: 1,
    });

    mockOcrService.extractWithOcr = jest.fn().mockRejectedValue(
      new Error('OCR could not extract readable text from this document')
    );

    const { geminiService } = await import('../src/services/geminiService');
    const result = await geminiService.extractTextFromFile('/tmp/scan.pdf', 'application/pdf');

    expect(result).toBe(
      'Could not extract text from this document. Please ensure the scan quality is sufficient or try a different file.'
    );
  });
});

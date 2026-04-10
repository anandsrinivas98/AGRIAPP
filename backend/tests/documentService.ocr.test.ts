jest.mock('pdf-parse');
jest.mock('../src/services/pdfDetector');
jest.mock('../src/services/pdfOcrService');
jest.mock('fs');
jest.mock('mammoth');
// Prevent cacheService from trying to connect to Redis
jest.mock('../src/services/cacheService', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { PdfDetector } from '../src/services/pdfDetector';
import { pdfOcrService } from '../src/services/pdfOcrService';
import { documentService } from '../src/services/documentService';

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
const MockPdfDetector = PdfDetector as jest.MockedClass<typeof PdfDetector>;
const mockOcrService = pdfOcrService as jest.Mocked<typeof pdfOcrService>;
const mockMammoth = mammoth as jest.Mocked<typeof mammoth>;

describe('DocumentService OCR integration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.ENABLE_OCR;
  });

  afterEach(() => {
    delete process.env.ENABLE_OCR;
  });

  it('logs OCR usage when OCR is used for a PDF', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    mockFs.readFileSync.mockReturnValue(Buffer.from('pdf content') as any);
    mockPdfParse.mockResolvedValue({ text: '', numpages: 1 } as any);

    MockPdfDetector.prototype.classify = jest.fn().mockReturnValue({
      type: 'image-based',
      rawText: '',
      pageCount: 1,
    });

    mockOcrService.extractWithOcr = jest.fn().mockResolvedValue({
      text: 'extracted ocr text from the document',
      pageCount: 1,
      truncated: false,
    });

    const result = await documentService.extractText('/tmp/test.pdf');

    expect(result).toBe('extracted ocr text from the document');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[OCR] Used OCR for test.pdf:')
    );

    consoleSpy.mockRestore();
  });

  it('throws a user-friendly error when OCR fails', async () => {
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

    await expect(documentService.extractText('/tmp/scan.pdf')).rejects.toThrow(
      'Could not extract text from this document. If it is a scanned PDF, please ensure the scan quality is sufficient.'
    );
  });

  it('does not invoke OCR for DOCX files', async () => {
    mockMammoth.extractRawText = jest.fn().mockResolvedValue({ value: 'docx content here' } as any);

    const result = await documentService.extractText('/tmp/report.docx');

    expect(result).toBe('docx content here');
    expect(mockOcrService.extractWithOcr).not.toHaveBeenCalled();
  });

  it('does not invoke OCR for TXT files', async () => {
    mockFs.readFileSync.mockReturnValue('plain text content' as any);

    const result = await documentService.extractText('/tmp/notes.txt');

    expect(result).toBe('plain text content');
    expect(mockOcrService.extractWithOcr).not.toHaveBeenCalled();
  });
});

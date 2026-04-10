// Mock external dependencies at top level
jest.mock('pdf-parse', () => jest.fn());
jest.mock('pdf2pic', () => ({ fromBuffer: jest.fn() }));
jest.mock('tesseract.js', () => ({
  default: { createWorker: jest.fn() },
  createWorker: jest.fn(),
}));

import pdfParse from 'pdf-parse';
import { fromBuffer } from 'pdf2pic';
import { createWorker } from 'tesseract.js';
import { PdfOcrService } from '../src/services/pdfOcrService';

const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;
const mockFromBuffer = fromBuffer as jest.MockedFunction<typeof fromBuffer>;
const mockCreateWorker = createWorker as jest.MockedFunction<typeof createWorker>;

describe('PdfOcrService', () => {
  let service: PdfOcrService;
  const dummyBuffer = Buffer.from('dummy pdf content');

  beforeEach(() => {
    jest.resetAllMocks();
    service = new PdfOcrService();
    delete process.env.ENABLE_OCR;
  });

  afterEach(() => {
    delete process.env.ENABLE_OCR;
  });

  it('returns empty result immediately when ENABLE_OCR=false', async () => {
    process.env.ENABLE_OCR = 'false';
    const result = await service.extractWithOcr(dummyBuffer, 'test.pdf');
    expect(result).toEqual({ text: '', pageCount: 0, truncated: false });
    expect(mockPdfParse).not.toHaveBeenCalled();
  });

  it('processes only 100 pages for a 101-page PDF and includes truncation notice', async () => {
    mockPdfParse.mockResolvedValue({ numpages: 101 } as any);

    const mockConvert = jest.fn().mockResolvedValue({ base64: 'abc' });
    mockFromBuffer.mockReturnValue(mockConvert as any);

    const mockWorker = {
      recognize: jest.fn().mockResolvedValue({ data: { text: 'page text here' } }),
      terminate: jest.fn().mockResolvedValue(undefined),
    };
    mockCreateWorker.mockResolvedValue(mockWorker as any);

    const result = await service.extractWithOcr(dummyBuffer, 'big.pdf');

    expect(mockConvert).toHaveBeenCalledTimes(100);
    expect(result.pageCount).toBe(100);
    expect(result.truncated).toBe(true);
    expect(result.text).toContain('[Document truncated: only first 100 pages were processed]');
  });

  it('throws when OCR yields fewer than 20 total characters', async () => {
    mockPdfParse.mockResolvedValue({ numpages: 1 } as any);

    const mockConvert = jest.fn().mockResolvedValue({ base64: 'abc' });
    mockFromBuffer.mockReturnValue(mockConvert as any);

    const mockWorker = {
      // 5 chars total — well under the 20-char threshold
      recognize: jest.fn().mockResolvedValue({ data: { text: 'short' } }),
      terminate: jest.fn().mockResolvedValue(undefined),
    };
    mockCreateWorker.mockResolvedValue(mockWorker as any);

    await expect(service.extractWithOcr(dummyBuffer, 'scan.pdf')).rejects.toThrow(
      'OCR could not extract readable text from this document'
    );
  });
});

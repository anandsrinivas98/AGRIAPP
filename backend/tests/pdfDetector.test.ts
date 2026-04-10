import { PdfDetector } from '../src/services/pdfDetector';

describe('PdfDetector', () => {
  const detector = new PdfDetector();
  const dummyBuffer = Buffer.from('dummy');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('classifies as image-based when avg chars/page < 50 (49 chars, 1 page)', () => {
    const result = detector.classify(dummyBuffer, 'a'.repeat(49), 1);
    expect(result.type).toBe('image-based');
  });

  it('classifies as text-based when avg chars/page >= 50 (50 chars, 1 page)', () => {
    const result = detector.classify(dummyBuffer, 'a'.repeat(50), 1);
    expect(result.type).toBe('text-based');
  });

  it('classifies as image-based when pageCount is 0', () => {
    const result = detector.classify(dummyBuffer, '', 0);
    expect(result.type).toBe('image-based');
  });

  it('returns rawText and pageCount in result', () => {
    const result = detector.classify(dummyBuffer, 'hello world', 1);
    expect(result.rawText).toBe('hello world');
    expect(result.pageCount).toBe(1);
  });
});

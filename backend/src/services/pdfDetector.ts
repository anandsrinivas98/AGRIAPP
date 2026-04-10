export interface PdfClassification {
  type: 'text-based' | 'image-based';
  rawText: string;
  pageCount: number;
}

export class PdfDetector {
  classify(buffer: Buffer, parsedText: string, pageCount: number): PdfClassification {
    let type: 'text-based' | 'image-based';

    if (pageCount === 0 || parsedText.length / pageCount < 50) {
      type = 'image-based';
    } else {
      type = 'text-based';
    }

    return { type, rawText: parsedText, pageCount };
  }
}

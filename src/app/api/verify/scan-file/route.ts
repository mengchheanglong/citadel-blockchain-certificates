import { NextResponse } from 'next/server';
import zlib from 'zlib';

/**
 * Extracts raw and decompressed text from a PDF document to find Certificate IDs
 * or verification URLs.
 */
function extractPdfCertificateId(buffer: Buffer): string {
  const latin1 = buffer.toString('latin1');

  // 1. Direct match on uncompressed streams / metadata
  const directMatch =
    latin1.match(/CERT-\d{4}-[A-Za-z0-9]+/i) ||
    latin1.match(/\/verify\/([A-Za-z0-9_-]+)/i);

  if (directMatch) {
    return (directMatch[1] || directMatch[0]).trim();
  }

  // 2. Iterate through all PDF streams and decompress with zlib
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let m: RegExpExecArray | null;

  while ((m = streamRegex.exec(latin1)) !== null) {
    const rawStream = Buffer.from(m[1], 'latin1');
    let decompressedStr = '';

    try {
      decompressedStr = zlib.inflateSync(rawStream).toString('latin1');
    } catch {
      try {
        decompressedStr = zlib.inflateRawSync(rawStream).toString('latin1');
      } catch {
        // Stream may be an image or unsupported compression format
      }
    }

    if (decompressedStr) {
      const match =
        decompressedStr.match(/CERT-\d{4}-[A-Za-z0-9]+/i) ||
        decompressedStr.match(/\/verify\/([A-Za-z0-9_-]+)/i);

      if (match) {
        return (match[1] || match[0]).trim();
      }
    }
  }

  return '';
}

/**
 * POST /api/verify/scan-file
 * Server endpoint to parse PDFs and documents for certificate verification.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');

    if (isPdf) {
      const certId = extractPdfCertificateId(buffer);
      if (certId) {
        return NextResponse.json({
          success: true,
          certificateId: certId,
          source: 'pdf',
        });
      }

      return NextResponse.json(
        {
          success: false,
          error:
            'No certificate ID or verification link could be detected in this PDF. Please verify the document or enter the ID manually.',
        },
        { status: 422 }
      );
    }

    // Direct text search fallback for any file format
    const latin1 = buffer.toString('latin1');
    const match =
      latin1.match(/CERT-\d{4}-[A-Za-z0-9]+/i) ||
      latin1.match(/\/verify\/([A-Za-z0-9_-]+)/i);

    if (match) {
      return NextResponse.json({
        success: true,
        certificateId: (match[1] || match[0]).trim(),
        source: 'text_match',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          'Could not find a valid certificate QR code or ID in this file.',
      },
      { status: 422 }
    );
  } catch (error) {
    console.error('Error processing scan-file upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process file. Please try again or enter the Certificate ID manually.',
      },
      { status: 500 }
    );
  }
}

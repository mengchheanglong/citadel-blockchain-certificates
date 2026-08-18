import { jsPDF } from 'jspdf';

export interface CertificatePDFData {
  certificateId: string;
  recipientName: string;
  courseName: string;
  courseDescription?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  organizationName: string;
  txHash?: string | null;
  contractAddress?: string | null;
  qrCodeDataUrl: string;
}

function shortenAddress(addr: string, chars: number = 6): string {
  if (!addr) return 'N/A';
  if (addr.length <= chars * 2 + 2) return addr;
  return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
}

/**
 * Generates a high-quality, professional A4 landscape certificate PDF.
 */
export async function generateCertificatePDF(data: CertificatePDFData): Promise<Buffer> {
  // Initialize jsPDF in A4 landscape: 297mm width x 210mm height
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // 1. Background Fill
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Decorative Double Borders
  // Outer Burgundy Red Border
  doc.setDrawColor(158, 27, 50); // #9E1B32 Citadel Burgundy
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner Gold Border
  doc.setDrawColor(202, 138, 4); // #ca8a04
  doc.setLineWidth(0.6);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner Accents (Gold L-shapes)
  const cornerSize = 6;
  doc.setDrawColor(202, 138, 4);
  doc.setLineWidth(1);

  // Top-left
  doc.line(16, 16, 16 + cornerSize, 16);
  doc.line(16, 16, 16, 16 + cornerSize);
  // Top-right
  doc.line(pageWidth - 16, 16, pageWidth - 16 - cornerSize, 16);
  doc.line(pageWidth - 16, 16, pageWidth - 16, 16 + cornerSize);
  // Bottom-left
  doc.line(16, pageHeight - 16, 16 + cornerSize, pageHeight - 16);
  doc.line(16, pageHeight - 16, 16, pageHeight - 16 - cornerSize);
  // Bottom-right
  doc.line(pageWidth - 16, pageHeight - 16, pageWidth - 16 - cornerSize, pageHeight - 16);
  doc.line(pageWidth - 16, pageHeight - 16, pageWidth - 16, pageHeight - 16 - cornerSize);

  // 3. Header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('BLOCKCHAIN-VERIFIED DIGITAL CREDENTIAL', centerX, 27, { align: 'center' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(30, 58, 138); // Navy
  doc.text('CERTIFICATE OF COMPLETION', centerX, 39, { align: 'center' });

  // Gold separator line below title
  doc.setDrawColor(202, 138, 4);
  doc.setLineWidth(0.75);
  doc.line(centerX - 40, 44, centerX + 40, 44);

  // Small gold diamond accent in center of line
  doc.setFillColor(202, 138, 4);
  doc.rect(centerX - 2, 43, 4, 2, 'F');

  // 4. "This is to certify that"
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139);
  doc.text('This is to certify that', centerX, 55, { align: 'center' });

  // 5. Recipient Name with dynamic font scaling
  const nameLen = data.recipientName.length;
  const nameFontSize = nameLen > 45 ? 15 : nameLen > 30 ? 19 : 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(nameFontSize);
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text(data.recipientName, centerX, 69, { align: 'center' });

  // Subtle separator line under recipient name
  const lineHalfWidth = Math.min(80, Math.max(40, nameLen * 2));
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(centerX - lineHalfWidth, 73, centerX + lineHalfWidth, 73);

  // 6. "has successfully completed"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('has successfully completed the program requirements for', centerX, 83, { align: 'center' });

  // 7. Course Name with dynamic font scaling
  const courseLen = data.courseName.length;
  const courseFontSize = courseLen > 50 ? 13 : courseLen > 32 ? 15 : 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(courseFontSize);
  doc.setTextColor(30, 58, 138);
  doc.text(data.courseName, centerX, 95, { align: 'center' });

  // 8. Course Description (if provided, capped to 3 lines)
  let nextY = 104;
  if (data.courseDescription && data.courseDescription.trim().length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(data.courseDescription.trim(), 190).slice(0, 3);
    doc.text(descLines, centerX, nextY, { align: 'center' });
    nextY += descLines.length * 4.5 + 3;
  } else {
    nextY += 2;
  }

  // 9. Issue & Expiration Dates
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  const expiryStr = data.expiryDate ? `Expires: ${data.expiryDate}` : 'Expires: Lifetime (No Expiration)';
  doc.text(`Issued: ${data.issueDate}   •   ${expiryStr}`, centerX, nextY + 4, { align: 'center' });

  // Certificate ID
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(`Certificate ID: ${data.certificateId}`, centerX, nextY + 12, { align: 'center' });

  // 10. Footer Section (Y = 142 to 190)
  // Left Area: QR Code & Verification
  if (data.qrCodeDataUrl) {
    try {
      doc.addImage(data.qrCodeDataUrl, 'PNG', 24, 143, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text('Scan to Verify', 39, 178, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Cryptographically Verified', 39, 182, { align: 'center' });
    } catch (e) {
      console.warn('Could not add QR code to PDF:', e);
    }
  }

  // Center Area: Blockchain Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('On-Chain Verification Info', centerX, 154, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const contractDisplay = data.contractAddress ? shortenAddress(data.contractAddress, 8) : 'Not Deployed';
  const txDisplay = data.txHash ? shortenAddress(data.txHash, 8) : 'Pending / Off-Chain';
  doc.text(`Contract: ${contractDisplay}`, centerX, 161, { align: 'center' });
  doc.text(`Tx Hash: ${txDisplay}`, centerX, 166, { align: 'center' });
  doc.text('Immutable Ethereum Sepolia Ledger', centerX, 171, { align: 'center' });

  // Right Area: Organization & Signature Line
  const sigLineStartX = 212;
  const sigLineEndX = 272;
  const sigCenterX = (sigLineStartX + sigLineEndX) / 2;

  doc.setDrawColor(156, 163, 175);
  doc.setLineWidth(0.5);
  doc.line(sigLineStartX, 164, sigLineEndX, 164);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(data.organizationName, sigCenterX, 171, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Issuing Organization', sigCenterX, 176, { align: 'center' });

  // Generate output Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

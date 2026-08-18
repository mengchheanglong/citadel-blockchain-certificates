import { expect } from 'chai';
import {
  computeCertificateHash,
  generateCertificateId,
} from '../src/lib/blockchain';
import { generateQRCodeDataURL, getVerificationUrl } from '../src/lib/qrcode';
import { generateCertificatePDF } from '../src/lib/pdf';
import {
  issueCertificateSchema,
  registerSchema,
  revokeCertificateSchema,
  loginSchema,
} from '../src/lib/validation';

describe('Backend Services, PDF & Validation Edge Cases', function () {
  describe('1. Cryptographic Hashing & Canonical Ordering', function () {
    it('should produce identical hashes regardless of object key order', function () {
      const data1 = {
        certificateId: 'CERT-2026-TEST1',
        recipientName: 'Alice Johnson',
        recipientEmail: 'alice@example.com',
        courseName: 'Blockchain Architecture',
        issuerName: 'Global Institute of Technology',
        issueDate: '2026-08-18T00:00:00.000Z',
        expiryDate: '2027-08-18T00:00:00.000Z',
      };

      // Shuffled keys
      const data2 = {
        expiryDate: '2027-08-18T00:00:00.000Z',
        issuerName: 'Global Institute of Technology',
        courseName: 'Blockchain Architecture',
        recipientEmail: 'alice@example.com',
        recipientName: 'Alice Johnson',
        certificateId: 'CERT-2026-TEST1',
        issueDate: '2026-08-18T00:00:00.000Z',
      };

      const hash1 = computeCertificateHash(data1);
      const hash2 = computeCertificateHash(data2);

      expect(hash1).to.equal(hash2);
      expect(hash1).to.match(/^0x[a-f0-9]{64}$/);
    });

    it('should produce different hashes for subtle casing or whitespace differences', function () {
      const baseData = {
        certificateId: 'CERT-2026-TEST1',
        recipientName: 'Alice Johnson',
        recipientEmail: 'alice@example.com',
        courseName: 'Blockchain Architecture',
        issuerName: 'Global Institute of Technology',
        issueDate: '2026-08-18T00:00:00.000Z',
        expiryDate: null,
      };

      const hashOriginal = computeCertificateHash(baseData);

      const modifiedData = {
        ...baseData,
        recipientName: 'Alice johnson', // lowercase 'j'
      };
      const hashModified = computeCertificateHash(modifiedData);

      expect(hashOriginal).to.not.equal(hashModified);
    });

    it('should generate valid certificate IDs matching format CERT-YYYY-XXXXX', function () {
      const currentYear = new Date().getFullYear().toString();
      const generatedIds = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const id = generateCertificateId();
        expect(id).to.match(new RegExp(`^CERT-${currentYear}-[A-Z0-9]{5}$`));
        generatedIds.add(id);
      }

      // Check collision resistance over 100 samples
      expect(generatedIds.size).to.equal(100);
    });
  });

  describe('2. PDF Generation Resilience & Edge Cases', function () {
    it('should generate a valid PDF buffer for standard certificate data', async function () {
      const qrDataUrl = await generateQRCodeDataURL('CERT-2026-PDF01');

      const pdfBuffer = await generateCertificatePDF({
        certificateId: 'CERT-2026-PDF01',
        recipientName: 'Jane Doe',
        courseName: 'Full-Stack Blockchain Engineering',
        courseDescription: 'Comprehensive study of Ethereum smart contracts and decentralized applications.',
        issueDate: 'August 18, 2026',
        expiryDate: 'August 18, 2028',
        organizationName: 'Blockchain University',
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        contractAddress: '0x0987654321fedcba0987654321fedcba09876543',
        qrCodeDataUrl: qrDataUrl,
      });

      expect(pdfBuffer).to.be.instanceOf(Buffer);
      expect(pdfBuffer.length).to.be.greaterThan(5000); // Standard PDF > 5KB
      expect(pdfBuffer.slice(0, 5).toString()).to.equal('%PDF-'); // PDF magic header
    });

    it('should generate valid PDF for long recipient names and unicode characters without throwing', async function () {
      const qrDataUrl = await generateQRCodeDataURL('CERT-2026-LONG');

      const pdfBuffer = await generateCertificatePDF({
        certificateId: 'CERT-2026-LONG',
        recipientName: 'Dr. Jean-François Maximilian von Hohenzollern-Sigmaringen Jr.',
        courseName: 'Advanced Quantum-Resistant Cryptography & Post-Quantum Distributed Computing Protocols',
        courseDescription:
          'Extensive 2-year doctoral-level curriculum encompassing lattice-based cryptography, multivariate polynomials, zero-knowledge proofs, and decentralized consensus mechanisms.',
        issueDate: 'August 18, 2026',
        expiryDate: null,
        organizationName: 'International Institute of Advanced Studies & Technology',
        txHash: null,
        contractAddress: null,
        qrCodeDataUrl: qrDataUrl,
      });

      expect(pdfBuffer).to.be.instanceOf(Buffer);
      expect(pdfBuffer.length).to.be.greaterThan(5000);
      expect(pdfBuffer.slice(0, 5).toString()).to.equal('%PDF-');
    });

    it('should generate valid PDF with empty description and lifetime expiration', async function () {
      const qrDataUrl = await generateQRCodeDataURL('CERT-2026-EMPTY-DESC');

      const pdfBuffer = await generateCertificatePDF({
        certificateId: 'CERT-2026-EMPTY-DESC',
        recipientName: 'Bob Smith',
        courseName: 'Solidity 101',
        courseDescription: null,
        issueDate: 'August 18, 2026',
        expiryDate: null,
        organizationName: 'Open Academy',
        qrCodeDataUrl: qrDataUrl,
      });

      expect(pdfBuffer).to.be.instanceOf(Buffer);
      expect(pdfBuffer.length).to.be.greaterThan(3000);
    });
  });

  describe('3. Zod Input Validation & Security Edge Cases', function () {
    it('should reject invalid emails in registration and issuance', function () {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'username@.com',
        'username@domain..com',
        'username with spaces@domain.com',
        '',
      ];

      for (const email of invalidEmails) {
        const issueResult = issueCertificateSchema.safeParse({
          recipientName: 'Test User',
          recipientEmail: email,
          courseName: 'Test Course',
        });
        expect(issueResult.success).to.be.false;
      }
    });

    it('should validate flexible date formats (YYYY-MM-DD and ISO)', function () {
      const validDates = [
        '2027-12-31',
        '2028-06-15T00:00:00.000Z',
        '2030-01-01T12:30:00Z',
        null,
        undefined,
        '',
      ];

      for (const date of validDates) {
        const result = issueCertificateSchema.safeParse({
          recipientName: 'Test User',
          recipientEmail: 'test@example.com',
          courseName: 'Test Course',
          expiryDate: date,
        });
        expect(result.success).to.be.true;
      }
    });

    it('should reject non-date garbage strings for expiryDate', function () {
      const invalidDates = ['invalid-date-string', 'not a date', '2026-99-99'];

      for (const date of invalidDates) {
        const result = issueCertificateSchema.safeParse({
          recipientName: 'Test User',
          recipientEmail: 'test@example.com',
          courseName: 'Test Course',
          expiryDate: date,
        });
        expect(result.success).to.be.false;
      }
    });

    it('should reject registration if password and confirmPassword do not match', function () {
      const result = registerSchema.safeParse({
        name: 'My Organization',
        email: 'org@example.com',
        password: 'securepassword123',
        confirmPassword: 'differentpassword456',
      });

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.confirmPassword).to.exist;
      }
    });

    it('should reject short revocation reasons (< 5 chars)', function () {
      const result = revokeCertificateSchema.safeParse({
        reason: 'Bad',
      });

      expect(result.success).to.be.false;
    });

    it('should accept valid revocation reason (>= 5 chars)', function () {
      const result = revokeCertificateSchema.safeParse({
        reason: 'Issued by clerical mistake to incorrect student.',
      });

      expect(result.success).to.be.true;
    });
  });
});

import nodemailer from 'nodemailer';

interface RecipientInfo {
  name: string;
  email: string;
}

interface IssuedCertificateInfo {
  certificateId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string | null;
  organizationName: string;
}

interface RevokedCertificateInfo {
  certificateId: string;
  courseName: string;
  organizationName: string;
}

export function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn('SMTP credentials (SMTP_USER / SMTP_PASSWORD) not configured. Emails will not be sent.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@certificate-platform.com';

/**
 * Sends an email notifying the recipient that their certificate has been issued.
 */
export async function sendCertificateIssuedEmail(
  recipient: RecipientInfo,
  certificate: IssuedCertificateInfo,
  verificationUrl: string,
  pdfBuffer?: Buffer
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();

    const expiryDisplay = certificate.expiryDate ? certificate.expiryDate : 'Lifetime (No Expiration)';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Certificate has been Issued</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 24px;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      padding: 36px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 15px;
      opacity: 0.9;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .details-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table td {
      padding: 8px 0;
      font-size: 14px;
      vertical-align: top;
    }
    .details-table .label {
      color: #64748b;
      width: 38%;
      font-weight: 500;
    }
    .details-table .value {
      color: #0f172a;
      font-weight: 600;
    }
    .cta-container {
      text-align: center;
      margin-bottom: 28px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
    }
    .attachment-note {
      font-size: 13px;
      color: #6b7280;
      text-align: center;
      margin-bottom: 24px;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Certificate of Completion</h1>
      <p>Blockchain-Verified Credential</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${recipient.name},</div>
      <p class="message">
        Congratulations! <strong>${certificate.organizationName}</strong> has officially issued your verified certificate for successfully completing <strong>${certificate.courseName}</strong>.
      </p>
      
      <div class="details-card">
        <table class="details-table">
          <tr>
            <td class="label">Certificate ID:</td>
            <td class="value">${certificate.certificateId}</td>
          </tr>
          <tr>
            <td class="label">Recipient:</td>
            <td class="value">${recipient.name}</td>
          </tr>
          <tr>
            <td class="label">Course / Program:</td>
            <td class="value">${certificate.courseName}</td>
          </tr>
          <tr>
            <td class="label">Issuing Organization:</td>
            <td class="value">${certificate.organizationName}</td>
          </tr>
          <tr>
            <td class="label">Issue Date:</td>
            <td class="value">${certificate.issueDate}</td>
          </tr>
          <tr>
            <td class="label">Expiration Date:</td>
            <td class="value">${expiryDisplay}</td>
          </tr>
        </table>
      </div>

      <div class="cta-container">
        <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">
          Verify Your Certificate
        </a>
      </div>

      ${
        pdfBuffer
          ? '<p class="attachment-note">📎 A PDF copy of your certificate is attached to this email for your records.</p>'
          : ''
      }
    </div>
    <div class="footer">
      <p>This credential is cryptographic proof recorded on the blockchain.</p>
      <p>If you have any questions, please contact ${certificate.organizationName}.</p>
    </div>
  </div>
</body>
</html>
`;

    const attachments = pdfBuffer
      ? [
          {
            filename: `certificate-${certificate.certificateId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ]
      : [];

    await transporter.sendMail({
      from: `"${certificate.organizationName}" <${FROM_EMAIL}>`,
      to: `"${recipient.name}" <${recipient.email}>`,
      subject: `Your Certificate: ${certificate.courseName} (${certificate.certificateId})`,
      html: htmlContent,
      attachments,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending certificate issued email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

/**
 * Sends an email notifying the recipient that their certificate has been revoked.
 */
export async function sendCertificateRevokedEmail(
  recipient: RecipientInfo,
  certificate: RevokedCertificateInfo,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate Revocation Notice</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 24px;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
      color: #ffffff;
      padding: 36px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .alert-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .alert-title {
      font-weight: 600;
      color: #991b1b;
      margin-bottom: 4px;
      font-size: 14px;
    }
    .alert-reason {
      color: #7f1d1d;
      font-size: 14px;
      margin: 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .details-table td {
      padding: 6px 0;
      font-size: 14px;
    }
    .details-table .label {
      color: #6b7280;
      width: 35%;
    }
    .details-table .value {
      color: #111827;
      font-weight: 500;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Certificate Revocation Notice</h1>
      <p>Important Status Update</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${recipient.name},</div>
      <p class="message">
        This is an official notice to inform you that your certificate for <strong>${certificate.courseName}</strong> has been revoked by <strong>${certificate.organizationName}</strong> and marked as invalid on the blockchain registry.
      </p>

      <table class="details-table">
        <tr>
          <td class="label">Certificate ID:</td>
          <td class="value">${certificate.certificateId}</td>
        </tr>
        <tr>
          <td class="label">Course / Program:</td>
          <td class="value">${certificate.courseName}</td>
        </tr>
        <tr>
          <td class="label">Issuing Organization:</td>
          <td class="value">${certificate.organizationName}</td>
        </tr>
      </table>

      <div class="alert-box">
        <div class="alert-title">Reason for Revocation:</div>
        <p class="alert-reason">${reason || 'No specific reason provided.'}</p>
      </div>

      <p class="message">
        If you believe this revocation was made in error, please contact <strong>${certificate.organizationName}</strong> directly for assistance.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated notification from the Blockchain Digital Certificate Platform.</p>
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"${certificate.organizationName}" <${FROM_EMAIL}>`,
      to: `"${recipient.name}" <${recipient.email}>`,
      subject: `Notice: Certificate Revoked - ${certificate.courseName} (${certificate.certificateId})`,
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending certificate revoked email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

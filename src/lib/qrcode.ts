import QRCode from 'qrcode';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function getVerificationUrl(certificateId: string): string {
  return `${BASE_URL}/verify/${certificateId}`;
}

export async function generateQRCodeDataURL(certificateId: string): Promise<string> {
  const url = getVerificationUrl(certificateId);
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });
}

export async function generateQRCodeSVG(certificateId: string): Promise<string> {
  const url = getVerificationUrl(certificateId);
  return QRCode.toString(url, {
    type: 'svg',
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'M',
  });
}

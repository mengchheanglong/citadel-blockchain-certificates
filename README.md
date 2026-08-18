# Citadel - Immutable Blockchain Digital Certificate Platform

A web-based Digital Certificate Issuing Platform that uses blockchain technology to provide secure, tamper-resistant, and publicly verifiable certificates.

## Features

- 🔐 **Organization Portal** - Login, create and issue digital certificates
- 📄 **PDF Certificates** - Generate professional downloadable PDF certificates with QR codes
- ⛓️ **Blockchain Anchoring** - Certificate hashes stored on Ethereum (Sepolia testnet)
- ✅ **Public Verification** - Verify certificates via Certificate ID or QR Code scan
- 📧 **Email Notifications** - Automated emails to certificate recipients
- ⏰ **Expiration Management** - Set and track certificate expiry dates
- ❌ **Certificate Revocation** - Revoke certificates with on-chain recording

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL |
| Blockchain | Solidity, Hardhat, ethers.js v6 |
| Network | Ethereum Sepolia Testnet / Hardhat Local |
| Email | Nodemailer |
| PDF | jsPDF |
| QR Code | qrcode + html5-qrcode |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Infura/Alchemy account for Sepolia testnet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain-certificates
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Compile smart contracts**
   ```bash
   npx hardhat compile
   ```

6. **Start local blockchain (optional, for development)**
   ```bash
   npx hardhat node
   ```

7. **Deploy smart contract**
   ```bash
   # Local deployment
   npm run hardhat:deploy:local
   
   # Sepolia deployment
   npm run hardhat:deploy:sepolia
   ```

8. **Update CONTRACT_ADDRESS in .env** with the deployed address

9. **Start the development server**
   ```bash
   npm run dev
   ```

10. Visit http://localhost:3000

## Project Structure

```
blockchain-certificates/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (dashboard)/        # Organization dashboard
│   │   ├── verify/             # Public verification
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   └── ui/                 # shadcn/ui components
│   └── lib/                    # Utility libraries
│       ├── auth.ts             # NextAuth.js configuration
│       ├── blockchain.ts       # Blockchain integration
│       ├── db.ts               # Prisma client
│       ├── email.ts            # Email service
│       ├── pdf.ts              # PDF generation
│       ├── qrcode.ts           # QR code utilities
│       ├── utils.ts            # General utilities
│       └── validation.ts       # Zod schemas
├── contracts/                  # Solidity smart contracts
├── scripts/                    # Deployment scripts
├── test/                       # Smart contract tests
├── prisma/                     # Database schema
└── hardhat.config.ts           # Hardhat configuration
```

## Smart Contract

The `CertificateRegistry` contract provides:
- Certificate issuance with SHA-256 hash anchoring
- Verification with status codes (Valid, Expired, Revoked, Hash Mismatch)
- Certificate revocation with access control
- Authorized issuer management

### Running Tests

```bash
npx hardhat test
```

## Certificate Verification Flow

1. Organization issues a certificate through the dashboard
2. Certificate data hash is computed (SHA-256) and stored on-chain
3. A PDF certificate with QR code is generated
4. Recipient receives email with certificate and verification link
5. Anyone can verify by:
   - Entering the Certificate ID on the verification page
   - Scanning the QR code on the PDF
6. The system checks:
   - Certificate exists in database
   - Hash matches on-chain record
   - Not expired or revoked

## License

MIT

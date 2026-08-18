# Blockchain Digital Certificate Platform - Agent Instructions

## Project Overview
This is a Blockchain-Based Digital Certificate Issuing Platform built with Next.js, Hardhat, Solidity, and PostgreSQL.

## Architecture
- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes + Prisma ORM
- **Blockchain**: Solidity smart contracts deployed via Hardhat (Sepolia testnet)
- **Database**: PostgreSQL via Prisma
- **Email**: Nodemailer with SMTP
- **PDF**: jsPDF for certificate generation
- **QR Code**: qrcode (generation) + html5-qrcode (scanning)

## Directory Structure
```
blockchain-certificates/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (dashboard)/        # Organization dashboard pages
│   │   ├── verify/             # Public verification pages
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── certificates/       # Certificate-related components
│   │   ├── dashboard/          # Dashboard components
│   │   └── verification/       # Verification components
│   ├── lib/                    # Utility libraries
│   │   ├── blockchain.ts       # Web3/ethers.js integration
│   │   ├── db.ts               # Prisma client
│   │   ├── email.ts            # Email service
│   │   ├── pdf.ts              # PDF generation
│   │   ├── qrcode.ts           # QR code utilities
│   │   └── auth.ts             # Authentication utilities
│   ├── contracts/              # Solidity smart contracts (source)
│   └── types/                  # TypeScript type definitions
├── contracts/                  # Hardhat contracts directory
├── scripts/                    # Hardhat deployment scripts
├── test/                       # Smart contract tests
├── prisma/
│   └── schema.prisma           # Database schema
├── hardhat.config.ts           # Hardhat configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Key Conventions
- Use TypeScript for all code
- Use Prisma for database operations
- Use ethers.js v6 for blockchain interactions
- Use NextAuth.js for authentication
- Follow Next.js App Router patterns
- Use server actions where appropriate
- Certificate IDs follow format: CERT-{YYYY}-{random-alphanumeric}
- All blockchain operations must have proper error handling and retry logic
- Store certificate hash on-chain, full metadata off-chain in PostgreSQL

## Smart Contract
The `CertificateRegistry` contract handles:
- `issueCertificate(certId, certHash, expirationDate)` - Records certificate hash
- `verifyCertificate(certId)` - Returns certificate data and validity
- `revokeCertificate(certId)` - Marks certificate as revoked
- `getCertificate(certId)` - Gets certificate blockchain record

## Database Tables
- `Organization` - Organization accounts
- `Certificate` - Certificate records with metadata
- `Recipient` - Certificate recipients
- `BlockchainTransaction` - Transaction records

## Environment Variables Required
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x...
CONTRACT_ADDRESS=0x...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
```

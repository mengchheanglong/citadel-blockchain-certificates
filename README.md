<p align="center">
  <img src="public/citadel-logo.png" alt="Citadel Logo" width="100" height="100" />
</p>

<h1 align="center">Citadel</h1>

<p align="center">
  <strong>Immutable Blockchain-Based Digital Certificate Issuing & Zero-Gas Verification Platform</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://soliditylang.org"><img src="https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat-square&logo=solidity" alt="Solidity" /></a>
  <a href="https://hardhat.org"><img src="https://img.shields.io/badge/Hardhat-2.22-yellow?style=flat-square&logo=hardhat&logoColor=black" alt="Hardhat" /></a>
  <a href="https://docs.ethers.org/v6"><img src="https://img.shields.io/badge/Ethers.js-v6-purple?style=flat-square" alt="Ethers.js" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-PostgreSQL-teal?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <img src="https://img.shields.io/badge/Tests-52%20Passed-brightgreen?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License" />
</p>

---

## ⚡ Overview

**Citadel** is a full-stack Web3 platform that eliminates credential fraud by anchoring digital certificates to the **Ethereum blockchain**. 

- 🔒 **Cryptographic Tamper-Proofing:** Certificate data is canonicalized and hashed (SHA-256), anchoring an immutable cryptographic proof on-chain.
- ⚡ **Zero-Gas Public Verification:** Anyone can verify certificates instantly via QR scan or PDF upload with no gas fees, crypto wallet, or account required.
- 🎨 **Live Issue Studio:** Real-time vector certificate preview as administrators type, with automated PDF generation (`jsPDF`) and SMTP email dispatch.
- 🛡️ **Privacy-First (GDPR/FERPA):** Sensitive metadata remains off-chain in PostgreSQL; only 32-byte cryptographic digests live on Ethereum.

---

## 📸 Product Showcase

| Issue Studio (Live Preview) | Executive Dashboard |
| :---: | :---: |
| ![Issue Studio](docs/screenshots/05_issue_studio_live_preview.png) | ![Dashboard](docs/screenshots/04_dashboard_overview.png) |

| Multi-Modal Verification Portal | Instant Cryptographic Proof |
| :---: | :---: |
| ![Verification Portal](docs/screenshots/07_public_verify_portal.png) | ![Valid Result](docs/screenshots/08_verification_result_valid.png) |

---

## 🏗️ Architecture

Citadel uses a **hybrid on-chain / off-chain model** for speed, low gas costs, and regulatory compliance:

<p align="center">
  <img src="docs/screenshots/diagram_architecture.png" alt="System Architecture" width="85%" />
</p>

1. **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
2. **Backend API:** Next.js Server Route Handlers, Zod validation, `jsPDF`, `nodemailer`.
3. **Database:** PostgreSQL via Prisma ORM (stores institution metadata and audit logs).
4. **Blockchain:** Solidity `CertificateRegistry.sol` on Ethereum Sepolia / Hardhat local node.

---

## 🔄 How It Works

```
1. ISSUE ──► Admin inputs details ──► Deterministic SHA-256 generated ──► Anchored to Smart Contract
2. SEND  ──► High-res PDF generated with QR code ──► Automatically emailed to recipient inbox
3. VERIFY──► Verifier scans QR or drops PDF ──► Zero-gas EVM view query ──► Cryptographic proof displayed
```

### Smart Contract State Machine (`CertificateRegistry.sol`)

The registry evaluates certificate status directly on-chain:
- **`Valid (1)`** — Hash matches on-chain record and expiry is active.
- **`Expired (2)`** — Validity timestamp has passed.
- **`Revoked (3)`** — Invalidated by issuing authority with audit reason.
- **`HashMismatch (4)`** — Certificate content has been modified.
- **`NotFound (0)`** — Never issued or non-existent ID.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Lucide |
| **Backend & Services** | Next.js Server Actions, Prisma ORM, Zod, Nodemailer, jsPDF |
| **Database** | PostgreSQL |
| **Blockchain** | Solidity `^0.8.24`, Hardhat, Ethers.js v6, Sepolia Testnet |
| **Testing** | Hardhat, Chai, Mocha (52 automated unit, integration & fuzz tests) |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/mengchheanglong/citadel-blockchain-certificates.git
cd citadel-blockchain-certificates
npm install --legacy-peer-deps
```

### 2. Environment Setup
Create a `.env` file (see `.env.example`):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/citadel_db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
CONTRACT_ADDRESS="0x..."
PRIVATE_KEY="0x..."
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/..."
```

### 3. Database & Smart Contracts
```bash
# Push Prisma database schema
npx prisma db push

# Compile & deploy smart contract locally
npx hardhat compile
npm run hardhat:deploy:local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Testing

```bash
npx hardhat test
```
```text
  52 passing (3s)
  ✔ Cryptographic Canonical Hashing & Invariance (12 tests)
  ✔ Smart Contract Issuance, Zero-Gas Verify & Revocation (28 tests)
  ✔ Time Boundary, 1-Bit Tamper & Fuzz Stress Testing (12 tests)
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

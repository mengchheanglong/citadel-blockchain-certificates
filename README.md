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

## 🏗️ Architecture

Citadel uses a **hybrid on-chain / off-chain architecture** to optimize for privacy, performance, and minimal gas costs:

```mermaid
flowchart TD
    subgraph Client["1. Presentation Tier (Client)"]
        UI_Issue["🏢 Organization Issue Studio<br/>(Split-Screen Live Vector Preview)"]
        UI_Verify["🔍 Public Verification Portal<br/>(Camera QR • Drag & Drop • PDF Drop)"]
    end

    subgraph App["2. Application Tier (Next.js 14 App Router)"]
        API["API Route Handlers & Server Actions<br/>(Session Auth & Zod Sanitization)"]
        Hash["Deterministic Canonical Hashing<br/>(Lexicographical Sort + SHA-256)"]
        Doc["Document & Delivery Services<br/>(jsPDF Engine + Nodemailer SMTP)"]
    end

    subgraph Data["3. Persistence Tier"]
        DB[("PostgreSQL Database<br/>(Prisma ORM)")]
        DB_Desc["• Organization Profiles<br/>• Full Certificate Metadata<br/>• Transaction Receipts & Logs"]
    end

    subgraph Chain["4. Blockchain Ledger Tier (Ethereum EVM)"]
        Contract["CertificateRegistry.sol<br/>(Solidity ^0.8.24)"]
        Contract_Desc["• 32-Byte certHash Anchor<br/>• 5-State Verification Engine<br/>• Zero-Gas View Queries"]
    end

    UI_Issue -->|Form Submission| API
    UI_Verify -->|Zero-Gas Query| API
    API --> Hash
    API --> Doc
    API -->|Off-Chain PII & Records| DB
    DB --- DB_Desc
    Hash -->|issueCertificate / Gas Tx| Contract
    API -.->|eth_call / Free View Query| Contract
    Contract --- Contract_Desc
```

### Key Architectural Decisions

| Design Decision | Implementation | Engineering Rationale |
| :--- | :--- | :--- |
| **Hybrid Storage Model** | PostgreSQL (Metadata) + Ethereum (Hashes) | Ensures compliance with **GDPR** (Right to be Forgotten) and **FERPA** while keeping gas costs negligible. |
| **Deterministic Hashing** | Lexicographical Key Sorting + SHA-256 | Prevents hash mismatches caused by varying JSON key-order serialization across runtimes. |
| **Zero-Gas Verification** | EVM `view` Function (`verifyCertificate`) | Verifiers (employers, recruiters) can authenticate credentials in milliseconds without crypto wallets or gas fees. |

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

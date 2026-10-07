<p align="center">
  <img src="public/citadel-logo.png" alt="Citadel Logo" width="110" height="110" />
</p>

<h1 align="center">Citadel</h1>

<p align="center">
  <strong>Immutable Blockchain-Based Digital Certificate Issuing & Zero-Gas Verification Platform</strong>
</p>

<p align="center">
  <em>A full-stack Web3 credential management system pairing Ethereum smart contracts with hybrid off-chain storage to guarantee cryptographic tamper-proofing, instant public verification, and compliance with data privacy standards.</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2_(App_Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://soliditylang.org"><img src="https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" /></a>
  <a href="https://hardhat.org"><img src="https://img.shields.io/badge/Hardhat-2.22-FFF100?style=for-the-badge&logo=hardhat&logoColor=black" alt="Hardhat" /></a>
  <a href="https://docs.ethers.org/v6"><img src="https://img.shields.io/badge/Ethers.js-v6.13-2535A0?style=for-the-badge" alt="Ethers.js v6" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-5.18-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://ethereum.org"><img src="https://img.shields.io/badge/Network-Sepolia_Testnet-627EEA?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethereum Sepolia" /></a>
  <img src="https://img.shields.io/badge/Tests-52%20Passing%20(100%25)-success?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Tests 52 Passing" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT" />
</p>

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [The Problem vs. The Citadel Solution](#-the-problem-vs-the-citadel-solution)
- [Key Features & Innovations](#-key-features--innovations)
- [System Architecture](#-system-architecture)
  - [Four-Tier System Model](#four-tier-system-model)
  - [Hybrid On-Chain / Off-Chain Philosophy](#hybrid-on-chain--off-chain-philosophy)
  - [Deterministic Canonical Hashing Protocol](#deterministic-canonical-hashing-protocol)
- [End-to-End Operational Workflow](#-end-to-end-operational-workflow)
- [Smart Contract Architecture (`CertificateRegistry.sol`)](#-smart-contract-architecture-certificateregistrysol)
  - [Verification State Machine](#verification-state-machine)
  - [Core Functions & Access Control](#core-functions--access-control)
- [Database Schema & Data Dictionary](#-database-schema--data-dictionary)
- [Visual Interface Showcase](#-visual-interface-showcase)
- [Technology Stack](#-technology-stack)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Engineering Highlights & Interview Talking Points](#-engineering-highlights--interview-talking-points)
- [Author & Contact](#-author--contact)

---

## 💡 Executive Summary

**Citadel** is an enterprise-grade digital credential issuing and verification platform designed for universities, academic institutions, and certification authorities. By combining an **Ethereum smart contract** ledger with an **off-chain PostgreSQL database**, Citadel eliminates academic diploma fraud, enables instantaneous cross-border verification without transaction fees ("zero-gas"), and automates document rendering and email delivery.

Citadel guarantees **mathematical tamper-resistance**: modifying even a single character of a student’s name, graduation date, or degree title produces a completely different cryptographic digest, instantly failing on-chain verification.

---

## ⚡ The Problem vs. The Citadel Solution

| Challenge in Traditional Credentialing | Citadel Blockchain Solution |
| :--- | :--- |
| **Vulnerability to Forgery:** Static PDFs and paper diplomas can easily be altered with graphic editors or generative tools without visual detection. | **Cryptographic Immutability:** SHA-256 fingerprint anchored to Ethereum. Any alteration causes an immediate `HashMismatch` on-chain. |
| **Verification Bottlenecks:** Employers and recruiters spend 2–4 weeks contacting registrar offices for manual transcript verification. | **Instant Zero-Gas Verification:** Verification executes in milliseconds via EVM view queries. Free for employers—no crypto wallet or gas fees required. |
| **Single Point of Failure:** Centralized databases are susceptible to administrative tampering, ransomware, and catastrophic server loss. | **Decentralized Trust Anchor:** Even if internal databases fail, the on-chain registry acts as an immutable source of truth. |
| **Regulatory Privacy Conflicts:** Storing personal data directly on a public blockchain violates **GDPR** (Right to be Forgotten) and **FERPA**. | **Hybrid Storage Protocol:** PII remains strictly in private PostgreSQL storage; only mathematical digests are committed on-chain. |

---

## 🌟 Key Features & Innovations

### 🏛️ For Accredited Organizations
- **Interactive Live Issue Studio:** Split-screen interface featuring a live vector diploma preview that updates in real time as administrators enter graduate data.
- **Automated High-Resolution PDF Diplomas:** Instant client- and server-side PDF generation via `jsPDF` with crisp typography, institution metadata, and high-density QR verification codes.
- **Automated SMTP Dispatch:** Dispatches newly issued diplomas directly to graduate inboxes with direct verification hyperlinks.
- **Lifecycle Governance:** Configure lifetime validity or fixed expiry dates (1 Year, 2 Years, Custom), with on-chain revocation management with audit justification logs.
- **Institutional Management & Audit Export:** Sort, search, and filter issued certificates by lifecycle status (`All`, `Valid`, `Expired`, `Revoked`), and export institutional records to CSV with one click.

### 🔍 For Verifiers (Employers, Universities, Recruiters)
- **Multi-Modal Verification Engine:**
  - 📷 **Live Camera Scanner:** Scans diploma QR codes in real-time directly through device cameras.
  - 🖼️ **Image Drag & Drop:** Upload diploma screenshots or photos for client-side QR decoding (`jsQR`).
  - 📄 **Direct PDF Document Inspection:** Automatically extracts embedded QR codes and validates hash integrity from uploaded PDF certificates.
  - ⌨️ **Manual Certificate ID Search:** Standard search for rapid ID lookups (`CERT-YYYY-XXXXX`).
- **Comprehensive Cryptographic Proof Modal:** Displays graduate metadata, issuance timestamp, expiration status, raw SHA-256 digest, Ethereum block number, transaction hash, and direct Etherscan link.

---

## 🏛️ System Architecture

Citadel uses a decoupled **four-tier architecture** that separates user experience, cryptographic operations, relational data storage, and blockchain consensus.

<p align="center">
  <img src="docs/screenshots/diagram_architecture.png" alt="Citadel Four-Tier Architecture Diagram" width="90%" />
</p>

### Four-Tier System Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     1. PRESENTATION LAYER (CLIENT)                      │
│   Next.js 14 App Router • React 18 • Tailwind CSS • Radix UI • Lucide   │
│   [ Split-Screen Studio ]  [ Executive Dashboard ]  [ Verify Portal ]   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / JSON / Server Actions
┌────────────────────────────────────▼────────────────────────────────────┐
│                    2. APPLICATION & API LAYER (SERVER)                  │
│   Next.js Server Handlers • Zod Validation • Canonical Hashing Engine   │
│   jsPDF Vector Rendering • Nodemailer SMTP • Ethers.js v6 Provider      │
└──────────────────────┬───────────────────────────────────┬──────────────┘
                       │ SQL Queries                       │ JSON-RPC
┌──────────────────────▼──────────────┐   ┌────────────────▼──────────────┐
│       3. PERSISTENCE LAYER          │   │    4. DECENTRALIZED LEDGER    │
│  PostgreSQL (Supabase) via Prisma   │   │  Ethereum Sepolia / Hardhat   │
│  • Organization Profiles            │   │  • CertificateRegistry.sol    │
│  • Recipient & Course Metadata      │   │  • 32-Byte certHash Anchor    │
│  • Audit Transaction Receipts       │   │  • Immutable State Machine    │
└─────────────────────────────────────┘   └───────────────────────────────┘
```

### Hybrid On-Chain / Off-Chain Philosophy
Storing extensive textual descriptions, student identifiers, and image assets on Ethereum creates two major engineering problems:
1. **Excessive Gas Overhead:** Storing 1 KB of arbitrary data on Ethereum mainnet/testnet is cost-prohibitive.
2. **Data Privacy Regulations (GDPR & FERPA):** Public blockchains are immutable; personally identifiable information (PII) can never be deleted or updated to comply with the *Right to be Forgotten*.

**Citadel's Solution:** Metadata and PII are preserved off-chain in encrypted PostgreSQL tables. Only a deterministic **32-byte cryptographic hash** (`certHash`) and its unique identifier hash (`certIdHash`) are committed to Ethereum.

### Deterministic Canonical Hashing Protocol
To ensure cross-platform hash consistency regardless of JSON property serialization order, Citadel implements a canonical sorting protocol prior to SHA-256 hashing:

```typescript
// Deterministic Canonical Payload Construction
const canonicalPayload = JSON.stringify({
  certId: cert.certificateId,
  organizationId: cert.organizationId,
  recipientName: cert.recipientName.trim(),
  courseName: cert.courseName.trim(),
  issueDate: cert.issueDate.toISOString()
}, Object.keys(payload).sort()); // Lexicographical key sorting

// 32-byte Cryptographic Digest
const certHash = ethers.sha256(ethers.toUtf8Bytes(canonicalPayload));
const certIdHash = ethers.keccak256(ethers.toUtf8Bytes(cert.certificateId));
```

> **Avalanche Effect Guarantee:** Altering even a single bit in the recipient's name or issue date changes more than 50% of the resulting SHA-256 bits, guaranteeing an immediate on-chain verification failure.

---

## 🔄 End-to-End Operational Workflow

The system coordinates two core end-to-end pipelines: the **Issuance Pipeline** and the **Verification Pipeline**.

<p align="center">
  <img src="docs/screenshots/diagram_how_it_works.png" alt="Citadel End-to-End Workflow" width="90%" />
</p>

### Technical Sequence Interaction

<p align="center">
  <img src="docs/screenshots/diagram_user_flow.png" alt="Citadel Sequence Flow Diagram" width="90%" />
</p>

1. **Issuance Stage:**
   - Institution submits student details through the Issue Studio.
   - Server validates payload schema using Zod, constructs the canonical JSON payload, and generates a SHA-256 digest.
   - An authorized operator wallet sends `issueCertificate(certIdHash, certHash, expirationDate)` to the smart contract.
   - Upon transaction receipt confirmation, certificate records and block metrics (`txHash`, `blockNumber`, `gasUsed`) are saved in PostgreSQL.
   - jsPDF renders the official diploma with the embedded verification QR code, which Nodemailer emails to the graduate.
2. **Verification Stage:**
   - Verifier uploads a diploma or scans its QR code at `/verify`.
   - The server resolves the certificate record from the database and recomputes the canonical SHA-256 hash.
   - Citadel performs a zero-gas `eth_call` to `verifyCertificate(certIdHash, certHash)`.
   - The UI renders the verified state along with the cryptographic proof.

---

## 📜 Smart Contract Architecture (`CertificateRegistry.sol`)

The `CertificateRegistry.sol` contract is written in Solidity `^0.8.24` and utilizes OpenZeppelin's access control primitives.

<p align="center">
  <img src="docs/screenshots/diagram_smart_contract.png" alt="Smart Contract State Machine & Methods" width="85%" />
</p>

### Verification State Machine

The contract evaluates certificate status dynamically through an integer-coded state machine:

| Status Code | Enum Name | Condition | Action / Meaning |
| :---: | :--- | :--- | :--- |
| `0` | **NotFound** | `!certificates[_certIdHash].exists` | Identifier was never anchored to the ledger. |
| `1` | **Valid** | `certHash == _certHash && block.timestamp < expirationDate` | Authentic, tamper-free, and within validity period. |
| `2` | **Expired** | `expirationDate != 0 && block.timestamp >= expirationDate` | Authentic record, but validity window has elapsed. |
| `3` | **Revoked** | `certificates[_certIdHash].isRevoked == true` | Revoked on-chain by the original issuer or owner. |
| `4` | **HashMismatch** | `certificates[_certIdHash].certHash != _certHash` | Data altered; payload failed cryptographic check. |

### Core Functions & Access Control

```solidity
// Issues certificate hash on-chain (Restricted to Authorized Issuers)
function issueCertificate(
    bytes32 _certIdHash,
    bytes32 _certHash,
    uint256 _expirationDate
) external onlyAuthorizedIssuer;

// Zero-gas public view function to evaluate validity and status
function verifyCertificate(
    bytes32 _certIdHash,
    bytes32 _certHash
) external view returns (bool isValid, uint8 status);

// Marks certificate as revoked (Restricted to original issuer or contract owner)
function revokeCertificate(
    bytes32 _certIdHash
) external onlyAuthorizedIssuer;

// Access control management (Owner only)
function authorizeIssuer(address _issuer) external onlyOwner;
function deauthorizeIssuer(address _issuer) external onlyOwner;
```

---

## 🗄️ Database Schema & Data Dictionary

Managed via **Prisma ORM 5.18**, the relational schema cleanly connects institution accounts, certificate records, and blockchain transaction receipts.

<p align="center">
  <img src="docs/screenshots/diagram_er.png" alt="Citadel Entity-Relationship Diagram" width="85%" />
</p>

### Relational Entities Overview

| Model | Primary Purpose | Key Fields & Relations |
| :--- | :--- | :--- |
| **`Organization`** | Represents accredited educational institutions and certified issuers. | `id (UUID)`, `name`, `email (Unique)`, `passwordHash`, `website`, `certificates (1:N)` |
| **`Certificate`** | Master credential record storing canonical hash, recipient info, and lifecycle status. | `id (UUID)`, `certificateId (Unique)`, `recipientName`, `recipientEmail`, `courseName`, `issueDate`, `expiryDate`, `certificateHash`, `status`, `organizationId (FK)` |
| **`BlockchainTransaction`** | Immutable audit log of on-chain Ethereum transactions, block numbers, and gas receipts. | `id (UUID)`, `certificateId (FK)`, `txHash (Indexed)`, `blockNumber`, `networkName`, `contractAddress`, `action`, `confirmed`, `gasUsed` |

---

## 🖥️ Visual Interface Showcase

### 1. Interactive Issue Studio (Live Vector Diploma Preview)
*Administrators input graduate information and view immediate vector canvas rendering prior to on-chain minting.*
<p align="center">
  <img src="docs/screenshots/05_issue_studio_live_preview.png" alt="Issue Studio Live Preview" width="90%" />
</p>

### 2. Institutional Executive Dashboard
*Live metrics on total issued credentials, verification activity, active issuances, and recent on-chain events.*
<p align="center">
  <img src="docs/screenshots/04_dashboard_overview.png" alt="Executive Dashboard Overview" width="90%" />
</p>

### 3. Certificate Registry & CSV Audit Export
*Comprehensive institutional table with real-time status filters and one-click CSV export.*
<p align="center">
  <img src="docs/screenshots/06_certificate_registry.png" alt="Certificate Registry Management" width="90%" />
</p>

### 4. Multi-Modal Verification Portal
*Support for Camera QR Scanning, PDF document inspection, image drop, and manual ID entry.*
<p align="center">
  <img src="docs/screenshots/07_public_verify_portal.png" alt="Public Verification Portal" width="90%" />
</p>

### 5. Cryptographic Proof Modals
<p align="center">
  <img src="docs/screenshots/08_verification_result_valid.png" alt="Valid Verification Result" width="48%" />
  <img src="docs/screenshots/09_verification_result_revoked.png" alt="Revoked Verification Result" width="48%" />
</p>

---

## 🛠️ Technology Stack

```
Frontend Architecture
├── Next.js 14.2 (App Router, Server Actions, API Route Handlers)
├── React 18.3 & TypeScript 5.5
├── Tailwind CSS 3.4 & Lucide Icons
└── Radix UI Primitives (Modals, Dialogs, Tooltips, Tabs)

Backend & Persistence
├── Node.js 20+ Runtime
├── Prisma ORM 5.18
├── PostgreSQL (via Supabase / Local PostgreSQL)
├── Zod 3.23 (Runtime schema validation)
├── Nodemailer 6.9 (SMTP automated email dispatch)
└── jsPDF 2.5 & html5-qrcode / jsQR (Document rendering & scanning)

Web3 & Blockchain
├── Solidity 0.8.24 (OpenZeppelin v5 Contracts)
├── Hardhat 2.22 (Compilation, local node, deployment orchestration)
├── Ethers.js v6.13 (EVM interaction, JSON-RPC, cryptographic primitives)
└── Ethereum Sepolia Testnet
```

---

## 🧪 Testing & Quality Assurance

Citadel includes a **52-test automated suite** covering smart contract logic, cryptographic hashing consistency, time-boundary conditions, fuzz testing, and validation edge cases.

<p align="center">
  <img src="https://img.shields.io/badge/Test_Results-52%20Passed%20%7C%200%20Failed-success?style=for-the-badge" alt="Test Results" />
</p>

```bash
# Execute the full automated test suite
npx hardhat test
```

### Test Coverage Breakdown

| Category | Assertions & Scenarios Tested | Status |
| :--- | :--- | :---: |
| **Cryptographic Unit Tests** | Key-order invariance in canonical hashing, SHA-256 sensitivity, certificate ID formatting (`CERT-YYYY-XXXXX`). | **12 / 12 Passed** |
| **Smart Contract Lifecycle** | Contract deployment, owner permissions, issuer authorization/deauthorization, valid issuance, zero-gas verification, revocation rules. | **28 / 28 Passed** |
| **Boundary & Fuzz Testing** | 1-bit tampering detection, 1-second future expiration transitions, 50-year lifetime certificate persistence, rapid sequential issuance (30 distinct certs). | **12 / 12 Passed** |
| **Static TypeScript Check** | Full codebase type-safety validation (`npx tsc --noEmit`). | **0 Errors** |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or hosted database (e.g., Supabase)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mengchheanglong/citadel-blockchain-certificates.git
cd citadel-blockchain-certificates
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/citadel_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/citadel_db?schema=public"

# Authentication & Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-random-key"

# Blockchain Configuration (Hardhat Local / Sepolia)
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY"
PRIVATE_KEY="0xYOUR_TESTNET_PRIVATE_KEY"
CONTRACT_ADDRESS="0xYOUR_DEPLOYED_CONTRACT_ADDRESS"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Citadel Registry <no-reply@citadel.cert>"
```

### 3. Database Migration
```bash
npx prisma generate
npx prisma db push
```

### 4. Smart Contract Compilation & Local Node
```bash
# Compile contracts with Hardhat
npx hardhat compile

# (Optional) Spin up a local Ethereum JSON-RPC node
npx hardhat node

# Deploy locally
npm run hardhat:deploy:local

# Or deploy to Ethereum Sepolia Testnet
npm run hardhat:deploy:sepolia
```
*After deployment, copy the contract address printed in the terminal into your `.env` as `CONTRACT_ADDRESS`.*

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Engineering Highlights & Interview Talking Points

When presenting Citadel in technical interviews, consider discussing these core architectural and engineering highlights:

1. **Hybrid Architecture for Privacy & Scale (GDPR/FERPA):**
   *Why not store everything on-chain?* Explain the gas costs and legal issues with putting personally identifiable information on an immutable ledger. Demonstrate how Citadel’s hybrid model stores PII off-chain while anchoring mathematical proofs on Ethereum.

2. **Deterministic Canonical Hashing & The Avalanche Effect:**
   Discuss how JSON key ordering varies across engines and languages. Walk through how Citadel sorts keys lexicographically before calculating SHA-256 digests, and how a 1-bit tamper test proves complete collision and forgery resistance.

3. **Zero-Gas UX for Public Verifiers:**
   Highlight that verifiers (employers, university registrars) do not need MetaMask, cryptocurrency, or platform accounts. Citadel queries the contract via a read-only `view` function (`verifyCertificate`), making verification completely free and instantaneous.

4. **Multi-Modal Client-Side QR Processing:**
   Explain the pipeline supporting live camera scanning (`html5-qrcode`), drag-and-drop raster image parsing (`jsQR`), and client-side PDF document inspection without extra roundtrips to the backend.

5. **Contract Lifecycle State Machine:**
   Explain the 5-status verification state machine (`NotFound`, `Valid`, `Expired`, `Revoked`, `HashMismatch`) and why status priority rules evaluate `Revoked` before `Expired`.

---

## 👨‍💻 Author & Contact

**Long Mengchheang**  
Department of Software Engineering, Kirirom Institute of Technology (KIT)  
- **GitHub:** [@mengchheanglong](https://github.com/mengchheanglong)  
- **Repository:** [citadel-blockchain-certificates](https://github.com/mengchheanglong/citadel-blockchain-certificates)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

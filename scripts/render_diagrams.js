const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Diagram 1: System Architecture HTML Template
const architectureHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0B0F17;
      color: #F8FAFC;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 40px;
    }
    .diagram-container {
      width: 1200px;
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1F2937;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title-block h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .title-block p {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .badge {
      background: rgba(200, 16, 46, 0.15);
      border: 1px solid rgba(200, 16, 46, 0.4);
      color: #FF4D6A;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .layers-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }
    .layer-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px 24px;
      position: relative;
    }
    .layer-card.highlight {
      border-color: #C8102E;
      background: linear-gradient(180deg, rgba(200, 16, 46, 0.08) 0%, #1E293B 100%);
    }
    .layer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .layer-name {
      font-size: 14px;
      font-weight: 700;
      color: #E2E8F0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .layer-num {
      background: #C8102E;
      color: #FFF;
      font-size: 11px;
      font-weight: 800;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tech-tags {
      font-size: 11px;
      color: #94A3B8;
      background: #0F172A;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #1E293B;
    }
    .boxes-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .module-box {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .module-box h4 {
      font-size: 13px;
      font-weight: 600;
      color: #F1F5F9;
      margin-bottom: 4px;
    }
    .module-box p {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.4;
    }
    .flow-connector {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 16px;
      color: #64748B;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
    }
  </style>
</head>
<body>
  <div class="diagram-container">
    <div class="header">
      <div class="title-block">
        <h1>Citadel System Architecture</h1>
        <p>Four-Tier Decentralized Credential Issuing & Cryptographic Verification Platform</p>
      </div>
      <div class="badge">EVM Smart Contract + Next.js 14</div>
    </div>

    <div class="layers-grid">
      <!-- Layer 1 -->
      <div class="layer-card">
        <div class="layer-header">
          <div class="layer-name">
            <span class="layer-num">1</span>
            Presentation Layer (Client-Side Interface)
          </div>
          <span class="tech-tags">Next.js 14 App Router • Tailwind CSS • Lucide Icons • HTML5-QRCode</span>
        </div>
        <div class="boxes-row">
          <div class="module-box">
            <h4>Landing Page (/)</h4>
            <p>Obsidian dark UI, instant search bar, protocol metrics & institutional value proposition.</p>
          </div>
          <div class="module-box">
            <h4>Issuer Dashboard (/dashboard)</h4>
            <p>Live credential health metrics, issuance trend graphs, and recent activity ledger.</p>
          </div>
          <div class="module-box">
            <h4>Issue Studio (/certificates/new)</h4>
            <p>Split-screen input studio with real-time vector diploma preview canvas.</p>
          </div>
          <div class="module-box">
            <h4>Verification Portal (/verify)</h4>
            <p>Dual-mode public verification: Certificate ID text lookup & direct camera QR scanning.</p>
          </div>
        </div>
      </div>

      <div class="flow-connector">▼ RESTful HTTPS Requests / JSON Payloads / SSR Cookies ▼</div>

      <!-- Layer 2 -->
      <div class="layer-card highlight">
        <div class="layer-header">
          <div class="layer-name">
            <span class="layer-num">2</span>
            Application & API Layer (Server-Side Logic)
          </div>
          <span class="tech-tags">Node.js • Next.js Route Handlers • Zod Schemas • jsPDF • Nodemailer</span>
        </div>
        <div class="boxes-row">
          <div class="module-box">
            <h4>Authentication & Sessions</h4>
            <p>Supabase SSR Auth, route protection middleware, and institutional access control.</p>
          </div>
          <div class="module-box">
            <h4>Deterministic Hashing</h4>
            <p>Canonical key-sorted JSON hashing with SHA-256 for tamper-evident data integrity.</p>
          </div>
          <div class="module-box">
            <h4>Diploma PDF & QR Engine</h4>
            <p>Generates high-resolution vector PDF diplomas with embedded verification QR codes.</p>
          </div>
          <div class="module-box">
            <h4>Notification Service</h4>
            <p>Automated SMTP email dispatch delivering congratulatory notes and attached PDF diplomas.</p>
          </div>
        </div>
      </div>

      <div class="flow-connector">▼ Off-Chain SQL Queries (Prisma) &nbsp;&nbsp;|&nbsp;&nbsp; On-Chain JSON-RPC (Ethers.js v6) ▼</div>

      <!-- Layer 3 & 4 Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Layer 3 -->
        <div class="layer-card">
          <div class="layer-header">
            <div class="layer-name">
              <span class="layer-num">3</span>
              Persistence Layer (Off-Chain DB)
            </div>
            <span class="tech-tags">PostgreSQL • Prisma ORM</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            <div class="module-box">
              <h4>Organization Table</h4>
              <p>Issuer identities, account credentials, branding logos, and contact profiles.</p>
            </div>
            <div class="module-box">
              <h4>Certificate Table</h4>
              <p>Metadata (recipient, course, issue date, expiry), SHA-256 hash, and status.</p>
            </div>
            <div class="module-box">
              <h4>BlockchainTransaction Table</h4>
              <p>Audit trail of on-chain operations: Tx hash, block number, and contract address.</p>
            </div>
          </div>
        </div>

        <!-- Layer 4 -->
        <div class="layer-card highlight">
          <div class="layer-header">
            <div class="layer-name">
              <span class="layer-num">4</span>
              Decentralized Ledger (Blockchain)
            </div>
            <span class="tech-tags">Solidity 0.8.24 • Hardhat • Sepolia EVM</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            <div class="module-box">
              <h4>CertificateRegistry.sol</h4>
              <p>Smart contract storing keccak256(certId) -> (certHash, issuer, expiry, revoked).</p>
            </div>
            <div class="module-box">
              <h4>issueCertificate(...)</h4>
              <p>Restricted to authorized issuers; anchors 32-byte hash and validity timestamp on-chain.</p>
            </div>
            <div class="module-box">
              <h4>verifyCertificate(...)</h4>
              <p>Public gas-free view function validating hash equality and dynamic block timestamp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Diagram 2: System Flow & User Flow HTML Template
const userFlowHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0B0F17;
      color: #F8FAFC;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 40px;
    }
    .diagram-container {
      width: 1200px;
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1F2937;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title-block h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .title-block p {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .badge {
      background: rgba(200, 16, 46, 0.15);
      border: 1px solid rgba(200, 16, 46, 0.4);
      color: #FF4D6A;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .flow-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .flow-column {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
    }
    .flow-column.issuer {
      border-top: 4px solid #C8102E;
    }
    .flow-column.verifier {
      border-top: 4px solid #3B82F6;
    }
    .flow-title {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .flow-desc {
      font-size: 12px;
      color: #94A3B8;
      margin-bottom: 20px;
    }
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
    }
    .step-item {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .step-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #334155;
      color: #F8FAFC;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .step-badge.red { background: #C8102E; }
    .step-badge.blue { background: #2563EB; }
    .step-info h4 {
      font-size: 13px;
      font-weight: 600;
      color: #F1F5F9;
      margin-bottom: 3px;
    }
    .step-info p {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.4;
    }
    .step-arrow {
      text-align: center;
      color: #64748B;
      font-size: 11px;
      margin: -6px 0;
    }
  </style>
</head>
<body>
  <div class="diagram-container">
    <div class="header">
      <div class="title-block">
        <h1>Citadel System & User Flows</h1>
        <p>End-to-End Execution Lifecycles: Issuance Studio & Public Multi-Factor Verification</p>
      </div>
      <div class="badge">Issuance & Verification Lifecycles</div>
    </div>

    <div class="flow-split">
      <!-- Flow A: Organization Issuance Flow -->
      <div class="flow-column issuer">
        <div class="flow-title">
          <span>🏛️</span> Organization Issuance Flow
        </div>
        <p class="flow-desc">Autonomous pipeline from live preview to EVM ledger anchoring & SMTP delivery.</p>

        <div class="step-list">
          <div class="step-item">
            <div class="step-badge red">1</div>
            <div class="step-info">
              <h4>Organization Authentication</h4>
              <p>Institution signs into the Citadel Portal. Session is authenticated via Supabase SSR cookies.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge red">2</div>
            <div class="step-info">
              <h4>Data Entry & Live Canvas Preview</h4>
              <p>Registrar inputs recipient details, degree title, and expiry. Live SVG diploma renders in real time.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge red">3</div>
            <div class="step-info">
              <h4>Deterministic SHA-256 Hashing</h4>
              <p>Server generates unique CERT-2026-XXXX ID and calculates canonical sorted-key SHA-256 digest.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge red">4</div>
            <div class="step-info">
              <h4>Blockchain Anchoring (Smart Contract)</h4>
              <p>Invokes issueCertificate on EVM. Contract writes keccak256(id) -> (certHash, expiry) into block.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge red">5</div>
            <div class="step-info">
              <h4>Database Record & Audit Log</h4>
              <p>Saves student profile off-chain in PostgreSQL with linked transaction hash and block number.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge red">6</div>
            <div class="step-info">
              <h4>PDF Diploma & Email Notification</h4>
              <p>jsPDF renders print-ready diploma with QR code. Nodemailer dispatches email with attached PDF.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Flow B: Public Verification Flow -->
      <div class="flow-column verifier">
        <div class="flow-title">
          <span>🔍</span> Public Verification Flow
        </div>
        <p class="flow-desc">Zero-login, gas-free cryptographic proof inspection for employers and registrars.</p>

        <div class="step-list">
          <div class="step-item">
            <div class="step-badge blue">1</div>
            <div class="step-info">
              <h4>Access Public Portal (/verify)</h4>
              <p>Verifier opens portal. Options: Manual Certificate ID entry or live device camera QR code scan.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge blue">2</div>
            <div class="step-info">
              <h4>Metadata Lookup & Reconstruction</h4>
              <p>Server queries PostgreSQL for certificate record and reconstructs the canonical data payload.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge blue">3</div>
            <div class="step-info">
              <h4>Cryptographic Hash Verification</h4>
              <p>Server calculates SHA-256 hash of reconstructed data to detect any database tampering.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge blue">4</div>
            <div class="step-info">
              <h4>Smart Contract Query (verifyCertificate)</h4>
              <p>Calls EVM contract view function. Checks hash equality and evaluates block.timestamp vs expiry.</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge blue">5</div>
            <div class="step-info">
              <h4>Consensus Status Resolution</h4>
              <p>Contract returns: Valid (1), Expired (2), Revoked (3), HashMismatch (4), or NotFound (0).</p>
            </div>
          </div>
          <div class="step-arrow">▼</div>

          <div class="step-item">
            <div class="step-badge blue">6</div>
            <div class="step-info">
              <h4>Cryptographic Proof Card Display</h4>
              <p>Renders green/yellow/red status badge, recipient details, issuing institution, and on-chain Tx hash.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Diagram 3: Database ER Diagram HTML Template
const erDiagramHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0B0F17;
      color: #F8FAFC;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 40px;
    }
    .diagram-container {
      width: 1200px;
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1F2937;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title-block h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .title-block p {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .badge {
      background: rgba(200, 16, 46, 0.15);
      border: 1px solid rgba(200, 16, 46, 0.4);
      color: #FF4D6A;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .er-grid {
      display: grid;
      grid-template-columns: 1fr auto 1.4fr auto 1fr;
      align-items: center;
      gap: 16px;
    }
    .entity-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .entity-header {
      background: #0F172A;
      padding: 12px 16px;
      border-bottom: 2px solid #C8102E;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .entity-header h3 {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }
    .entity-header span {
      font-size: 11px;
      color: #94A3B8;
      background: #1E293B;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .fields-list {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .field-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    .field-name {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #F1F5F9;
      font-family: 'SF Mono', Consolas, Monaco, monospace;
    }
    .key-badge {
      font-size: 9px;
      font-weight: 800;
      padding: 1px 4px;
      border-radius: 3px;
    }
    .key-pk { background: #C8102E; color: #FFF; }
    .key-fk { background: #2563EB; color: #FFF; }
    .key-uk { background: #059669; color: #FFF; }
    .field-type {
      color: #94A3B8;
      font-size: 11px;
    }
    .relation-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748B;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
    }
    .relation-line {
      width: 40px;
      height: 2px;
      background: #334155;
      margin: 6px 0;
      position: relative;
    }
    .relation-line::after {
      content: '';
      position: absolute;
      right: 0;
      top: -3px;
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 6px solid #64748B;
    }
  </style>
</head>
<body>
  <div class="diagram-container">
    <div class="header">
      <div class="title-block">
        <h1>Citadel Relational Database Design (ER Diagram)</h1>
        <p>PostgreSQL Schema via Prisma ORM: Off-Chain Metadata & On-Chain Audit Linking</p>
      </div>
      <div class="badge">Entity Relationship Model</div>
    </div>

    <div class="er-grid">
      <!-- Entity 1: Organization -->
      <div class="entity-card">
        <div class="entity-header">
          <h3>Organization</h3>
          <span>Issuer Table</span>
        </div>
        <div class="fields-list">
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-pk">PK</span> id</span>
            <span class="field-type">UUID</span>
          </div>
          <div class="field-row">
            <span class="field-name">name</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-uk">UK</span> email</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">passwordHash</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">description</span>
            <span class="field-type">String?</span>
          </div>
          <div class="field-row">
            <span class="field-name">website</span>
            <span class="field-type">String?</span>
          </div>
          <div class="field-row">
            <span class="field-name">logoUrl</span>
            <span class="field-type">String?</span>
          </div>
          <div class="field-row">
            <span class="field-name">createdAt</span>
            <span class="field-type">DateTime</span>
          </div>
        </div>
      </div>

      <!-- Relationship 1: 1 to Many -->
      <div class="relation-link">
        <span>1 : N</span>
        <div class="relation-line"></div>
        <span>issues</span>
      </div>

      <!-- Entity 2: Certificate -->
      <div class="entity-card">
        <div class="entity-header" style="border-bottom-color: #2563EB;">
          <h3>Certificate</h3>
          <span>Academic Credential</span>
        </div>
        <div class="fields-list">
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-pk">PK</span> id</span>
            <span class="field-type">UUID</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-uk">UK</span> certificateId</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-fk">FK</span> organizationId</span>
            <span class="field-type">UUID</span>
          </div>
          <div class="field-row">
            <span class="field-name">recipientName</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">recipientEmail</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">courseName</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">issueDate</span>
            <span class="field-type">DateTime</span>
          </div>
          <div class="field-row">
            <span class="field-name">expiryDate</span>
            <span class="field-type">DateTime?</span>
          </div>
          <div class="field-row">
            <span class="field-name">certificateHash</span>
            <span class="field-type">String (32B)</span>
          </div>
          <div class="field-row">
            <span class="field-name">status</span>
            <span class="field-type">Enum</span>
          </div>
          <div class="field-row">
            <span class="field-name">revokeReason</span>
            <span class="field-type">String?</span>
          </div>
          <div class="field-row">
            <span class="field-name">qrCodeData</span>
            <span class="field-type">Text (PNG)</span>
          </div>
          <div class="field-row">
            <span class="field-name">emailSent</span>
            <span class="field-type">Boolean</span>
          </div>
        </div>
      </div>

      <!-- Relationship 2: 1 to Many -->
      <div class="relation-link">
        <span>1 : N</span>
        <div class="relation-line"></div>
        <span>logs</span>
      </div>

      <!-- Entity 3: BlockchainTransaction -->
      <div class="entity-card">
        <div class="entity-header" style="border-bottom-color: #059669;">
          <h3>BlockchainTransaction</h3>
          <span>EVM Audit Ledger</span>
        </div>
        <div class="fields-list">
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-pk">PK</span> id</span>
            <span class="field-type">UUID</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-fk">FK</span> certificateId</span>
            <span class="field-type">UUID</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="key-badge key-uk">UK</span> txHash</span>
            <span class="field-type">String (66B)</span>
          </div>
          <div class="field-row">
            <span class="field-name">blockNumber</span>
            <span class="field-type">BigInt</span>
          </div>
          <div class="field-row">
            <span class="field-name">networkName</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">contractAddress</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">action</span>
            <span class="field-type">Enum</span>
          </div>
          <div class="field-row">
            <span class="field-name">timestamp</span>
            <span class="field-type">DateTime</span>
          </div>
          <div class="field-row">
            <span class="field-name">confirmed</span>
            <span class="field-type">Boolean</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Diagram 4: Smart Contract State Machine HTML Template
const smartContractHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0B0F17;
      color: #F8FAFC;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 40px;
    }
    .diagram-container {
      width: 1200px;
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1F2937;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title-block h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .title-block p {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .badge {
      background: rgba(200, 16, 46, 0.15);
      border: 1px solid rgba(200, 16, 46, 0.4);
      color: #FF4D6A;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .states-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .state-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 18px;
      position: relative;
    }
    .state-card.valid { border-left: 4px solid #10B981; }
    .state-card.expired { border-left: 4px solid #F59E0B; }
    .state-card.revoked { border-left: 4px solid #EF4444; }
    .state-card.tampered { border-left: 4px solid #8B5CF6; }
    .state-card.notfound { border-left: 4px solid #64748B; }
    .state-card.contract { border-left: 4px solid #C8102E; grid-column: span 3; }
    .state-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .state-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .status-code {
      font-size: 11px;
      font-family: monospace;
      padding: 2px 6px;
      border-radius: 4px;
      background: #0F172A;
      color: #94A3B8;
    }
    .state-desc {
      font-size: 12px;
      color: #94A3B8;
      line-height: 1.4;
    }
    .contract-methods {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 10px;
    }
    .method-box {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 12px;
    }
    .method-box h4 {
      font-size: 12px;
      font-family: 'SF Mono', Consolas, monospace;
      color: #FF4D6A;
      margin-bottom: 4px;
    }
    .method-box p {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="diagram-container">
    <div class="header">
      <div class="title-block">
        <h1>CertificateRegistry.sol Smart Contract Architecture</h1>
        <p>State Machine Lifecycle, Access Modifiers, and Cryptographic Invariance on EVM</p>
      </div>
      <div class="badge">Solidity 0.8.24 • EVM State Machine</div>
    </div>

    <div class="states-grid">
      <div class="state-card valid">
        <div class="state-header">
          <div class="state-title">🟢 VALID</div>
          <span class="status-code">Status = 1</span>
        </div>
        <p class="state-desc">The certificate hash matches the immutable on-chain record, issuer is authorized, and block.timestamp <= expirationDate (or lifetime).</p>
      </div>

      <div class="state-card expired">
        <div class="state-header">
          <div class="state-title">🟡 EXPIRED</div>
          <span class="status-code">Status = 2</span>
        </div>
        <p class="state-desc">The credential was authentic when issued, but current block.timestamp has exceeded the designated expirationDate timestamp.</p>
      </div>

      <div class="state-card revoked">
        <div class="state-header">
          <div class="state-title">🔴 REVOKED</div>
          <span class="status-code">Status = 3</span>
        </div>
        <p class="state-desc">Explicitly invalidated on-chain by the issuing organization or contract owner. Irreversible state with permanently recorded revocation timestamp.</p>
      </div>

      <div class="state-card tampered">
        <div class="state-header">
          <div class="state-title">🟣 HASH MISMATCH</div>
          <span class="status-code">Status = 4</span>
        </div>
        <p class="state-desc">The certificate ID exists on-chain, but the computed SHA-256 payload does not match. Immediately detects forged student names or grade alterations.</p>
      </div>

      <div class="state-card notfound">
        <div class="state-header">
          <div class="state-title">⚪ NOT FOUND</div>
          <span class="status-code">Status = 0</span>
        </div>
        <p class="state-desc">The requested certificate ID has never been registered on the blockchain. Protects against fictional or fabricated certificate identifiers.</p>
      </div>

      <div class="state-card contract">
        <div class="state-header">
          <div class="state-title">🛡️ Smart Contract Core Interface & Access Modifiers</div>
          <span class="status-code">0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
        </div>
        <div class="contract-methods">
          <div class="method-box">
            <h4>issueCertificate(...)</h4>
            <p><strong>onlyIssuer:</strong> Validates uniqueness, ensures future expiry, writes keccak256(id) -> struct. Emits CertificateIssued.</p>
          </div>
          <div class="method-box">
            <h4>verifyCertificate(...)</h4>
            <p><strong>public view:</strong> Gas-free execution. Computes hash equality and dynamically evaluates block.timestamp against expiry.</p>
          </div>
          <div class="method-box">
            <h4>revokeCertificate(...)</h4>
            <p><strong>onlyIssuerOrOwner:</strong> Enforces cryptographic authority to prevent unauthorized revocation. Emits CertificateRevoked.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function renderDiagrams() {
  console.log('Rendering high-resolution diagrams with Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1300, height: 860 },
    deviceScaleFactor: 2.0, // Crisp 2x retina export
  });
  const page = await context.newPage();

  // 1. Architecture Diagram
  console.log('1. Rendering diagram_architecture.png...');
  await page.setContent(architectureHtml, { waitUntil: 'load' });
  const archElement = await page.$('.diagram-container');
  await archElement.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'diagram_architecture.png'),
  });

  // 2. User Flow Diagram
  console.log('2. Rendering diagram_user_flow.png...');
  await page.setContent(userFlowHtml, { waitUntil: 'load' });
  const flowElement = await page.$('.diagram-container');
  await flowElement.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'diagram_user_flow.png'),
  });

  // 3. Database ER Diagram
  console.log('3. Rendering diagram_er.png...');
  await page.setContent(erDiagramHtml, { waitUntil: 'load' });
  const erElement = await page.$('.diagram-container');
  await erElement.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'diagram_er.png'),
  });

  // 4. Smart Contract Diagram
  console.log('4. Rendering diagram_smart_contract.png...');
  await page.setContent(smartContractHtml, { waitUntil: 'load' });
  const scElement = await page.$('.diagram-container');
  await scElement.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'diagram_smart_contract.png'),
  });

  await browser.close();
  console.log('✅ ALL 4 DIAGRAMS SUCCESSFULLY RENDERED AS CRISP PNGs!');
}

renderDiagrams().catch((err) => {
  console.error('Failed to render diagrams:', err);
  process.exit(1);
});

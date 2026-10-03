const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

// Common SVG definitions (drop shadows, markers, gradients)
const SVG_DEFS = `
  <defs>
    <!-- Drop Shadow Filter -->
    <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.08" />
    </filter>
    <filter id="hoverShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.12" />
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563EB" />
    </marker>
    <marker id="arrow-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
    </marker>
    <marker id="arrow-crimson" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#C8102E" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16A34A" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7C3AED" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D97706" />
    </marker>

    <!-- Crow's Foot & Cardinality Markers for ERD -->
    <marker id="crow-many" viewBox="0 0 16 16" refX="16" refY="8" markerWidth="12" markerHeight="12" orient="auto">
      <path d="M 0 1 L 16 8 L 0 15 M 10 1 L 10 15" stroke="#475569" stroke-width="1.8" fill="none" />
    </marker>
    <marker id="crow-one" viewBox="0 0 16 16" refX="0" refY="8" markerWidth="12" markerHeight="12" orient="auto">
      <path d="M 6 1 L 6 15 M 12 1 L 12 15" stroke="#475569" stroke-width="1.8" fill="none" />
    </marker>
  </defs>
`;

function wrapHtml(title, figureNo, svgContent, width = 1400, height = 900) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${figureNo}: ${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .canvas-card {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      padding: 28px 36px 32px 36px;
      width: ${width + 72}px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #C8102E;
      padding-bottom: 14px;
      margin-bottom: 22px;
    }
    .title-group h1 {
      font-size: 19px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.01em;
    }
    .title-group p {
      font-size: 12px;
      color: #64748B;
      font-weight: 500;
      margin-top: 3px;
    }
    .badge {
      background: #FFF1F2;
      color: #C8102E;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 6px;
      border: 1px solid #FECDD3;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    svg text {
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .mono {
      font-family: 'Consolas', 'Fira Code', 'Monaco', monospace;
    }
  </style>
</head>
<body>
  <div class="canvas-card">
    <div class="header-bar">
      <div class="title-group">
        <h1>${figureNo}: ${title}</h1>
        <p>Citadel Academic Credential Verification Platform • Official Software Engineering Specification</p>
      </div>
      <div class="badge">Official Technical Diagram</div>
    </div>
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${SVG_DEFS}
      ${svgContent}
    </svg>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 1. ARCHITECTURE DIAGRAM (Figure 2.1)
// ---------------------------------------------------------------------------
function getArchitectureSvg() {
  const w = 1360;
  const h = 760;

  return `
    <!-- BACKGROUND GRID / CANVAS -->
    <rect width="${w}" height="${h}" fill="#FAFAFA" rx="8" />

    <!-- ==================== TIER 1: CLIENT TIER ==================== -->
    <rect x="25" y="25" width="280" height="660" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4 4" />
    <rect x="25" y="25" width="280" height="38" rx="10" fill="#E2E8F0" />
    <text x="40" y="49" font-size="13" font-weight="700" fill="#1E293B">TIER 1: PRESENTATION & CLIENTS</text>

    <!-- Client 1: Org Portal -->
    <g transform="translate(45, 85)" filter="url(#cardShadow)">
      <rect width="240" height="150" rx="8" fill="#FFFFFF" stroke="#2563EB" stroke-width="2" />
      <rect width="240" height="32" rx="8" fill="#EFF6FF" />
      <text x="14" y="21" font-size="12" font-weight="700" fill="#1E40AF">🏛️ Institution Portal (/dashboard)</text>
      <text x="14" y="55" font-size="11" font-weight="600" fill="#0F172A">• Next.js 14 Client Component</text>
      <text x="14" y="75" font-size="11" fill="#475569">• Live Diploma Canvas Studio</text>
      <text x="14" y="95" font-size="11" fill="#475569">• Certificate Registry Management</text>
      <text x="14" y="115" font-size="11" fill="#475569">• One-Click Revocation Modal</text>
      <rect x="14" y="127" width="105" height="16" rx="4" fill="#DBEAFE" />
      <text x="20" y="139" font-size="9.5" font-weight="700" fill="#1D4ED8">ROLE: ISSUER ADMIN</text>
    </g>

    <!-- Client 2: Public Verifier -->
    <g transform="translate(45, 275)" filter="url(#cardShadow)">
      <rect width="240" height="150" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <rect width="240" height="32" rx="8" fill="#ECFDF5" />
      <text x="14" y="21" font-size="12" font-weight="700" fill="#065F46">🔍 Public Verifier (/verify)</text>
      <text x="14" y="55" font-size="11" font-weight="600" fill="#0F172A">• HTML5 Camera QR Code Scanner</text>
      <text x="14" y="75" font-size="11" fill="#475569">• Manual Certificate ID Lookup</text>
      <text x="14" y="95" font-size="11" fill="#475569">• Interactive Blockchain Proof Card</text>
      <text x="14" y="115" font-size="11" fill="#475569">• Real-time Consensus Status Badge</text>
      <rect x="14" y="127" width="105" height="16" rx="4" fill="#D1FAE5" />
      <text x="20" y="139" font-size="9.5" font-weight="700" fill="#047857">ROLE: PUBLIC / EMPLOYER</text>
    </g>

    <!-- Client 3: Student Email / PDF -->
    <g transform="translate(45, 465)" filter="url(#cardShadow)">
      <rect width="240" height="135" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="2" />
      <rect width="240" height="32" rx="8" fill="#FFFBEB" />
      <text x="14" y="21" font-size="12" font-weight="700" fill="#92400E">🎓 Graduate Recipient</text>
      <text x="14" y="55" font-size="11" font-weight="600" fill="#0F172A">• Automated Email Notification</text>
      <text x="14" y="75" font-size="11" fill="#475569">• Attached Vector PDF Diploma</text>
      <text x="14" y="95" font-size="11" fill="#475569">• High-Resolution Verification QR</text>
      <rect x="14" y="112" width="105" height="16" rx="4" fill="#FEF3C7" />
      <text x="20" y="124" font-size="9.5" font-weight="700" fill="#B45309">ROLE: CREDENTIAL HOLDER</text>
    </g>


    <!-- ==================== TIER 2: APPLICATION SERVICES ==================== -->
    <rect x="345" y="25" width="370" height="660" rx="10" fill="#F8FAFC" stroke="#6366F1" stroke-width="1.5" stroke-dasharray="4 4" />
    <rect x="345" y="25" width="370" height="38" rx="10" fill="#EEF2FF" />
    <text x="360" y="49" font-size="13" font-weight="700" fill="#3730A3">TIER 2: NEXT.JS 14 APPLICATION &amp; API SERVICES</text>

    <!-- Service 1: API Router & Auth -->
    <g transform="translate(365, 80)" filter="url(#cardShadow)">
      <rect width="330" height="95" rx="8" fill="#FFFFFF" stroke="#4F46E5" stroke-width="1.5" />
      <rect width="330" height="28" rx="8" fill="#EEF2FF" />
      <text x="14" y="19" font-size="11.5" font-weight="700" fill="#3730A3">🛡️ Auth Middleware &amp; Input Validation</text>
      <text x="14" y="47" font-size="10.5" fill="#334155">• Supabase SSR Session Token Verification</text>
      <text x="14" y="65" font-size="10.5" fill="#334155">• Strict Zod Schema Sanitization &amp; Type Safety</text>
      <text x="14" y="83" font-size="10" font-weight="600" fill="#4F46E5">Endpoints: /api/auth/*, /api/certificates/*</text>
    </g>

    <!-- Service 2: Canonical Hashing Engine -->
    <g transform="translate(365, 195)" filter="url(#cardShadow)">
      <rect width="330" height="100" rx="8" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
      <rect width="330" height="28" rx="8" fill="#F5F3FF" />
      <text x="14" y="19" font-size="11.5" font-weight="700" fill="#5B21B6">🔐 Canonical SHA-256 Hashing Engine</text>
      <text x="14" y="47" font-size="10.5" fill="#334155">• Deterministic Lexicographical Key Sorting</text>
      <text x="14" y="65" font-size="10.5" fill="#334155">• JSON Normalization (LF linebreaks, UTF-8)</text>
      <text x="14" y="83" font-size="10.5" font-weight="600" fill="#7C3AED">• Output: 32-Byte Hex Digest (0x...)</text>
    </g>

    <!-- Service 3: Verification Gateway Handler -->
    <g transform="translate(365, 315)" filter="url(#cardShadow)">
      <rect width="330" height="90" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5" />
      <rect width="330" height="28" rx="8" fill="#ECFDF5" />
      <text x="14" y="19" font-size="11.5" font-weight="700" fill="#065F46">🔍 Verification Handler (/api/verify)</text>
      <text x="14" y="47" font-size="10.5" fill="#334155">• Coordinates DB Record Retrieval &amp; Payload Rehashing</text>
      <text x="14" y="65" font-size="10.5" fill="#334155">• Dispatches Gas-Free Web3 View Query to Contract</text>
      <text x="14" y="81" font-size="9.5" font-weight="600" fill="#047857">Evaluates Consensus State: Valid | Exp | Rev | Mismatch</text>
    </g>

    <!-- Service 4: PDF & QR Code Engine -->
    <g transform="translate(365, 425)" filter="url(#cardShadow)">
      <rect width="330" height="75" rx="8" fill="#FFFFFF" stroke="#0891B2" stroke-width="1.5" />
      <rect width="330" height="26" rx="8" fill="#ECFEFF" />
      <text x="14" y="18" font-size="11" font-weight="700" fill="#155E75">📄 Document Engine (jsPDF + QRCode)</text>
      <text x="14" y="44" font-size="10" fill="#334155">• Vector PDF Diploma Generation (Citadel Crimson)</text>
      <text x="14" y="60" font-size="10" fill="#334155">• High-Density QR Matrix with Direct Verify URL</text>
    </g>

    <!-- Service 5: Nodemailer Dispatcher -->
    <g transform="translate(365, 520)" filter="url(#cardShadow)">
      <rect width="330" height="70" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5" />
      <rect width="330" height="26" rx="8" fill="#FFFBEB" />
      <text x="14" y="18" font-size="11" font-weight="700" fill="#92400E">✉️ Nodemailer SMTP Notification Service</text>
      <text x="14" y="44" font-size="10" fill="#334155">• Asynchronous TLS Delivery with Attached PDF</text>
      <text x="14" y="60" font-size="9.5" font-weight="600" fill="#D97706">Direct diploma access link dispatched to graduate</text>
    </g>

    <!-- Service 6: Web3 Signer Client -->
    <g transform="translate(365, 608)" filter="url(#cardShadow)">
      <rect width="330" height="65" rx="8" fill="#FFFFFF" stroke="#BE123C" stroke-width="1.5" />
      <rect width="330" height="24" rx="8" fill="#FFF1F2" />
      <text x="14" y="17" font-size="11" font-weight="700" fill="#9F1239">⚡ Ethers.js v6 Web3 Client &amp; Signer</text>
      <text x="14" y="40" font-size="9.5" fill="#334155">• Smart Contract ABI Interface • Nonce &amp; Gas Logic</text>
      <text x="14" y="54" font-size="9.5" font-weight="600" fill="#BE123C">Gas-free view calls + signed write transactions</text>
    </g>


    <!-- ==================== TIER 3: PERSISTENCE LAYER ==================== -->
    <rect x="755" y="25" width="270" height="660" rx="10" fill="#F8FAFC" stroke="#059669" stroke-width="1.5" stroke-dasharray="4 4" />
    <rect x="755" y="25" width="270" height="38" rx="10" fill="#ECFDF5" />
    <text x="770" y="49" font-size="13" font-weight="700" fill="#065F46">TIER 3: PERSISTENCE (OFF-CHAIN)</text>

    <!-- Prisma ORM -->
    <g transform="translate(775, 80)" filter="url(#cardShadow)">
      <rect width="230" height="70" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5" />
      <rect width="230" height="26" rx="8" fill="#ECFDF5" />
      <text x="12" y="18" font-size="11" font-weight="700" fill="#047857">🔷 Prisma ORM Client</text>
      <text x="12" y="44" font-size="10" fill="#334155">• Type-Safe Query Builder &amp; Pool</text>
      <text x="12" y="58" font-size="9.5" fill="#64748B">Connection Pooling on Port 5432</text>
    </g>

    <!-- PostgreSQL DB Box -->
    <g transform="translate(775, 170)" filter="url(#cardShadow)">
      <rect width="230" height="425" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <rect width="230" height="32" rx="8" fill="#D1FAE5" />
      <text x="12" y="21" font-size="11.5" font-weight="800" fill="#065F46">🐘 PostgreSQL Database (Supabase)</text>

      <!-- Table 1 -->
      <rect x="12" y="42" width="206" height="105" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1" />
      <text x="20" y="60" font-size="10.5" font-weight="700" fill="#166534">📋 Organization Table</text>
      <text x="20" y="77" font-size="9.5" fill="#334155">• id (UUIDv4, PK)</text>
      <text x="20" y="93" font-size="9.5" fill="#334155">• name, email (UK), website</text>
      <text x="20" y="109" font-size="9.5" fill="#334155">• passwordHash (Bcrypt)</text>
      <text x="20" y="125" font-size="9.5" fill="#334155">• logoUrl, createdAt, updatedAt</text>
      <text x="20" y="141" font-size="8.5" font-weight="600" fill="#15803D">Relation: 1:N Certificates</text>

      <!-- Table 2 -->
      <rect x="12" y="160" width="206" height="135" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1" />
      <text x="20" y="178" font-size="10.5" font-weight="700" fill="#166534">📜 Certificate Table</text>
      <text x="20" y="195" font-size="9.5" fill="#334155">• id (UUIDv4, PK)</text>
      <text x="20" y="211" font-size="9.5" fill="#334155">• certificateId (UK, formatted)</text>
      <text x="20" y="227" font-size="9.5" fill="#334155">• organizationId (FK)</text>
      <text x="20" y="243" font-size="9.5" fill="#334155">• recipientName, courseName</text>
      <text x="20" y="259" font-size="9.5" fill="#334155">• certificateHash (SHA-256)</text>
      <text x="20" y="275" font-size="9.5" fill="#334155">• status, revokeReason, expiry</text>

      <!-- Table 3 -->
      <rect x="12" y="308" width="206" height="105" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1" />
      <text x="20" y="326" font-size="10.5" font-weight="700" fill="#166534">🔗 BlockchainTx Table</text>
      <text x="20" y="343" font-size="9.5" fill="#334155">• id (UUID, PK), certificateId (FK)</text>
      <text x="20" y="359" font-size="9.5" fill="#334155">• txHash (UK, 66-char hex)</text>
      <text x="20" y="375" font-size="9.5" fill="#334155">• blockNumber, network, gasUsed</text>
      <text x="20" y="391" font-size="9.5" fill="#334155">• action (ISSUE | REVOKE)</text>
      <text x="20" y="405" font-size="8.5" font-weight="600" fill="#15803D">Complete immutable audit trail</text>
    </g>


    <!-- ==================== TIER 4: BLOCKCHAIN EVM ==================== -->
    <rect x="1065" y="25" width="270" height="660" rx="10" fill="#F8FAFC" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 4" />
    <rect x="1065" y="25" width="270" height="38" rx="10" fill="#FFF1F2" />
    <text x="1080" y="49" font-size="13" font-weight="700" fill="#9F1239">TIER 4: BLOCKCHAIN (ON-CHAIN)</text>

    <!-- Node / Network Box -->
    <g transform="translate(1085, 85)" filter="url(#cardShadow)">
      <rect width="230" height="85" rx="8" fill="#FFFFFF" stroke="#C8102E" stroke-width="1.5" />
      <rect width="230" height="26" rx="8" fill="#FFF1F2" />
      <text x="12" y="18" font-size="11" font-weight="700" fill="#9F1239">🌐 EVM Network Node</text>
      <text x="12" y="44" font-size="10" fill="#334155">• Hardhat Local Node (127.0.0.1:8545)</text>
      <text x="12" y="60" font-size="10" fill="#334155">• Ethereum Sepolia Public Testnet</text>
      <text x="12" y="76" font-size="9.5" font-weight="600" fill="#BE123C">Standard JSON-RPC 2.0 Protocol</text>
    </g>

    <!-- Smart Contract Box -->
    <g transform="translate(1085, 195)" filter="url(#cardShadow)">
      <rect width="230" height="270" rx="8" fill="#FFFFFF" stroke="#C8102E" stroke-width="2" />
      <rect width="230" height="32" rx="8" fill="#FFE4E6" />
      <text x="12" y="21" font-size="11.5" font-weight="800" fill="#9F1239">📜 CertificateRegistry.sol</text>

      <rect x="12" y="44" width="206" height="50" rx="4" fill="#FFF1F2" />
      <text x="18" y="61" font-size="10" font-weight="700" fill="#881337">issueCertificate()</text>
      <text x="18" y="76" font-size="9" fill="#475569">Stores (idHash => certHash, expiry)</text>
      <text x="18" y="88" font-size="9" fill="#047857">Emits: CertificateIssued</text>

      <rect x="12" y="104" width="206" height="50" rx="4" fill="#FFF1F2" />
      <text x="18" y="121" font-size="10" font-weight="700" fill="#881337">verifyCertificate() [view]</text>
      <text x="18" y="136" font-size="9" fill="#475569">Returns: (isValid, isRevoked, isExpired)</text>
      <text x="18" y="148" font-size="9" fill="#047857">Gas Cost: 0 ETH (Gas-Free)</text>

      <rect x="12" y="164" width="206" height="50" rx="4" fill="#FFF1F2" />
      <text x="18" y="181" font-size="10" font-weight="700" fill="#881337">revokeCertificate()</text>
      <text x="18" y="196" font-size="9" fill="#475569">Flags isRevoked = true, stores reason</text>
      <text x="18" y="208" font-size="9" fill="#047857">Emits: CertificateRevoked</text>

      <rect x="12" y="224" width="206" height="34" rx="4" fill="#F1F5F9" />
      <text x="18" y="240" font-size="9" font-weight="600" fill="#334155">Security: onlyIssuer, Ownable</text>
      <text x="18" y="252" font-size="8.5" fill="#64748B">Tamper-Proof & Non-Custodial</text>
    </g>

    <!-- EVM State Box -->
    <g transform="translate(1085, 485)" filter="url(#cardShadow)">
      <rect width="230" height="180" rx="8" fill="#FFFFFF" stroke="#9333EA" stroke-width="1.5" />
      <rect width="230" height="28" rx="8" fill="#FAF5FF" />
      <text x="12" y="19" font-size="11" font-weight="700" fill="#6B21A8">💾 EVM Immutable Ledger State</text>
      <text x="12" y="46" font-size="9.5" font-weight="600" fill="#334155">Storage Mapping:</text>
      <text x="12" y="62" font-size="8.5" fill="#7C3AED" class="mono">mapping(bytes32 => CertRecord)</text>
      <text x="12" y="82" font-size="9.5" fill="#334155">• certHash: bytes32 (SHA-256)</text>
      <text x="12" y="98" font-size="9.5" fill="#334155">• issuer: address (20-byte)</text>
      <text x="12" y="114" font-size="9.5" fill="#334155">• issueDate: uint256 (timestamp)</text>
      <text x="12" y="130" font-size="9.5" fill="#334155">• expirationDate: uint256</text>
      <text x="12" y="146" font-size="9.5" fill="#334155">• isRevoked: bool</text>
      <text x="12" y="166" font-size="9" font-weight="700" fill="#047857">✓ Cryptographically Permanent</text>
    </g>

    <!-- ==================== CONNECTORS & DATA FLOWS ==================== -->
    <!-- Line 1: Admin Portal -> App Server Validation -->
    <path d="M 285 130 L 365 130" fill="none" stroke="#2563EB" stroke-width="2" marker-end="url(#arrow-blue)" />
    <rect x="290" y="116" width="70" height="15" rx="3" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="0.8" />
    <text x="295" y="127" font-size="8.5" font-weight="700" fill="#1E40AF">HTTPS POST</text>

    <!-- Line 2: Validation -> Hash Engine -->
    <path d="M 530 175 L 530 195" fill="none" stroke="#6366F1" stroke-width="1.8" marker-end="url(#arrow-slate)" />

    <!-- Line 3: Public Verifier -> /api/verify handler -->
    <path d="M 285 350 L 365 350" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)" />
    <rect x="288" y="336" width="74" height="15" rx="3" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="0.8" />
    <text x="292" y="347" font-size="8.5" font-weight="700" fill="#065F46">HTTPS GET</text>

    <!-- Line 4: /api/verify -> Prisma DB Lookup -->
    <path d="M 695 350 L 775 350" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)" />
    <rect x="702" y="336" width="65" height="15" rx="3" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="0.8" />
    <text x="708" y="347" font-size="8.5" font-weight="700" fill="#065F46">DB Query</text>

    <!-- Line 5: Hash Engine -> Doc Engine -->
    <path d="M 530 295 L 530 425" fill="none" stroke="#6366F1" stroke-width="1.8" marker-end="url(#arrow-slate)" />

    <!-- Line 6: Doc Engine -> Nodemailer -->
    <path d="M 530 500 L 530 520" fill="none" stroke="#6366F1" stroke-width="1.8" marker-end="url(#arrow-slate)" />

    <!-- Line 7: Nodemailer -> Student Email -->
    <path d="M 365 545 L 285 545" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arrow-amber)" />
    <rect x="290" y="531" width="70" height="15" rx="3" fill="#FFFBEB" stroke="#FDE68A" stroke-width="0.8" />
    <text x="294" y="542" font-size="8.5" font-weight="700" fill="#92400E">SMTP / PDF</text>

    <!-- Line 8: Hash Engine -> Web3 Layer (32-byte hash) -->
    <path d="M 695 245 L 730 245 L 730 640 L 695 640" fill="none" stroke="#7C3AED" stroke-width="1.8" marker-end="url(#arrow-purple)" />
    <text x="736" y="445" font-size="8.5" font-weight="700" fill="#7C3AED">32-Byte Hash</text>

    <!-- Line 9: App Server -> Prisma ORM -->
    <path d="M 695 115 L 775 115" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)" />
    <rect x="704" y="101" width="60" height="15" rx="3" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="0.8" />
    <text x="709" y="112" font-size="8.5" font-weight="700" fill="#065F46">Prisma CRUD</text>

    <!-- Line 10: Prisma -> PostgreSQL -->
    <path d="M 890 150 L 890 170" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)" />
    <text x="898" y="163" font-size="8.5" font-weight="600" fill="#047857">SQL / TCP</text>

    <!-- Line 11: Web3 Signer -> Smart Contract (Write) -->
    <path d="M 695 640 L 1055 640 L 1055 330 L 1085 330" fill="none" stroke="#C8102E" stroke-width="2" marker-end="url(#arrow-crimson)" />
    <rect x="800" y="628" width="145" height="16" rx="3" fill="#FFF1F2" stroke="#FECDD3" stroke-width="0.8" />
    <text x="806" y="640" font-size="8.5" font-weight="700" fill="#9F1239">JSON-RPC: issueCertificate()</text>

    <!-- Line 12: Gas-free verifyCertificate() from /api/verify to contract -->
    <path d="M 695 375 L 725 375 L 725 30 L 1055 30 L 1055 125 L 1085 125" fill="none" stroke="#059669" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#arrow-green)" />
    <rect x="820" y="21" width="165" height="16" rx="3" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="0.8" />
    <text x="826" y="33" font-size="8.5" font-weight="700" fill="#065F46">Gas-Free view: verifyCertificate()</text>

    <!-- Line 13: Contract -> State storage -->
    <path d="M 1200 465 L 1200 485" fill="none" stroke="#9333EA" stroke-width="2" marker-end="url(#arrow-purple)" />
    <text x="1208" y="478" font-size="8.5" font-weight="600" fill="#7C3AED">SSTORE</text>

    <!-- ==================== BOTTOM LEGEND ==================== -->
    <g transform="translate(25, 700)">
      <rect width="${w - 50}" height="45" rx="6" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
      <text x="15" y="27" font-size="11" font-weight="700" fill="#0F172A">DIAGRAM LEGEND & DATA SECURITY PROTOCOLS:</text>
      
      <circle cx="340" cy="23" r="5" fill="#2563EB" />
      <text x="352" y="27" font-size="10" font-weight="600" fill="#334155">HTTPS Client Request</text>

      <circle cx="510" cy="23" r="5" fill="#059669" />
      <text x="522" y="27" font-size="10" font-weight="600" fill="#334155">Prisma DB Query (Off-Chain)</text>

      <circle cx="720" cy="23" r="5" fill="#C8102E" />
      <text x="732" y="27" font-size="10" font-weight="600" fill="#334155">EVM Transaction (On-Chain)</text>

      <circle cx="920" cy="23" r="5" fill="#D97706" />
      <text x="932" y="27" font-size="10" font-weight="600" fill="#334155">SMTP Email Delivery</text>

      <circle cx="1100" cy="23" r="5" fill="#7C3AED" />
      <text x="1112" y="27" font-size="10" font-weight="600" fill="#334155">Deterministic Hash Pipeline</text>
    </g>
  `;
}

// ---------------------------------------------------------------------------
// 2. USER FLOW & SYSTEM FLOWCHART (Figure 3.1)
// ---------------------------------------------------------------------------
function getUserFlowSvg() {
  const w = 1360;
  const h = 920;

  return `
    <!-- BACKGROUND GRID -->
    <rect width="${w}" height="${h}" fill="#FAFAFA" rx="8" />

    <!-- ==================== PART A: ISSUANCE WORKFLOW ==================== -->
    <rect x="25" y="20" width="630" height="880" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
    <rect x="25" y="20" width="630" height="42" rx="10" fill="#EFF6FF" />
    <text x="45" y="46" font-size="13.5" font-weight="800" fill="#1E40AF">PART A: ORGANIZATION CERTIFICATE ISSUANCE PIPELINE</text>
    <text x="480" y="46" font-size="11" font-weight="700" fill="#3B82F6">[ACTOR: ISSUER ADMIN]</text>

    <!-- Node A1: Start -->
    <g transform="translate(265, 80)">
      <rect width="150" height="34" rx="17" fill="#1E293B" />
      <text x="75" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">START: Org Admin Login</text>
    </g>
    <path d="M 340 114 L 340 134" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A2: Studio Nav -->
    <g transform="translate(200, 134)" filter="url(#cardShadow)">
      <rect width="280" height="36" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="1.2" />
      <text x="140" y="22" font-size="11" font-weight="600" fill="#0F172A" text-anchor="middle">Navigate to Issue Studio (/dashboard)</text>
    </g>
    <path d="M 340 170 L 340 190" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A3: Enter Form Data -->
    <g transform="translate(180, 190)" filter="url(#cardShadow)">
      <rect width="320" height="42" rx="6" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5" />
      <text x="160" y="20" font-size="11" font-weight="700" fill="#1E40AF" text-anchor="middle">Fill Credential Parameters Form</text>
      <text x="160" y="34" font-size="9.5" fill="#64748B" text-anchor="middle">Recipient Name, Email, Course Title, Expiration Date</text>
    </g>
    <path d="M 340 232 L 340 252" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A4: Live Canvas Preview -->
    <g transform="translate(190, 252)" filter="url(#cardShadow)">
      <rect width="300" height="38" rx="6" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.2" />
      <text x="150" y="23" font-size="10.5" font-weight="600" fill="#1D4ED8" text-anchor="middle">👁️ Real-Time Interactive Canvas Preview Renders</text>
    </g>
    <path d="M 340 290 L 340 310" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A5: Submit Action -->
    <g transform="translate(230, 310)">
      <rect width="220" height="34" rx="6" fill="#2563EB" />
      <text x="110" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Click "Issue Certificate" Button</text>
    </g>
    <path d="M 340 344 L 340 364" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A6: Validation Decision Diamond -->
    <g transform="translate(340, 400)">
      <polygon points="0,-36 90,0 0,36 -90,0" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8" />
      <text x="0" y="-4" font-size="10.5" font-weight="700" fill="#78350F" text-anchor="middle">Payload Valid?</text>
      <text x="0" y="11" font-size="9" fill="#92400E" text-anchor="middle">(Zod Schema)</text>
    </g>
    <!-- Failure branch -->
    <path d="M 250 400 L 100 400 L 100 211 L 180 211" fill="none" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-crimson)" />
    <text x="150" y="392" font-size="9.5" font-weight="700" fill="#DC2626">No (Errors)</text>

    <!-- Success branch -->
    <path d="M 340 436 L 340 460" stroke="#16A34A" stroke-width="2" marker-end="url(#arrow-green)" />
    <text x="348" y="452" font-size="10" font-weight="700" fill="#16A34A">Yes (Pass)</text>

    <!-- Node A7: Generate Certificate ID -->
    <g transform="translate(190, 460)" filter="url(#cardShadow)">
      <rect width="300" height="38" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="1.2" />
      <text x="150" y="23" font-size="10.5" font-weight="600" fill="#0F172A" text-anchor="middle">Generate Unique ID: CERT-YYYY-XXXXX</text>
    </g>
    <path d="M 340 498 L 340 518" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A8: Canonical JSON & SHA-256 -->
    <g transform="translate(160, 518)" filter="url(#cardShadow)">
      <rect width="360" height="48" rx="6" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.8" />
      <text x="180" y="20" font-size="11" font-weight="700" fill="#5B21B6" text-anchor="middle">Deterministic SHA-256 Canonical Hashing</text>
      <text x="180" y="36" font-size="9.5" fill="#6B21A8" text-anchor="middle">Sort JSON keys alphabetically • Compute 32-Byte Hash</text>
    </g>
    <path d="M 340 566 L 340 586" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A9: Smart Contract Transaction -->
    <g transform="translate(160, 586)" filter="url(#cardShadow)">
      <rect width="360" height="52" rx="6" fill="#FFF1F2" stroke="#C8102E" stroke-width="2" />
      <text x="180" y="21" font-size="11" font-weight="800" fill="#9F1239" text-anchor="middle">⛓️ Smart Contract: issueCertificate()</text>
      <text x="180" y="38" font-size="9.5" fill="#881337" text-anchor="middle">Anchor on EVM: idHash, certHash, expirationDate</text>
    </g>
    <path d="M 340 638 L 340 658" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A10: Mine & Save DB -->
    <g transform="translate(170, 658)" filter="url(#cardShadow)">
      <rect width="340" height="44" rx="6" fill="#F0FDF4" stroke="#16A34A" stroke-width="1.5" />
      <text x="170" y="20" font-size="10.5" font-weight="700" fill="#166534" text-anchor="middle">EVM Mines Block & Returns TxHash</text>
      <text x="170" y="34" font-size="9.5" fill="#15803D" text-anchor="middle">Prisma saves metadata & transaction log to PostgreSQL</text>
    </g>
    <path d="M 340 702 L 340 722" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A11: PDF & Nodemailer Delivery -->
    <g transform="translate(160, 722)" filter="url(#cardShadow)">
      <rect width="360" height="48" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="1.5" />
      <text x="180" y="20" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">📄 Vector PDF Engine & Nodemailer Delivery</text>
      <text x="180" y="36" font-size="9.5" fill="#78350F" text-anchor="middle">Embed QR Code • Dispatch automated SMTP email with PDF</text>
    </g>
    <path d="M 340 770 L 340 790" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node A12: End -->
    <g transform="translate(240, 790)">
      <rect width="200" height="34" rx="17" fill="#16A34A" />
      <text x="100" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">END: Certificate Anchored</text>
    </g>


    <!-- ==================== PART B: VERIFICATION WORKFLOW ==================== -->
    <rect x="680" y="20" width="655" height="880" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
    <rect x="680" y="20" width="655" height="42" rx="10" fill="#ECFDF5" />
    <text x="700" y="46" font-size="13.5" font-weight="800" fill="#065F46">PART B: PUBLIC MULTI-FACTOR VERIFICATION PIPELINE</text>
    <text x="1145" y="46" font-size="11" font-weight="700" fill="#059669">[ACTOR: VERIFIER]</text>

    <!-- Node B1: Start -->
    <g transform="translate(930, 80)">
      <rect width="160" height="34" rx="17" fill="#1E293B" />
      <text x="80" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">START: Open /verify</text>
    </g>
    <path d="M 1010 114 L 1010 134" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B2: Decision Input Method -->
    <g transform="translate(1010, 170)">
      <polygon points="0,-32 90,0 0,32 -90,0" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8" />
      <text x="0" y="-3" font-size="10.5" font-weight="700" fill="#78350F" text-anchor="middle">Input Method?</text>
    </g>

    <!-- Branch B2-Left: Manual Input -->
    <path d="M 920 170 L 800 170 L 800 215" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow-slate)" />
    <text x="830" y="162" font-size="9" font-weight="600" fill="#475569">Type ID</text>
    <g transform="translate(710, 215)" filter="url(#cardShadow)">
      <rect width="180" height="40" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="1.2" />
      <text x="90" y="19" font-size="10" font-weight="700" fill="#0F172A" text-anchor="middle">Input Certificate ID</text>
      <text x="90" y="32" font-size="8.5" fill="#64748B" text-anchor="middle">(e.g. CERT-2026-PUCC8)</text>
    </g>

    <!-- Branch B2-Right: QR Scan -->
    <path d="M 1100 170 L 1220 170 L 1220 215" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow-slate)" />
    <text x="1135" y="162" font-size="9" font-weight="600" fill="#475569">Scan QR</text>
    <g transform="translate(1130, 215)" filter="url(#cardShadow)">
      <rect width="180" height="40" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="1.2" />
      <text x="90" y="19" font-size="10" font-weight="700" fill="#0F172A" text-anchor="middle">HTML5 QR Scanner</text>
      <text x="90" y="32" font-size="8.5" fill="#64748B" text-anchor="middle">Camera scans diploma QR</text>
    </g>

    <!-- Converge to DB query -->
    <path d="M 800 255 L 800 280 L 1010 280" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 1220 255 L 1220 280 L 1010 280" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 1010 280 L 1010 295" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B3: Query Database -->
    <g transform="translate(860, 295)" filter="url(#cardShadow)">
      <rect width="300" height="38" rx="6" fill="#F0FDF4" stroke="#16A34A" stroke-width="1.5" />
      <text x="150" y="23" font-size="11" font-weight="700" fill="#166534" text-anchor="middle">Query PostgreSQL Database for Record</text>
    </g>
    <path d="M 1010 333 L 1010 353" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B4: Record Found Decision -->
    <g transform="translate(1010, 385)">
      <polygon points="0,-32 90,0 0,32 -90,0" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8" />
      <text x="0" y="-3" font-size="10.5" font-weight="700" fill="#78350F" text-anchor="middle">Record Found?</text>
    </g>

    <!-- Not Found Branch -->
    <path d="M 1100 385 L 1240 385 L 1240 435" fill="none" stroke="#DC2626" stroke-width="1.5" marker-end="url(#arrow-crimson)" />
    <text x="1120" y="377" font-size="9.5" font-weight="700" fill="#DC2626">No (404)</text>
    <g transform="translate(1160, 435)" filter="url(#cardShadow)">
      <rect width="160" height="42" rx="6" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" />
      <text x="80" y="18" font-size="10" font-weight="700" fill="#991B1B" text-anchor="middle">❌ Unregistered Record</text>
      <text x="80" y="32" font-size="8.5" fill="#7F1D1D" text-anchor="middle">Display 404 Alert</text>
    </g>
    <path d="M 1240 477 L 1240 500" stroke="#DC2626" stroke-width="1.8" marker-end="url(#arrow-crimson)" />
    <g transform="translate(1165, 500)">
      <rect width="150" height="28" rx="14" fill="#991B1B" />
      <text x="75" y="18" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">END: 404 Terminated</text>
    </g>

    <!-- Found Branch -->
    <path d="M 1010 417 L 1010 440" stroke="#16A34A" stroke-width="2" marker-end="url(#arrow-green)" />
    <text x="1018" y="432" font-size="10" font-weight="700" fill="#16A34A">Yes</text>

    <!-- Node B5: Reconstruct and Rehash -->
    <g transform="translate(830, 440)" filter="url(#cardShadow)">
      <rect width="320" height="42" rx="6" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5" />
      <text x="160" y="19" font-size="10.5" font-weight="700" fill="#5B21B6" text-anchor="middle">Reconstruct Canonical JSON & Rehash</text>
      <text x="160" y="33" font-size="9" fill="#6B21A8" text-anchor="middle">Verify local database payload integrity via SHA-256</text>
    </g>
    <path d="M 990 482 L 990 505" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B6: Call Smart Contract -->
    <g transform="translate(810, 505)" filter="url(#cardShadow)">
      <rect width="360" height="44" rx="6" fill="#FFF1F2" stroke="#C8102E" stroke-width="2" />
      <text x="180" y="19" font-size="11" font-weight="800" fill="#9F1239" text-anchor="middle">⛓️ Call Smart Contract: verifyCertificate() [view]</text>
      <text x="180" y="34" font-size="9" fill="#881337" text-anchor="middle">Gas-free EVM call: queries hash match, expiry & revocation state</text>
    </g>
    <path d="M 990 549 L 990 570" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B7: Consensus Status Multi-Decision -->
    <g transform="translate(990, 605)">
      <polygon points="0,-35 110,0 0,35 -110,0" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8" />
      <text x="0" y="-4" font-size="10.5" font-weight="700" fill="#78350F" text-anchor="middle">EVM Consensus Status?</text>
      <text x="0" y="11" font-size="9" fill="#92400E" text-anchor="middle">(Smart Contract Return)</text>
    </g>

    <!-- Branch 1: Valid -->
    <path d="M 880 605 L 710 605 L 710 660" fill="none" stroke="#16A34A" stroke-width="1.8" marker-end="url(#arrow-green)" />
    <g transform="translate(635, 660)" filter="url(#cardShadow)">
      <rect width="145" height="110" rx="6" fill="#F0FDF4" stroke="#16A34A" stroke-width="2" />
      <rect width="145" height="24" rx="6" fill="#DCFCE7" />
      <text x="72" y="16" font-size="10" font-weight="800" fill="#166534" text-anchor="middle">🟢 GENUINE & VALID</text>
      <text x="10" y="44" font-size="8.5" font-weight="600" fill="#15803D">• Hash Verified</text>
      <text x="10" y="59" font-size="8.5" fill="#334155">• Active Period</text>
      <text x="10" y="74" font-size="8.5" fill="#334155">• Tx Proof Displayed</text>
      <text x="10" y="89" font-size="8.5" fill="#334155">• Verified Issuer</text>
      <rect x="8" y="94" width="129" height="12" rx="3" fill="#BBF7D0" />
      <text x="72" y="103" font-size="7.5" font-weight="700" fill="#14532D" text-anchor="middle">STATUS CODE: 1</text>
    </g>

    <!-- Branch 2: Expired -->
    <path d="M 940 635 L 850 645 L 850 660" fill="none" stroke="#D97706" stroke-width="1.8" marker-end="url(#arrow-amber)" />
    <g transform="translate(790, 660)" filter="url(#cardShadow)">
      <rect width="145" height="110" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
      <rect width="145" height="24" rx="6" fill="#FEF3C7" />
      <text x="72" y="16" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle">🟡 EXPIRED</text>
      <text x="10" y="44" font-size="8.5" font-weight="600" fill="#B45309">• Authentic at Issue</text>
      <text x="10" y="59" font-size="8.5" fill="#334155">• Past Valid Date</text>
      <text x="10" y="74" font-size="8.5" fill="#334155">• Ledger Confirmed</text>
      <text x="10" y="89" font-size="8.5" fill="#334155">• Needs Renewal</text>
      <rect x="8" y="94" width="129" height="12" rx="3" fill="#FDE68A" />
      <text x="72" y="103" font-size="7.5" font-weight="700" fill="#78350F" text-anchor="middle">STATUS CODE: 2</text>
    </g>

    <!-- Branch 3: Revoked -->
    <path d="M 1040 635 L 1120 645 L 1120 660" fill="none" stroke="#DC2626" stroke-width="1.8" marker-end="url(#arrow-crimson)" />
    <g transform="translate(945, 660)" filter="url(#cardShadow)">
      <rect width="145" height="110" rx="6" fill="#FFF1F2" stroke="#DC2626" stroke-width="2" />
      <rect width="145" height="24" rx="6" fill="#FEE2E2" />
      <text x="72" y="16" font-size="10" font-weight="800" fill="#991B1B" text-anchor="middle">🔴 REVOKED</text>
      <text x="10" y="44" font-size="8.5" font-weight="600" fill="#B91C1C">• Invalidated by Org</text>
      <text x="10" y="59" font-size="8.5" fill="#334155">• Audit Reason Shown</text>
      <text x="10" y="74" font-size="8.5" fill="#334155">• Revoked Timestamp</text>
      <text x="10" y="89" font-size="8.5" fill="#334155">• Permanent on EVM</text>
      <rect x="8" y="94" width="129" height="12" rx="3" fill="#FECDD3" />
      <text x="72" y="103" font-size="7.5" font-weight="700" fill="#881337" text-anchor="middle">STATUS CODE: 3</text>
    </g>

    <!-- Branch 4: Mismatch -->
    <path d="M 1100 605 L 1250 605 L 1250 660" fill="none" stroke="#7C3AED" stroke-width="1.8" marker-end="url(#arrow-purple)" />
    <g transform="translate(1175, 660)" filter="url(#cardShadow)">
      <rect width="145" height="110" rx="6" fill="#FAF5FF" stroke="#7C3AED" stroke-width="2" />
      <rect width="145" height="24" rx="6" fill="#F3E8FF" />
      <text x="72" y="16" font-size="9" font-weight="800" fill="#6B21A8" text-anchor="middle">🟣 HASH MISMATCH</text>
      <text x="10" y="44" font-size="8.5" font-weight="600" fill="#7C3AED">• Forgery Detected!</text>
      <text x="10" y="59" font-size="8.5" fill="#334155">• Altered Off-Chain</text>
      <text x="10" y="74" font-size="8.5" fill="#334155">• On-Chain Mismatch</text>
      <text x="10" y="89" font-size="8.5" fill="#334155">• Zero Trust Alert</text>
      <rect x="8" y="94" width="129" height="12" rx="3" fill="#E9D5FF" />
      <text x="72" y="103" font-size="7.5" font-weight="700" fill="#581C87" text-anchor="middle">STATUS CODE: 4</text>
    </g>

    <!-- Converge all branches to End -->
    <path d="M 707 770 L 707 810 L 980 810" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 862 770 L 862 810 L 980 810" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 1017 770 L 1017 810 L 980 810" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 1247 770 L 1247 810 L 1020 810" fill="none" stroke="#475569" stroke-width="1.5" />
    <path d="M 980 810 L 980 835" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Node B8: End -->
    <g transform="translate(890, 835)">
      <rect width="180" height="34" rx="17" fill="#1E293B" />
      <text x="90" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">END: Verification Done</text>
    </g>
  `;
}

// ---------------------------------------------------------------------------
// 3. DATABASE ER DIAGRAM (Figure 4.1)
// ---------------------------------------------------------------------------
function getErDiagramSvg() {
  const w = 1360;
  const h = 760;

  return `
    <!-- BACKGROUND GRID -->
    <rect width="${w}" height="${h}" fill="#FAFAFA" rx="8" />

    <!-- ==================== TABLE 1: ORGANIZATION ==================== -->
    <g transform="translate(40, 70)" filter="url(#cardShadow)">
      <rect width="360" height="390" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <!-- Table Header -->
      <rect width="360" height="38" rx="8" fill="#059669" />
      <text x="16" y="24" font-size="13" font-weight="800" fill="#FFFFFF">🏛️ ORGANIZATION</text>
      <text x="260" y="24" font-size="10.5" font-weight="600" fill="#D1FAE5">[PostgreSQL Table]</text>

      <!-- Table Subheader -->
      <rect y="38" width="360" height="24" fill="#F1F5F9" />
      <text x="16" y="54" font-size="10" font-weight="700" fill="#475569">KEY</text>
      <text x="56" y="54" font-size="10" font-weight="700" fill="#475569">COLUMN NAME</text>
      <text x="220" y="54" font-size="10" font-weight="700" fill="#475569">TYPE & CONSTRAINTS</text>
      <line x1="0" y1="62" x2="360" y2="62" stroke="#E2E8F0" stroke-width="1" />

      <!-- Columns -->
      <!-- id (PK) -->
      <rect x="12" y="72" width="28" height="15" rx="3" fill="#FEF3C7" />
      <text x="26" y="83" font-size="8.5" font-weight="800" fill="#B45309" text-anchor="middle">PK</text>
      <text x="56" y="84" font-size="11" font-weight="700" fill="#0F172A">id</text>
      <text x="220" y="84" font-size="10" fill="#059669" class="mono">UUID (v4) NOT NULL</text>
      <line x1="12" y1="95" x2="348" y2="95" stroke="#F1F5F9" stroke-width="1" />

      <!-- name -->
      <text x="56" y="112" font-size="11" font-weight="600" fill="#334155">name</text>
      <text x="220" y="112" font-size="10" fill="#64748B" class="mono">VARCHAR(255) NOT NULL</text>
      <line x1="12" y1="123" x2="348" y2="123" stroke="#F1F5F9" stroke-width="1" />

      <!-- email (UK) -->
      <rect x="12" y="132" width="28" height="15" rx="3" fill="#EDE9FE" />
      <text x="26" y="143" font-size="8.5" font-weight="800" fill="#6D28D9" text-anchor="middle">UK</text>
      <text x="56" y="144" font-size="11" font-weight="700" fill="#0F172A">email</text>
      <text x="220" y="144" font-size="10" fill="#6D28D9" class="mono">VARCHAR(255) UNIQUE</text>
      <line x1="12" y1="155" x2="348" y2="155" stroke="#F1F5F9" stroke-width="1" />

      <!-- passwordHash -->
      <text x="56" y="174" font-size="11" font-weight="600" fill="#334155">passwordHash</text>
      <text x="220" y="174" font-size="10" fill="#64748B" class="mono">VARCHAR(255) NOT NULL</text>
      <line x1="12" y1="185" x2="348" y2="185" stroke="#F1F5F9" stroke-width="1" />

      <!-- website -->
      <text x="56" y="204" font-size="11" font-weight="600" fill="#334155">website</text>
      <text x="220" y="204" font-size="10" fill="#64748B" class="mono">VARCHAR(255)</text>
      <line x1="12" y1="215" x2="348" y2="215" stroke="#F1F5F9" stroke-width="1" />

      <!-- description -->
      <text x="56" y="234" font-size="11" font-weight="600" fill="#334155">description</text>
      <text x="220" y="234" font-size="10" fill="#64748B" class="mono">TEXT</text>
      <line x1="12" y1="245" x2="348" y2="245" stroke="#F1F5F9" stroke-width="1" />

      <!-- logoUrl -->
      <text x="56" y="264" font-size="11" font-weight="600" fill="#334155">logoUrl</text>
      <text x="220" y="264" font-size="10" fill="#64748B" class="mono">VARCHAR(512)</text>
      <line x1="12" y1="275" x2="348" y2="275" stroke="#F1F5F9" stroke-width="1" />

      <!-- createdAt -->
      <text x="56" y="294" font-size="11" font-weight="600" fill="#334155">createdAt</text>
      <text x="220" y="294" font-size="10" fill="#64748B" class="mono">TIMESTAMP DEFAULT NOW</text>
      <line x1="12" y1="305" x2="348" y2="305" stroke="#F1F5F9" stroke-width="1" />

      <!-- updatedAt -->
      <text x="56" y="324" font-size="11" font-weight="600" fill="#334155">updatedAt</text>
      <text x="220" y="324" font-size="10" fill="#64748B" class="mono">TIMESTAMP (AUTO-UPDATE)</text>

      <!-- Table Footer Note -->
      <rect y="350" width="360" height="40" rx="8" fill="#F8FAFC" />
      <line x1="0" y1="350" x2="360" y2="350" stroke="#CBD5E1" stroke-width="1" />
      <text x="16" y="374" font-size="10" font-weight="700" fill="#047857">Relation: 1 Organization -> N Certificates</text>
    </g>


    <!-- ==================== TABLE 2: CERTIFICATE (CENTER) ==================== -->
    <g transform="translate(480, 50)" filter="url(#cardShadow)">
      <rect width="400" height="610" rx="8" fill="#FFFFFF" stroke="#2563EB" stroke-width="2" />
      <!-- Table Header -->
      <rect width="400" height="38" rx="8" fill="#2563EB" />
      <text x="16" y="24" font-size="13" font-weight="800" fill="#FFFFFF">📜 CERTIFICATE</text>
      <text x="290" y="24" font-size="10.5" font-weight="600" fill="#BFDBFE">[Core Entity Table]</text>

      <!-- Subheader -->
      <rect y="38" width="400" height="24" fill="#F1F5F9" />
      <text x="16" y="54" font-size="10" font-weight="700" fill="#475569">KEY</text>
      <text x="56" y="54" font-size="10" font-weight="700" fill="#475569">COLUMN NAME</text>
      <text x="240" y="54" font-size="10" font-weight="700" fill="#475569">DATA TYPE & CONSTRAINTS</text>
      <line x1="0" y1="62" x2="400" y2="62" stroke="#E2E8F0" stroke-width="1" />

      <!-- Columns -->
      <!-- id (PK) -->
      <rect x="12" y="72" width="28" height="15" rx="3" fill="#FEF3C7" />
      <text x="26" y="83" font-size="8.5" font-weight="800" fill="#B45309" text-anchor="middle">PK</text>
      <text x="56" y="84" font-size="11" font-weight="700" fill="#0F172A">id</text>
      <text x="240" y="84" font-size="10" fill="#2563EB" class="mono">UUID (v4) NOT NULL</text>
      <line x1="12" y1="94" x2="388" y2="94" stroke="#F1F5F9" stroke-width="1" />

      <!-- certificateId (UK) -->
      <rect x="12" y="102" width="28" height="15" rx="3" fill="#EDE9FE" />
      <text x="26" y="113" font-size="8.5" font-weight="800" fill="#6D28D9" text-anchor="middle">UK</text>
      <text x="56" y="114" font-size="11" font-weight="700" fill="#0F172A">certificateId</text>
      <text x="240" y="114" font-size="10" fill="#6D28D9" class="mono">VARCHAR(64) UNIQUE</text>
      <line x1="12" y1="124" x2="388" y2="124" stroke="#F1F5F9" stroke-width="1" />

      <!-- organizationId (FK) -->
      <rect x="12" y="132" width="28" height="15" rx="3" fill="#DBEAFE" />
      <text x="26" y="143" font-size="8.5" font-weight="800" fill="#1E40AF" text-anchor="middle">FK</text>
      <text x="56" y="144" font-size="11" font-weight="700" fill="#1E40AF">organizationId</text>
      <text x="240" y="144" font-size="10" fill="#1E40AF" class="mono">UUID -> ORGANIZATION(id)</text>
      <line x1="12" y1="154" x2="388" y2="154" stroke="#F1F5F9" stroke-width="1" />

      <!-- recipientName -->
      <text x="56" y="172" font-size="11" font-weight="600" fill="#334155">recipientName</text>
      <text x="240" y="172" font-size="10" fill="#64748B" class="mono">VARCHAR(255) NOT NULL</text>
      <line x1="12" y1="182" x2="388" y2="182" stroke="#F1F5F9" stroke-width="1" />

      <!-- recipientEmail -->
      <text x="56" y="200" font-size="11" font-weight="600" fill="#334155">recipientEmail</text>
      <text x="240" y="200" font-size="10" fill="#64748B" class="mono">VARCHAR(255) NOT NULL</text>
      <line x1="12" y1="210" x2="388" y2="210" stroke="#F1F5F9" stroke-width="1" />

      <!-- courseName -->
      <text x="56" y="228" font-size="11" font-weight="600" fill="#334155">courseName</text>
      <text x="240" y="228" font-size="10" fill="#64748B" class="mono">VARCHAR(255) NOT NULL</text>
      <line x1="12" y1="238" x2="388" y2="238" stroke="#F1F5F9" stroke-width="1" />

      <!-- courseDescription -->
      <text x="56" y="256" font-size="11" font-weight="600" fill="#334155">courseDescription</text>
      <text x="240" y="256" font-size="10" fill="#64748B" class="mono">TEXT</text>
      <line x1="12" y1="266" x2="388" y2="266" stroke="#F1F5F9" stroke-width="1" />

      <!-- issueDate -->
      <text x="56" y="284" font-size="11" font-weight="600" fill="#334155">issueDate</text>
      <text x="240" y="284" font-size="10" fill="#64748B" class="mono">TIMESTAMP NOT NULL</text>
      <line x1="12" y1="294" x2="388" y2="294" stroke="#F1F5F9" stroke-width="1" />

      <!-- expiryDate -->
      <text x="56" y="312" font-size="11" font-weight="600" fill="#334155">expiryDate</text>
      <text x="240" y="312" font-size="10" fill="#64748B" class="mono">TIMESTAMP (NULL=LIFETIME)</text>
      <line x1="12" y1="322" x2="388" y2="322" stroke="#F1F5F9" stroke-width="1" />

      <!-- certificateHash -->
      <text x="56" y="340" font-size="11" font-weight="700" fill="#7C3AED">certificateHash</text>
      <text x="240" y="340" font-size="10" fill="#7C3AED" class="mono">VARCHAR(66) SHA-256 NOT NULL</text>
      <line x1="12" y1="350" x2="388" y2="350" stroke="#F1F5F9" stroke-width="1" />

      <!-- status -->
      <text x="56" y="368" font-size="11" font-weight="700" fill="#0F172A">status</text>
      <text x="240" y="368" font-size="10" fill="#64748B" class="mono">VARCHAR(20) [VALID|EXP|REV]</text>
      <line x1="12" y1="378" x2="388" y2="378" stroke="#F1F5F9" stroke-width="1" />

      <!-- revokeReason -->
      <text x="56" y="396" font-size="11" font-weight="600" fill="#334155">revokeReason</text>
      <text x="240" y="396" font-size="10" fill="#64748B" class="mono">TEXT</text>
      <line x1="12" y1="406" x2="388" y2="406" stroke="#F1F5F9" stroke-width="1" />

      <!-- revokedAt -->
      <text x="56" y="424" font-size="11" font-weight="600" fill="#334155">revokedAt</text>
      <text x="240" y="424" font-size="10" fill="#64748B" class="mono">TIMESTAMP</text>
      <line x1="12" y1="434" x2="388" y2="434" stroke="#F1F5F9" stroke-width="1" />

      <!-- qrCodeData -->
      <text x="56" y="452" font-size="11" font-weight="600" fill="#334155">qrCodeData</text>
      <text x="240" y="452" font-size="10" fill="#64748B" class="mono">TEXT (Base64 PNG URI)</text>
      <line x1="12" y1="462" x2="388" y2="462" stroke="#F1F5F9" stroke-width="1" />

      <!-- emailSent -->
      <text x="56" y="480" font-size="11" font-weight="600" fill="#334155">emailSent</text>
      <text x="240" y="480" font-size="10" fill="#64748B" class="mono">BOOLEAN DEFAULT FALSE</text>
      <line x1="12" y1="490" x2="388" y2="490" stroke="#F1F5F9" stroke-width="1" />

      <!-- createdAt -->
      <text x="56" y="508" font-size="11" font-weight="600" fill="#334155">createdAt</text>
      <text x="240" y="508" font-size="10" fill="#64748B" class="mono">TIMESTAMP DEFAULT NOW</text>
      <line x1="12" y1="518" x2="388" y2="518" stroke="#F1F5F9" stroke-width="1" />

      <!-- updatedAt -->
      <text x="56" y="536" font-size="11" font-weight="600" fill="#334155">updatedAt</text>
      <text x="240" y="536" font-size="10" fill="#64748B" class="mono">TIMESTAMP (AUTO-UPDATE)</text>

      <!-- Footer Note -->
      <rect y="565" width="400" height="45" rx="8" fill="#EFF6FF" />
      <line x1="0" y1="565" x2="400" y2="565" stroke="#BFDBFE" stroke-width="1" />
      <text x="16" y="585" font-size="10" font-weight="700" fill="#1D4ED8">Deterministic Integrity Hash matches On-Chain Hash</text>
      <text x="16" y="600" font-size="9" fill="#2563EB">Links 1:N with Blockchain Transactions</text>
    </g>


    <!-- ==================== TABLE 3: BLOCKCHAIN_TRANSACTION ==================== -->
    <g transform="translate(960, 70)" filter="url(#cardShadow)">
      <rect width="360" height="425" rx="8" fill="#FFFFFF" stroke="#C8102E" stroke-width="2" />
      <!-- Table Header -->
      <rect width="360" height="38" rx="8" fill="#C8102E" />
      <text x="16" y="24" font-size="13" font-weight="800" fill="#FFFFFF">⛓️ BLOCKCHAIN_TX</text>
      <text x="245" y="24" font-size="10.5" font-weight="600" fill="#FECDD3">[EVM Audit Trail]</text>

      <!-- Subheader -->
      <rect y="38" width="360" height="24" fill="#F1F5F9" />
      <text x="16" y="54" font-size="10" font-weight="700" fill="#475569">KEY</text>
      <text x="56" y="54" font-size="10" font-weight="700" fill="#475569">COLUMN NAME</text>
      <text x="215" y="54" font-size="10" font-weight="700" fill="#475569">DATA TYPE</text>
      <line x1="0" y1="62" x2="360" y2="62" stroke="#E2E8F0" stroke-width="1" />

      <!-- Columns -->
      <!-- id (PK) -->
      <rect x="12" y="72" width="28" height="15" rx="3" fill="#FEF3C7" />
      <text x="26" y="83" font-size="8.5" font-weight="800" fill="#B45309" text-anchor="middle">PK</text>
      <text x="56" y="84" font-size="11" font-weight="700" fill="#0F172A">id</text>
      <text x="215" y="84" font-size="10" fill="#C8102E" class="mono">UUID (v4) NOT NULL</text>
      <line x1="12" y1="95" x2="348" y2="95" stroke="#F1F5F9" stroke-width="1" />

      <!-- certificateId (FK) -->
      <rect x="12" y="104" width="28" height="15" rx="3" fill="#DBEAFE" />
      <text x="26" y="115" font-size="8.5" font-weight="800" fill="#1E40AF" text-anchor="middle">FK</text>
      <text x="56" y="116" font-size="11" font-weight="700" fill="#1E40AF">certificateId</text>
      <text x="215" y="116" font-size="10" fill="#1E40AF" class="mono">UUID -> CERT(id)</text>
      <line x1="12" y1="127" x2="348" y2="127" stroke="#F1F5F9" stroke-width="1" />

      <!-- txHash (UK) -->
      <rect x="12" y="136" width="28" height="15" rx="3" fill="#EDE9FE" />
      <text x="26" y="147" font-size="8.5" font-weight="800" fill="#6D28D9" text-anchor="middle">UK</text>
      <text x="56" y="148" font-size="11" font-weight="700" fill="#0F172A">txHash</text>
      <text x="215" y="148" font-size="10" fill="#6D28D9" class="mono">VARCHAR(66) UNIQUE</text>
      <line x1="12" y1="159" x2="348" y2="159" stroke="#F1F5F9" stroke-width="1" />

      <!-- blockNumber -->
      <text x="56" y="178" font-size="11" font-weight="600" fill="#334155">blockNumber</text>
      <text x="215" y="178" font-size="10" fill="#64748B" class="mono">BIGINT NOT NULL</text>
      <line x1="12" y1="189" x2="348" y2="189" stroke="#F1F5F9" stroke-width="1" />

      <!-- networkName -->
      <text x="56" y="208" font-size="11" font-weight="600" fill="#334155">networkName</text>
      <text x="215" y="208" font-size="10" fill="#64748B" class="mono">VARCHAR(64)</text>
      <line x1="12" y1="219" x2="348" y2="219" stroke="#F1F5F9" stroke-width="1" />

      <!-- contractAddress -->
      <text x="56" y="238" font-size="11" font-weight="600" fill="#334155">contractAddress</text>
      <text x="215" y="238" font-size="10" fill="#64748B" class="mono">VARCHAR(42)</text>
      <line x1="12" y1="249" x2="348" y2="249" stroke="#F1F5F9" stroke-width="1" />

      <!-- action -->
      <text x="56" y="268" font-size="11" font-weight="700" fill="#0F172A">action</text>
      <text x="215" y="268" font-size="10" fill="#64748B" class="mono">VARCHAR(32) [ISSUE|REV]</text>
      <line x1="12" y1="279" x2="348" y2="279" stroke="#F1F5F9" stroke-width="1" />

      <!-- gasUsed -->
      <text x="56" y="298" font-size="11" font-weight="600" fill="#334155">gasUsed</text>
      <text x="215" y="298" font-size="10" fill="#64748B" class="mono">VARCHAR(64)</text>
      <line x1="12" y1="309" x2="348" y2="309" stroke="#F1F5F9" stroke-width="1" />

      <!-- timestamp -->
      <text x="56" y="328" font-size="11" font-weight="600" fill="#334155">timestamp</text>
      <text x="215" y="328" font-size="10" fill="#64748B" class="mono">TIMESTAMP (BLOCK TIME)</text>
      <line x1="12" y1="339" x2="348" y2="339" stroke="#F1F5F9" stroke-width="1" />

      <!-- confirmed -->
      <text x="56" y="358" font-size="11" font-weight="600" fill="#334155">confirmed</text>
      <text x="215" y="358" font-size="10" fill="#64748B" class="mono">BOOLEAN DEFAULT TRUE</text>

      <!-- Footer Note -->
      <rect y="380" width="360" height="45" rx="8" fill="#FFF1F2" />
      <line x1="0" y1="380" x2="360" y2="380" stroke="#FECDD3" stroke-width="1" />
      <text x="16" y="402" font-size="10" font-weight="700" fill="#9F1239">Stores permanent on-chain transaction receipt</text>
      <text x="16" y="416" font-size="9" fill="#881337">Provides verifiable public block explorer proof</text>
    </g>


    <!-- ==================== CROW'S FOOT RELATIONSHIP LINES ==================== -->
    <!-- Line 1: ORGANIZATION (1) ---- (N) CERTIFICATE -->
    <path d="M 400 200 L 480 200" stroke="#475569" stroke-width="2.5" fill="none" marker-start="url(#crow-one)" marker-end="url(#crow-many)" />
    <rect x="415" y="175" width="50" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
    <text x="440" y="188" font-size="9.5" font-weight="800" fill="#047857" text-anchor="middle">1 : N</text>
    <text x="440" y="218" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">issues</text>

    <!-- Line 2: CERTIFICATE (1) ---- (N) BLOCKCHAIN_TRANSACTION -->
    <path d="M 880 200 L 960 200" stroke="#475569" stroke-width="2.5" fill="none" marker-start="url(#crow-one)" marker-end="url(#crow-many)" />
    <rect x="895" y="175" width="50" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
    <text x="920" y="188" font-size="9.5" font-weight="800" fill="#9F1239" text-anchor="middle">1 : N</text>
    <text x="920" y="218" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">records</text>


    <!-- ==================== BOTTOM ERD LEGEND ==================== -->
    <g transform="translate(40, 680)">
      <rect width="${w - 80}" height="55" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
      <text x="18" y="24" font-size="11.5" font-weight="800" fill="#0F172A">CROW'S FOOT RELATIONAL NOTATION & CONSTRAINTS SPECIFICATION:</text>

      <!-- PK Legend -->
      <rect x="18" y="32" width="24" height="14" rx="3" fill="#FEF3C7" />
      <text x="30" y="43" font-size="8.5" font-weight="800" fill="#B45309" text-anchor="middle">PK</text>
      <text x="48" y="43" font-size="10" font-weight="600" fill="#334155">Primary Key</text>

      <!-- FK Legend -->
      <rect x="140" y="32" width="24" height="14" rx="3" fill="#DBEAFE" />
      <text x="152" y="43" font-size="8.5" font-weight="800" fill="#1E40AF" text-anchor="middle">FK</text>
      <text x="170" y="43" font-size="10" font-weight="600" fill="#334155">Foreign Key</text>

      <!-- UK Legend -->
      <rect x="260" y="32" width="24" height="14" rx="3" fill="#EDE9FE" />
      <text x="272" y="43" font-size="8.5" font-weight="800" fill="#6D28D9" text-anchor="middle">UK</text>
      <text x="290" y="43" font-size="10" font-weight="600" fill="#334155">Unique Key</text>

      <!-- Cardinality 1 -->
      <line x1="400" y1="39" x2="430" y2="39" stroke="#475569" stroke-width="2" marker-start="url(#crow-one)" />
      <text x="440" y="43" font-size="10" font-weight="600" fill="#334155">Exactly One (1)</text>

      <!-- Cardinality N -->
      <line x1="550" y1="39" x2="580" y2="39" stroke="#475569" stroke-width="2" marker-end="url(#crow-many)" />
      <text x="590" y="43" font-size="10" font-weight="600" fill="#334155">Zero or Many (0..N)</text>

      <!-- Off-chain integrity notice -->
      <text x="750" y="39" font-size="10" font-weight="600" fill="#047857">✓ Referential Integrity: ON DELETE RESTRICT on organizationId & certificateId</text>
    </g>
  `;
}

// ---------------------------------------------------------------------------
// 4. SMART CONTRACT STATE MACHINE (Figure 6.1)
// ---------------------------------------------------------------------------
function getSmartContractSvg() {
  const w = 1360;
  const h = 760;

  return `
    <!-- BACKGROUND GRID -->
    <rect width="${w}" height="${h}" fill="#FAFAFA" rx="8" />

    <!-- ==================== LEFT: UML STATE MACHINE ==================== -->
    <rect x="25" y="20" width="890" height="710" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
    <rect x="25" y="20" width="890" height="40" rx="10" fill="#F8FAFC" />
    <text x="45" y="45" font-size="13.5" font-weight="800" fill="#0F172A">CERTIFICATEREGISTRY.SOL STATE MACHINE & LIFECYCLE MODEL</text>

    <!-- Initial Pseudo-State (●) -->
    <circle cx="470" cy="85" r="12" fill="#1E293B" />
    <text x="470" y="112" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">INITIAL STATE</text>

    <!-- Transition 1: Deploy / Query unissued ID -->
    <path d="M 470 120 L 470 145" stroke="#475569" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- State 0: NOT_FOUND / UNREGISTERED -->
    <g transform="translate(350, 145)" filter="url(#cardShadow)">
      <rect width="240" height="52" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8" />
      <text x="120" y="24" font-size="11.5" font-weight="800" fill="#334155" text-anchor="middle">⚪ NOT_FOUND (Unregistered)</text>
      <text x="120" y="42" font-size="9.5" fill="#64748B" text-anchor="middle">certHash == 0x0 • status = 0</text>
    </g>

    <!-- Transition 2: issueCertificate() -->
    <path d="M 470 197 L 470 270" stroke="#16A34A" stroke-width="2.5" marker-end="url(#arrow-green)" />
    <!-- Transition Box -->
    <g transform="translate(190, 215)">
      <rect width="560" height="40" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.2" />
      <text x="280" y="17" font-size="10.5" font-weight="800" fill="#166534" text-anchor="middle">
        TRIGGER: issueCertificate(bytes32 certIdHash, bytes32 certHash, uint256 expirationDate)
      </text>
      <text x="280" y="32" font-size="9.5" fill="#15803D" text-anchor="middle">
        [GUARD: onlyIssuer && !isIssued(certIdHash)]  /  ACTION: emit CertificateIssued()
      </text>
    </g>

    <!-- State 1: VALID (Active Credential) -->
    <g transform="translate(320, 270)" filter="url(#hoverShadow)">
      <rect width="300" height="135" rx="10" fill="#F0FDF4" stroke="#16A34A" stroke-width="2.5" />
      <rect width="300" height="32" rx="10" fill="#DCFCE7" />
      <text x="150" y="22" font-size="12.5" font-weight="800" fill="#166534" text-anchor="middle">🟢 STATE: VALID (ACTIVE CREDENTIAL)</text>
      
      <text x="18" y="54" font-size="10" font-weight="700" fill="#15803D">STATE INVARIANTS & VERIFICATION RULES:</text>
      <text x="18" y="72" font-size="10" fill="#334155">• onChainHash == sha256(canonicalPayload)</text>
      <text x="18" y="90" font-size="10" fill="#334155">• block.timestamp &lt;= expirationDate (or expiry == 0)</text>
      <text x="18" y="108" font-size="10" fill="#334155">• isRevoked == false</text>

      <rect x="18" y="114" width="264" height="15" rx="3" fill="#BBF7D0" />
      <text x="150" y="125" font-size="8.5" font-weight="700" fill="#14532D" text-anchor="middle">CONSENSUS STATUS CODE: 1 (VALID)</text>
    </g>


    <!-- ==================== THREE TRANSITIONS OUT OF VALID ==================== -->
    
    <!-- TRANSITION A (Left): Time Progression -> EXPIRED -->
    <path d="M 320 330 L 170 330 L 170 450" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arrow-amber)" />
    <g transform="translate(50, 360)">
      <rect width="210" height="42" rx="4" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1" />
      <text x="105" y="17" font-size="9" font-weight="800" fill="#92400E" text-anchor="middle">TRIGGER: Time Elapsed</text>
      <text x="105" y="32" font-size="8.5" fill="#78350F" text-anchor="middle">[block.timestamp &gt; expiry]</text>
    </g>

    <!-- State 2: EXPIRED -->
    <g transform="translate(50, 450)" filter="url(#cardShadow)">
      <rect width="240" height="145" rx="8" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
      <rect width="240" height="30" rx="8" fill="#FEF3C7" />
      <text x="120" y="20" font-size="11.5" font-weight="800" fill="#92400E" text-anchor="middle">🟡 STATE: EXPIRED</text>

      <text x="14" y="52" font-size="9.5" font-weight="700" fill="#B45309">INVARIANTS:</text>
      <text x="14" y="68" font-size="9" fill="#334155">• Authentic when issued</text>
      <text x="14" y="84" font-size="9" fill="#334155">• Past authorized validity date</text>
      <text x="14" y="100" font-size="9" fill="#334155">• Credential lapsed, not revoked</text>

      <rect x="14" y="118" width="212" height="18" rx="4" fill="#FDE68A" />
      <text x="120" y="131" font-size="8.5" font-weight="700" fill="#78350F" text-anchor="middle">STATUS CODE: 2 (EXPIRED)</text>
    </g>

    <!-- Transition from Expired to Revoked -->
    <path d="M 290 520 L 350 520" stroke="#DC2626" stroke-width="1.8" stroke-dasharray="3 3" marker-end="url(#arrow-crimson)" />
    <text x="320" y="512" font-size="8" font-weight="700" fill="#DC2626" text-anchor="middle">Revoke</text>


    <!-- TRANSITION B (Center): revokeCertificate() -> REVOKED -->
    <path d="M 470 405 L 470 450" stroke="#DC2626" stroke-width="2.5" marker-end="url(#arrow-crimson)" />
    <g transform="translate(340, 407)">
      <rect width="260" height="38" rx="4" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
      <text x="130" y="15" font-size="9" font-weight="800" fill="#9F1239" text-anchor="middle">TRIGGER: revokeCertificate(idHash, reason)</text>
      <text x="130" y="30" font-size="8" fill="#881337" text-anchor="middle">[GUARD: onlyIssuerOrOwner] / emit Revoked()</text>
    </g>

    <!-- State 3: REVOKED -->
    <g transform="translate(350, 450)" filter="url(#cardShadow)">
      <rect width="240" height="145" rx="8" fill="#FFF1F2" stroke="#DC2626" stroke-width="2" />
      <rect width="240" height="30" rx="8" fill="#FEE2E2" />
      <text x="120" y="20" font-size="11.5" font-weight="800" fill="#991B1B" text-anchor="middle">🔴 STATE: REVOKED</text>

      <text x="14" y="52" font-size="9.5" font-weight="700" fill="#B91C1C">INVARIANTS:</text>
      <text x="14" y="68" font-size="9" fill="#334155">• Explicitly cancelled by issuer</text>
      <text x="14" y="84" font-size="9" fill="#334155">• Revocation reason on ledger</text>
      <text x="14" y="100" font-size="9" fill="#334155">• Immutable, permanent state</text>

      <rect x="14" y="118" width="212" height="18" rx="4" fill="#FECDD3" />
      <text x="120" y="131" font-size="8.5" font-weight="700" fill="#881337" text-anchor="middle">STATUS CODE: 3 (REVOKED)</text>
    </g>


    <!-- TRANSITION C (Right): Tamper Detection -> HASH_MISMATCH -->
    <path d="M 620 330 L 770 330 L 770 450" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arrow-purple)" />
    <g transform="translate(670, 360)">
      <rect width="210" height="42" rx="4" fill="#FAF5FF" stroke="#E9D5FF" stroke-width="1" />
      <text x="105" y="17" font-size="9" font-weight="800" fill="#6B21A8" text-anchor="middle">TRIGGER: Data Tampering</text>
      <text x="105" y="32" font-size="8.5" fill="#581C87" text-anchor="middle">[computedHash != onChainHash]</text>
    </g>

    <!-- State 4: HASH_MISMATCH -->
    <g transform="translate(650, 450)" filter="url(#cardShadow)">
      <rect width="240" height="145" rx="8" fill="#FAF5FF" stroke="#7C3AED" stroke-width="2" />
      <rect width="240" height="30" rx="8" fill="#F3E8FF" />
      <text x="120" y="20" font-size="11.5" font-weight="800" fill="#6B21A8" text-anchor="middle">🟣 HASH MISMATCH</text>

      <text x="14" y="52" font-size="9.5" font-weight="700" fill="#7C3AED">INVARIANTS:</text>
      <text x="14" y="68" font-size="9" fill="#334155">• Certificate ID exists on chain</text>
      <text x="14" y="84" font-size="9" fill="#334155">• Name/grade altered off-chain</text>
      <text x="14" y="100" font-size="9" fill="#334155">• Cryptographic fraud alert</text>

      <rect x="14" y="118" width="212" height="18" rx="4" fill="#E9D5FF" />
      <text x="120" y="131" font-size="8.5" font-weight="700" fill="#581C87" text-anchor="middle">STATUS CODE: 4 (MISMATCH)</text>
    </g>

    <!-- Bullseye Final Pseudo-States (⦿) -->
    <!-- From Expired -->
    <circle cx="170" cy="650" r="12" fill="#FFFFFF" stroke="#D97706" stroke-width="2" />
    <circle cx="170" cy="650" r="6" fill="#D97706" />
    <path d="M 170 595 L 170 636" stroke="#D97706" stroke-width="1.8" />

    <!-- From Revoked -->
    <circle cx="470" cy="650" r="12" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <circle cx="470" cy="650" r="6" fill="#DC2626" />
    <path d="M 470 595 L 470 636" stroke="#DC2626" stroke-width="1.8" />

    <!-- From Mismatch -->
    <circle cx="770" cy="650" r="12" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
    <circle cx="770" cy="650" r="6" fill="#7C3AED" />
    <path d="M 770 595 L 770 636" stroke="#7C3AED" stroke-width="1.8" />

    <text x="470" y="685" font-size="10.5" font-weight="700" fill="#475569" text-anchor="middle">
      TERMINAL VERIFICATION EVALUATIONS (IMMUTABLE CONSENSUS FINALITY)
    </text>


    <!-- ==================== RIGHT: SMART CONTRACT SPECIFICATION ==================== -->
    <rect x="940" y="20" width="395" height="710" rx="10" fill="#FFFFFF" stroke="#C8102E" stroke-width="2" />
    <rect x="940" y="20" width="395" height="40" rx="10" fill="#FFF1F2" />
    <text x="960" y="45" font-size="13" font-weight="800" fill="#9F1239">TECHNICAL CONTRACT SPECIFICATION</text>

    <g transform="translate(960, 80)">
      <!-- Contract Metadata Box -->
      <rect width="355" height="110" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="14" y="24" font-size="11" font-weight="700" fill="#0F172A">📜 CertificateRegistry.sol</text>
      <text x="14" y="45" font-size="10" fill="#334155">• Compiler: Solidity ^0.8.20 (London EVM)</text>
      <text x="14" y="63" font-size="10" fill="#334155">• Access Control: OpenZeppelin Ownable.sol</text>
      <text x="14" y="81" font-size="10" fill="#334155">• Optimization: Enabled (runs = 200)</text>
      <text x="14" y="99" font-size="10" fill="#334155">• Deployment: Hardhat / Sepolia Testnet</text>

      <!-- Data Structure Box -->
      <rect y="125" width="355" height="155" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="14" y="148" font-size="11" font-weight="700" fill="#0F172A">📦 Data Structures & Storage</text>
      <text x="14" y="168" font-size="9" fill="#4F46E5" class="mono">struct Certificate {</text>
      <text x="28" y="184" font-size="9" fill="#475569" class="mono">bytes32 certificateHash;</text>
      <text x="28" y="200" font-size="9" fill="#475569" class="mono">address issuer;</text>
      <text x="28" y="216" font-size="9" fill="#475569" class="mono">uint256 issueDate;</text>
      <text x="28" y="232" font-size="9" fill="#475569" class="mono">uint256 expirationDate;</text>
      <text x="28" y="248" font-size="9" fill="#475569" class="mono">bool isRevoked;</text>
      <text x="14" y="264" font-size="9" fill="#4F46E5" class="mono">}</text>

      <!-- Gas Efficiency Analysis -->
      <rect y="295" width="355" height="125" rx="6" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1" />
      <text x="14" y="318" font-size="11" font-weight="700" fill="#166534">⚡ EVM Gas Efficiency & Optimization</text>
      <text x="14" y="340" font-size="9.5" fill="#334155">• Issuance Tx: ~68,400 Gas units</text>
      <text x="14" y="358" font-size="9.5" fill="#334155">• Revocation Tx: ~31,200 Gas units</text>
      <text x="14" y="376" font-size="9.5" font-weight="700" fill="#15803D">• verifyCertificate(): 0 Gas (view function)</text>
      <text x="14" y="394" font-size="9" fill="#475569">Public verifications incur zero gas costs or fees</text>

      <!-- Security Guarantees Box -->
      <rect y="435" width="355" height="175" rx="6" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
      <text x="14" y="458" font-size="11" font-weight="700" fill="#9F1239">🛡️ Cryptographic Security Guarantees</text>
      <text x="14" y="480" font-size="9.5" font-weight="600" fill="#881337">1. Collision Resistance</text>
      <text x="14" y="495" font-size="9" fill="#475569">SHA-256 provides 128-bit security against collision</text>
      <text x="14" y="515" font-size="9.5" font-weight="600" fill="#881337">2. Non-Repudiation</text>
      <text x="14" y="530" font-size="9" fill="#475569">Only registered issuer private key can sign issuance</text>
      <text x="14" y="550" font-size="9.5" font-weight="600" fill="#881337">3. Decentralized Consensus</text>
      <text x="14" y="565" font-size="9" fill="#475569">Proof persists even if issuing institution server is offline</text>
      <text x="14" y="585" font-size="9.5" font-weight="600" fill="#881337">4. Privacy Preserving</text>
      <text x="14" y="600" font-size="9" fill="#475569">Zero PII (names, grades) is stored in the clear on-chain</text>
    </g>
  `;
}

// ---------------------------------------------------------------------------
// MAIN RENDERING PIPELINE
// ---------------------------------------------------------------------------
async function renderAll() {
  console.log('🚀 Launching Chromium to render authentic, world-class technical diagrams...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1550, height: 1100 },
    deviceScaleFactor: 2.0, // High-DPI Retina output
  });
  const page = await context.newPage();

  const specs = [
    {
      file: 'diagram_architecture.png',
      figureNo: 'Figure 2.1',
      title: 'Citadel Four-Tier Hybrid Architecture Model',
      getSvg: getArchitectureSvg,
      w: 1360,
      h: 760,
    },
    {
      file: 'diagram_user_flow.png',
      figureNo: 'Figure 3.1',
      title: 'Citadel End-to-End System & User Flowcharts',
      getSvg: getUserFlowSvg,
      w: 1360,
      h: 920,
    },
    {
      file: 'diagram_er.png',
      figureNo: 'Figure 4.1',
      title: 'Citadel Relational Database Schema (Crow\'s Foot ER Diagram)',
      getSvg: getErDiagramSvg,
      w: 1360,
      h: 760,
    },
    {
      file: 'diagram_smart_contract.png',
      figureNo: 'Figure 6.1',
      title: 'CertificateRegistry.sol UML State Machine & Lifecycle Transitions',
      getSvg: getSmartContractSvg,
      w: 1360,
      h: 760,
    },
  ];

  for (const s of specs) {
    console.log(`Rendering ${s.file} (${s.figureNo})...`);
    const svg = s.getSvg();
    const html = wrapHtml(s.title, s.figureNo, svg, s.w, s.h);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const card = await page.$('.canvas-card');
    const outPath = path.join(SCREENSHOTS_DIR, s.file);
    await card.screenshot({ path: outPath });
    console.log(`✅ Saved: ${outPath}`);
  }

  await browser.close();
  console.log('🎉 ALL 4 VECTOR-PERFECT TECHNICAL DIAGRAMS GENERATED SUCCESSFULLY!');
}

renderAll().catch((err) => {
  console.error('Fatal error rendering diagrams:', err);
  process.exit(1);
});

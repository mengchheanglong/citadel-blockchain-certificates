const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const DOWNLOADS_DIR = 'C:\\Users\\User\\Downloads';

function getArchitectureSvg() {
  const w = 1760;
  const h = 1000;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <defs>
      <!-- Drop Shadows -->
      <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.06" />
      </filter>
      <filter id="hoverShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.09" />
      </filter>

      <!-- Arrow Markers -->
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563EB" />
      </marker>
      <marker id="arrow-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
      </marker>
      <marker id="arrow-crimson" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC2626" />
      </marker>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
      </marker>
      <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7C3AED" />
      </marker>
      <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D97706" />
      </marker>
    </defs>

    <!-- Canvas Inner Container -->
    <rect width="${w}" height="${h}" fill="#FAFCFF" rx="14" stroke="#E2E8F0" stroke-width="1.5" />

    <!-- ============================================================ -->
    <!-- TIER 1: PRESENTATION & CLIENTS -->
    <!-- ============================================================ -->
    <g transform="translate(30, 48)">
      <!-- Tier Box -->
      <rect width="360" height="850" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.6" stroke-dasharray="5 5" />
      <rect width="360" height="46" rx="12" fill="#E2E8F0" />
      <rect y="36" width="360" height="10" fill="#E2E8F0" />
      <text x="20" y="29" font-size="14.5" font-weight="800" fill="#0F172A" letter-spacing="0.02em">TIER 1: PRESENTATION &amp; CLIENTS</text>

      <!-- Card 1: Org Portal -->
      <g transform="translate(20, 65)" filter="url(#cardShadow)">
        <rect width="320" height="195" rx="10" fill="#FFFFFF" stroke="#2563EB" stroke-width="2" />
        <rect width="320" height="38" rx="10" fill="#EFF6FF" />
        <rect y="28" width="320" height="10" fill="#EFF6FF" />
        <text x="16" y="24" font-size="14" font-weight="800" fill="#1D4ED8">🏛️ Institution Portal (/dashboard)</text>
        <text x="18" y="62" font-size="12.5" font-weight="700" fill="#0F172A">• Next.js 14 Client Component</text>
        <text x="18" y="86" font-size="12" font-weight="500" fill="#334155">• Live Diploma Canvas Studio</text>
        <text x="18" y="110" font-size="12" font-weight="500" fill="#334155">• Certificate Registry Management</text>
        <text x="18" y="134" font-size="12" font-weight="500" fill="#334155">• One-Click Revocation Modal</text>
        <rect x="18" y="152" width="140" height="24" rx="5" fill="#DBEAFE" stroke="#BFDBFE" stroke-width="1" />
        <text x="26" y="168" font-size="11" font-weight="800" fill="#1E40AF">ROLE: ISSUER ADMIN</text>
      </g>

      <!-- Card 2: Public Verifier -->
      <g transform="translate(20, 310)" filter="url(#cardShadow)">
        <rect width="320" height="195" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
        <rect width="320" height="38" rx="10" fill="#ECFDF5" />
        <rect y="28" width="320" height="10" fill="#ECFDF5" />
        <text x="16" y="24" font-size="14" font-weight="800" fill="#047857">🔍 Public Verifier (/verify)</text>
        <text x="18" y="62" font-size="12.5" font-weight="700" fill="#0F172A">• HTML5 Camera QR Code Scanner</text>
        <text x="18" y="86" font-size="12" font-weight="500" fill="#334155">• Manual Certificate ID Lookup</text>
        <text x="18" y="110" font-size="12" font-weight="500" fill="#334155">• Interactive Blockchain Proof Card</text>
        <text x="18" y="134" font-size="12" font-weight="500" fill="#334155">• Real-Time Consensus Status Badge</text>
        <rect x="18" y="152" width="165" height="24" rx="5" fill="#D1FAE5" stroke="#A7F3D0" stroke-width="1" />
        <text x="26" y="168" font-size="11" font-weight="800" fill="#065F46">ROLE: PUBLIC / EMPLOYER</text>
      </g>

      <!-- Card 3: Graduate Recipient -->
      <g transform="translate(20, 565)" filter="url(#cardShadow)">
        <rect width="320" height="185" rx="10" fill="#FFFFFF" stroke="#D97706" stroke-width="2" />
        <rect width="320" height="38" rx="10" fill="#FFFBEB" />
        <rect y="28" width="320" height="10" fill="#FFFBEB" />
        <text x="16" y="24" font-size="14" font-weight="800" fill="#B45309">🎓 Graduate Recipient</text>
        <text x="18" y="62" font-size="12.5" font-weight="700" fill="#0F172A">• Automated Email Notification</text>
        <text x="18" y="86" font-size="12" font-weight="500" fill="#334155">• Attached Vector PDF Diploma</text>
        <text x="18" y="110" font-size="12" font-weight="500" fill="#334155">• High-Resolution Verification QR</text>
        <rect x="18" y="138" width="175" height="24" rx="5" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1" />
        <text x="26" y="154" font-size="11" font-weight="800" fill="#92400E">ROLE: CREDENTIAL HOLDER</text>
      </g>
    </g>

    <!-- ============================================================ -->
    <!-- TIER 2: NEXT.JS 14 APPLICATION & API SERVICES -->
    <!-- ============================================================ -->
    <g transform="translate(435, 48)">
      <!-- Tier Box -->
      <rect width="455" height="850" rx="12" fill="#F8FAFC" stroke="#6366F1" stroke-width="1.6" stroke-dasharray="5 5" />
      <rect width="455" height="46" rx="12" fill="#EEF2FF" />
      <rect y="36" width="455" height="10" fill="#EEF2FF" />
      <text x="20" y="29" font-size="14.5" font-weight="800" fill="#3730A3" letter-spacing="0.02em">TIER 2: NEXT.JS 14 APPLICATION &amp; API SERVICES</text>

      <!-- Service 1: Auth & Validation -->
      <g transform="translate(20, 65)" filter="url(#cardShadow)">
        <rect width="415" height="115" rx="9" fill="#FFFFFF" stroke="#4F46E5" stroke-width="1.8" />
        <rect width="415" height="34" rx="9" fill="#EEF2FF" />
        <rect y="24" width="415" height="10" fill="#EEF2FF" />
        <text x="16" y="22" font-size="13" font-weight="800" fill="#3730A3">🛡️ Auth Middleware &amp; Input Validation</text>
        <text x="18" y="55" font-size="12" font-weight="500" fill="#1E293B">• Supabase SSR Session Token Verification</text>
        <text x="18" y="77" font-size="12" font-weight="500" fill="#1E293B">• Strict Zod Schema Sanitization &amp; Type Safety</text>
        <text x="18" y="99" font-size="11.5" font-weight="700" fill="#4F46E5">Endpoints: /api/auth/*, /api/certificates/*</text>
      </g>

      <!-- Service 2: Canonical SHA-256 -->
      <g transform="translate(20, 200)" filter="url(#cardShadow)">
        <rect width="415" height="120" rx="9" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
        <rect width="415" height="34" rx="9" fill="#F5F3FF" />
        <rect y="24" width="415" height="10" fill="#F5F3FF" />
        <text x="16" y="22" font-size="13" font-weight="800" fill="#5B21B6">🔐 Canonical SHA-256 Hashing Engine</text>
        <text x="18" y="55" font-size="12" font-weight="500" fill="#1E293B">• Deterministic Lexicographical Key Sorting</text>
        <text x="18" y="77" font-size="12" font-weight="500" fill="#1E293B">• JSON Normalization (LF linebreaks, UTF-8)</text>
        <text x="18" y="99" font-size="12" font-weight="700" fill="#7C3AED">• Output: 32-Byte Hex Digest (0x...)</text>
      </g>

      <!-- Service 3: Verification Handler -->
      <g transform="translate(20, 340)" filter="url(#cardShadow)">
        <rect width="415" height="120" rx="9" fill="#FFFFFF" stroke="#059669" stroke-width="1.8" />
        <rect width="415" height="34" rx="9" fill="#ECFDF5" />
        <rect y="24" width="415" height="10" fill="#ECFDF5" />
        <text x="16" y="22" font-size="13" font-weight="800" fill="#065F46">🔍 Verification Handler (/api/verify)</text>
        <text x="18" y="55" font-size="12" font-weight="500" fill="#1E293B">• Coordinates DB Record Retrieval &amp; Payload Rehashing</text>
        <text x="18" y="77" font-size="12" font-weight="500" fill="#1E293B">• Dispatches Gas-Free Web3 View Query to Contract</text>
        <text x="18" y="99" font-size="11.5" font-weight="700" fill="#047857">Evaluates Consensus State: Valid | Exp | Rev | Mismatch</text>
      </g>

      <!-- Service 4: Document Engine -->
      <g transform="translate(20, 480)" filter="url(#cardShadow)">
        <rect width="415" height="100" rx="9" fill="#FFFFFF" stroke="#0891B2" stroke-width="1.8" />
        <rect width="415" height="32" rx="9" fill="#ECFEFF" />
        <rect y="22" width="415" height="10" fill="#ECFEFF" />
        <text x="16" y="21" font-size="13" font-weight="800" fill="#155E75">📄 Document Engine (jsPDF + QRCode)</text>
        <text x="18" y="53" font-size="12" font-weight="500" fill="#1E293B">• Vector PDF Diploma Generation (Citadel Crimson)</text>
        <text x="18" y="75" font-size="12" font-weight="500" fill="#1E293B">• High-Density QR Matrix with Direct Verify URL</text>
      </g>

      <!-- Service 5: Nodemailer -->
      <g transform="translate(20, 600)" filter="url(#cardShadow)">
        <rect width="415" height="100" rx="9" fill="#FFFFFF" stroke="#D97706" stroke-width="1.8" />
        <rect width="415" height="32" rx="9" fill="#FFFBEB" />
        <rect y="22" width="415" height="10" fill="#FFFBEB" />
        <text x="16" y="21" font-size="13" font-weight="800" fill="#92400E">✉️ Nodemailer SMTP Notification Service</text>
        <text x="18" y="53" font-size="12" font-weight="500" fill="#1E293B">• Asynchronous TLS Delivery with Attached PDF</text>
        <text x="18" y="75" font-size="11.5" font-weight="700" fill="#D97706">Direct diploma access link dispatched to graduate</text>
      </g>

      <!-- Service 6: Ethers.js -->
      <g transform="translate(20, 720)" filter="url(#cardShadow)">
        <rect width="415" height="95" rx="9" fill="#FFFFFF" stroke="#BE123C" stroke-width="1.8" />
        <rect width="415" height="32" rx="9" fill="#FFF1F2" />
        <rect y="22" width="415" height="10" fill="#FFF1F2" />
        <text x="16" y="21" font-size="13" font-weight="800" fill="#9F1239">⚡ Ethers.js v6 Web3 Client &amp; Signer</text>
        <text x="18" y="53" font-size="12" font-weight="500" fill="#1E293B">• Smart Contract ABI Interface • Nonce &amp; Gas Logic</text>
        <text x="18" y="75" font-size="11.5" font-weight="700" fill="#BE123C">Gas-free view calls + signed write transactions</text>
      </g>
    </g>

    <!-- ============================================================ -->
    <!-- TIER 3: PERSISTENCE (OFF-CHAIN) -->
    <!-- ============================================================ -->
    <g transform="translate(930, 48)">
      <!-- Tier Box -->
      <rect width="365" height="850" rx="12" fill="#F8FAFC" stroke="#059669" stroke-width="1.6" stroke-dasharray="5 5" />
      <rect width="365" height="46" rx="12" fill="#ECFDF5" />
      <rect y="36" width="365" height="10" fill="#ECFDF5" />
      <text x="20" y="29" font-size="14.5" font-weight="800" fill="#065F46" letter-spacing="0.02em">TIER 3: PERSISTENCE (OFF-CHAIN)</text>

      <!-- Prisma ORM -->
      <g transform="translate(20, 65)" filter="url(#cardShadow)">
        <rect width="325" height="85" rx="9" fill="#FFFFFF" stroke="#059669" stroke-width="1.8" />
        <rect width="325" height="30" rx="9" fill="#ECFDF5" />
        <rect y="20" width="325" height="10" fill="#ECFDF5" />
        <text x="14" y="20" font-size="13" font-weight="800" fill="#047857">🔷 Prisma ORM Client</text>
        <text x="16" y="50" font-size="12" font-weight="500" fill="#1E293B">• Type-Safe Query Builder &amp; Pool</text>
        <text x="16" y="70" font-size="11.5" font-weight="600" fill="#64748B">Connection Pooling on Port 5432</text>
      </g>

      <!-- PostgreSQL Box -->
      <g transform="translate(20, 168)" filter="url(#cardShadow)">
        <rect width="325" height="480" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="2.2" />
        <rect width="325" height="36" rx="10" fill="#D1FAE5" />
        <rect y="26" width="325" height="10" fill="#D1FAE5" />
        <text x="16" y="23" font-size="13.5" font-weight="800" fill="#065F46">🐘 PostgreSQL Database (Supabase)</text>

        <!-- Subtable 1: Organization Table -->
        <g transform="translate(14, 46)">
          <rect width="297" height="126" rx="7" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.2" />
          <text x="14" y="20" font-size="12.5" font-weight="800" fill="#166534">📋 Organization Table</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#1E293B">• id (UUIDv4, PK)</text>
          <text x="14" y="60" font-size="11.5" font-weight="500" fill="#1E293B">• name, email (UK), website</text>
          <text x="14" y="80" font-size="11.5" font-weight="500" fill="#1E293B">• passwordHash (Bcrypt)</text>
          <text x="14" y="100" font-size="11.5" font-weight="500" fill="#1E293B">• logoUrl, createdAt, updatedAt</text>
          <text x="14" y="118" font-size="11" font-weight="700" fill="#15803D">Relation: 1:N Certificates</text>
        </g>

        <!-- Subtable 2: Certificate Table -->
        <g transform="translate(14, 182)">
          <rect width="297" height="142" rx="7" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.2" />
          <text x="14" y="20" font-size="12.5" font-weight="800" fill="#166534">📜 Certificate Table</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#1E293B">• id (UUIDv4, PK)</text>
          <text x="14" y="60" font-size="11.5" font-weight="500" fill="#1E293B">• certificateId (UK, formatted)</text>
          <text x="14" y="80" font-size="11.5" font-weight="500" fill="#1E293B">• organizationId (FK)</text>
          <text x="14" y="100" font-size="11.5" font-weight="500" fill="#1E293B">• recipientName, courseName</text>
          <text x="14" y="120" font-size="11.5" font-weight="700" fill="#047857">• certificateHash (SHA-256)</text>
          <text x="14" y="136" font-size="11" font-weight="700" fill="#15803D">Status: VALID | EXPIRED | REVOKED</text>
        </g>

        <!-- Subtable 3: BlockchainTx Table -->
        <g transform="translate(14, 334)">
          <rect width="297" height="132" rx="7" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.2" />
          <text x="14" y="20" font-size="12.5" font-weight="800" fill="#166534">🔗 BlockchainTx Table</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#1E293B">• id (UUID, PK), certificateId (FK)</text>
          <text x="14" y="60" font-size="11.5" font-weight="500" fill="#1E293B">• txHash (UK, 66-char hex)</text>
          <text x="14" y="80" font-size="11.5" font-weight="500" fill="#1E293B">• blockNumber, network, gasUsed</text>
          <text x="14" y="100" font-size="11.5" font-weight="500" fill="#1E293B">• action (ISSUE / REVOKE)</text>
          <text x="14" y="122" font-size="11" font-weight="700" fill="#15803D">Complete immutable audit trail</text>
        </g>
      </g>
    </g>

    <!-- ============================================================ -->
    <!-- TIER 4: BLOCKCHAIN (ON-CHAIN) -->
    <!-- ============================================================ -->
    <g transform="translate(1335, 48)">
      <!-- Tier Box -->
      <rect width="395" height="850" rx="12" fill="#F8FAFC" stroke="#DC2626" stroke-width="1.6" stroke-dasharray="5 5" />
      <rect width="395" height="46" rx="12" fill="#FEF2F2" />
      <rect y="36" width="395" height="10" fill="#FEF2F2" />
      <text x="20" y="29" font-size="14.5" font-weight="800" fill="#991B1B" letter-spacing="0.02em">TIER 4: BLOCKCHAIN (ON-CHAIN)</text>

      <!-- Card 1: Node Network -->
      <g transform="translate(20, 65)" filter="url(#cardShadow)">
        <rect width="355" height="105" rx="9" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.8" />
        <rect width="355" height="32" rx="9" fill="#FEF2F2" />
        <rect y="22" width="355" height="10" fill="#FEF2F2" />
        <text x="14" y="21" font-size="13" font-weight="800" fill="#991B1B">🌐 EVM Network Node</text>
        <text x="16" y="53" font-size="12" font-weight="500" fill="#1E293B">• Hardhat Local Node (127.0.0.1:8545)</text>
        <text x="16" y="73" font-size="12" font-weight="500" fill="#1E293B">• Ethereum Sepolia Public Testnet</text>
        <text x="16" y="93" font-size="11.5" font-weight="700" fill="#DC2626">Standard JSON-RPC 2.0 Protocol</text>
      </g>

      <!-- Card 2: CertificateRegistry.sol -->
      <g transform="translate(20, 190)" filter="url(#cardShadow)">
        <rect width="355" height="375" rx="10" fill="#FFFFFF" stroke="#DC2626" stroke-width="2.2" />
        <rect width="355" height="38" rx="10" fill="#FFE4E6" />
        <rect y="28" width="355" height="10" fill="#FFE4E6" />
        <text x="16" y="24" font-size="13.5" font-weight="800" fill="#9F1239">📜 CertificateRegistry.sol</text>

        <!-- Method 1: issueCertificate -->
        <g transform="translate(14, 50)">
          <rect width="327" height="70" rx="6" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
          <text x="14" y="20" font-size="12" font-weight="800" fill="#881337">issueCertificate()</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#475569">Stores (idHash =&gt; certHash, expiry)</text>
          <text x="14" y="59" font-size="11" font-weight="700" fill="#059669">Emits: CertificateIssued</text>
        </g>

        <!-- Method 2: verifyCertificate -->
        <g transform="translate(14, 130)">
          <rect width="327" height="70" rx="6" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
          <text x="14" y="20" font-size="12" font-weight="800" fill="#881337">verifyCertificate() [view]</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#475569">Returns: (isValid, isRevoked, isExpired)</text>
          <text x="14" y="59" font-size="11" font-weight="700" fill="#059669">Gas Cost: 0 ETH (Gas-Free View)</text>
        </g>

        <!-- Method 3: revokeCertificate -->
        <g transform="translate(14, 210)">
          <rect width="327" height="70" rx="6" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
          <text x="14" y="20" font-size="12" font-weight="800" fill="#881337">revokeCertificate()</text>
          <text x="14" y="40" font-size="11.5" font-weight="500" fill="#475569">Flags isRevoked = true, stores reason</text>
          <text x="14" y="59" font-size="11" font-weight="700" fill="#059669">Emits: CertificateRevoked</text>
        </g>

        <!-- Contract Security -->
        <g transform="translate(14, 290)">
          <rect width="327" height="68" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
          <text x="14" y="24" font-size="11.5" font-weight="700" fill="#0F172A">Security: onlyIssuer, Ownable</text>
          <text x="14" y="46" font-size="11" font-weight="600" fill="#64748B">Non-Custodial &amp; Mathematically Tamper-Proof</text>
        </g>
      </g>

      <!-- Card 3: EVM Ledger State -->
      <g transform="translate(20, 585)" filter="url(#cardShadow)">
        <rect width="355" height="235" rx="10" fill="#FFFFFF" stroke="#9333EA" stroke-width="1.8" />
        <rect width="355" height="34" rx="10" fill="#FAF5FF" />
        <rect y="24" width="355" height="10" fill="#FAF5FF" />
        <text x="16" y="22" font-size="13" font-weight="800" fill="#6B21A8">💾 EVM Immutable Ledger State</text>
        <text x="18" y="55" font-size="12" font-weight="700" fill="#334155">Storage Mapping:</text>
        <text x="18" y="75" font-size="11" font-weight="700" fill="#7C3AED" font-family="monospace">mapping(bytes32 =&gt; CertRecord)</text>
        <text x="18" y="100" font-size="11.5" font-weight="500" fill="#1E293B">• certHash: bytes32 (SHA-256)</text>
        <text x="18" y="122" font-size="11.5" font-weight="500" fill="#1E293B">• issuer: address (20-byte)</text>
        <text x="18" y="144" font-size="11.5" font-weight="500" fill="#1E293B">• issueDate: uint256 (timestamp)</text>
        <text x="18" y="166" font-size="11.5" font-weight="500" fill="#1E293B">• expirationDate: uint256</text>
        <text x="18" y="188" font-size="11.5" font-weight="500" fill="#1E293B">• isRevoked: bool</text>
        <text x="18" y="214" font-size="12" font-weight="800" fill="#047857">✓ Cryptographically Permanent</text>
      </g>
    </g>

    <!-- ============================================================ -->
    <!-- CONNECTORS & DATA FLOW ARROWS -->
    <!-- ============================================================ -->
    <!-- 1. Admin Portal -> Auth Middleware -->
    <path d="M 370 171 L 455 171" fill="none" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arrow-blue)" />
    <rect x="375" y="156" width="82" height="20" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1" />
    <text x="382" y="170" font-size="10" font-weight="800" fill="#1E40AF">HTTPS POST</text>

    <!-- 2. Auth -> Hash Engine -->
    <path d="M 662 228 L 662 248" fill="none" stroke="#6366F1" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- 3. Public Verifier -> /api/verify -->
    <path d="M 370 448 L 455 448" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arrow-green)" />
    <rect x="375" y="433" width="82" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
    <text x="382" y="447" font-size="10" font-weight="800" fill="#065F46">HTTPS GET</text>

    <!-- 4. /api/verify -> Prisma DB Lookup -->
    <path d="M 870 448 L 950 448" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arrow-green)" />
    <rect x="876" y="433" width="76" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
    <text x="882" y="447" font-size="10" font-weight="800" fill="#065F46">DB Query</text>

    <!-- 5. Hash Engine -> Doc Engine -->
    <path d="M 662 368 L 662 528" fill="none" stroke="#6366F1" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- 6. Doc Engine -> Nodemailer -->
    <path d="M 662 628 L 662 648" fill="none" stroke="#6366F1" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- 7. Nodemailer -> Student Email -->
    <path d="M 455 698 L 370 698" fill="none" stroke="#D97706" stroke-width="2.2" marker-end="url(#arrow-amber)" />
    <rect x="376" y="683" width="80" height="20" rx="4" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1" />
    <text x="382" y="697" font-size="10" font-weight="800" fill="#92400E">SMTP / PDF</text>

    <!-- 8. Hash Engine -> Web3 Client (32-byte hash) -->
    <path d="M 870 308 L 905 308 L 905 788 L 870 788" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arrow-purple)" />
    <rect x="882" y="538" width="84" height="20" rx="4" fill="#F5F3FF" stroke="#DDD6FE" stroke-width="1" />
    <text x="888" y="552" font-size="10" font-weight="800" fill="#7C3AED">32-Byte Hash</text>

    <!-- 9. App Server -> Prisma ORM -->
    <path d="M 870 158 L 950 158" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arrow-green)" />
    <rect x="876" y="143" width="76" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
    <text x="881" y="157" font-size="10" font-weight="800" fill="#065F46">Prisma CRUD</text>

    <!-- 10. Prisma -> PostgreSQL -->
    <path d="M 1090 198 L 1090 216" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arrow-green)" />
    <text x="1100" y="210" font-size="10" font-weight="700" fill="#047857">SQL / TCP</text>

    <!-- 11. Web3 Signer -> Smart Contract (Write) through completely clear space below PostgreSQL -->
    <path d="M 870 803 L 1320 803 L 1320 393 L 1355 393" fill="none" stroke="#DC2626" stroke-width="2.2" marker-end="url(#arrow-crimson)" />
    <rect x="1010" y="791" width="180" height="22" rx="4" fill="#FEF2F2" stroke="#FECDD3" stroke-width="1" />
    <text x="1018" y="806" font-size="10" font-weight="800" fill="#991B1B">JSON-RPC: issueCertificate()</text>

    <!-- 12. Gas-Free verifyCertificate() from /api/verify to contract (above tier boxes at y=24) -->
    <path d="M 870 403 L 915 403 L 915 24 L 1320 24 L 1320 343 L 1355 343" fill="none" stroke="#059669" stroke-width="2.2" stroke-dasharray="5 4" marker-end="url(#arrow-green)" />
    <rect x="1015" y="13" width="205" height="22" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
    <text x="1023" y="28" font-size="10.5" font-weight="800" fill="#065F46">Gas-Free view: verifyCertificate()</text>

    <!-- 13. Smart Contract -> EVM State Storage -->
    <path d="M 1515 613 L 1515 633" fill="none" stroke="#9333EA" stroke-width="2.2" marker-end="url(#arrow-purple)" />
    <text x="1525" y="626" font-size="10" font-weight="700" fill="#7C3AED">SSTORE</text>

    <!-- ============================================================ -->
    <!-- BOTTOM LEGEND -->
    <!-- ============================================================ -->
    <g transform="translate(30, 925)">
      <rect width="1700" height="52" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.2" />
      <text x="24" y="32" font-size="12.5" font-weight="800" fill="#0F172A">DIAGRAM LEGEND &amp; DATA SECURITY PROTOCOLS:</text>
      
      <circle cx="450" cy="27" r="6" fill="#2563EB" />
      <text x="464" y="31" font-size="12" font-weight="700" fill="#334155">HTTPS Client Request</text>

      <circle cx="680" cy="27" r="6" fill="#059669" />
      <text x="694" y="31" font-size="12" font-weight="700" fill="#334155">Prisma DB Query (Off-Chain)</text>

      <circle cx="950" cy="27" r="6" fill="#DC2626" />
      <text x="964" y="31" font-size="12" font-weight="700" fill="#334155">EVM Transaction (On-Chain)</text>

      <circle cx="1210" cy="27" r="6" fill="#D97706" />
      <text x="1224" y="31" font-size="12" font-weight="700" fill="#334155">SMTP Email Delivery</text>

      <circle cx="1440" cy="27" r="6" fill="#7C3AED" />
      <text x="1454" y="31" font-size="12" font-weight="700" fill="#334155">Deterministic Hash Pipeline</text>
    </g>
  </svg>
  `;
}

function wrapHtml(title, figureNo, svgContent, width = 1760) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${figureNo}: ${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    .canvas-card {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 16px;
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.05);
      padding: 32px 42px 38px 42px;
      width: ${width + 84}px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #C8102E;
      padding-bottom: 18px;
      margin-bottom: 24px;
    }
    .title-group h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.015em;
    }
    .title-group p {
      font-size: 13.5px;
      color: #64748B;
      font-weight: 600;
      margin-top: 4px;
    }
    .badge {
      background: #FFF1F2;
      color: #C8102E;
      font-size: 12px;
      font-weight: 800;
      padding: 7px 16px;
      border-radius: 8px;
      border: 1.5px solid #FECDD3;
      letter-spacing: 0.04em;
    }
    .svg-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="canvas-card">
    <div class="header-bar">
      <div class="title-group">
        <h1>Figure 2.1: Citadel Four-Tier Hybrid Architecture Model</h1>
        <p>Citadel Academic Credential Verification Platform - Official Software Engineering Specification</p>
      </div>
      <div class="badge">OFFICIAL TECHNICAL DIAGRAM</div>
    </div>
    <div class="svg-container">
      ${svgContent}
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log('Rendering crystal-clear, ultra-sharp architecture diagram...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1980, height: 1280 },
    deviceScaleFactor: 3.0, // 3x Ultra-High Retina DPI
  });
  const page = await context.newPage();

  const svg = getArchitectureSvg();
  const html = wrapHtml(
    'Citadel Four-Tier Hybrid Architecture Model',
    'Figure 2.1',
    svg,
    1760
  );

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const card = await page.$('.canvas-card');

  // 1. Save to docs/screenshots
  const outScreenshots = path.join(OUTPUT_DIR, 'diagram_architecture.png');
  await card.screenshot({ path: outScreenshots });
  console.log('Saved to screenshots:', outScreenshots);

  // 2. Save directly to Downloads for convenient access
  const outDownloads = path.join(DOWNLOADS_DIR, 'Figure_2_1_Citadel_Four_Tier_Architecture_Model.png');
  await card.screenshot({ path: outDownloads });
  console.log('Saved to Downloads:', outDownloads);

  // 3. Save directly to workspace root
  const outRoot = path.join(__dirname, '..', 'Figure_2_1_Citadel_Four_Tier_Architecture_Model.png');
  await card.screenshot({ path: outRoot });
  console.log('Saved to project root:', outRoot);

  // 4. Also save standalone SVG for vector embedding in Word
  const outSvg = path.join(__dirname, '..', 'Figure_2_1_Citadel_Four_Tier_Architecture_Model.svg');
  fs.writeFileSync(outSvg, svg);
  console.log('Saved vector SVG to project root:', outSvg);

  const outSvgDownloads = path.join(DOWNLOADS_DIR, 'Figure_2_1_Citadel_Four_Tier_Architecture_Model.svg');
  fs.writeFileSync(outSvgDownloads, svg);
  console.log('Saved vector SVG to Downloads:', outSvgDownloads);

  await browser.close();
  console.log('Done rendering crystal-clear architecture diagram!');
}

run().catch(console.error);

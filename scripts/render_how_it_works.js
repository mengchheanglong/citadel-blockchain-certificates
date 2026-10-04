const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

const SVG_DEFS = `
  <defs>
    <!-- Drop Shadows -->
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
    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16A34A" />
    </marker>
    <marker id="arrow-crimson" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#C8102E" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7C3AED" />
    </marker>
    <marker id="arrow-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
    </marker>
  </defs>
`;

function getHowItWorksSvg() {
  const w = 1400;
  const h = 880;

  return `
    <rect width="${w}" height="${h}" fill="#FAFAFA" rx="8" />

    <!-- ==================== PHASE 1: ISSUING CERTIFICATE ==================== -->
    <rect x="25" y="20" width="1350" height="380" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2" />
    <rect x="25" y="20" width="1350" height="42" rx="12" fill="#EFF6FF" />
    <text x="45" y="47" font-size="14" font-weight="800" fill="#1E40AF">STAGE 1: HOW A CERTIFICATE IS ISSUED & LOCKED ON BLOCKCHAIN (ORGANIZATION SIDE)</text>

    <!-- STEP 1: Fill Form -->
    <g transform="translate(45, 80)" filter="url(#cardShadow)">
      <rect width="280" height="290" rx="10" fill="#FFFFFF" stroke="#2563EB" stroke-width="2" />
      <rect width="280" height="48" rx="10" fill="#EFF6FF" />
      <circle cx="34" cy="24" r="14" fill="#2563EB" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">1</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#1E40AF">School Enters Info</text>
      <text x="58" y="40" font-size="10.5" fill="#3B82F6">Organization Portal</text>

      <text x="20" y="80" font-size="12" font-weight="700" fill="#0F172A">🏛️ Admin Fills Details:</text>
      <text x="20" y="105" font-size="11.5" fill="#334155">• Student Name</text>
      <text x="20" y="125" font-size="11.5" fill="#334155">• Degree or Course Title</text>
      <text x="20" y="145" font-size="11.5" fill="#334155">• Student Email</text>
      <text x="20" y="165" font-size="11.5" fill="#334155">• Expiration Date (if any)</text>

      <rect x="18" y="190" width="244" height="65" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="28" y="212" font-size="11" font-weight="700" fill="#2563EB">👁️ Live Preview Screen</text>
      <text x="28" y="232" font-size="10.5" fill="#64748B">Staff sees the diploma update</text>
      <text x="28" y="247" font-size="10.5" fill="#64748B">live to prevent typos.</text>
    </g>

    <!-- Arrow 1 -> 2 -->
    <path d="M 325 225 L 365 225" stroke="#2563EB" stroke-width="3" marker-end="url(#arrow-blue)" />

    <!-- STEP 2: Create Digital Fingerprint -->
    <g transform="translate(375, 80)" filter="url(#cardShadow)">
      <rect width="295" height="290" rx="10" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
      <rect width="295" height="48" rx="10" fill="#F5F3FF" />
      <circle cx="34" cy="24" r="14" fill="#7C3AED" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">2</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#5B21B6">Create Digital Fingerprint</text>
      <text x="58" y="40" font-size="10.5" fill="#7C3AED">SHA-256 Cryptographic Hash</text>

      <text x="20" y="80" font-size="12" font-weight="700" fill="#0F172A">🔐 What happens here:</text>
      <text x="20" y="103" font-size="11" fill="#334155">The system turns the student info</text>
      <text x="20" y="121" font-size="11" fill="#334155">into a unique 32-byte code:</text>

      <rect x="18" y="133" width="259" height="38" rx="6" fill="#F3E8FF" stroke="#D8B4FE" />
      <text x="28" y="152" font-size="9" font-family="monospace" font-weight="700" fill="#6B21A8">0x8a9f4c21e7...d4b9 (32 bytes)</text>
      <text x="28" y="165" font-size="8.5" fill="#7C3AED">Unique Digital Fingerprint</text>

      <rect x="18" y="185" width="259" height="85" rx="6" fill="#FAF5FF" stroke="#E9D5FF" />
      <text x="28" y="206" font-size="11" font-weight="700" fill="#6B21A8">💡 Why do we do this?</text>
      <text x="28" y="226" font-size="10.5" fill="#4B5563">1. Tiny size = super fast &amp; cheap.</text>
      <text x="28" y="244" font-size="10.5" fill="#4B5563">2. Keeps student name/data private</text>
      <text x="28" y="260" font-size="10.5" fill="#4B5563">   (no personal info on public chain).</text>
    </g>

    <!-- Arrow 2 -> 3 -->
    <path d="M 670 225 L 710 225" stroke="#7C3AED" stroke-width="3" marker-end="url(#arrow-purple)" />

    <!-- STEP 3: Lock on Ethereum -->
    <g transform="translate(720, 80)" filter="url(#cardShadow)">
      <rect width="310" height="290" rx="10" fill="#FFFFFF" stroke="#C8102E" stroke-width="2" />
      <rect width="310" height="48" rx="10" fill="#FFF1F2" />
      <circle cx="34" cy="24" r="14" fill="#C8102E" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">3</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#9F1239">Lock on Ethereum Blockchain</text>
      <text x="58" y="40" font-size="10.5" fill="#BE123C">Solidity Smart Contract</text>

      <text x="20" y="80" font-size="12" font-weight="700" fill="#0F172A">⛓️ Writing to Smart Contract:</text>
      <text x="20" y="103" font-size="11" fill="#334155">Calls: <tspan font-family="monospace" font-weight="700" fill="#9F1239">issueCertificate(id, hash)</tspan></text>
      <text x="20" y="123" font-size="11" fill="#334155">The fingerprint is sealed into an</text>
      <text x="20" y="141" font-size="11" fill="#334155">Ethereum block forever.</text>

      <rect x="18" y="155" width="274" height="115" rx="6" fill="#FFF1F2" stroke="#FECDD3" />
      <text x="28" y="176" font-size="11" font-weight="800" fill="#881337">🔒 The Blockchain Guarantee:</text>
      <text x="28" y="198" font-size="10.5" font-weight="600" fill="#9F1239">✓ CANNOT be edited</text>
      <text x="28" y="216" font-size="10.5" font-weight="600" fill="#9F1239">✓ CANNOT be deleted</text>
      <text x="28" y="234" font-size="10.5" font-weight="600" fill="#9F1239">✓ Stored on thousands of nodes</text>
      <text x="28" y="254" font-size="10" fill="#4B5563">Not even the university can alter it!</text>
    </g>

    <!-- Arrow 3 -> 4 -->
    <path d="M 1030 225 L 1070 225" stroke="#C8102E" stroke-width="3" marker-end="url(#arrow-crimson)" />

    <!-- STEP 4: Deliver PDF & QR Code -->
    <g transform="translate(1080, 80)" filter="url(#cardShadow)">
      <rect width="275" height="290" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <rect width="275" height="48" rx="10" fill="#ECFDF5" />
      <circle cx="34" cy="24" r="14" fill="#059669" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">4</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#065F46">Generate Diploma &amp; QR</text>
      <text x="58" y="40" font-size="10.5" fill="#059669">Delivery to Student</text>

      <text x="20" y="80" font-size="12" font-weight="700" fill="#0F172A">🎓 Final Certificate Delivery:</text>
      <text x="20" y="103" font-size="11" fill="#334155">• System generates official PDF</text>
      <text x="20" y="123" font-size="11" fill="#334155">• Embeds a scannable QR Code</text>
      <text x="20" y="143" font-size="11" fill="#334155">• Automatically emails to student</text>

      <rect x="18" y="165" width="239" height="105" rx="6" fill="#F0FDF4" stroke="#A7F3D0" />
      <text x="28" y="188" font-size="11" font-weight="700" fill="#166534">📱 Ready for Verification:</text>
      <text x="28" y="208" font-size="10.5" fill="#334155">Student can print it, attach to CV,</text>
      <text x="28" y="226" font-size="10.5" fill="#334155">or post on LinkedIn.</text>
      <text x="28" y="250" font-size="10" font-weight="600" fill="#059669">Anyone can scan QR to check truth!</text>
    </g>


    <!-- ==================== CONNECTOR BETWEEN STAGES ==================== -->
    <path d="M 1217 370 L 1217 415 L 200 415 L 200 455" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arrow-blue)" />
    <rect x="580" y="404" width="260" height="22" rx="4" fill="#EFF6FF" stroke="#BFDBFE" />
    <text x="710" y="419" font-size="10.5" font-weight="800" fill="#1E40AF" text-anchor="middle">QR CODE SCANNED BY EMPLOYER FOR VERIFICATION</text>


    <!-- ==================== PHASE 2: VERIFICATION & HOW IT CHECKS ==================== -->
    <rect x="25" y="445" width="1350" height="415" rx="12" fill="#FFFFFF" stroke="#86EFAC" stroke-width="2" />
    <rect x="25" y="445" width="1350" height="42" rx="12" fill="#F0FDF4" />
    <text x="45" y="472" font-size="14" font-weight="800" fill="#166534">STAGE 2: HOW VERIFICATION WORKS (EMPLOYER / PUBLIC VERIFIER SIDE)</text>

    <!-- STEP 5: Verifier Inputs ID / Scans QR -->
    <g transform="translate(45, 505)" filter="url(#cardShadow)">
      <rect width="310" height="330" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <rect width="310" height="48" rx="10" fill="#ECFDF5" />
      <circle cx="34" cy="24" r="14" fill="#059669" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">5</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#065F46">Employer Checks Diploma</text>
      <text x="58" y="40" font-size="10.5" fill="#059669">Public Portal (/verify)</text>

      <text x="20" y="82" font-size="12" font-weight="700" fill="#0F172A">🔍 Two Simple Ways to Check:</text>
      <text x="20" y="108" font-size="11.5" fill="#334155">1. Scan QR Code using phone camera</text>
      <text x="20" y="128" font-size="11.5" fill="#334155">2. Or type Certificate ID on the site</text>
      <text x="34" y="146" font-size="10.5" font-family="monospace" fill="#059669">(e.g. CERT-2026-PUCC8)</text>

      <rect x="18" y="170" width="274" height="140" rx="8" fill="#F0FDF4" stroke="#A7F3D0" />
      <text x="28" y="196" font-size="11.5" font-weight="800" fill="#166534">🌟 Super Easy for Employers:</text>
      <text x="28" y="222" font-size="11" font-weight="600" fill="#065F46">✓ NO account needed</text>
      <text x="28" y="244" font-size="11" font-weight="600" fill="#065F46">✓ NO crypto wallet needed</text>
      <text x="28" y="266" font-size="11" font-weight="600" fill="#065F46">✓ 100% Free (zero gas fees)</text>
      <text x="28" y="292" font-size="10.5" fill="#4B5563">Anyone can verify anywhere in the world!</text>
    </g>

    <!-- Arrow 5 -> 6 -->
    <path d="M 355 670 L 395 670" stroke="#059669" stroke-width="3" marker-end="url(#arrow-green)" />

    <!-- STEP 6: Recreate Hash & Ask Blockchain -->
    <g transform="translate(405, 505)" filter="url(#cardShadow)">
      <rect width="330" height="330" rx="10" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
      <rect width="330" height="48" rx="10" fill="#F5F3FF" />
      <circle cx="34" cy="24" r="14" fill="#7C3AED" />
      <text x="34" y="30" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">6</text>
      <text x="58" y="24" font-size="13" font-weight="800" fill="#5B21B6">Compare with Blockchain</text>
      <text x="58" y="40" font-size="10.5" fill="#7C3AED">Automatic Cryptographic Check</text>

      <text x="20" y="82" font-size="12" font-weight="700" fill="#0F172A">⚙️ The System Does 2 Things:</text>
      
      <rect x="18" y="98" width="294" height="70" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="28" y="118" font-size="11" font-weight="700" fill="#334155">A. Re-computes Fingerprint:</text>
      <text x="28" y="136" font-size="10.5" fill="#64748B">Takes the diploma details and makes</text>
      <text x="28" y="152" font-size="10.5" fill="#64748B">the SHA-256 fingerprint again.</text>

      <rect x="18" y="178" width="294" height="75" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="28" y="198" font-size="11" font-weight="700" fill="#334155">B. Asks the Smart Contract:</text>
      <text x="28" y="216" font-size="10.5" font-family="monospace" fill="#7C3AED">verifyCertificate(id, fingerprint)</text>
      <text x="28" y="234" font-size="10" fill="#64748B">Does this match what's on the ledger?</text>

      <rect x="18" y="263" width="294" height="52" rx="6" fill="#EDE9FE" />
      <text x="28" y="283" font-size="10.5" font-weight="700" fill="#6D28D9">⚡ 0-Second Instant Result</text>
      <text x="28" y="299" font-size="10" fill="#5B21B6">The blockchain returns the official status!</text>
    </g>

    <!-- Arrow 6 -> 7 -->
    <path d="M 735 670 L 775 670" stroke="#7C3AED" stroke-width="3" marker-end="url(#arrow-purple)" />

    <!-- STEP 7: The 4 Outcomes Box (Right Side) -->
    <g transform="translate(785, 505)">
      <!-- Outcome 1: VALID -->
      <g filter="url(#cardShadow)">
        <rect width="280" height="155" rx="8" fill="#F0FDF4" stroke="#16A34A" stroke-width="2" />
        <rect width="280" height="30" rx="8" fill="#DCFCE7" />
        <text x="14" y="21" font-size="12" font-weight="800" fill="#166534">🟢 1. GENUINE &amp; VALID</text>
        <text x="14" y="55" font-size="11" font-weight="700" fill="#15803D">• Fingerprints Match 100%</text>
        <text x="14" y="75" font-size="10.5" fill="#334155">• Diploma is active &amp; authentic</text>
        <text x="14" y="95" font-size="10.5" fill="#334155">• Issued by accredited university</text>
        <text x="14" y="115" font-size="10.5" fill="#334155">• Shows Blockchain Tx Proof</text>
        <rect x="14" y="127" width="130" height="18" rx="4" fill="#BBF7D0" />
        <text x="20" y="140" font-size="9" font-weight="800" fill="#14532D">100% AUTHENTIC</text>
      </g>

      <!-- Outcome 2: EXPIRED -->
      <g transform="translate(295, 0)" filter="url(#cardShadow)">
        <rect width="280" height="158" rx="8" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
        <rect width="280" height="30" rx="8" fill="#FEF3C7" />
        <text x="14" y="21" font-size="12" font-weight="800" fill="#92400E">🟡 2. EXPIRED</text>
        <text x="14" y="55" font-size="11" font-weight="700" fill="#B45309">• Was real when issued</text>
        <text x="14" y="75" font-size="10.5" fill="#334155">• Expiration date has passed</text>
        <text x="14" y="95" font-size="10.5" fill="#334155">• Blockchain clock verified it</text>
        <text x="14" y="115" font-size="10.5" fill="#334155">• Alerts employer to renew</text>
        <rect x="14" y="128" width="130" height="18" rx="4" fill="#FDE68A" />
        <text x="20" y="141" font-size="9" font-weight="800" fill="#78350F">NEEDS RENEWAL</text>
      </g>

      <!-- Outcome 3: REVOKED -->
      <g transform="translate(0, 172)" filter="url(#cardShadow)">
        <rect width="280" height="158" rx="8" fill="#FFF1F2" stroke="#DC2626" stroke-width="2" />
        <rect width="280" height="30" rx="8" fill="#FEE2E2" />
        <text x="14" y="21" font-size="12" font-weight="800" fill="#991B1B">🔴 3. REVOKED</text>
        <text x="14" y="55" font-size="11" font-weight="700" fill="#B91C1C">• Cancelled by School</text>
        <text x="14" y="75" font-size="10.5" fill="#334155">• E.g., Cheating or Admin Error</text>
        <text x="14" y="95" font-size="10.5" fill="#334155">• Revocation reason on ledger</text>
        <text x="14" y="115" font-size="10.5" fill="#334155">• Permanent on blockchain</text>
        <rect x="14" y="128" width="140" height="18" rx="4" fill="#FECDD3" />
        <text x="20" y="141" font-size="9" font-weight="800" fill="#881337">INVALIDATED DEGREE</text>
      </g>

      <!-- Outcome 4: HASH MISMATCH (TAMPER ALERT) -->
      <g transform="translate(295, 172)" filter="url(#cardShadow)">
        <rect width="280" height="158" rx="8" fill="#FAF5FF" stroke="#7C3AED" stroke-width="2" />
        <rect width="280" height="30" rx="8" fill="#F3E8FF" />
        <text x="14" y="21" font-size="12" font-weight="800" fill="#6B21A8">🟣 4. TAMPER ALERT (FAKE!)</text>
        <text x="14" y="55" font-size="11" font-weight="700" fill="#7C3AED">• Someone altered name / grade</text>
        <text x="14" y="75" font-size="10.5" fill="#334155">• The fingerprint changed!</text>
        <text x="14" y="95" font-size="10.5" fill="#334155">• Doesn't match blockchain anchor</text>
        <text x="14" y="115" font-size="10.5" fill="#334155">• Instant forgery alert!</text>
        <rect x="14" y="128" width="140" height="18" rx="4" fill="#E9D5FF" />
        <text x="20" y="141" font-size="9" font-weight="800" fill="#581C87">FORGERY CAUGHT</text>
      </g>
    </g>
  `;
}

function wrapHtml(title, svgContent, width = 1400, height = 880) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      padding: 28px 36px 32px 36px;
      width: ${width + 72}px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #C8102E;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .title-group h1 {
      font-size: 19px;
      font-weight: 800;
      color: #0F172A;
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
  </style>
</head>
<body>
  <div class="canvas-card">
    <div class="header-bar">
      <div class="title-group">
        <h1>HOW CITADEL WORKS: STEP-BY-STEP BLOCKCHAIN EXPLANATION</h1>
        <p>A Simple Visual Guide to Certificate Issuance, Ethereum Smart Contract Anchoring, and Public Verification</p>
      </div>
      <div class="badge">System Flow Diagram</div>
    </div>
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${SVG_DEFS}
      ${svgContent}
    </svg>
  </div>
</body>
</html>`;
}

async function render() {
  console.log('Rendering How-It-Works diagram...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1550, height: 1050 },
    deviceScaleFactor: 2.0,
  });
  const page = await context.newPage();

  const svg = getHowItWorksSvg();
  const html = wrapHtml('How Citadel Works', svg, 1400, 880);
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const card = await page.$('.canvas-card');
  const outPath = path.join(SCREENSHOTS_DIR, 'diagram_how_it_works.png');
  await card.screenshot({ path: outPath });
  console.log('✅ Successfully rendered:', outPath);

  await browser.close();
}

render().catch(console.error);

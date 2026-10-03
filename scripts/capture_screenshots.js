const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3005';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser to capture screenshots...');
  const browser = await chromium.launch({ headless: true });
  
  // Public context without auth cookie
  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const publicPage = await publicContext.newPage();

  // 1. Landing Page
  console.log('1. Capturing Landing Page...');
  await publicPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await publicPage.waitForTimeout(1000);
  await publicPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_page.png') });

  // 2. Login Page
  console.log('2. Capturing Login Page...');
  await publicPage.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await publicPage.waitForTimeout(1000);
  await publicPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_login_page.png') });

  // 3. Register Page
  console.log('3. Capturing Register Page...');
  await publicPage.goto(`${BASE_URL}/register`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await publicPage.waitForTimeout(1000);
  await publicPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_register_page.png') });

  // 4. Public Verification Page
  console.log('4. Capturing Public Verification Page...');
  await publicPage.goto(`${BASE_URL}/verify`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await publicPage.waitForTimeout(1000);
  await publicPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_public_verify_portal.png') });

  // 5. Sample Certificate Verification Result
  console.log('5. Capturing Verification Result (Valid)...');
  await publicPage.goto(`${BASE_URL}/verify/CERT-2026-PUCC8`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await publicPage.waitForTimeout(2000);
  await publicPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_verification_result_valid.png') });

  await publicContext.close();

  // Authenticated Context with demo_auth cookie
  console.log('Creating authenticated session for dashboard...');
  const authContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  await authContext.addCookies([
    {
      name: 'demo_auth',
      value: 'true',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    },
  ]);

  const authPage = await authContext.newPage();

  // 6. Dashboard Overview
  console.log('6. Capturing Dashboard Overview...');
  await authPage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await authPage.waitForTimeout(2000);
  await authPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_dashboard_overview.png') });

  // 7. Issue Certificate Studio (with live preview)
  console.log('7. Capturing Issue Studio (Live Preview)...');
  await authPage.goto(`${BASE_URL}/dashboard/certificates/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await authPage.waitForTimeout(1500);

  // Fill in live preview data
  try {
    const nameInput = authPage.locator('input[name="recipientName"], input#recipientName').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Alexander J. Vance');
    }

    const emailInput = authPage.locator('input[name="recipientEmail"], input#recipientEmail').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('alexander.vance@mit.edu');
    }

    const courseInput = authPage.locator('input[name="courseName"], input#courseName').first();
    if (await courseInput.isVisible()) {
      await courseInput.fill('Master of Science in Distributed Blockchain Systems');
    }

    const descInput = authPage.locator('textarea[name="courseDescription"], textarea#courseDescription').first();
    if (await descInput.isVisible()) {
      await descInput.fill('Awarded with Highest Distinction for thesis excellence in Cryptographic Zero-Knowledge Consensus Protocols.');
    }
  } catch (e) {
    console.warn('Could not fill preview inputs:', e.message);
  }

  await authPage.waitForTimeout(2000);
  await authPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_issue_studio_live_preview.png') });

  // 8. Certificate Registry Page
  console.log('8. Capturing Certificate Registry...');
  await authPage.goto(`${BASE_URL}/dashboard/certificates`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await authPage.waitForTimeout(2000);
  await authPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_certificate_registry.png') });

  await authContext.close();
  await browser.close();

  console.log('✅ ALL SCREENSHOTS SUCCESSFULLY CAPTURED IN docs/screenshots!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

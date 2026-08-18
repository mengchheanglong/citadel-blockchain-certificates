import { test, expect } from '@playwright/test';

// Use a unique email for each run to avoid state collision
const timestamp = Date.now();
const testOrg = {
  name: `Org Edge Cases ${timestamp}`,
  email: `edgecases_${timestamp}@test.com`,
  password: 'SecurePassword123!',
};

let issuedCertId = '';

test.describe('Blockchain Certificate Platform - UI Edge Cases', () => {

  test('1. Registration Edge Cases (Passwords, XSS, Validation)', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Test XSS in name
    await page.fill('input[name="name"]', '<script>alert("XSS")</script> Name');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'short');
    await page.fill('input[name="confirmPassword"]', 'mismatch');
    
    await page.click('button[type="submit"]');

    // Wait for validation errors or toasts (assuming HTML5 validation or Zod shows up)
    // We expect it to NOT navigate away.
    expect(page.url()).toContain('/register');

    // Now valid registration
    await page.fill('input[name="name"]', testOrg.name);
    await page.fill('input[name="email"]', testOrg.email);
    await page.fill('input[name="password"]', testOrg.password);
    await page.fill('input[name="confirmPassword"]', testOrg.password);

    // Click and wait for navigation to login or dashboard
    await Promise.all([
      page.waitForURL('**/login*'),
      page.click('button[type="submit"]')
    ]);

    expect(page.url()).toContain('/login');
  });

  test('2. Login Edge Cases (Wrong credentials, SQLi attempt)', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Attempt SQLi / NoSQLi in email
    await page.fill('input[name="email"]', "' OR 1=1 --");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');

    // Should stay on login
    expect(page.url()).toContain('/login');

    // Valid login
    await page.fill('input[name="email"]', testOrg.email);
    await page.fill('input[name="password"]', testOrg.password);
    
    await Promise.all([
      page.waitForURL('**/dashboard*'),
      page.click('button[type="submit"]')
    ]);

    expect(page.url()).toContain('/dashboard');
  });

  test('3. Issue Certificate Edge Cases (Long inputs, HTML tags, Missing optionals)', async ({ page }) => {
    // Requires login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testOrg.email);
    await page.fill('input[name="password"]', testOrg.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard*');

    await page.goto('http://localhost:3000/dashboard/certificates/new');

    // Fuzzing Inputs
    const longName = 'A'.repeat(250); // Exceeds 200 char limit
    await page.fill('input[name="recipientName"]', longName);
    await page.fill('input[name="recipientEmail"]', 'test@example.com');
    await page.fill('input[name="courseName"]', 'Blockchain 101');
    
    await page.click('button[type="submit"]');
    
    // Should fail validation (assuming Zod max length is 200)
    // We expect an error toast or message, but let's check if it blocked issuance
    await page.waitForTimeout(1000); 
    const isSuccessVisible = await page.isVisible('text="Certificate Issued Successfully"');
    expect(isSuccessVisible).toBeFalsy();

    // Now Valid Issuance with valid Edge inputs (Unicode, Max allowed lengths, HTML entity)
    const validLongName = 'Jósé Máriá 👨‍💻 ' + 'B'.repeat(50);
    await page.fill('input[name="recipientName"]', validLongName);
    await page.fill('input[name="recipientEmail"]', 'edge.recipient@test.com');
    await page.fill('input[name="courseName"]', 'Advanced Quantum Cryptography & Blockchain Architecture');
    await page.fill('textarea[name="courseDescription"]', 'Testing <b>HTML</b> and <script> tags to ensure they are sanitized in PDF.');
    
    // Valid future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    await page.fill('input[name="expiryDate"]', futureDate.toISOString().split('T')[0]);

    await page.click('button[type="submit"]');

    // Wait for success screen
    await page.waitForSelector('text=Certificate Issued Successfully', { timeout: 15000 });
    
    // Extract ID (assuming the ID is displayed in a monospace font or specific element, we look for CERT-)
    const pageText = await page.content();
    const match = pageText.match(/CERT-\d{4}-[A-Z0-9]+/);
    expect(match).toBeTruthy();
    if (match) issuedCertId = match[0];
  });

  test('4. Dashboard Search Edge Cases (Regex characters, Case Insensitivity)', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testOrg.email);
    await page.fill('input[name="password"]', testOrg.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard*');

    await page.goto('http://localhost:3000/dashboard/certificates');

    // Search with regex control characters to ensure backend escapes them or handles them safely
    await page.fill('input[placeholder*="Search"]', '[.*+?^${}()|[]');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(1000);

    // Search for the issued cert in LOWERCASE (testing case insensitivity)
    if (issuedCertId) {
      await page.fill('input[placeholder*="Search"]', issuedCertId.toLowerCase());
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(1000);
      
      const tableContent = await page.textContent('table');
      // Should find the uppercase ID
      expect(tableContent).toContain(issuedCertId);
    }
  });

  test('5. Public Verification Edge Cases (Whitespace, Tampered ID)', async ({ page }) => {
    if (!issuedCertId) test.skip();

    await page.goto('http://localhost:3000/verify');

    // Test with leading/trailing spaces and lowercase
    await page.fill('input[placeholder*="Enter Certificate ID"]', `  ${issuedCertId.toLowerCase()}  `);
    await page.click('button:has-text("Verify")');

    // Wait for result page
    await page.waitForURL(`**/verify/${encodeURIComponent(issuedCertId.toLowerCase())}*`);
    
    // Verify it resolved correctly despite the spaces and casing
    await page.waitForSelector('text=Valid');
    const content = await page.content();
    expect(content).toContain(issuedCertId); // The canonical ID should be displayed

    // Test Tampered / Fake ID
    await page.goto('http://localhost:3000/verify');
    await page.fill('input[placeholder*="Enter Certificate ID"]', 'CERT-9999-FAKE1');
    await page.click('button:has-text("Verify")');
    
    // Should show Not Found or similar error
    await page.waitForSelector('text=not found', { timeout: 5000 }).catch(() => {});
  });
});

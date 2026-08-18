# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edge-cases.spec.ts >> Blockchain Certificate Platform - UI Edge Cases >> 4. Dashboard Search Edge Cases (Regex characters, Case Insensitivity)
- Location: e2e\edge-cases.spec.ts:116:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Back to Home" [ref=e5] [cursor=pointer]:
          - /url: /
        - link "BlockCert" [ref=e9] [cursor=pointer]:
          - /url: /
    - main [ref=e14]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - heading "Organization Sign In" [level=3] [ref=e21]
          - paragraph [ref=e22]: Enter your organization credentials to manage and issue certificates
        - generic [ref=e24]:
          - generic [ref=e25]:
            - text: Email Address
            - textbox "Email Address" [ref=e30]:
              - /placeholder: org@example.com
          - generic [ref=e31]:
            - generic [ref=e32]: Password
            - textbox "Password" [ref=e38]:
              - /placeholder: ••••••••
          - button "Sign In" [ref=e39] [cursor=pointer]
        - paragraph [ref=e43]:
          - text: Don't have an organization account yet?
          - link "Register your Organization" [ref=e44] [cursor=pointer]:
            - /url: /register
    - contentinfo [ref=e45]: © 2026 BlockCert Platform. Immutable blockchain credentialing.
  - region "Notifications (F8)":
    - list
  - alert [ref=e46]
```

# Test source

```ts
  18  |     // Test XSS in name
  19  |     await page.fill('input[name="name"]', '<script>alert("XSS")</script> Name');
  20  |     await page.fill('input[name="email"]', 'invalid-email');
  21  |     await page.fill('input[name="password"]', 'short');
  22  |     await page.fill('input[name="confirmPassword"]', 'mismatch');
  23  |     
  24  |     await page.click('button[type="submit"]');
  25  | 
  26  |     // Wait for validation errors or toasts (assuming HTML5 validation or Zod shows up)
  27  |     // We expect it to NOT navigate away.
  28  |     expect(page.url()).toContain('/register');
  29  | 
  30  |     // Now valid registration
  31  |     await page.fill('input[name="name"]', testOrg.name);
  32  |     await page.fill('input[name="email"]', testOrg.email);
  33  |     await page.fill('input[name="password"]', testOrg.password);
  34  |     await page.fill('input[name="confirmPassword"]', testOrg.password);
  35  | 
  36  |     // Click and wait for navigation to login or dashboard
  37  |     await Promise.all([
  38  |       page.waitForURL('**/login*'),
  39  |       page.click('button[type="submit"]')
  40  |     ]);
  41  | 
  42  |     expect(page.url()).toContain('/login');
  43  |   });
  44  | 
  45  |   test('2. Login Edge Cases (Wrong credentials, SQLi attempt)', async ({ page }) => {
  46  |     await page.goto('http://localhost:3000/login');
  47  | 
  48  |     // Attempt SQLi / NoSQLi in email
  49  |     await page.fill('input[name="email"]', "' OR 1=1 --");
  50  |     await page.fill('input[name="password"]', "password");
  51  |     await page.click('button[type="submit"]');
  52  | 
  53  |     // Should stay on login
  54  |     expect(page.url()).toContain('/login');
  55  | 
  56  |     // Valid login
  57  |     await page.fill('input[name="email"]', testOrg.email);
  58  |     await page.fill('input[name="password"]', testOrg.password);
  59  |     
  60  |     await Promise.all([
  61  |       page.waitForURL('**/dashboard*'),
  62  |       page.click('button[type="submit"]')
  63  |     ]);
  64  | 
  65  |     expect(page.url()).toContain('/dashboard');
  66  |   });
  67  | 
  68  |   test('3. Issue Certificate Edge Cases (Long inputs, HTML tags, Missing optionals)', async ({ page }) => {
  69  |     // Requires login first
  70  |     await page.goto('http://localhost:3000/login');
  71  |     await page.fill('input[name="email"]', testOrg.email);
  72  |     await page.fill('input[name="password"]', testOrg.password);
  73  |     await page.click('button[type="submit"]');
  74  |     await page.waitForURL('**/dashboard*');
  75  | 
  76  |     await page.goto('http://localhost:3000/dashboard/certificates/new');
  77  | 
  78  |     // Fuzzing Inputs
  79  |     const longName = 'A'.repeat(250); // Exceeds 200 char limit
  80  |     await page.fill('input[name="recipientName"]', longName);
  81  |     await page.fill('input[name="recipientEmail"]', 'test@example.com');
  82  |     await page.fill('input[name="courseName"]', 'Blockchain 101');
  83  |     
  84  |     await page.click('button[type="submit"]');
  85  |     
  86  |     // Should fail validation (assuming Zod max length is 200)
  87  |     // We expect an error toast or message, but let's check if it blocked issuance
  88  |     await page.waitForTimeout(1000); 
  89  |     const isSuccessVisible = await page.isVisible('text="Certificate Issued Successfully"');
  90  |     expect(isSuccessVisible).toBeFalsy();
  91  | 
  92  |     // Now Valid Issuance with valid Edge inputs (Unicode, Max allowed lengths, HTML entity)
  93  |     const validLongName = 'Jósé Máriá 👨‍💻 ' + 'B'.repeat(50);
  94  |     await page.fill('input[name="recipientName"]', validLongName);
  95  |     await page.fill('input[name="recipientEmail"]', 'edge.recipient@test.com');
  96  |     await page.fill('input[name="courseName"]', 'Advanced Quantum Cryptography & Blockchain Architecture');
  97  |     await page.fill('textarea[name="courseDescription"]', 'Testing <b>HTML</b> and <script> tags to ensure they are sanitized in PDF.');
  98  |     
  99  |     // Valid future date
  100 |     const futureDate = new Date();
  101 |     futureDate.setFullYear(futureDate.getFullYear() + 1);
  102 |     await page.fill('input[name="expiryDate"]', futureDate.toISOString().split('T')[0]);
  103 | 
  104 |     await page.click('button[type="submit"]');
  105 | 
  106 |     // Wait for success screen
  107 |     await page.waitForSelector('text=Certificate Issued Successfully', { timeout: 15000 });
  108 |     
  109 |     // Extract ID (assuming the ID is displayed in a monospace font or specific element, we look for CERT-)
  110 |     const pageText = await page.content();
  111 |     const match = pageText.match(/CERT-\d{4}-[A-Z0-9]+/);
  112 |     expect(match).toBeTruthy();
  113 |     if (match) issuedCertId = match[0];
  114 |   });
  115 | 
  116 |   test('4. Dashboard Search Edge Cases (Regex characters, Case Insensitivity)', async ({ page }) => {
  117 |     await page.goto('http://localhost:3000/login');
> 118 |     await page.fill('input[name="email"]', testOrg.email);
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  119 |     await page.fill('input[name="password"]', testOrg.password);
  120 |     await page.click('button[type="submit"]');
  121 |     await page.waitForURL('**/dashboard*');
  122 | 
  123 |     await page.goto('http://localhost:3000/dashboard/certificates');
  124 | 
  125 |     // Search with regex control characters to ensure backend escapes them or handles them safely
  126 |     await page.fill('input[placeholder*="Search"]', '[.*+?^${}()|[]');
  127 |     await page.click('button:has-text("Search")');
  128 |     await page.waitForTimeout(1000);
  129 | 
  130 |     // Search for the issued cert in LOWERCASE (testing case insensitivity)
  131 |     if (issuedCertId) {
  132 |       await page.fill('input[placeholder*="Search"]', issuedCertId.toLowerCase());
  133 |       await page.click('button:has-text("Search")');
  134 |       await page.waitForTimeout(1000);
  135 |       
  136 |       const tableContent = await page.textContent('table');
  137 |       // Should find the uppercase ID
  138 |       expect(tableContent).toContain(issuedCertId);
  139 |     }
  140 |   });
  141 | 
  142 |   test('5. Public Verification Edge Cases (Whitespace, Tampered ID)', async ({ page }) => {
  143 |     if (!issuedCertId) test.skip();
  144 | 
  145 |     await page.goto('http://localhost:3000/verify');
  146 | 
  147 |     // Test with leading/trailing spaces and lowercase
  148 |     await page.fill('input[placeholder*="Enter Certificate ID"]', `  ${issuedCertId.toLowerCase()}  `);
  149 |     await page.click('button:has-text("Verify")');
  150 | 
  151 |     // Wait for result page
  152 |     await page.waitForURL(`**/verify/${encodeURIComponent(`  ${issuedCertId.toLowerCase()}  `)}*`);
  153 |     
  154 |     // Verify it resolved correctly despite the spaces and casing
  155 |     await page.waitForSelector('text=Valid');
  156 |     const content = await page.content();
  157 |     expect(content).toContain(issuedCertId); // The canonical ID should be displayed
  158 | 
  159 |     // Test Tampered / Fake ID
  160 |     await page.goto('http://localhost:3000/verify');
  161 |     await page.fill('input[placeholder*="Enter Certificate ID"]', 'CERT-9999-FAKE1');
  162 |     await page.click('button:has-text("Verify")');
  163 |     
  164 |     // Should show Not Found or similar error
  165 |     await page.waitForSelector('text=not found', { timeout: 5000 }).catch(() => {});
  166 |   });
  167 | });
  168 | 
```
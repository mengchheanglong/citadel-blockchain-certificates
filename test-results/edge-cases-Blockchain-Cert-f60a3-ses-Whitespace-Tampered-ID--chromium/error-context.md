# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edge-cases.spec.ts >> Blockchain Certificate Platform - UI Edge Cases >> 5. Public Verification Edge Cases (Whitespace, Tampered ID)
- Location: e2e\edge-cases.spec.ts:142:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/verify/%20%20cert-2026-oy2li%20%20*" until "load"
  navigated to "http://localhost:3000/verify/cert-2026-oy2li"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Verify Another" [ref=e5] [cursor=pointer]:
          - /url: /verify
        - link "BlockCert" [ref=e9] [cursor=pointer]:
          - /url: /
        - link [ref=e14] [cursor=pointer]:
          - /url: /login
          - button "Issuer Login" [ref=e15]
    - main [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - heading "Certificate is Valid" [level=1] [ref=e27]
            - generic [ref=e28]: AUTHENTIC RECORD
          - paragraph [ref=e29]: This credential is cryptographically anchored on the Ethereum blockchain and verified authentic.
        - generic [ref=e30]:
          - generic [ref=e32]:
            - generic [ref=e34]:
              - generic [ref=e35]:
                - heading "Credential Details" [level=3] [ref=e36]
                - paragraph [ref=e37]: Verified recipient and course information
              - generic [ref=e38]:
                - generic [ref=e39]: CERT-2026-OY2LI
                - button "Copy ID" [ref=e40] [cursor=pointer]
            - generic [ref=e44]:
              - generic [ref=e49]:
                - text: Recipient Name
                - paragraph [ref=e50]: Jósé Máriá 👨‍💻 BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
              - generic [ref=e55]:
                - text: Course / Credential
                - paragraph [ref=e56]: Advanced Quantum Cryptography & Blockchain Architecture
                - paragraph [ref=e57]: Testing <b>HTML</b> and <script> tags to ensure they are sanitized in PDF.
              - generic [ref=e63]:
                - text: Issuing Organization
                - paragraph [ref=e64]: Org Edge Cases 1787037835499
                - generic [ref=e65]: edgecases_1787037835499@test.com
              - generic [ref=e70]:
                - generic [ref=e74]:
                  - text: Issue Date
                  - paragraph [ref=e75]: August 18, 2026
                - generic [ref=e80]:
                  - text: Expiration Date
                  - paragraph [ref=e81]: August 18, 2027
          - generic [ref=e83]:
            - generic [ref=e84]:
              - heading "Blockchain Proof" [level=3] [ref=e90]
              - paragraph [ref=e91]: Verified on Blockchain
            - generic [ref=e92]:
              - generic [ref=e93]:
                - generic [ref=e94]: Verification Status
                - text: Verified on Blockchain
              - generic [ref=e95]:
                - generic [ref=e96]:
                  - generic [ref=e97]: Transaction Hash
                  - button "Copy Hash" [ref=e98] [cursor=pointer]
                - link "0xd38a89ea...73f05520" [ref=e103] [cursor=pointer]:
                  - /url: https://etherscan.io/tx/0xd38a89ea0b818520cebcc868b23cfff002e3c2dfe394f05c5d65ab5373f05520
              - generic [ref=e109]:
                - text: Block Number
                - paragraph [ref=e110]: "#2"
              - generic [ref=e111]:
                - text: Network
                - paragraph [ref=e112]: hardhat
              - generic [ref=e113]:
                - generic [ref=e114]:
                  - generic [ref=e115]: Contract Address
                  - button "Copy Contract" [ref=e116] [cursor=pointer]
                - paragraph [ref=e120]: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        - generic [ref=e121]:
          - generic [ref=e122]:
            - heading "Need to verify another certificate?" [level=3] [ref=e123]
            - paragraph [ref=e124]: You can search by ID or scan another QR code.
          - generic [ref=e125]:
            - link [ref=e126] [cursor=pointer]:
              - /url: /verify
              - button "Verify Another Certificate" [ref=e127]
            - link [ref=e131] [cursor=pointer]:
              - /url: /
              - button "Back to Home" [ref=e132]
    - contentinfo [ref=e133]:
      - paragraph [ref=e134]: © 2026 BlockCert Platform. Immutable blockchain credential verification.
  - region "Notifications (F8)":
    - list
  - alert [ref=e135]
```

# Test source

```ts
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
  118 |     await page.fill('input[name="email"]', testOrg.email);
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
> 152 |     await page.waitForURL(`**/verify/${encodeURIComponent(`  ${issuedCertId.toLowerCase()}  `)}*`);
      |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
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
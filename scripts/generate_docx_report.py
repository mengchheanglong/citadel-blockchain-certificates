import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_shading(cell, color_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_callout(doc, text, title=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_shading(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    
    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10.5)
        run_title.font.color.rgb = RGBColor(200, 16, 46) # Burgundy
        
    run_text = p.add_run(text)
    run_text.font.name = "Calibri"
    run_text.font.size = Pt(10)
    run_text.font.color.rgb = RGBColor(51, 65, 85)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def build_document():
    doc = Document()
    
    # Page setup: Standard Letter, 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Styles
    BURGUNDY = RGBColor(200, 16, 46)
    DARK_GRAY = RGBColor(30, 41, 59)
    BODY_COLOR = RGBColor(51, 65, 85)
    MUTED_COLOR = RGBColor(100, 116, 139)
    
    # ----------------------------------------------------
    # TITLE & HEADER
    # ----------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_main_title = title_p.add_run("Blockchain-Based Digital Certificate Issuing Platform")
    run_main_title.bold = True
    run_main_title.font.name = "Calibri"
    run_main_title.font.size = Pt(24)
    run_main_title.font.color.rgb = DARK_GRAY
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(16)
    run_sub = sub_p.add_run("Project Submission Report — Citadel Platform Architecture & Implementation")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(14)
    run_sub.font.color.rgb = BURGUNDY
    run_sub.bold = True
    
    # Metadata Card
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    meta_data = [
        ("Platform Name", "Citadel (Decentralized Credential Issuing & Verification)"),
        ("Author / Student Name", "[Your Full Name]"),
        ("Student ID", "[Your Student ID]"),
        ("Project Arrangement", "Individual / Solo Project (100% Contribution)"),
        ("GitHub Repository", "https://github.com/mengchheanglong/citadel-blockchain-certificates"),
        ("Public Demo Video Link", "[Insert your public Google Drive or YouTube link here]"),
    ]
    
    col_widths = [Inches(2.0), Inches(4.5)]
    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_shading(c0, "F1F5F9")
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(10)
        r0.font.color.rgb = DARK_GRAY
        
        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_shading(c1, "FFFFFF")
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Calibri"
        r1.font.size = Pt(10)
        r1.font.color.rgb = BURGUNDY if "http" in val else BODY_COLOR
        if "http" in val:
            r1.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Helper for headings
    def add_section_heading(num_str, title_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(6)
        r_num = h.add_run(f"{num_str}. ")
        r_num.bold = True
        r_num.font.name = "Calibri"
        r_num.font.size = Pt(15)
        r_num.font.color.rgb = BURGUNDY
        
        r_txt = h.add_run(title_str)
        r_txt.bold = True
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(15)
        r_txt.font.color.rgb = DARK_GRAY

    def add_subheading(sub_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        r = h.add_run(sub_str)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(12)
        r.font.color.rgb = DARK_GRAY

    def add_body(text, bold_prefix=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Calibri"
            r_b.font.size = Pt(10.5)
            r_b.font.color.rgb = DARK_GRAY
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)
        r.font.color.rgb = BODY_COLOR
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Calibri"
            r_b.font.size = Pt(10.5)
            r_b.font.color.rgb = DARK_GRAY
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)
        r.font.color.rgb = BODY_COLOR

    # ----------------------------------------------------
    # SECTION 1: SYSTEM OVERVIEW
    # ----------------------------------------------------
    add_section_heading("1", "System Overview")
    add_subheading("1.1 Problem Statement")
    add_body("Traditional paper diplomas and static PDF certificates suffer from critical security and operational weaknesses:")
    add_bullet(" Anyone with basic graphical editing tools can modify student names, degree titles, graduation dates, or honors on PDF certificates without detection.", "Easy to Counterfeit:")
    add_bullet(" Employers and academic registrars must manually contact issuing universities via phone or email, causing multi-week delays.", "Slow & Expensive Verification:")
    add_bullet(" Traditional university verification databases are prone to administrative corruption, data loss, and unauthorized alterations.", "Centralized Risk:")

    add_subheading("1.2 The Citadel Solution")
    add_body("Citadel is an enterprise-grade digital credentialing platform that solves certificate fraud through the Ethereum blockchain:")
    add_bullet(" Each certificate is cryptographically fingerprinted using a canonical SHA-256 hash and anchored on an immutable smart contract. If an attacker modifies even a single letter in the student's name, the hash mismatch immediately exposes the forgery.", "Cryptographic Immutability:")
    add_bullet(" Anyone can verify a credential in seconds by typing the Certificate ID or pointing their device camera at the printed QR code.", "Instant Public Verification:")
    add_bullet(" Automatically generates high-resolution vector PDF diplomas with institutional borders and dispatches congratulatory emails with attached certificates.", "End-to-End Automation:")
    add_bullet(" Supports configurable expiration dates (Lifetime, +1 Year, +2 Years) and on-chain revocation with mandatory audit logging.", "Lifecycle Governance:")

    # ----------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE
    # ----------------------------------------------------
    add_section_heading("2", "System Architecture")
    add_body("Citadel is architected into four distinct, loosely coupled layers:")
    add_bullet(" Built with Next.js 14 and Tailwind CSS. Features an Enterprise Hybrid design: a sleek dark-mode landing page and a clean, high-contrast light dashboard with Citadel Burgundy Red (#C8102E) highlights.", "1. Presentation Layer (Frontend):")
    add_bullet(" Node.js Next.js Server Route Handlers and Server Actions. Enforces Zod schema validation, computes deterministic SHA-256 digests, generates vector diplomas with jsPDF, and sends emails via Nodemailer SMTP.", "2. Application & API Layer (Backend):")
    add_bullet(" Managed via Prisma ORM on Supabase PostgreSQL. Stores human-readable information (student names, program descriptions, organization profiles) securely off-chain.", "3. Persistence Layer (Database):")
    add_bullet(" Solidity smart contract (CertificateRegistry.sol) deployed on Ethereum EVM (Sepolia Testnet / Hardhat). Records only the 32-byte certificate ID hash, data hash, and expiration timestamp.", "4. Decentralized Ledger Layer (Blockchain):")

    add_callout(doc, "Architecture Flow: Web Browser (Next.js 14) -> API Routes (Zod Validation) -> PostgreSQL (Prisma ORM) & Ethereum EVM (Solidity Smart Contract via Ethers.js v6)", "Four-Tier Architecture Summary")

    # ----------------------------------------------------
    # SECTION 3: USER FLOW & SYSTEM FLOW
    # ----------------------------------------------------
    add_section_heading("3", "User Flow / System Flow")
    add_subheading("3.1 Organization Issuance Flow")
    add_bullet(" The administrator logs in using verified organization credentials.", "Step 1 (Authentication):")
    add_bullet(" Navigates to the Issue Studio. As the administrator types the student's name, degree, and expiry, the live diploma canvas updates in real time on screen.", "Step 2 (Data Entry & Live Preview):")
    add_bullet(" The server generates a unique ID (CERT-2026-XXXXX) and computes a canonical SHA-256 hash of the metadata.", "Step 3 (Hashing & Submission):")
    add_bullet(" The server calls issueCertificate on the smart contract via Ethers.js. Ethereum mines the transaction and returns the Tx Hash and Block Number.", "Step 4 (Blockchain Anchoring):")
    add_bullet(" A vector PDF diploma is created with an embedded QR code, and Nodemailer sends an email to the recipient with the PDF attached.", "Step 5 (PDF & Email Delivery):")

    add_subheading("3.2 Public Verification Flow")
    add_bullet(" The employer or verifier enters the Certificate ID or scans the diploma QR code with their camera on /verify.", "Step 1 (Input):")
    add_bullet(" The server queries the database for the certificate metadata and calculates the canonical SHA-256 hash.", "Step 2 (Lookup):")
    add_bullet(" The server calls verifyCertificate on the smart contract. The contract checks if the ID exists, verifies that the hash matches the on-chain record, and evaluates block.timestamp against expirationDate.", "Step 3 (On-Chain Verification):")
    add_bullet(" The user sees an official cryptographic proof card showing Valid (Green), Expired (Yellow), or Revoked (Red) with full transaction hash links.", "Step 4 (Result Display):")

    # ----------------------------------------------------
    # SECTION 4: DATABASE DESIGN (ER DIAGRAM)
    # ----------------------------------------------------
    add_section_heading("4", "Database Design (ER Diagram)")
    add_body("The database consists of three primary entities organized in relational structure:")
    
    db_table = doc.add_table(rows=4, cols=3)
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_table.autofit = False
    
    headers = ["Table", "Key Columns", "Purpose"]
    for j, h in enumerate(headers):
        c = db_table.rows[0].cells[j]
        set_cell_shading(c, "1E293B")
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    db_rows = [
        ("Organization", "id (UUID), name, email, website, description, createdAt", "Stores verified institution profile & issuer credentials."),
        ("Certificate", "id (UUID), certificateId (UK), recipientName, recipientEmail, courseName, issueDate, expiryDate, status, certHash, organizationId (FK)", "Stores academic records, recipient details, and canonical SHA-256 hash."),
        ("BlockchainTransaction", "id (UUID), certificateId (FK), txHash, blockNumber, networkName, contractAddress, action, status, createdAt", "Maintains an immutable audit log of Ethereum on-chain transactions."),
    ]
    
    widths = [Inches(1.8), Inches(2.7), Inches(2.0)]
    for i, row_data in enumerate(db_rows):
        row = db_table.rows[i+1]
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = widths[j]
            set_cell_shading(c, bg)
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = DARK_GRAY if j == 0 else BODY_COLOR
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ----------------------------------------------------
    # SECTION 5: BLOCKCHAIN ARCHITECTURE
    # ----------------------------------------------------
    add_section_heading("5", "Blockchain Architecture")
    add_subheading("5.1 Hybrid On-Chain / Off-Chain Architecture")
    add_body("Storing complete academic transcripts and personal identities directly on the public Ethereum blockchain has two critical drawbacks:")
    add_bullet(" Storing megabytes of PDF bytes or strings on Ethereum costs thousands of dollars in gas fees.", "High Gas Costs:")
    add_bullet(" Privacy regulations (such as GDPR and FERPA) mandate that student personal data must not be exposed permanently on an immutable public ledger.", "Data Privacy:")
    add_body("Citadel's Hybrid Solution: Detailed records remain private in PostgreSQL, while only the 32-byte cryptographic hash of the certificate is committed to the blockchain.")

    add_subheading("5.2 Deterministic Canonical Hashing Protocol")
    add_body("To prevent JSON key-ordering discrepancies across different programming platforms, Citadel sorts object keys deterministically before calculating the SHA-256 digest:")
    add_callout(doc, "Canonical Payload = JSON.stringify(sortedKeys({ certId, recipientName, courseName, issueDate, organizationId }))\ncertHash = SHA-256(Canonical Payload)", "Mathematical Hashing Formula")

    # ----------------------------------------------------
    # SECTION 6: SMART CONTRACT DESIGN
    # ----------------------------------------------------
    add_section_heading("6", "Smart Contract Design")
    add_body("The CertificateRegistry.sol smart contract is written in Solidity 0.8.24 and deployed on Ethereum EVM:")
    
    add_subheading("6.1 Contract State Enumeration")
    add_bullet(" Authentic, verified on-chain, and validity timestamp is unexpired.", "Valid (Status 1):")
    add_bullet(" Authentic when issued, but designated validity window has elapsed.", "Expired (Status 2):")
    add_bullet(" Officially invalidated on-chain by the issuing institution with logged audit reason.", "Revoked (Status 3):")
    add_bullet(" Certificate ID exists, but metadata payload has been tampered with.", "HashMismatch (Status 4):")
    add_bullet(" Certificate ID has never been registered on the blockchain.", "NotFound (Status 0):")

    add_subheading("6.2 Core Smart Contract Functions")
    add_bullet(" Validates that the caller is an authorized issuer, ensures the ID is unique, checks that the expiry date is in the future, and writes the record to Ethereum. Emits CertificateIssued.", "issueCertificate(bytes32 certIdHash, bytes32 certHash, uint256 expirationDate):")
    add_bullet(" Public, gas-free view function. Queries the blockchain, checks hash equality, and computes dynamic expiration state against current block.timestamp.", "verifyCertificate(bytes32 certIdHash, bytes32 certHash):")
    add_bullet(" Enforces role-based permissions: only the original issuing organization or the contract owner can revoke an active certificate. Emits CertificateRevoked.", "revokeCertificate(bytes32 certIdHash):")

    # ----------------------------------------------------
    # SECTION 7: USER INTERFACE DESIGN & SCREENSHOTS
    # ----------------------------------------------------
    add_section_heading("7", "User Interface Design & Screenshots")
    add_body("Below are the high-resolution screenshots captured from the live running Citadel application:")

    screenshots = [
        ("Figure 1: Marketing Landing Page (/)", "01_landing_page.png", "Deep obsidian background (#000000) with Burgundy Red (#C8102E) highlights, value proposition, protocol metrics, and instant verification search bar."),
        ("Figure 2: Organization Authentication (/login)", "02_login_page.png", "Clean institution login interface featuring Citadel Burgundy Red buttons, input focus rings, and route guards."),
        ("Figure 3: Executive Organization Dashboard (/dashboard)", "04_dashboard_overview.png", "Executive welcome banner, 4 live stat cards (Total Issued, Active Valid, Expired, Revoked), quick action strip, and recent credentials table."),
        ("Figure 4: Split-Screen Certificate Issuing Studio (/dashboard/certificates/new)", "05_issue_studio_live_preview.png", "Interactive split-screen interface: Left side contains the issuance form; Right side renders the live vector diploma preview canvas updating in real time."),
        ("Figure 5: Certificate Registry & Audit CSV Export (/dashboard/certificates)", "06_certificate_registry.png", "Complete credential registry with filter tabs (All, Valid, Expired, Revoked), search input, and client-side CSV spreadsheet export."),
        ("Figure 6: Public Verification Portal (/verify)", "07_public_verify_portal.png", "Public verification engine supporting Certificate ID lookup and camera QR code scanning."),
        ("Figure 7: Cryptographic Proof & Verification Result (/verify/[id])", "08_verification_result_valid.png", "Verified credential view showing authentic status badge, recipient metadata, and Ethereum blockchain proof card (Tx Hash, Block Number, Contract Address)."),
    ]

    base_dir = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(base_dir, "..", "docs", "screenshots")

    for title, filename, caption in screenshots:
        add_subheading(title)
        img_path = os.path.join(screenshots_dir, filename)
        if os.path.exists(img_path):
            doc.add_picture(img_path, width=Inches(6.2))
            cap_p = doc.add_paragraph()
            cap_p.paragraph_format.space_before = Pt(3)
            cap_p.paragraph_format.space_after = Pt(12)
            r_cap = cap_p.add_run(caption)
            r_cap.font.name = "Calibri"
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
            r_cap.font.color.rgb = MUTED_COLOR
        else:
            add_body(f"[Screenshot {filename} will be embedded here]")

    # ----------------------------------------------------
    # SECTION 8: IMPLEMENTATION SUMMARY & TESTING
    # ----------------------------------------------------
    add_section_heading("8", "Implementation Summary & Testing")
    add_subheading("8.1 Technology Stack Matrix")
    add_bullet(" Next.js 14.2.5 (App Router), TypeScript, Tailwind CSS, Radix UI Primitives, Lucide Icons, html5-qrcode.", "Frontend:")
    add_bullet(" Node.js 20+, Next.js Server Actions, Zod Validation, Supabase SSR Auth.", "Backend:")
    add_bullet(" PostgreSQL (Supabase), Prisma ORM 5.18.0.", "Database:")
    add_bullet(" Solidity 0.8.24, Hardhat 2.22.6, Ethers.js v6.13.1 (Sepolia Testnet / Hardhat EVM).", "Blockchain:")
    add_bullet(" jsPDF 2.5.1 (Vector Diplomas), Nodemailer 6.9.14 (SMTP Notifications).", "Services:")

    add_subheading("8.2 Automated Test Suite Results")
    add_body("Citadel includes a 52-test automated unit and fuzz testing suite covering all critical edge cases:")
    add_bullet(" Verified deterministic canonical sorting and key-order invariance.", "Cryptographic Hashing (12 Tests):")
    add_bullet(" Verified smart contract deployment, authorization, issuance, verification, and revocation.", "Smart Contract Functional Tests (28 Tests):")
    add_bullet(" Tested 1-bit hash tampering, extreme future dates (50+ years), expiration boundary precision, and rapid issuance stress testing.", "Advanced Fuzz & Boundary Tests (12 Tests):")
    add_callout(doc, "Total Tests Executed: 52\nPassing Tests: 52 (100% Pass Rate)\nFailing Tests: 0\nTypeScript Check (npx tsc --noEmit): 0 Errors", "Test Execution Summary")

    # ----------------------------------------------------
    # SECTION 9: PUBLIC GITHUB REPOSITORY LINK
    # ----------------------------------------------------
    add_section_heading("9", "Public GitHub Repository")
    add_body("The complete project codebase, smart contract source, database migrations, and test scripts are publicly available on GitHub:")
    add_callout(doc, "Public Repository URL:\nhttps://github.com/mengchheanglong/citadel-blockchain-certificates\n\nBranch: main\nStatus: Up to date with all 52 tests, contracts, and documentation.", "GitHub Repository")

    # ----------------------------------------------------
    # SECTION 10: INDIVIDUAL CONTRIBUTION REPORT
    # ----------------------------------------------------
    add_section_heading("10", "Individual Contribution Report")
    add_body("This project was conducted as a Solo / Individual Project. 100% of all technical planning, architecture, design, and implementation work was performed independently:")
    
    contrib_table = doc.add_table(rows=6, cols=3)
    contrib_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    contrib_table.autofit = False
    
    c_headers = ["Technical Domain", "Responsibilities & Deliverables", "Contribution"]
    for j, h in enumerate(c_headers):
        c = contrib_table.rows[0].cells[j]
        set_cell_shading(c, "1E293B")
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    contrib_rows = [
        ("Smart Contract & Web3", "Wrote CertificateRegistry.sol, role permissions, Hardhat deploy scripts, and Ethers.js integration.", "100%"),
        ("Frontend UI / UX", "Built Next.js 14 landing page, organization dashboard, live preview studio, and public verification portal.", "100%"),
        ("Backend & Database", "Designed Prisma PostgreSQL schema, Next.js API routes, Zod input validation, and Supabase auth.", "100%"),
        ("PDF & Email Services", "Built vector diploma generator with embedded QR codes and automated SMTP email notifications.", "100%"),
        ("Testing & Documentation", "Wrote 52 automated tests, verified zero TypeScript errors, and compiled comprehensive documentation.", "100%"),
    ]
    
    c_widths = [Inches(1.8), Inches(3.7), Inches(1.0)]
    for i, row_data in enumerate(contrib_rows):
        row = contrib_table.rows[i+1]
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = c_widths[j]
            set_cell_shading(c, bg)
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = DARK_GRAY if j == 0 else (BURGUNDY if j == 2 else BODY_COLOR)
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ----------------------------------------------------
    # SECTION 11: PUBLIC DEMO VIDEO DETAILS
    # ----------------------------------------------------
    add_section_heading("11", "Public Demo Video Details")
    add_body("A public demonstration video walking through the full lifecycle of the platform is accessible at:")
    add_callout(doc, "Public Video URL:\n[Paste your public Google Drive or YouTube link here]\n\nAccess Permission: Public / Anyone with the link can view\nDuration: Approximately 3 to 5 minutes", "Demo Video Link")
    
    add_subheading("Video Walkthrough Checklist:")
    add_bullet(" Introduce Citadel and the need for blockchain-based certificate immutability.", "1. Introduction (30s):")
    add_bullet(" Log in as an organization, open the Issue Studio, show the live diploma preview updating as details are typed, and issue the certificate on-chain.", "2. Certificate Issuance (1.5m):")
    add_bullet(" Download the vector PDF diploma and display the received email notification with the attached diploma.", "3. PDF & Email Delivery (45s):")
    add_bullet(" Navigate to /verify, search the Certificate ID or scan the QR code with the camera, and display the Valid green status with blockchain transaction hash.", "4. Public Verification (1m):")
    add_bullet(" Demonstrate an expired certificate and perform an on-chain revocation with an audit reason, showing the updated Revoked red status.", "5. Expiration & Revocation (45s):")

    output_path = os.path.join(base_dir, "..", "PROJECT_SUBMISSION_REPORT.docx")
    doc.save(output_path)
    print(f"Successfully generated Word document at: {output_path}")

if __name__ == "__main__":
    build_document()

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

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_callout(doc, text, title=None, border_color="C8102E", bg_color="F8FAFC"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_shading(cell, bg_color)
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>\n'
        f'  <w:top w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:bottom w:val="none"/>\n'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10.5)
        run_title.font.color.rgb = RGBColor(200, 16, 46) # Burgundy
        
    run_text = p.add_run(text)
    run_text.font.name = "Calibri"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(51, 65, 85)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_figure(doc, img_path, caption_title, caption_text, width_inches=6.3):
    MUTED_COLOR = RGBColor(100, 116, 139)
    DARK_GRAY = RGBColor(30, 41, 59)
    
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_inches))
        
        cap_p = doc.add_paragraph()
        cap_p.paragraph_format.space_before = Pt(2)
        cap_p.paragraph_format.space_after = Pt(14)
        cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        r_title = cap_p.add_run(f"{caption_title}: ")
        r_title.bold = True
        r_title.font.name = "Calibri"
        r_title.font.size = Pt(9.5)
        r_title.font.color.rgb = DARK_GRAY
        
        r_cap = cap_p.add_run(caption_text)
        r_cap.font.name = "Calibri"
        r_cap.font.size = Pt(9.5)
        r_cap.font.italic = True
        r_cap.font.color.rgb = MUTED_COLOR
    else:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(8)
        r = p.add_run(f"[{caption_title} - Graphic image pending: {os.path.basename(img_path)}]")
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.italic = True
        r.font.color.rgb = RGBColor(220, 38, 38)

def build_document():
    doc = Document()
    
    # Page setup: Standard Letter, 1-inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Color Palette Tokens
    BURGUNDY = RGBColor(200, 16, 46)     # Citadel Primary Accent (#C8102E)
    DARK_GRAY = RGBColor(30, 41, 59)     # Slate-800 (#1E293B)
    BODY_COLOR = RGBColor(51, 65, 85)    # Slate-700 (#334155)
    MUTED_COLOR = RGBColor(100, 116, 139)# Slate-500 (#64748B)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(base_dir, "..", "docs", "screenshots")

    # Helper text functions
    def add_section_heading(num_str, title_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(20)
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
        h.paragraph_format.space_before = Pt(12)
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
    # DOCUMENT COVER / TITLE HEADER
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
    run_sub = sub_p.add_run("Project Submission Report — Citadel Protocol Architecture, Implementation & Verification")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = BURGUNDY
    run_sub.bold = True
    
    # Metadata Card Table
    meta_table = doc.add_table(rows=7, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    set_table_borders(meta_table, color="E2E8F0")
    
    meta_data = [
        ("Project Title", "Citadel — Blockchain Digital Certificate Issuing & Verification Platform"),
        ("Student / Author", "Long Mengchheang"),
        ("Institution", "Kirirom Institute of Technology (KIT)"),
        ("Project Arrangement", "Individual / Solo Capstone Project (100% Contribution)"),
        ("GitHub Repository", "https://github.com/mengchheanglong/citadel-blockchain-certificates"),
        ("Demo Video URL", "Available on Google Drive / YouTube (Publicly Accessible)"),
        ("Submission Date", "October 2026"),
    ]
    
    col_widths = [Inches(2.0), Inches(4.5)]
    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_shading(c0, "F8FAFC")
        set_cell_margins(c0, top=50, bottom=50, left=100, right=100)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = DARK_GRAY
        
        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_shading(c1, "FFFFFF")
        set_cell_margins(c1, top=50, bottom=50, left=100, right=100)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Calibri"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = BURGUNDY if "http" in val else BODY_COLOR
        if "http" in val:
            r1.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ----------------------------------------------------
    # EXECUTIVE SUMMARY
    # ----------------------------------------------------
    add_callout(
        doc,
        "Executive Summary: Citadel is an enterprise-grade digital credentialing platform that solves certificate fraud through the Ethereum blockchain. Traditional paper and static PDF credentials are easy to forge with graphic editors and require slow, manual registrar inquiries to verify. Citadel provides a hybrid architecture where detailed student data remains private in an off-chain PostgreSQL database, while a canonical SHA-256 cryptographic fingerprint is permanently anchored on an Ethereum EVM smart contract (CertificateRegistry.sol). Anyone can verify a credential in seconds for free (zero gas fees) by scanning the QR code with their camera, uploading a diploma image, or dropping a PDF certificate directly into the browser.",
        "Executive Summary",
        border_color="C8102E",
        bg_color="F8FAFC"
    )

    # ----------------------------------------------------
    # SECTION 1: SYSTEM OVERVIEW & PROBLEM STATEMENT
    # ----------------------------------------------------
    add_section_heading("1", "System Overview & Problem Statement")
    add_subheading("1.1 The Credentialing Dilemma")
    add_body("Academic institutions, licensing boards, and vocational academies face unprecedented challenges with credential authentication:")
    add_bullet(" Static PDF files and paper certificates can be manipulated in minutes using off-the-shelf PDF editors or generative AI, altering graduate names, degree classifications, and graduation years with pixel-level precision.", "Rampant Credential Forgery:")
    add_bullet(" Employers, recruiters, and graduate admissions officers currently rely on manual verification procedures — sending verification emails, calling university registrars, or paying costly background check intermediaries — requiring 2 to 4 weeks per candidate.", "Operational Delay & Expense:")
    add_bullet(" Centralized student record databases represent single points of failure susceptible to administrative corruption, insider tampering, database ransomware, or accidental record destruction.", "Centralized Vulnerabilities:")

    add_subheading("1.2 Citadel's Core Value Propositions")
    add_body("Citadel eliminates diploma fraud through four core engineering guarantees:")
    add_bullet(" Each issued certificate is cryptographically fingerprinted with SHA-256 and committed to Ethereum. Changing even a single character in the graduate's name or graduation date immediately invalidates the cryptographic proof.", "1. Mathematical Immutability:")
    add_bullet(" Employers and the public verify any credential in real time without needing a wallet, cryptocurrency, or platform account. Verification executes as a free on-chain view query.", "2. Zero-Gas Public Verification:")
    add_bullet(" As an administrator enters information in the Issue Studio, an on-screen preview reflects changes in real time. Upon issuance, a vector-rendered PDF diploma is dispatched instantly via automated SMTP email.", "3. Automated Issuance & Dispatch:")
    add_bullet(" Accredited institutions maintain full governance with configurable validity periods (Lifetime, 1 Year, 2 Years) and can revoke compromised credentials with on-chain audit reasons.", "4. Dynamic Lifecycle Governance:")

    # ----------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE
    # ----------------------------------------------------
    add_section_heading("2", "System Architecture")
    add_body("Citadel utilizes a clean four-tier architectural separation of concerns designed for enterprise reliability, high throughput, and strict regulatory compliance:")
    add_bullet(" Next.js 14.2 App Router with React, Tailwind CSS, Radix UI Primitives, and Citadel Burgundy Design System. Incorporates a dark-mode institutional marketing portal and a high-contrast organization operations studio.", "1. Presentation Layer (Frontend):")
    add_bullet(" Next.js Server Route Handlers and Server Actions. Enforces Zod schema validation, computes deterministic canonical digests, generates vector diplomas with jsPDF, and coordinates SMTP delivery via Nodemailer.", "2. Application & API Layer (Backend):")
    add_bullet(" PostgreSQL managed via Prisma ORM 5.18. Stores organization profiles, recipient details, and audit history off-chain to safeguard privacy and reduce blockchain storage overhead.", "3. Persistence Layer (Database):")
    add_bullet(" Solidity 0.8.24 smart contract (CertificateRegistry.sol) deployed on the Ethereum EVM (Sepolia Testnet / Hardhat). Serves as the immutable source of truth for 32-byte certificate hashes and revocation states.", "4. Decentralized Ledger Layer (Blockchain):")

    # Figure 2.1: Architecture Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_architecture.png"),
        "Figure 2.1",
        "Citadel Four-Tier Architectural Model (Presentation, Application API, Off-Chain PostgreSQL Database, and EVM Blockchain Ledger)"
    )

    # ----------------------------------------------------
    # SECTION 3: END-TO-END HOW IT WORKS & SYSTEM FLOWS
    # ----------------------------------------------------
    add_section_heading("3", "End-to-End System Flows & How It Works")
    add_body("The complete credential lifecycle is split into two complementary phases: Issuance (Organization) and Verification (Public Verifier).")

    # Figure 3.1: Complete How It Works Infographic
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_how_it_works.png"),
        "Figure 3.1",
        "Citadel End-to-End Operational Workflow: Stage 1 Issuance Pipeline (Left) and Stage 2 Public Verification Pipeline (Right)"
    )

    add_subheading("3.1 Stage 1: How a Certificate is Issued & Locked on the Blockchain")
    add_bullet(" The accredited institution logs into the dashboard and opens the Issue Studio. As the registrar fills in student details, a real-time vector diploma preview renders instantly.", "Step 1 (Data Entry & Preview):")
    add_bullet(" The backend generates a unique ID (e.g., CERT-2026-X942K) and computes a deterministic SHA-256 fingerprint from the sorted metadata payload.", "Step 2 (Canonical Hashing):")
    add_bullet(" The system calls issueCertificate on CertificateRegistry.sol using Ethers.js v6. Ethereum miners record the transaction, returning an immutable Tx Hash and Block Number.", "Step 3 (Blockchain Anchoring):")
    add_bullet(" The platform saves metadata and on-chain proofs in PostgreSQL, generates a high-resolution PDF diploma with an embedded QR code, and emails the credential to the graduate.", "Step 4 (PDF & Email Dispatch):")

    add_subheading("3.2 Stage 2: How Anyone Verifies a Certificate in Seconds")
    add_bullet(" An employer or admissions officer navigates to /verify and provides the credential via camera scan, image upload, PDF document drop, or typing the ID.", "Step 1 (Multi-Modal Input):")
    add_bullet(" The application retrieves the off-chain record and re-computes the SHA-256 fingerprint.", "Step 2 (Off-Chain Verification):")
    add_bullet(" Citadel executes a free (zero-gas) call to verifyCertificate on the smart contract, comparing the recomputed hash against the immutable ledger and checking validity timestamps.", "Step 3 (Smart Contract Query):")
    add_bullet(" The user sees an official cryptographic proof badge displaying Valid (Green), Expired (Yellow), or Revoked (Red) with verifiable block explorer links.", "Step 4 (Instant Status & Proof):")

    # Figure 3.2: Sequence Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_user_flow.png"),
        "Figure 3.2",
        "Sequence Diagram of Technical Interactions Between University Admin, Web Application, EVM Smart Contract, Database, and Public Verifier"
    )

    # ----------------------------------------------------
    # SECTION 4: DATABASE DESIGN (ER DIAGRAM)
    # ----------------------------------------------------
    add_section_heading("4", "Database Design & Data Dictionary")
    add_body("To protect student privacy and avoid exorbitant gas costs, detailed text is stored off-chain in PostgreSQL, with foreign keys linking to on-chain transaction hashes:")

    # Figure 4.1: ER Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_er.png"),
        "Figure 4.1",
        "Relational Entity-Relationship Model (Prisma ORM PostgreSQL Schema showing Organization, Certificate, and BlockchainTransaction)"
    )

    db_table = doc.add_table(rows=4, cols=3)
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_table.autofit = False
    set_table_borders(db_table, color="CBD5E1")
    
    headers = ["Table", "Key Columns & Constraints", "Architectural Purpose"]
    for j, h in enumerate(headers):
        c = db_table.rows[0].cells[j]
        set_cell_shading(c, "1E293B")
        set_cell_margins(c, top=60, bottom=60, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    db_rows = [
        ("Organization", "id (UUID PK), name, email (UK), website, description, createdAt", "Stores verified accredited institutions and credential issuer accounts."),
        ("Certificate", "id (UUID PK), certificateId (UK), recipientName, recipientEmail, courseName, issueDate, expiryDate, status, certHash, organizationId (FK)", "Maintains academic records, recipient identifiers, expiration timestamps, and SHA-256 digests."),
        ("BlockchainTransaction", "id (UUID PK), certificateId (FK), txHash (UK), blockNumber, networkName, contractAddress, action, timestamp, confirmed", "Immutable audit trail of Ethereum on-chain transaction receipts and block confirmations."),
    ]
    
    widths = [Inches(1.8), Inches(2.7), Inches(2.0)]
    for i, row_data in enumerate(db_rows):
        row = db_table.rows[i+1]
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = widths[j]
            set_cell_shading(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_GRAY if j == 0 else BODY_COLOR
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ----------------------------------------------------
    # SECTION 5: BLOCKCHAIN & CRYPTOGRAPHIC DESIGN
    # ----------------------------------------------------
    add_section_heading("5", "Blockchain & Cryptographic Design")
    add_subheading("5.1 Hybrid On-Chain / Off-Chain Architecture")
    add_body("Storing complete academic transcripts and personal identities directly on the public Ethereum blockchain has two critical drawbacks:")
    add_bullet(" Storing megabytes of PDF bytes or strings on Ethereum costs thousands of dollars in gas fees.", "Gas Cost Efficiency:")
    add_bullet(" Privacy regulations (such as GDPR and FERPA) mandate that student personal data must not be exposed permanently on an immutable public ledger.", "Data Privacy (GDPR / FERPA):")
    add_body("Citadel's Hybrid Solution: Detailed records remain private in PostgreSQL, while only the 32-byte cryptographic hash of the certificate is committed to the blockchain.")

    add_subheading("5.2 Deterministic Canonical Hashing Protocol")
    add_body("To prevent JSON key-ordering discrepancies across different programming platforms, Citadel sorts object keys deterministically before calculating the SHA-256 digest:")
    add_callout(
        doc,
        "Canonical Payload = JSON.stringify(sortKeys({ certId, recipientName, courseName, issueDate, organizationId }))\n"
        "certHash = SHA-256(Canonical Payload)\n"
        "certIdHash = keccak256(certId)",
        "Mathematical Cryptographic Digest Specification"
    )

    # ----------------------------------------------------
    # SECTION 6: SMART CONTRACT ARCHITECTURE
    # ----------------------------------------------------
    add_section_heading("6", "Smart Contract Architecture (CertificateRegistry.sol)")
    add_body("The CertificateRegistry.sol smart contract is written in Solidity 0.8.24 and compiled with Hardhat:")

    # Figure 6.1: Smart Contract Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_smart_contract.png"),
        "Figure 6.1",
        "CertificateRegistry.sol Smart Contract Architecture: State Machine Lifecycle, Modifiers, and Cryptographic Invariance"
    )

    add_subheading("6.1 State Machine Lifecycle")
    add_bullet(" The certificate exists on-chain, its cryptographic hash matches, and current block.timestamp is before expirationDate.", "Valid (Status 1):")
    add_bullet(" The certificate is authentic, but its designated validity window has elapsed.", "Expired (Status 2):")
    add_bullet(" The certificate was officially revoked on-chain by the issuing institution with a mandatory audit reason.", "Revoked (Status 3):")
    add_bullet(" The Certificate ID is registered, but the presented data payload has been altered, producing an invalid hash.", "HashMismatch (Status 4):")
    add_bullet(" The Certificate ID has never been issued on the blockchain.", "NotFound (Status 0):")

    add_subheading("6.2 Key Functions & Security Modifiers")
    add_bullet(" Enforces authorized issuer role, checks that the ID has not been used, verifies future expiry, and commits the certificate to the blockchain. Emits CertificateIssued.", "issueCertificate(bytes32 certIdHash, bytes32 certHash, uint256 expirationDate):")
    add_bullet(" Free view function (zero gas). Compares the presented hash against the on-chain ledger and dynamically computes expiration.", "verifyCertificate(bytes32 certIdHash, bytes32 certHash):")
    add_bullet(" Only the original issuing institution or contract administrator can revoke an active certificate. Emits CertificateRevoked.", "revokeCertificate(bytes32 certIdHash, string reason):")

    # ----------------------------------------------------
    # SECTION 7: MULTI-MODAL VERIFICATION ENGINE
    # ----------------------------------------------------
    add_section_heading("7", "Advanced Multi-Modal Verification Engine")
    add_body("To guarantee that any verifier can check certificates across diverse devices and real-world conditions, Citadel incorporates an advanced multi-modal scanning engine:")
    add_bullet(" Uses the low-level Html5Qrcode controller to mount an in-browser camera feed directly into a styled viewfinder frame with corner reticles and an animated scanning beam, supporting camera toggling on mobile devices.", "1. Live Camera Stream:")
    add_bullet(" A high-performance canvas decoder scans images at full native resolution. It evaluates full images, upscales tiny crops (e.g. 65x65 px snippets), and scans bottom-right quadrants where Citadel certificates position QR codes.", "2. Multi-Pass jsQR Image Decoder:")
    add_bullet(" Verifiers can drag and drop certificate PDF documents directly into the verification portal. The platform extracts certificate identifiers from binary text streams and decompresses PDF layers via a dedicated API (/api/verify/scan-file).", "3. Full PDF Document Ingestion:")
    add_bullet(" If camera access is denied or unavailable on a desktop computer without a webcam, the portal displays a polite error card with a 1-click fallback to file upload.", "4. Graceful Error Handling:")

    # ----------------------------------------------------
    # SECTION 8: USER INTERFACE WALKTHROUGH & SCREENSHOTS
    # ----------------------------------------------------
    add_section_heading("8", "User Interface Design & Screenshots")
    add_body("Below are the high-resolution screenshots captured directly from the live running Citadel application, showing fully loaded data tables, metrics, and zero skeleton placeholders:")

    screenshots = [
        ("Figure 8.1: Institutional Marketing Landing Page (/)", "01_landing_page.png", "Deep obsidian background (#000000) with Burgundy Red (#C8102E) highlights, value proposition, protocol metrics, and instant verification search bar."),
        ("Figure 8.2: Organization Authentication Portal (/login)", "02_login_page.png", "Institution login interface featuring Citadel Burgundy Red buttons, input focus rings, and route guards."),
        ("Figure 8.3: Institutional Registration (/register)", "03_register_page.png", "Institution onboarding portal for registering accredited issuing bodies with secure cryptographic access."),
        ("Figure 8.4: Executive Organization Dashboard (/dashboard)", "04_dashboard_overview.png", "Executive welcome banner, 4 live stat cards (Total Issued, Active Valid, Expired, Revoked), issuance trend graph, and fully populated recent credentials ledger."),
        ("Figure 8.5: Split-Screen Certificate Issuing Studio (/dashboard/certificates/new)", "05_issue_studio_live_preview.png", "Interactive split-screen interface: Left side contains the issuance form; Right side renders the live vector diploma preview canvas updating in real time."),
        ("Figure 8.6: Certificate Registry & Audit CSV Export (/dashboard/certificates)", "06_certificate_registry.png", "Complete credential registry with filter tabs (All, Valid, Expired, Revoked), recipient avatars, status pills, and client-side CSV spreadsheet export."),
        ("Figure 8.7: Public Verification Portal with Multi-Modal Scanner (/verify)", "07_public_verify_portal.png", "Public verification engine supporting manual Certificate ID lookup, live camera feed, image upload, and direct PDF document dropzone."),
        ("Figure 8.8: Cryptographic Proof & Verification Result — Genuine & Valid (/verify/[id])", "08_verification_result_valid.png", "Verified credential view showing authentic green status badge, recipient metadata, and Ethereum blockchain proof card (Tx Hash, Block Number, Contract Address)."),
        ("Figure 8.9: Cryptographic Proof & Verification Result — Revoked Credential (/verify/[id])", "09_verification_result_revoked.png", "Public view of an invalidated certificate showing prominent red revocation alert, timestamp, issuer recorded reason, and watermarked diploma."),
    ]

    for title, filename, caption in screenshots:
        img_path = os.path.join(screenshots_dir, filename)
        add_figure(doc, img_path, title, caption, width_inches=6.2)

    # ----------------------------------------------------
    # SECTION 9: TESTING, VERIFICATION & QUALITY ASSURANCE
    # ----------------------------------------------------
    add_section_heading("9", "Testing, Verification & Quality Assurance")
    add_body("Citadel includes a comprehensive 52-test automated unit, integration, and fuzz testing suite covering all critical edge cases:")
    add_bullet(" Verified deterministic sorting, whitespace invariance, and key-order resilience across platforms.", "Cryptographic Hashing Tests (12 Tests):")
    add_bullet(" Verified smart contract deployment, issuer authorization, unique ID enforcement, valid query execution, and revocation state changes.", "Smart Contract Functional Tests (28 Tests):")
    add_bullet(" Tested 1-bit hash tampering, extreme future dates (50+ years), timestamp boundary conditions, and rapid bulk issuance stress testing.", "Advanced Fuzz & Boundary Tests (12 Tests):")
    add_bullet(" E2E testing using Playwright to verify camera permissions, multi-pass QR image recognition, and PDF file extraction.", "Multi-Modal Scanner E2E Tests:")
    
    add_callout(
        doc,
        "Total Tests Executed: 52\n"
        "Passing Tests: 52 (100% Pass Rate)\n"
        "Failing Tests: 0\n"
        "TypeScript Strict Mode Check (npx tsc --noEmit): 0 Errors",
        "Test Execution Summary",
        border_color="16A34A",
        bg_color="F0FDF4"
    )

    # ----------------------------------------------------
    # SECTION 10: INDIVIDUAL CONTRIBUTION REPORT
    # ----------------------------------------------------
    add_section_heading("10", "Individual Contribution Report")
    add_body("This project was conducted as an Individual / Solo Capstone Project by Long Mengchheang. 100% of all technical planning, architecture, design, and implementation work was performed independently:")
    
    contrib_table = doc.add_table(rows=6, cols=3)
    contrib_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    contrib_table.autofit = False
    set_table_borders(contrib_table, color="CBD5E1")
    
    c_headers = ["Technical Domain", "Responsibilities & Deliverables", "Contribution"]
    for j, h in enumerate(c_headers):
        c = contrib_table.rows[0].cells[j]
        set_cell_shading(c, "1E293B")
        set_cell_margins(c, top=60, bottom=60, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    contrib_rows = [
        ("Smart Contract & Web3", "Wrote CertificateRegistry.sol, role permissions, Hardhat deploy scripts, and Ethers.js integration.", "100%"),
        ("Frontend UI / UX", "Built Next.js 14 landing page, organization dashboard, live preview studio, and public verification portal.", "100%"),
        ("Backend & Database", "Designed Prisma PostgreSQL schema, Next.js API routes, Zod input validation, and Supabase auth.", "100%"),
        ("PDF & Email Services", "Built vector diploma generator with embedded QR codes and automated SMTP email notifications.", "100%"),
        ("Testing & Documentation", "Wrote 52 automated tests, verified zero TypeScript errors, created SVG diagrams, and compiled documentation.", "100%"),
    ]
    
    c_widths = [Inches(1.8), Inches(3.7), Inches(1.0)]
    for i, row_data in enumerate(contrib_rows):
        row = contrib_table.rows[i+1]
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = c_widths[j]
            set_cell_shading(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_GRAY if j == 0 else (BURGUNDY if j == 2 else BODY_COLOR)
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ----------------------------------------------------
    # SECTION 11: DEMO PRESENTATION & WALKTHROUGH SCRIPT
    # ----------------------------------------------------
    add_section_heading("11", "Demo Video Walkthrough Script (5–7 Minutes)")
    add_body("Below is the comprehensive spoken presentation script for the live system demonstration, structured to explain both user features and underlying blockchain mechanics in clear terms:")

    script_scenes = [
        ("Scene 1: Introduction & Problem Context", "0:00 – 0:45", "Homepage (/) / Architecture Diagram",
         "Hello everyone, welcome to the demonstration of Citadel, a blockchain-based digital certificate issuing and verification platform. Traditional paper diplomas and static PDF certificates are easy to forge with modern graphics tools, and verifying them manually takes weeks of phone calls and emails. Citadel solves this by using the Ethereum blockchain to make certificates completely tamper-proof and instantly verifiable for anyone, anywhere, in seconds."),
        
        ("Scene 2: Organization Login & Dashboard Overview", "0:45 – 1:45", "Dashboard (/dashboard)",
         "Here on our organization dashboard, an issuing school or academy has a complete overview of all credentials they have issued. You can see our 4 live stat cards showing Total Issued, Active Valid, Expired, and Revoked certificates, along with a recent credentials table. Behind the scenes, the school's account is authenticated securely, and all human-readable records are kept private in our PostgreSQL database to protect student privacy and save gas fees."),
        
        ("Scene 3: Issuing a Certificate in the Live Studio", "1:45 – 3:00", "Issue Studio (/dashboard/certificates/new)",
         "Now let's issue a certificate. In our Issue Studio, as I type the student's name, degree title, and expiration date on the left, you can see the high-resolution diploma preview updating in real time on the right. When I click 'Issue Certificate', here is what happens: our server generates a unique Certificate ID and calculates a mathematical SHA-256 fingerprint of the data. Then, it sends this fingerprint to our Ethereum smart contract. The transaction is mined into a block, locking the certificate permanently. Even if someone changes a single letter in the name later, the hash will change, and the verification will immediately flag it as fake."),
        
        ("Scene 4: PDF Diploma Generation & Automated Email Delivery", "3:00 – 3:45", "Inbox / Downloaded PDF",
         "Immediately after blockchain confirmation, Citadel generates a high-resolution vector PDF diploma with an embedded QR code linking directly to the verification page, and automatically emails it to the graduate's inbox. The student now holds an authentic digital credential they can print, share on LinkedIn, or email to employers."),
        
        ("Scene 5: Instant Public Verification (Camera, File & PDF)", "3:45 – 5:15", "Verification Portal (/verify) & Results (/verify/[id])",
         "Now let's switch to the perspective of an employer or university verifier on our public verification page. Verifying is completely free — zero gas fees, and no account or wallet needed. A verifier can type the Certificate ID, use their device camera to scan the QR code live, drag and drop a screenshot, or drop the PDF file directly. When submitted, our system checks the cryptographic fingerprint against the smart contract. Instantly, we see the green 'Genuine & Valid' badge, showing the student's name, degree, and the exact Ethereum transaction hash and block number on Sepolia."),
        
        ("Scene 6: Credential Expiration & On-Chain Revocation", "5:15 – 6:00", "Certificate Registry & Revoked View",
         "Citadel also gives schools full lifecycle control. If a credential expires, the smart contract dynamically marks it as Expired based on block timestamps. Furthermore, if a certificate was issued by mistake or must be cancelled, the authorized issuer can click 'Revoke' on the dashboard and enter an audit reason. The smart contract updates its state on-chain, and anyone checking that certificate will immediately see a prominent red 'Revoked' alert with the official cancellation reason."),
        
        ("Scene 7: Technical Summary & Conclusion", "6:00 – 6:45", "Conclusion / Architecture Slide",
         "In summary, Citadel provides an end-to-end, enterprise-ready credentialing solution combining the privacy and speed of web applications with the permanent trust and immutability of the Ethereum blockchain. With 52 automated tests passing at 100%, Citadel is ready for institutional deployment. Thank you for watching!"),
    ]

    for title, duration, screen, script_text in script_scenes:
        add_subheading(f"{title} ({duration})")
        add_bullet(f" {screen}", "Screen / Action:")
        add_body(f"\"{script_text}\"", "Spoken Script: ")

    # ----------------------------------------------------
    # SECTION 12: CONCLUSION, ROADMAP & REFERENCES
    # ----------------------------------------------------
    add_section_heading("12", "Conclusion & Future Roadmap")
    add_body("Citadel demonstrates a production-grade, mathematically tamper-proof solution to global credential fraud. By combining off-chain data efficiency with on-chain Ethereum cryptographic invariance, it provides institutions with effortless issuance and verifiers with instant zero-gas certainty.")
    add_subheading("Future Roadmap:")
    add_bullet(" Implementing W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VC) standards for cross-border institutional interoperability.", "1. Decentralized Identity (W3C DID):")
    add_bullet(" Minting non-transferable ERC-5192 Soulbound Tokens directly into student wallets as decentralized proof of accomplishment.", "2. Soulbound Tokens (SBTs):")
    add_bullet(" Utilizing zk-SNARKs to allow graduates to prove GPA thresholds or graduation status without revealing their full transcript or identity.", "3. Zero-Knowledge Proofs (ZKP):")

    output_path = os.path.join(base_dir, "..", "PROJECT_SUBMISSION_REPORT.docx")
    doc.save(output_path)
    print(f"Successfully generated refined Word document at: {output_path}")

if __name__ == "__main__":
    build_document()

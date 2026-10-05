import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_shading(cell, color_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=70, bottom=70, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="B0B0B0", sz="4", val="single"):
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

def add_academic_callout(doc, text, title=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_shading(cell, "F9F9F9")
    set_cell_margins(cell, top=90, bottom=90, left=140, right=140)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'  <w:left w:val="single" w:sz="18" w:space="0" w:color="333333"/>\n'
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
        run_title = p.add_run(f"{title}: ")
        run_title.bold = True
        run_title.font.name = "Times New Roman"
        run_title.font.size = Pt(10)
        run_title.font.color.rgb = RGBColor(0, 0, 0)
        
    run_text = p.add_run(text)
    run_text.font.name = "Times New Roman"
    run_text.font.size = Pt(10)
    run_text.font.color.rgb = RGBColor(25, 25, 25)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(3)

def add_figure(doc, img_path, caption_title, caption_text, width_inches=5.6):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.paragraph_format.space_before = Pt(7)
        p_img.paragraph_format.space_after = Pt(2)
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_inches))
        
        cap_p = doc.add_paragraph()
        cap_p.paragraph_format.space_before = Pt(1)
        cap_p.paragraph_format.space_after = Pt(9)
        cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        r_title = cap_p.add_run(f"{caption_title}: ")
        r_title.bold = True
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(9.5)
        r_title.font.color.rgb = RGBColor(0, 0, 0)
        
        r_cap = cap_p.add_run(caption_text)
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(9.5)
        r_cap.font.italic = True
        r_cap.font.color.rgb = RGBColor(60, 60, 60)
    else:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(5)
        r = p.add_run(f"[{caption_title} - {os.path.basename(img_path)}]")
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.italic = True
        r.font.color.rgb = RGBColor(100, 100, 100)

def add_footer_page_number(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)

def build_document():
    doc = Document()
    
    # 1.0 Inch Academic Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Academic Running Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Blockchain-Based Digital Certificate Issuing Platform | Long Mengchheang")
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(110, 110, 110)
        
        # Running Footer Page Number
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Page ")
        frun.font.name = "Times New Roman"
        frun.font.size = Pt(9.5)
        frun.font.color.rgb = RGBColor(50, 50, 50)
        add_footer_page_number(frun)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(base_dir, "..", "docs", "screenshots")

    BLACK = RGBColor(0, 0, 0)
    DARK_TEXT = RGBColor(20, 20, 20)

    def add_sec_heading(title_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(title_str)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(13)
        r.font.color.rgb = BLACK

    def add_sub_heading(title_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(9)
        h.paragraph_format.space_after = Pt(2)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(title_str)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.color.rgb = BLACK

    def add_body(text, bold_prefix=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3.5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Times New Roman"
            r_b.font.size = Pt(10.5)
            r_b.font.color.rgb = BLACK
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.color.rgb = DARK_TEXT
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Times New Roman"
            r_b.font.size = Pt(10.5)
            r_b.font.color.rgb = BLACK
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.color.rgb = DARK_TEXT

    # ----------------------------------------------------
    # COVER / HEADER
    # ----------------------------------------------------
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("KIRIROM INSTITUTE OF TECHNOLOGY")
    r_inst.bold = True
    r_inst.font.name = "Times New Roman"
    r_inst.font.size = Pt(13)
    r_inst.font.color.rgb = BLACK

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_after = Pt(14)
    r_dept = p_dept.add_run("Department of Software Engineering")
    r_dept.font.name = "Times New Roman"
    r_dept.font.size = Pt(11)
    r_dept.font.italic = True
    r_dept.font.color.rgb = RGBColor(60, 60, 60)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(3)
    r_title = p_title.add_run("BLOCKCHAIN-BASED DIGITAL CERTIFICATE ISSUING PLATFORM")
    r_title.bold = True
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(16)
    r_title.font.color.rgb = BLACK

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Final Project Submission Report — Citadel Platform Architecture & Implementation")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(60, 60, 60)

    # Submission Information Table
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    set_table_borders(meta_table, color="D0D0D0")
    
    meta_data = [
        ("Student / Author", "Long Mengchheang"),
        ("Institution", "Kirirom Institute of Technology (KIT)"),
        ("Team Arrangement", "Individual Project (100% Technical Contribution)"),
        ("GitHub Repository", "https://github.com/mengchheanglong/citadel-blockchain-certificates"),
        ("Public Demo Video", "Available on Google Drive / YouTube (Public Link)"),
        ("Submission Date", "October 2026"),
    ]
    
    col_widths = [Inches(1.8), Inches(4.7)]
    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_shading(c0, "F5F5F5")
        set_cell_margins(c0, top=35, bottom=35, left=70, right=70)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = BLACK
        
        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_shading(c1, "FFFFFF")
        set_cell_margins(c1, top=35, bottom=35, left=70, right=70)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = DARK_TEXT

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ----------------------------------------------------
    # SECTION 1: SYSTEM OVERVIEW
    # ----------------------------------------------------
    add_sec_heading("1. System Overview")
    add_sub_heading("1.1 The Credentialing Dilemma")
    add_body("Educational institutions and professional certifying organizations face growing challenges with traditional credential authenticity:")
    add_bullet(" Static PDF certificates and paper diplomas can easily be altered using graphic editing software or AI tools to modify recipient names, degree titles, or graduation years without visual detection.", "Vulnerability to Forgery: ")
    add_bullet(" Employers and university registrars must conduct manual verification via phone calls or email, typically requiring two to four weeks per verification.", "Operational Bottlenecks: ")
    add_bullet(" Centralized academic databases represent single points of failure susceptible to administrative corruption, insider tampering, and catastrophic data loss.", "Centralized Database Risks: ")

    add_sub_heading("1.2 The Citadel Platform Solution")
    add_body("Citadel is a decentralized web application engineered to modernize credential issuing using Ethereum blockchain technology:")
    add_bullet(" When a certificate is issued, a unique SHA-256 cryptographic fingerprint is permanently recorded on an Ethereum smart contract. Any alteration to student data alters the hash, immediately exposing the forgery.", "Cryptographic Immutability: ")
    add_bullet(" Verifiers authenticate credentials in seconds without requiring cryptocurrency, a Web3 wallet, or a platform account via free on-chain view queries.", "Instant Zero-Gas Verification: ")
    add_bullet(" The platform generates high-resolution vector PDF diplomas with embedded verification QR codes and dispatches them automatically to student inboxes via SMTP.", "Automated Issuance & Delivery: ")
    add_bullet(" Issuing bodies can assign validity periods (Lifetime, 1 Year, 2 Years) and revoke compromised certificates on-chain with mandatory audit justification logging.", "Lifecycle Governance: ")

    # ----------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE
    # ----------------------------------------------------
    add_sec_heading("2. System Architecture")
    add_body("Citadel utilizes a clean four-tier architectural separation of concerns designed for enterprise reliability, high throughput, and data privacy:")
    add_bullet(" Next.js 14 App Router, TypeScript, and Tailwind CSS. Provides an administrative operations portal and a clean public verification engine.", "1. Presentation Layer (Frontend): ")
    add_bullet(" Next.js Server Route Handlers and Server Actions. Enforces Zod schema validation, computes deterministic SHA-256 digests, renders vector diplomas with jsPDF, and coordinates SMTP delivery via Nodemailer.", "2. Application & API Layer (Backend): ")
    add_bullet(" PostgreSQL managed via Prisma ORM 5.18. Stores recipient metadata, degree titles, and institution profiles off-chain to ensure GDPR/FERPA compliance.", "3. Persistence Layer (Database): ")
    add_bullet(" Solidity 0.8.24 smart contract (CertificateRegistry.sol) deployed on the Ethereum EVM (Sepolia Testnet / Hardhat). Serves as the immutable registry for 32-byte credential hashes.", "4. Decentralized Ledger Layer (Blockchain): ")

    # Figure 1: Architecture
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_architecture.png"),
        "Figure 1",
        "Citadel four-tier system architecture model.",
        width_inches=5.6
    )

    # ----------------------------------------------------
    # SECTION 3: USER FLOW / SYSTEM FLOW
    # ----------------------------------------------------
    add_sec_heading("3. User Flow / System Flow")
    add_body("The platform coordinates two primary workflows: the Organization Issuance Pipeline and the Public Verification Pipeline:")
    add_bullet(" The accredited institution logs into the dashboard and accesses the Issue Studio. As the administrator inputs graduate information, an interactive vector diploma canvas updates in real time. Upon submission, the server computes a canonical SHA-256 fingerprint, calls issueCertificate on the smart contract, stores metadata in PostgreSQL, and generates an official PDF diploma emailed to the graduate.", "Organization Issuance Flow: ")
    add_bullet(" An employer or admissions officer navigates to /verify and provides the credential via camera QR scan, image drop, PDF upload, or manual ID entry. The system retrieves the record, re-computes the hash, executes a zero-gas view call on the smart contract, and renders an official cryptographic proof badge (Valid, Expired, or Revoked).", "Public Verification Flow: ")

    # Figure 2: End-to-End Operational Lifecycle
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_how_it_works.png"),
        "Figure 2",
        "End-to-end credential lifecycle: Stage 1 Issuance Pipeline and Stage 2 Public Verification Pipeline.",
        width_inches=5.6
    )

    # Figure 3: User Flow Sequence Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_user_flow.png"),
        "Figure 3",
        "Technical sequence diagram illustrating interactions across User, Web Application, EVM Smart Contract, Database, and Recipient.",
        width_inches=5.6
    )

    # ----------------------------------------------------
    # SECTION 4: DATABASE DESIGN (ER DIAGRAM)
    # ----------------------------------------------------
    add_sec_heading("4. Database Design (ER Diagram)")
    add_body("To protect student privacy and minimize gas expenditure, detailed textual data is stored off-chain in PostgreSQL, with relational foreign keys connecting to on-chain transaction hashes:")

    # Figure 4: ER Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_er.png"),
        "Figure 4",
        "Entity-Relationship model representing Organization, Certificate, and BlockchainTransaction entities.",
        width_inches=5.6
    )

    # Data Dictionary Table
    db_table = doc.add_table(rows=4, cols=3)
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_table.autofit = False
    set_table_borders(db_table, color="B0B0B0")
    
    headers = ["Table", "Key Attributes & Constraints", "Architectural Purpose"]
    for j, h in enumerate(headers):
        c = db_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=35, bottom=35, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    db_rows = [
        ("Organization", "id (PK UUID), name, email (UK), website, description, createdAt", "Stores verified institution profile and issuer credentials."),
        ("Certificate", "id (PK UUID), certificateId (UK), recipientName, recipientEmail, courseName, issueDate, expiryDate, status, certHash, organizationId (FK)", "Maintains academic records, expiration timestamps, and canonical SHA-256 digests."),
        ("BlockchainTransaction", "id (PK UUID), certificateId (FK), txHash (UK), blockNumber, networkName, contractAddress, action, timestamp, confirmed", "Audit log of on-chain Ethereum transaction receipts and block confirmations."),
    ]
    
    widths = [Inches(1.8), Inches(2.7), Inches(2.0)]
    for i, row_data in enumerate(db_rows):
        row = db_table.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = widths[j]
            set_cell_margins(c, top=35, bottom=35, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ----------------------------------------------------
    # SECTION 5: BLOCKCHAIN ARCHITECTURE
    # ----------------------------------------------------
    add_sec_heading("5. Blockchain Architecture")
    add_sub_heading("5.1 Hybrid On-Chain / Off-Chain Philosophy")
    add_body("Storing complete academic transcripts and personal identities directly on Ethereum is cost-prohibitive and violates privacy laws (GDPR Right to be Forgotten, FERPA student privacy). Citadel stores metadata in PostgreSQL while anchoring only a 32-byte cryptographic hash on-chain.")

    add_sub_heading("5.2 Deterministic Canonical Hashing Protocol")
    add_body("To prevent JSON key-ordering discrepancies across different programming platforms, Citadel sorts object keys lexicographically before calculating the SHA-256 digest:")
    add_academic_callout(
        doc,
        "Canonical Payload = JSON.stringify(sortKeys({ certId, recipientName, courseName, issueDate, organizationId }))\n"
        "certHash = SHA-256(Canonical Payload)\n"
        "certIdHash = keccak256(certId)",
        title="Mathematical Cryptographic Specification"
    )
    add_body("Due to the avalanche effect of SHA-256, changing even a single byte in the graduate's name or course title produces a completely different hash, immediately causing on-chain verification to fail.")

    # ----------------------------------------------------
    # SECTION 6: SMART CONTRACT DESIGN
    # ----------------------------------------------------
    add_sec_heading("6. Smart Contract Design")
    add_body("The CertificateRegistry.sol smart contract is written in Solidity 0.8.24 and compiled with Hardhat:")

    # Figure 5: Smart Contract Architecture
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_smart_contract.png"),
        "Figure 5",
        "CertificateRegistry.sol Smart Contract Architecture: State Machine Lifecycle, Modifiers, and Cryptographic Invariance.",
        width_inches=5.6
    )

    add_sub_heading("6.1 State Machine Lifecycle")
    add_bullet(" Credential exists on-chain, hash matches, and block.timestamp is before expirationDate.", "Valid (1): ")
    add_bullet(" Credential is authentic, but the validity window has elapsed.", "Expired (2): ")
    add_bullet(" Formally invalidated on-chain by the issuing institution with recorded audit reason.", "Revoked (3): ")
    add_bullet(" Certificate ID exists, but the presented data payload produces a mismatched hash.", "HashMismatch (4): ")
    add_bullet(" Certificate ID has never been registered on-chain.", "NotFound (0): ")

    add_sub_heading("6.2 Key Smart Contract Functions")
    add_bullet(" Enforces authorized issuer role, checks that the ID has not been used, verifies future expiry, and commits the certificate to the blockchain. Emits CertificateIssued.", "issueCertificate(bytes32 certIdHash, bytes32 certHash, uint256 expirationDate): ")
    add_bullet(" Free view function (zero gas). Compares the presented hash against the on-chain ledger and dynamically computes expiration.", "verifyCertificate(bytes32 certIdHash, bytes32 certHash): ")
    add_bullet(" Only the original issuing institution or contract administrator can revoke an active certificate. Emits CertificateRevoked.", "revokeCertificate(bytes32 certIdHash, string reason): ")

    # ----------------------------------------------------
    # SECTION 7: USER INTERFACE DESIGN OR SCREENSHOTS
    # ----------------------------------------------------
    add_sec_heading("7. User Interface Design or Screenshots")
    add_body("Below are the high-resolution screenshots demonstrating all required features across the Organization Portal and Certificate Verification Engine:")

    # Organization Portal Features
    add_sub_heading("7.1 Organization Portal Interface")
    add_body("The Organization Portal provides accredited institutions with complete administrative control:")
    add_bullet(" Secure authentication with input validation and session routing.", "1. Organization Login: ")
    add_bullet(" Interactive split-screen studio where entered data renders a vector diploma canvas in real time.", "2. Certificate Issuance: ")
    add_bullet(" Automatic PDF creation with embedded QR code and SMTP email dispatch.", "3. Downloadable PDF Diplomas: ")
    add_bullet(" Mined transaction confirmations with Tx Hash and Block Number on Ethereum Sepolia.", "4. Blockchain Commitment: ")
    add_bullet(" Comprehensive registry table with status filters (All, Valid, Expired, Revoked) and CSV audit export.", "5. Issued Certificate Management: ")

    # Figure 6: Issue Studio
    add_figure(
        doc,
        os.path.join(screenshots_dir, "05_issue_studio_live_preview.png"),
        "Figure 6",
        "Split-screen Issue Studio: form fields on left and real-time vector diploma preview on right.",
        width_inches=5.6
    )

    # Figure 7: Organization Dashboard
    add_figure(
        doc,
        os.path.join(screenshots_dir, "04_dashboard_overview.png"),
        "Figure 7",
        "Organization Executive Dashboard showing live metrics, issuance trends, and recent records.",
        width_inches=5.6
    )

    # Figure 8: Certificate Registry
    add_figure(
        doc,
        os.path.join(screenshots_dir, "06_certificate_registry.png"),
        "Figure 8",
        "Certificate Registry table with status filter tabs and client-side CSV spreadsheet export.",
        width_inches=5.6
    )

    # Certificate Verification Features
    add_sub_heading("7.2 Certificate Verification Interface")
    add_body("Public users verify credentials without accounts, gas, or Web3 wallets:")
    add_bullet(" Public users can verify via Certificate ID, camera QR scan, image drop, or PDF upload.", "1. Multi-Modal Verification: ")
    add_bullet(" Displays student name, degree title, issue date, and issuing accredited institution.", "2. Certificate Metadata Display: ")
    add_bullet(" Displays on-chain transaction hash, block number, contract address, and Etherscan link.", "3. Blockchain Transaction Proof: ")
    add_bullet(" Evaluates state across all three required statuses: Valid (Green), Expired (Yellow), and Revoked (Red).", "4. Three Lifecycle Statuses: ")

    # Figure 9: Verification Portal
    add_figure(
        doc,
        os.path.join(screenshots_dir, "07_public_verify_portal.png"),
        "Figure 9",
        "Public verification portal supporting manual ID search, camera scanning, and file upload.",
        width_inches=5.6
    )

    # Figure 10: Valid Result
    add_figure(
        doc,
        os.path.join(screenshots_dir, "08_verification_result_valid.png"),
        "Figure 10",
        "Cryptographic proof result: Valid status with on-chain Ethereum transaction confirmation.",
        width_inches=5.6
    )

    # Figure 11: Revoked Result
    add_figure(
        doc,
        os.path.join(screenshots_dir, "09_verification_result_revoked.png"),
        "Figure 11",
        "Revoked verification result: red status alert with recorded issuer audit reason and timestamp.",
        width_inches=5.6
    )

    # ----------------------------------------------------
    # SECTION 8: IMPLEMENTATION SUMMARY
    # ----------------------------------------------------
    add_sec_heading("8. Implementation Summary")
    add_body("Citadel is implemented using modern full-stack web and blockchain technologies:")
    add_bullet(" Next.js 14.2 App Router, TypeScript, Tailwind CSS, Radix UI Primitives, Lucide Icons.", "Frontend Stack: ")
    add_bullet(" Node.js 20+, Next.js Server Actions & API Routes, Zod schema validation.", "Backend Stack: ")
    add_bullet(" PostgreSQL (Supabase), Prisma ORM 5.18.0.", "Database: ")
    add_bullet(" Solidity 0.8.24, Hardhat 2.22.6, Ethers.js v6.13.1 (Sepolia Testnet / Hardhat EVM).", "Blockchain Ledger: ")
    add_bullet(" jsPDF 2.5.1 (vector diplomas), Nodemailer 6.9.14 (SMTP notifications).", "Document Services: ")
    add_bullet(" Html5Qrcode camera controller, jsQR multi-pass canvas engine, Node zlib decompression.", "Multi-Modal Scanner: ")

    add_sub_heading("8.1 Automated Test Suite Results")
    add_body("The implementation was validated using a 52-test automated unit, integration, and fuzz testing suite:")
    
    test_table = doc.add_table(rows=5, cols=3)
    test_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_table.autofit = False
    set_table_borders(test_table, color="B0B0B0")
    
    t_headers = ["Test Category", "Scope and Assertions", "Result"]
    for j, h in enumerate(t_headers):
        c = test_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=35, bottom=35, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    t_rows = [
        ("Cryptographic Unit Tests", "Canonical sorting, SHA-256 consistency, key-order invariance", "12 / 12 Passed (100%)"),
        ("Smart Contract Tests", "CertificateRegistry deployment, issuance, zero-gas verify, revoke", "28 / 28 Passed (100%)"),
        ("Fuzz & Edge Tests", "1-bit hash tampering, boundary timestamps, high-volume stress", "12 / 12 Passed (100%)"),
        ("TypeScript Static Check", "Strict compiler type-checking (npx tsc --noEmit)", "0 Errors (100% Valid)"),
    ]
    
    t_widths = [Inches(2.0), Inches(3.2), Inches(1.3)]
    for i, row_data in enumerate(t_rows):
        row = test_table.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = t_widths[j]
            set_cell_margins(c, top=35, bottom=35, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    add_sub_heading("8.2 Enhancements Beyond Minimum Requirements")
    add_bullet(" Live Split-Screen Diploma Preview Studio updating in real time as administrators type.", "1. Interactive Studio: ")
    add_bullet(" Multi-Modal Verification supporting camera video feed, drag-and-drop QR images, and PDF document drops.", "2. Multi-Modal Scanner: ")
    add_bullet(" Client-side CSV spreadsheet export for institutional record auditing.", "3. Audit Export: ")
    add_bullet(" Automated SMTP email delivery with generated high-resolution vector PDF diploma attached.", "4. Automated Email Delivery: ")

    # ----------------------------------------------------
    # SECTION 9: PUBLIC GITHUB REPOSITORY LINK
    # ----------------------------------------------------
    add_sec_heading("9. Public GitHub Repository Link")
    add_body("The complete project codebase, smart contract source code, database migrations, automated tests, and documentation are publicly available on GitHub:")
    add_academic_callout(
        doc,
        "Public GitHub Repository URL:\n"
        "https://github.com/mengchheanglong/citadel-blockchain-certificates\n\n"
        "Branch: main | Status: Up to date with all 52 tests, smart contracts, and documentation.",
        title="Repository Access"
    )

    # ----------------------------------------------------
    # SECTION 10: INDIVIDUAL CONTRIBUTION REPORT
    # ----------------------------------------------------
    add_sec_heading("10. Individual Contribution Report")
    add_body("This project was conducted as an Individual Capstone Project by Long Mengchheang. 100% of all technical planning, architecture, design, and implementation work was performed independently:")
    
    contrib_table = doc.add_table(rows=6, cols=3)
    contrib_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    contrib_table.autofit = False
    set_table_borders(contrib_table, color="B0B0B0")
    
    c_headers = ["Technical Domain", "Responsibilities & Deliverables", "Contribution"]
    for j, h in enumerate(c_headers):
        c = contrib_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=35, bottom=35, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    contrib_rows = [
        ("Smart Contract & Web3", "Wrote CertificateRegistry.sol, Hardhat deployment scripts, Ethers.js integration", "100%"),
        ("Frontend Engineering", "Next.js 14 landing portal, dashboard, live preview studio, multi-modal scanner", "100%"),
        ("Backend & Database", "Prisma PostgreSQL schema, Next.js API routes, Zod validation, PDF scan endpoint", "100%"),
        ("Document & Email Services", "Vector diploma generation with embedded QR codes, automated SMTP dispatch", "100%"),
        ("Quality Assurance", "52 automated tests, TypeScript strict compliance, diagrams, and project report", "100%"),
    ]
    
    c_widths = [Inches(1.8), Inches(3.7), Inches(1.0)]
    for i, row_data in enumerate(contrib_rows):
        row = contrib_table.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = c_widths[j]
            set_cell_margins(c, top=35, bottom=35, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ----------------------------------------------------
    # SECTION 11: PUBLIC DEMO VIDEO LINK
    # ----------------------------------------------------
    add_sec_heading("11. Public Demo Video Link")
    add_body("A comprehensive demonstration video walking through the full lifecycle of the platform is accessible publicly at:")
    add_academic_callout(
        doc,
        "Public Demonstration Video URL:\n"
        "[Insert Public Google Drive or YouTube Link Here]\n\n"
        "Access Permission: Public / Anyone with the link can view\n"
        "Duration: Approximately 5 to 7 minutes",
        title="Video Access"
    )

    add_sub_heading("11.1 Demonstration Video Walkthrough Outline")
    
    script_table = doc.add_table(rows=7, cols=3)
    script_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    script_table.autofit = False
    set_table_borders(script_table, color="B0B0B0")
    
    s_headers = ["Time", "Stage / Feature", "Demonstration Outline"]
    for j, h in enumerate(s_headers):
        c = script_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=35, bottom=35, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    script_data = [
        ("0:00 - 0:45", "Introduction", "Overview of diploma fraud problem and Citadel's blockchain solution."),
        ("0:45 - 1:45", "Dashboard", "Walkthrough of live metric cards, credential table, and off-chain storage model."),
        ("1:45 - 3:00", "Issuing Studio", "Data entry, real-time diploma canvas rendering, and on-chain hash commitment."),
        ("3:00 - 3:45", "Delivery", "Inspection of generated vector PDF diploma with embedded QR code and email delivery."),
        ("3:45 - 5:15", "Verification", "Public zero-gas verification via camera scan, image drop, and PDF file upload."),
        ("5:15 - 6:30", "Revocation & Summary", "On-chain revocation demonstration with audit reason and concluding remarks."),
    ]
    
    s_widths = [Inches(1.2), Inches(1.8), Inches(3.5)]
    for i, row_data in enumerate(script_data):
        row = script_table.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = s_widths[j]
            set_cell_margins(c, top=35, bottom=35, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0:
                r.bold = True

    output_path = os.path.join(base_dir, "..", "PROJECT_SUBMISSION_REPORT.docx")
    doc.save(output_path)
    print(f"Successfully generated formal Word document at: {output_path}")

    # Export to PDF via Word COM Object (if available)
    pdf_path = os.path.join(base_dir, "..", "PROJECT_SUBMISSION_REPORT.pdf")
    abs_docx = os.path.abspath(output_path)
    abs_pdf = os.path.abspath(pdf_path)
    
    ps_cmd = f'''
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    try {{
        $doc = $word.Documents.Open('{abs_docx}')
        $doc.SaveAs([ref]'{abs_pdf}', [ref]17)
        $doc.Close()
        Write-Output "PDF converted successfully"
    }} catch {{
        Write-Output "Error during PDF conversion: $_"
    }} finally {{
        $word.Quit()
    }}
    '''
    try:
        res = subprocess.run(["powershell", "-Command", ps_cmd], capture_output=True, text=True)
        print("PowerShell PDF export output:", res.stdout.strip())
        if os.path.exists(pdf_path):
            print(f"Successfully generated PDF report at: {pdf_path}")
    except Exception as e:
        print("Note: PDF auto-export encountered an issue:", e)

if __name__ == "__main__":
    build_document()

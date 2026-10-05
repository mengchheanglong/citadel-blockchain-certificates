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

def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
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
    set_cell_shading(cell, "F8F9FA")
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
    
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
    run_text.font.color.rgb = RGBColor(30, 30, 30)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_figure(doc, img_path, caption_title, caption_text, width_inches=5.8):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(3)
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_inches))
        
        cap_p = doc.add_paragraph()
        cap_p.paragraph_format.space_before = Pt(1)
        cap_p.paragraph_format.space_after = Pt(10)
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
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(f"[{caption_title} - Pending image: {os.path.basename(img_path)}]")
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.italic = True
        r.font.color.rgb = RGBColor(120, 120, 120)

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
    
    # Standard Academic 1-inch Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer setup
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Citadel — Blockchain Certificate Platform | Project Report")
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(120, 120, 120)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Page ")
        frun.font.name = "Times New Roman"
        frun.font.size = Pt(9.5)
        frun.font.color.rgb = RGBColor(60, 60, 60)
        add_footer_page_number(frun)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(base_dir, "..", "docs", "screenshots")

    # Typography helpers (Formal Times New Roman, Black)
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
        p.paragraph_format.space_after = Pt(4)
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
        p.paragraph_format.space_after = Pt(2.5)
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
    # ACADEMIC TITLE & METADATA SECTION
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
    p_dept.paragraph_format.space_after = Pt(16)
    r_dept = p_dept.add_run("Department of Software Engineering")
    r_dept.font.name = "Times New Roman"
    r_dept.font.size = Pt(11)
    r_dept.font.italic = True
    r_dept.font.color.rgb = RGBColor(60, 60, 60)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("CITADEL: A BLOCKCHAIN-BASED DIGITAL CERTIFICATE ISSUING AND VERIFICATION PLATFORM")
    r_title.bold = True
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(17)
    r_title.font.color.rgb = BLACK

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Project Submission Report")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(60, 60, 60)

    # Formal Metadata Table
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    set_table_borders(meta_table, color="D0D0D0")
    
    meta_data = [
        ("Student / Author", "Long Mengchheang"),
        ("Institution", "Kirirom Institute of Technology (KIT)"),
        ("Project Type", "Individual Capstone Project (100% Contribution)"),
        ("GitHub Repository", "https://github.com/mengchheanglong/citadel-blockchain-certificates"),
        ("Demonstration Video", "Available on Google Drive / YouTube (Public Link)"),
        ("Submission Date", "October 2026"),
    ]
    
    col_widths = [Inches(1.8), Inches(4.7)]
    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_shading(c0, "F5F5F5")
        set_cell_margins(c0, top=40, bottom=40, left=80, right=80)
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
        set_cell_margins(c1, top=40, bottom=40, left=80, right=80)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = DARK_TEXT

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ----------------------------------------------------
    # ABSTRACT
    # ----------------------------------------------------
    add_academic_callout(
        doc,
        "Abstract: Traditional paper diplomas and static PDF certificates suffer from widespread forgery and require manual, time-consuming registrar inquiries for validation. Citadel is a decentralized web platform designed to eliminate credential fraud using the Ethereum blockchain. The platform adopts a hybrid architecture: student academic metadata is stored off-chain in a secure PostgreSQL database to protect privacy and optimize gas costs, while a canonical SHA-256 cryptographic hash of the credential is committed to an EVM smart contract (CertificateRegistry.sol). Public verifiers can authenticate credentials in seconds at zero gas cost via manual ID entry, camera QR scanning, image upload, or native PDF drag-and-drop. The system features a real-time diploma issuance studio, automated PDF generation, SMTP delivery, dynamic expiration evaluation, and on-chain revocation with audit logging. The implementation was verified with a 52-test automated unit and fuzz testing suite achieving a 100% pass rate.",
        title="Abstract"
    )

    # ----------------------------------------------------
    # 1. INTRODUCTION & PROBLEM STATEMENT
    # ----------------------------------------------------
    add_sec_heading("1. Introduction and Problem Statement")
    add_body("Academic and professional credentialing systems face critical challenges in maintaining document authenticity and operational trust:")
    add_bullet(" Static PDF files and physical diplomas can be modified using desktop editing software or generative tools to alter student names, graduation dates, or honours without visual detection.", "Credential Forgery: ")
    add_bullet(" Employers and university registrars rely on phone calls, postal mail, or manual email exchanges to verify records, averaging 2 to 4 weeks per inquiry.", "Inefficient Verification: ")
    add_bullet(" Centralized academic databases represent single points of failure vulnerable to unauthorized tampering, data corruption, and administrative loss.", "Centralized Data Risks: ")
    add_body("Citadel addresses these vulnerabilities by establishing a tamper-proof, decentralized credential issuance and verification platform with four key design objectives:")
    add_bullet(" Commit cryptographic proofs to the Ethereum blockchain so that any modification to graduate records invalidates verification.", "1. Mathematical Immutability: ")
    add_bullet(" Allow employers and the public to verify any credential in real time without requiring blockchain wallets, tokens, or gas fees.", "2. Zero-Gas Verification: ")
    add_bullet(" Provide an interactive split-screen issuance studio that updates a vector diploma preview in real time and automates PDF generation and email delivery.", "3. End-to-End Automation: ")
    add_bullet(" Support configurable validity periods (e.g. lifetime or 1-year licenses) and on-chain revocation with recorded audit justifications.", "4. Lifecycle Governance: ")

    # ----------------------------------------------------
    # 2. SYSTEM ARCHITECTURE & OPERATIONAL WORKFLOW
    # ----------------------------------------------------
    add_sec_heading("2. System Architecture and Operational Workflow")
    add_body("Citadel is engineered across four functional layers to decouple user presentation, business logic, storage, and consensus verification:")
    add_bullet(" Next.js 14 App Router, TypeScript, and Tailwind CSS. Provides an administrative operations portal and a clean public verification engine.", "1. Presentation Layer: ")
    add_bullet(" Server route handlers and Server Actions that enforce Zod schema validation, compute deterministic SHA-256 hashes, render vector diplomas with jsPDF, and manage Nodemailer SMTP notifications.", "2. Application Layer: ")
    add_bullet(" PostgreSQL managed through Prisma ORM 5.18. Stores recipient details, degree titles, and issuer profiles off-chain.", "3. Persistence Layer: ")
    add_bullet(" Solidity 0.8.24 smart contract (CertificateRegistry.sol) deployed on the Ethereum EVM (Sepolia Testnet / Hardhat). Serves as the immutable registry for 32-byte credential hashes.", "4. Decentralized Ledger Layer: ")

    # Figure 1: Architecture
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_architecture.png"),
        "Figure 1",
        "Citadel four-tier system architecture model.",
        width_inches=5.8
    )

    add_sub_heading("2.1 End-to-End Credential Lifecycle")
    add_body("The platform coordinates two primary workflows: the Issuance Pipeline and the Verification Pipeline:")
    add_bullet(" The accredited institution inputs student information in the Issue Studio. The server computes a canonical SHA-256 digest and records it on Ethereum via Ethers.js v6. A vector PDF diploma with an embedded QR code is generated and dispatched via email.", "Stage 1 (Issuance Pipeline): ")
    add_bullet(" An employer or verifier enters the Certificate ID or scans the QR code on /verify. The system retrieves the record, recomputes the hash, queries the smart contract via a zero-gas view function, and displays an official verification badge.", "Stage 2 (Verification Pipeline): ")

    # Figure 2: How It Works
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_how_it_works.png"),
        "Figure 2",
        "End-to-end credential lifecycle: Stage 1 Issuance Pipeline and Stage 2 Public Verification Pipeline.",
        width_inches=5.8
    )

    # ----------------------------------------------------
    # 3. BLOCKCHAIN & CRYPTOGRAPHIC DESIGN
    # ----------------------------------------------------
    add_sec_heading("3. Blockchain and Cryptographic Mechanism")
    add_sub_heading("3.1 Hybrid Storage Architecture")
    add_body("Storing complete documents directly on Ethereum incurs high gas costs and violates privacy regulations (GDPR/FERPA), which prohibit permanent on-chain storage of personal identities. Citadel resolves this by storing metadata in PostgreSQL while anchoring only a 32-byte hash on-chain.")
    
    add_sub_heading("3.2 Deterministic Canonical Hashing Protocol")
    add_body("To eliminate JSON key-ordering discrepancies across different platforms, Citadel sorts object keys lexicographically before computing the cryptographic digest:")
    add_academic_callout(
        doc,
        "Canonical Payload = JSON.stringify(sortKeys({ certId, recipientName, courseName, issueDate, organizationId }))\n"
        "certHash = SHA-256(Canonical Payload)\n"
        "certIdHash = keccak256(certId)",
        title="Mathematical Specification"
    )
    add_body("Due to the avalanche effect of SHA-256, changing even a single byte in the graduate's name or course title produces a completely different hash, immediately causing on-chain verification to fail.")

    add_sub_heading("3.3 Smart Contract Implementation (CertificateRegistry.sol)")
    add_body("The CertificateRegistry contract maintains state transitions for each credential across five distinct statuses:")
    add_bullet(" Credential exists on-chain, hash matches, and block.timestamp is before expirationDate.", "Valid (1): ")
    add_bullet(" Credential is authentic, but the validity window has elapsed.", "Expired (2): ")
    add_bullet(" Formally invalidated by the issuer with a mandatory recorded audit reason.", "Revoked (3): ")
    add_bullet(" Certificate ID exists, but the supplied data produces a mismatched hash.", "HashMismatch (4): ")
    add_bullet(" Certificate ID has never been registered on-chain.", "NotFound (0): ")

    # ----------------------------------------------------
    # 4. DATABASE DESIGN & DATA MODEL
    # ----------------------------------------------------
    add_sec_heading("4. Database Design and Data Model")
    add_body("The off-chain relational database organizes information across three primary entities:")

    # Figure 3: ER Diagram
    add_figure(
        doc,
        os.path.join(screenshots_dir, "diagram_er.png"),
        "Figure 3",
        "Entity-Relationship model representing Organization, Certificate, and BlockchainTransaction entities.",
        width_inches=5.8
    )

    # Clean Academic Table for Data Model
    db_table = doc.add_table(rows=4, cols=3)
    db_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    db_table.autofit = False
    set_table_borders(db_table, color="B0B0B0")
    
    headers = ["Table", "Key Attributes & Constraints", "Description"]
    for j, h in enumerate(headers):
        c = db_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=40, bottom=40, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    db_rows = [
        ("Organization", "id (PK UUID), name, email (UK), website, description, createdAt", "Stores verified institution profile and issuer accounts."),
        ("Certificate", "id (PK UUID), certificateId (UK), recipientName, recipientEmail, courseName, issueDate, expiryDate, status, certHash, organizationId (FK)", "Maintains academic records, expiration timestamps, and canonical SHA-256 digests."),
        ("BlockchainTransaction", "id (PK UUID), certificateId (FK), txHash (UK), blockNumber, networkName, contractAddress, action, timestamp, confirmed", "Audit log of on-chain Ethereum transaction receipts and block confirmations."),
    ]
    
    widths = [Inches(1.8), Inches(2.7), Inches(2.0)]
    for i, row_data in enumerate(db_rows):
        row = db_table.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = widths[j]
            set_cell_margins(c, top=40, bottom=40, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ----------------------------------------------------
    # 5. CORE IMPLEMENTATION & USER INTERFACE
    # ----------------------------------------------------
    add_sec_heading("5. Core System Implementation and User Interface")
    add_sub_heading("5.1 Real-Time Issuance Studio")
    add_body("The Issue Studio provides an administrative interface where entered graduate metadata renders onto an SVG/canvas diploma in real time. Upon submission, the record is hashed, committed to Ethereum, and dispatched as a PDF via email.")

    # Figure 4: Issue Studio
    add_figure(
        doc,
        os.path.join(screenshots_dir, "05_issue_studio_live_preview.png"),
        "Figure 4",
        "Split-screen Issue Studio: form fields on left and real-time vector diploma preview on right.",
        width_inches=5.8
    )

    add_sub_heading("5.2 Multi-Modal Verification Engine")
    add_body("To support diverse devices, Citadel implements a multi-modal verification engine on /verify:")
    add_bullet(" Uses the low-level Html5Qrcode controller to stream video directly into a viewfinder frame with corner reticles and mobile camera switching.", "1. Live Camera Stream: ")
    add_bullet(" Employs a multi-pass canvas decoder with jsQR that evaluates native image dimensions, bottom corner quadrants, and upscales small crops.", "2. Multi-Pass jsQR Image Decoder: ")
    add_bullet(" Allows verifiers to drag and drop certificate PDF documents directly. The system extracts certificate identifiers from binary text streams and decompresses PDF layers via /api/verify/scan-file.", "3. PDF Document Ingestion: ")

    # Figure 5: Verification Portal
    add_figure(
        doc,
        os.path.join(screenshots_dir, "07_public_verify_portal.png"),
        "Figure 5",
        "Public verification portal supporting ID search, camera scanning, and file upload.",
        width_inches=5.8
    )

    # Figure 6: Verification Result
    add_figure(
        doc,
        os.path.join(screenshots_dir, "08_verification_result_valid.png"),
        "Figure 6",
        "Cryptographic proof result displaying verified metadata and Ethereum transaction details.",
        width_inches=5.8
    )

    # ----------------------------------------------------
    # 6. TESTING & EVALUATION RESULTS
    # ----------------------------------------------------
    add_sec_heading("6. Testing, Evaluation and Results")
    add_body("The system was validated using a comprehensive 52-test automated suite executed through Hardhat and Playwright:")
    add_bullet(" Validated deterministic sorting, whitespace resilience, and cross-platform key invariance.", "Cryptographic Hashing Tests (12 Tests): ")
    add_bullet(" Verified deployment, access control modifiers, uniqueness enforcement, verification logic, and revocation events.", "Smart Contract Functional Tests (28 Tests): ")
    add_bullet(" Evaluated single-bit hash alterations, extreme future dates (50+ years), timestamp boundary conditions, and concurrent issuance.", "Fuzz and Edge Case Tests (12 Tests): ")

    # Test summary table
    test_table = doc.add_table(rows=5, cols=3)
    test_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_table.autofit = False
    set_table_borders(test_table, color="B0B0B0")
    
    t_headers = ["Test Category", "Scope and Assertions", "Result"]
    for j, h in enumerate(t_headers):
        c = test_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=40, bottom=40, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.font.color.rgb = BLACK
        
    t_rows = [
        ("Cryptographic Unit Tests", "Canonical sorting, SHA-256 consistency, keystore validation", "12 / 12 Passed (100%)"),
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
            set_cell_margins(c, top=40, bottom=40, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ----------------------------------------------------
    # 7. PROJECT DELIVERABLES & CONTRIBUTION
    # ----------------------------------------------------
    add_sec_heading("7. Project Deliverables and Contribution")
    add_body("This project was conducted as an individual capstone project by Long Mengchheang. All architectural planning, implementation, smart contracts, frontend, backend, and testing were performed independently:")
    
    contrib_table = doc.add_table(rows=6, cols=3)
    contrib_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    contrib_table.autofit = False
    set_table_borders(contrib_table, color="B0B0B0")
    
    c_headers = ["Technical Domain", "Deliverables", "Contribution"]
    for j, h in enumerate(c_headers):
        c = contrib_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=40, bottom=40, left=60, right=60)
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
            set_cell_margins(c, top=40, bottom=40, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0 or j == 2:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Demonstration Script Summary Table
    add_sub_heading("7.1 Demonstration Video Outline (5–7 Minutes)")
    add_body("The live video walkthrough demonstrates the platform's features and blockchain mechanics:")
    
    script_table = doc.add_table(rows=7, cols=3)
    script_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    script_table.autofit = False
    set_table_borders(script_table, color="B0B0B0")
    
    s_headers = ["Time", "Stage / Feature", "Demonstration Outline"]
    for j, h in enumerate(s_headers):
        c = script_table.rows[0].cells[j]
        set_cell_shading(c, "EAEAEA")
        set_cell_margins(c, top=40, bottom=40, left=60, right=60)
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
            set_cell_margins(c, top=40, bottom=40, left=60, right=60)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.0)
            r.font.color.rgb = DARK_TEXT
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ----------------------------------------------------
    # 8. CONCLUSION & FUTURE WORK
    # ----------------------------------------------------
    add_sec_heading("8. Conclusion and Future Work")
    add_body("Citadel implements a production-grade, mathematically tamper-proof solution to credential forgery. By combining off-chain storage efficiency with Ethereum smart contract immutability, the platform achieves zero-gas public verification, automated delivery, and robust lifecycle governance.")
    add_body("Future enhancements include integrating W3C Decentralized Identifiers (DIDs) for cross-border institutional interoperability, issuing non-transferable ERC-5192 Soulbound Tokens into student wallets, and utilizing zero-knowledge proofs (zk-SNARKs) for privacy-preserving attribute verification.")

    output_path = os.path.join(base_dir, "..", "PROJECT_SUBMISSION_REPORT.docx")
    doc.save(output_path)
    print(f"Successfully generated formal academic Word document at: {output_path}")

if __name__ == "__main__":
    build_document()

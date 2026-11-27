from pathlib import Path
from textwrap import wrap


OUT = Path(__file__).with_name("StudyHub_Final_Project_Documentation.pdf")
PAGE_W, PAGE_H = 612, 792
LEFT, RIGHT, TOP, BOTTOM = 54, 54, 58, 54


sections = [
    ("1. Project Overview", [
        "StudyHub is a web-based learning material management system for organizing, searching, and downloading educational files. Teachers manage subjects, categories, and their own uploaded materials, while students can register, authenticate, browse resources, download files, and view download history.",
        "The backend is implemented with NestJS and TypeScript, with TypeORM and MySQL for persistence, JWT and bcrypt for authentication, class-validator for request validation, and Multer for controlled file uploads.",
    ]),
    ("2. System Analysis", [
        "Intended users",
        "Teachers manage subjects, categories, and learning materials that they own. Students access available resources, search by keyword or classification, download files, and review their personal download history.",
        "System objectives",
        "• Centralize learning materials in one searchable system.\n• Protect accounts and teacher-only operations with role-based authentication.\n• Maintain a normalized relational database.\n• Demonstrate REST API and systems integration concepts.",
        "Functional requirements",
        "The system supports registration, login, profile access, subject and category CRUD, material upload, material search, material metadata update and deletion, file download, and download-history viewing.",
        "Non-functional requirements",
        "The backend applies input validation, password hashing, protected routes, ownership checks, safe file extensions, maximum upload size, clear HTTP status codes, modular code organization, and environment-based configuration.",
    ]),
    ("3. System Architecture", [
        "The implemented request flow is:",
        "Postman Client → Controller → JWT/Role Guard → Service → TypeORM Repository → MySQL",
        "Controllers receive HTTP requests and delegate business rules to services. Guards validate JWT credentials and restrict teacher-only operations. Repositories persist data through TypeORM. Uploaded files are stored in the configured uploads directory and are served only after authorization and path-safety checks.",
        "The project architecture source is available in StudyHub_System_Architecture.mmd.",
    ]),
    ("4. Database Design", [
        "StudyHub uses five normalized tables: users, subjects, categories, materials, and downloads. A material references its owner, subject, and category through foreign keys. A download references both the downloading user and the material, allowing a history record to be created whenever a protected download succeeds.",
        "The ERD source is available in StudyHub_ERD.dbml. This design separates account data, classification data, file metadata, and activity history while preserving referential integrity.",
    ]),
    ("5. REST API Design", [
        "The Postman collection maps 20 backend routes. All protected requests use the Authorization header with a Bearer JWT.",
        "POST  /auth/register        Register a student\nPOST  /auth/login           Authenticate and return JWT\nGET   /auth/profile         Return authenticated profile\nGET   /subjects             List subjects\nGET   /subjects/:id         View one subject\nPOST  /subjects             Create subject (teacher)\nPATCH /subjects/:id         Update subject (teacher)\nDELETE /subjects/:id        Delete subject (teacher)\nGET   /categories           List categories\nGET   /categories/:id       View one category\nPOST  /categories           Create category (teacher)\nPATCH /categories/:id       Update category (teacher)\nDELETE /categories/:id      Delete category (teacher)\nGET   /materials            Search and filter materials\nGET   /materials/:id        View one material\nPOST  /materials            Upload material (teacher)\nPATCH /materials/:id        Update material metadata\nDELETE /materials/:id       Delete material\nGET   /materials/:id/download  Download and record history\nGET   /downloads            View personal download history",
        "The importable request templates are in StudyHub_Postman_Collection.json.",
    ]),
    ("6. Authentication and Security", [
        "Passwords are hashed with bcrypt and are not returned in normal responses. Login returns a signed JWT containing the authenticated user identity and role. JwtAuthGuard protects authenticated routes, while RolesGuard restricts teacher-only write operations. Public registration always assigns the student role.",
        "DTOs use class-validator for input checks. Uploads are limited to PDF, DOCX, PPTX, and TXT files and respect the configured maximum size. Material updates and deletions verify ownership. Downloads resolve paths safely before serving a file.",
    ]),
    ("7. Backend Implementation", [
        "The implementation is organized into NestJS modules containing controllers, services, DTOs, entities, guards, and repositories. TypeORM manages relationships and persistence. Multer handles multipart form-data uploads, while environment variables configure the server port, database, JWT settings, and upload limits.",
        "The backend can be started with npm.cmd run start:dev from the studyhub-backend directory. The expected local endpoint is http://localhost:3000.",
    ]),
    ("8. API Testing and Validation", [
        "The Postman testing sequence is: start the backend, register a student, log in as the student, verify the profile, log in as a seeded teacher, create a subject and category, upload a material, then test listing, viewing, updating, downloading, download history, and deletion.",
        "Verified during development: NestJS compilation passed; MySQL connection passed; root health request returned HTTP 200; student registration and JWT generation passed; login and protected profile passed; and all 20 routes were registered.",
        "For local Postman testing, use the Desktop Agent when the base_url is http://localhost:3000. The collection saves the student token after a successful login. Teacher operations require a valid teacher_token.",
    ]),
    ("9. Conclusion", [
        "StudyHub demonstrates an integrated backend prototype for learning-resource management. It combines authentication, role authorization, relational persistence, file handling, and REST API testing in one maintainable NestJS application.",
        "Remaining submission work includes collecting final Postman evidence, completing personal information and links, exporting the database if required, and attaching representative screenshots to the appendix.",
    ]),
    ("10. References", [
        "NestJS Documentation — https://docs.nestjs.com/\nTypeORM Documentation — https://typeorm.io/\nMySQL Documentation — https://dev.mysql.com/doc/\nPostman Learning Center — https://learning.postman.com/",
    ]),
    ("11. Appendix: Postman Test Flow", [
        "A. Register Student — POST /auth/register — expected HTTP 201.",
        "B. Login — POST /auth/login — expected HTTP 200 and access_token.",
        "C. Profile — GET /auth/profile — expected HTTP 200 with student profile.",
        "D. Subjects and Categories — list/view as student; create/update/delete as teacher.",
        "E. Materials — upload using form-data, then list, view, update, download, inspect /downloads, and delete.",
        "F. Record evidence — capture response status, response body, and relevant request headers for the final report.",
    ]),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def line_commands(lines, title=None, page_no=1):
    cmds = ["q", "0.12 0.24 0.40 rg", f"{LEFT} {PAGE_H-38} {PAGE_W-LEFT-RIGHT} 3 re", "f", "Q", "BT"]
    cmds += ["/F1 9 Tf", "0.25 0.25 0.25 rg", f"{LEFT} 28 Td", f"(StudyHub Final Project Documentation) Tj", "/F1 9 Tf", f"{PAGE_W-LEFT-RIGHT-62} 0 Td", f"(Page {page_no}) Tj", "ET"]
    y = PAGE_H - TOP
    if title:
        cmds += ["BT", "/F2 18 Tf", "0.12 0.24 0.40 rg", f"{LEFT} {y} Td", f"({esc(title)}) Tj", "ET"]
        y -= 32
    for text in lines:
        if text == "":
            y -= 8
            continue
        font = "/F3 10 Tf" if text.startswith("•") else "/F1 10 Tf"
        for wrapped in wrap(text, width=92, break_long_words=False, break_on_hyphens=False):
            cmds += ["BT", font, "0.10 0.10 0.10 rg", f"{LEFT} {y} Td", f"({esc(wrapped)}) Tj", "ET"]
            y -= 14
        y -= 3
    return "\n".join(cmds)


def make_pages():
    pages = []
    cover = [
        "STUDYHUB",
        "A Web-Based Learning Material Management System",
        "",
        "Final Project Documentation",
        "",
        "Course: ITEC 116 – IT Elective 4 (Systems Integration and Architecture 2)",
        "Instructor: John Vincent A. Dallego, MIT",
        "Student: ______________________________",
        "",
        "NestJS • TypeScript • MySQL • JWT • TypeORM • Postman",
    ]
    pages.append((None, cover, True))
    toc = ["1. Project Overview", "2. System Analysis", "3. System Architecture", "4. Database Design", "5. REST API Design", "6. Authentication and Security", "7. Backend Implementation", "8. API Testing and Validation", "9. Conclusion", "10. References", "11. Appendix: Postman Test Flow"]
    pages.append(("Table of Contents", toc, False))
    for title, paras in sections:
        current = []
        for para in paras:
            current.extend(para.split("\n"))
            current.append("")
        pages.append((title, current, False))
    return pages


def write_pdf():
    pages = make_pages()
    objects = []
    objects.append("<< /Type /Catalog /Pages 2 0 R >>")
    page_ids = []
    next_id = 4
    for _ in pages:
        page_ids.append(next_id)
        next_id += 2
    objects.append("<< /Type /Pages /Kids [" + " ".join(f"{i} 0 R" for i in page_ids) + f"] /Count {len(page_ids)} >>")
    objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>")
    streams = []
    for idx, (title, lines, cover) in enumerate(pages, start=1):
        if cover:
            cmds = ["q", "0.12 0.24 0.40 rg", "0 0 612 792 re", "f", "Q", "BT", "/F2 34 Tf", "1 1 1 rg", "80 510 Td", "(STUDYHUB) Tj", "/F1 16 Tf", "0 55 Td", "(A Web-Based Learning Material Management System) Tj", "/F1 12 Tf", "0 -90 Td", "(FINAL PROJECT DOCUMENTATION) Tj", "/F1 10 Tf", "0 -70 Td", "(NestJS / TypeScript / MySQL / JWT / Postman) Tj", "ET", "BT", "/F1 9 Tf", "0.9 0.9 0.9 rg", "80 55 Td", "(StudyHub Backend Deliverables) Tj", "ET"]
        else:
            cmds = line_commands(lines, title, idx)
        streams.append("\n".join(cmds))
    # Page and content objects follow the fixed font objects.
    for i, stream in zip(page_ids, streams):
        content_id = i + 1
        objects.append(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents {content_id} 0 R >>")
        objects.append(f"<< /Length {len(stream.encode('latin-1', 'replace'))} >>\nstream\n{stream}\nendstream")
    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for n, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out.extend(f"{n} 0 obj\n{obj}\nendobj\n".encode("latin-1", "replace"))
    xref = len(out)
    out.extend(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode())
    for off in offsets[1:]:
        out.extend(f"{off:010d} 00000 n \n".encode())
    out.extend(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
    OUT.write_bytes(out)


if __name__ == "__main__":
    write_pdf()
    print(OUT)

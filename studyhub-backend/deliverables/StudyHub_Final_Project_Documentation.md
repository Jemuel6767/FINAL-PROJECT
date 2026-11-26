# StudyHub: A Web-Based Learning Material Management System

## Cover Page

**Course:** ITEC 116 – IT Elective 4 (Systems Integration and Architecture 2)  
**Instructor:** John Vincent A. Dallego, MIT  
**Student:** PENDING: PERSONAL ACTION REQUIRED  
**GitHub Repository:** PENDING: PERSONAL ACTION REQUIRED  
**Video Demonstration:** PENDING: PERSONAL ACTION REQUIRED

## Table of Contents

1. Project Overview  
2. System Analysis  
3. System Architecture  
4. Database Design  
5. REST API Design  
6. Authentication and Security  
7. Backend Implementation  
8. API Testing and Validation  
9. Conclusion  
10. References  
11. Appendix

## 1. Project Overview

StudyHub is a backend information system for storing, organizing, searching, and downloading learning materials. Teachers manage subjects, categories, and their own uploaded files. Students can register, log in, view materials, download files, and view their download history.

The backend is implemented with NestJS, TypeScript, TypeORM, MySQL, JWT, bcrypt, class-validator, and Multer.

## 2. System Analysis

### Intended users

- Teachers: manage subjects, categories, and owned learning materials.
- Students: view, search, download materials, and view personal download history.

### Objectives

- Centralize learning materials.
- Secure user access with authentication and role authorization.
- Provide a normalized relational database.
- Demonstrate REST API and systems integration concepts.

### Functional requirements

Registration, login, profile access, subject and category CRUD, material upload, material search, material update/delete with ownership checking, material download, and download history.

### Non-functional requirements

Validation, password hashing, protected routes, safe file extensions, maximum upload size, clear status codes, maintainable modules, and environment-based configuration.

## 3. System Architecture

The implemented flow is:

`Postman Client → Controller → JWT/Role Guard → Service → TypeORM Repository → MySQL`

Files are stored in the protected `uploads` directory. The actual diagram is in `StudyHub_System_Architecture.mmd`.

## 4. Database Design

The system has five normalized tables: users, subjects, categories, materials, and downloads. Materials reference their owner, subject, and category through foreign keys. Downloads reference both the downloading user and the material. The ERD source is in `StudyHub_ERD.dbml`.

## 5. REST API Design

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a student |
| POST | `/auth/login` | Authenticate and return JWT |
| GET | `/auth/profile` | Return the authenticated profile |
| GET/POST/PATCH/DELETE | `/subjects` and `/subjects/:id` | Subject CRUD |
| GET/POST/PATCH/DELETE | `/categories` and `/categories/:id` | Category CRUD |
| GET | `/materials` | List and filter materials |
| GET | `/materials/:id` | View one material |
| POST | `/materials` | Teacher uploads a material |
| PATCH | `/materials/:id` | Owner updates material metadata |
| DELETE | `/materials/:id` | Owner deletes a material |
| GET | `/materials/:id/download` | Download and record history |
| GET | `/downloads` | View personal download history |

This provides 20 mapped REST endpoints. The importable collection is `StudyHub_Postman_Collection.json`.

## 6. Authentication and Security

Passwords are hashed with bcrypt. Login returns a signed JWT. `JwtAuthGuard` protects authenticated routes, and `RolesGuard` restricts teacher-only write routes. Public registration always assigns the student role. Password fields are excluded from normal queries and responses. DTOs use class-validator. File uploads allow PDF, DOCX, PPTX, and TXT files up to the configured maximum size.

## 7. Backend Implementation

Controllers receive HTTP requests. Services contain business rules. TypeORM repositories access MySQL. DTOs validate input. Entities define tables and relationships. Materials use Multer disk storage, generated filenames, ownership checks, and safe resolved paths before download.

## 8. API Testing and Validation

Verified during development:

- NestJS compilation: PASS.
- MySQL database connection: PASS.
- Root health request: PASS, HTTP 200.
- Student registration and JWT generation: PASS.
- Login and protected profile: PASS.
- Route registration for all 20 endpoints: PASS.

Full CRUD, upload, download, and Postman evidence remain to be executed and recorded in `StudyHub_Test_Results.md`.

## 9. Conclusion

StudyHub demonstrates a working integrated backend prototype using the required stack. Remaining submission work is evidence collection, SQL export, GitHub publication, and personal information/link completion.

## 10. References

- NestJS Documentation: https://docs.nestjs.com/
- TypeORM Documentation: https://typeorm.io/
- MySQL Documentation: https://dev.mysql.com/doc/
- Postman Learning Center: https://learning.postman.com/

## 11. Appendix

Attach representative Postman screenshots and final test evidence here. Do not add screenshots until they are actually captured.

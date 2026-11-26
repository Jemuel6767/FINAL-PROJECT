# StudyHub Project Progress

## Completed tasks

- Completed read-only inspection of the workspace and available software.
- Confirmed Node.js, npm, and Git are available.
- Confirmed the MySQL84 Windows service is running.
- Confirmed Postman is installed.
- Created the NestJS project in `studyhub-backend`.
- Installed the initial NestJS dependencies.
- Installed TypeORM, MySQL, JWT, Passport, bcrypt, validation, and Multer dependencies.
- Confirmed the initial project builds successfully with `npm.cmd run build`.
- Added environment/configuration support and global DTO validation.
- Added User, Subject, Category, Material, and Download TypeORM entities with relationships.
- Added student registration logic with bcrypt password hashing and duplicate-email handling.
- Added JWT authentication structure: register, login, profile, JWT strategy, and guards.
- Added role guard and teacher-only write protection for Subjects and Categories.
- Added protected Subjects and Categories CRUD foundations.
- Confirmed the expanded authentication and CRUD foundation builds successfully.
- Implemented Materials CRUD, keyword/subject/category filtering, Multer upload validation, protected download, and ownership checks.
- Implemented Downloads history for the authenticated user.
- Mapped and documented 20 REST API requests.
- Added ERD, architecture diagram, documentation source, Postman collection, presentation content, video script, defense Q&A, test report, and submission checklist under `deliverables`.
- Validated the Postman collection as JSON with 20 request items.
- Confirmed the complete backend build succeeds after Materials and Downloads implementation.
- Added a manual, idempotent demo Teacher seed command that requires a local environment password.
- Verified the running API: root HTTP 200, login/profile success, authenticated lists for subjects/categories/materials/downloads, and no-token profile HTTP 401.

## Pending tasks

- Configure environment variables and database connection.
- Complete final evidence and packaging: full Postman execution, SQL export, Git history, GitHub link, PDF conversion, and presentation file.
- Configure authentication, authorization, uploads, downloads, and download history.
- Create the MySQL database and seed demo accounts after permission and credential confirmation.
- Create and run API tests.
- Create the Postman collection and project deliverables.
- Initialize Git and create commits after confirmation.

## Current errors and warnings

- The `mysql` command is not currently available in the system PATH, although the MySQL84 service is running.
- npm reported that bcrypt install scripts require review; the application build currently succeeds.
- Database credentials have not yet been provided, so runtime database testing is pending.
- The actual SQL export and external GitHub/video links are still pending personal/external actions.
- The demo Teacher seed has not been executed because `DEMO_TEACHER_PASSWORD` is intentionally not set in source-controlled files.

## Solutions applied

- Used `npm.cmd` instead of PowerShell `npm` scripts.
- Used escalated network permission to download npm packages after the restricted cache was unavailable.

## Test results

- Initial NestJS build: PASS
- TypeScript/NestJS build after auth and CRUD foundation: PASS
- TypeScript/NestJS build after Materials and Downloads: PASS
- Postman collection JSON validation: PASS (20 request items)
- Runtime route smoke tests: PASS (root, login, profile, protected lists, no-token rejection)
- Frontend interface: intentionally not included; project remains Postman-tested backend per instructor requirements.
- MySQL connection: PENDING
- API endpoint tests: PENDING

## Next steps

1. Add configuration and environment template files.
2. Implement the database entities and application modules.
3. Build and test after each major implementation phase.

## Personal action required

- Provide local MySQL credentials only when database configuration is ready; do not commit real credentials.
- Provide student name, GitHub URL, video URL, and instructor collaboration details later if required for final documentation.

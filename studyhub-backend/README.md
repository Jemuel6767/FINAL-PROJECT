# StudyHub

StudyHub is a learning materials sharing system. Teachers upload and manage their own course files; students browse and download resources. This repository uses a NestJS API and a responsive web interface served by the same application.

## Stack

- NestJS 12, TypeScript, Node.js 24.7 or newer (native Argon2id support)
- MySQL 8+ with TypeORM
- HTML, CSS, and browser JavaScript frontend in `public/`
- JWT access tokens with 15 minute expiry

## Database setup

1. Create a MySQL user/database or use a local MySQL account.
2. Copy `.env.example` to `.env` and set the database credentials and a long random `JWT_SECRET`.
3. This version uses a separate database named `studyhub_v2` so the earlier plural-table schema and its data remain untouched. If you already have an older StudyHub database, keep it and use `DB_NAME=studyhub_v2` for this version.
4. Run `npm run db:setup` to apply `database/studyhub-schema.sql` to MySQL. It creates missing tables and does not drop existing rows.
5. Run `npm install`, then `npm run seed:demo` to create the demo Teacher and Student, sample subjects/categories, a private sample PDF, and a download history row.
6. Start the application with `npm run start:dev` and open `http://localhost:3000`.

The seed uses `DEMO_TEACHER_EMAIL` / `DEMO_TEACHER_PASSWORD` and `DEMO_STUDENT_EMAIL` / `DEMO_STUDENT_PASSWORD` from `.env`. Use throwaway local passwords; the seed never prints them. The credentials in `.env.example` are placeholders and must be replaced before seeding. Students may also register from the sign-in page. Teacher accounts are created only through the trusted seed/setup process; there is no public teacher registration.

TypeORM schema synchronization is disabled to prevent the app from changing existing data. Apply the SQL schema explicitly before seeding or starting the app. Do not point production data at a development database.

## Environment variables

See `.env.example` for all names. `JWT_SECRET` must be a high-entropy secret. `UPLOAD_DIR` defaults to `storage/private`, outside the static `public/` directory. Files are limited to 10 MB by default and must be real PDF, DOCX, or PPTX files. Keep `storage/` private and backed up as appropriate.

## Run

```powershell
npm install
npm run db:setup
npm run seed:demo
npm run start:dev
```

Open `http://localhost:3000`. The web app supports Teacher sign-in, Student sign-in/registration, dashboards, material search/filter, uploads, edits, deletion, secure download, and student download history. The backend API is under `/api/v1`; `/api/v1/health` is a basic health response.

## API

Except for login and student registration, API endpoints require `Authorization: Bearer <access_token>`. JSON fields use camelCase. Login returns HTTP 200 and registration returns HTTP 201. Password hashes and private file paths are never included in API responses.

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Sign in with teacher or student account |
| POST | `/api/v1/auth/register` | Public | Register a Student account only |
| POST | `/api/v1/auth/logout` | Signed in | Revoke the current token (204) |
| GET | `/api/v1/users/{userId}` | Own account | View own profile |
| GET | `/api/v1/subjects` | Signed in | List subjects |
| PUT | `/api/v1/subjects/{subjectId}` | Teacher | Update subject code/name |
| GET | `/api/v1/categories` | Signed in | List categories |
| GET | `/api/v1/learning-materials` | Signed in | Browse/search/filter materials (`search`, `subjectId`, `categoryId`) |
| GET | `/api/v1/learning-materials/deletable` | Teacher | List only your materials with no download records, for choosing a safe delete target |
| POST | `/api/v1/learning-materials` | Teacher | Upload a material as multipart form data |
| PATCH | `/api/v1/learning-materials/{materialId}` | Original teacher | Update title, description, subject, or category |
| DELETE | `/api/v1/learning-materials/{materialId}` | Original teacher | Delete material (409 if download history references it) |
| GET | `/api/v1/users/{userId}/downloads` | Own account | View own download history |
| GET | `/api/v1/learning-materials/{materialId}/download` | Signed in | Supporting secure file-delivery route; records successful downloads |

Upload fields: `title`, `description` (optional), `subjectId`, `categoryId`, and `file`. Select multipart/form-data in Postman. Supported file extensions and content: `.pdf`, `.docx`, `.pptx`.

Sample login JSON:

```json
{
  "email": "teacher@example.com",
  "password": "<DEMO_TEACHER_PASSWORD from your local .env>"
}
```

Use the credentials configured in your own `.env`; never commit `.env` or send its password to anyone. The Postman collection and environment are in `deliverables/StudyHub_Postman_Collection.json` and `deliverables/StudyHub_Postman_Environment.postman_environment.json`.

## Roles and security

- **Teacher:** view own profile; read subjects/categories/materials; update subjects; upload, edit, and delete only materials they uploaded; view own download history.
- **Student:** view own profile; browse subjects/categories/materials; download materials; view own download history. Students cannot upload, edit, or delete materials.

The server derives permissions from the verified account, never a client-supplied role. Passwords use Argon2id. JWT signature, issuer, audience, algorithm, and expiration are checked. Logout revocations are stored under the private upload directory until token expiry. Login attempts are limited per IP/email. Uploads are content-checked, assigned random server filenames, and stored outside the static web root. Use HTTPS and a durable private storage location in production. If available, add malware scanning before enabling public uploads.

## Database entities

The five business tables match Laboratory Activity 04: `User`, `Subject`, `Category`, `LearningMaterial`, and `Download`. Their fields and foreign keys are defined in `database/studyhub-schema.sql`; the visual ERD source is `deliverables/StudyHub_ERD.dbml`.

# StudyHub Backend

StudyHub is a NestJS backend prototype for managing learning materials for teachers and students.

## Technology stack

- NestJS and TypeScript
- TypeORM and MySQL
- JWT and bcrypt
- class-validator and Multer
- Postman and Git

## Setup

1. Install Node.js and MySQL Server.
2. Create the database:

```sql
CREATE DATABASE studyhub_db;
```

3. Copy `.env.example` to `.env` and set local MySQL credentials. Never commit `.env`.
4. Install packages:

```powershell
npm.cmd install
```

5. Run the backend:

```powershell
npm.cmd run start:dev
```

The server runs at `http://localhost:3000`.

## Optional demo teacher seed

Set `DEMO_TEACHER_PASSWORD` in the local `.env`, then run this manual command once:

```powershell
npm.cmd run seed:demo
```

The seed is safe to rerun and will not overwrite an existing teacher account. Never put a real personal password in source control.

## Demo API flow

Register or log in at `/auth/register` or `/auth/login`, then send the returned token as `Authorization: Bearer TOKEN`.

The API includes 20 routes across authentication, subjects, categories, materials, and downloads. Import `deliverables/StudyHub_Postman_Collection.json` into Postman for request templates.

## Security

Passwords are hashed with bcrypt. JWT and role guards protect routes. Students cannot create or modify teacher-managed resources. Teachers can modify only their own materials. Uploads are restricted to PDF, DOCX, PPTX, and TXT files with a configured size limit.

## Project files

See `deliverables/` for the ERD, architecture diagram, documentation source, Postman collection, testing report, video script, defense questions, and submission checklist.

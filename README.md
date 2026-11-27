# StudyHub

StudyHub is a learning materials sharing system. Teachers upload and manage learning resources; students browse and download them.

## Tech stack

- NestJS 12 and TypeScript for the REST API
- MySQL 8+ with TypeORM
- HTML, CSS, and JavaScript for the responsive web interface
- JWT authentication and Argon2id password hashing

## Run locally

Requirements: Node.js 24.7+, npm, and MySQL.

1. Open the `studyhub-backend` folder.
2. Copy `.env.example` to `.env`, then set your MySQL credentials, a strong `JWT_SECRET`, and demo teacher/student passwords.
3. Run:

   ```powershell
   npm install
   npm run db:setup
   npm run seed:demo
   npm run start:dev
   ```

4. Open `http://localhost:3000` for the web app. The API uses the `/api/v1` prefix.

See [`studyhub-backend/README.md`](studyhub-backend/README.md) for database details, credentials setup, API routes, and role permissions. Never commit `.env` or real credentials.

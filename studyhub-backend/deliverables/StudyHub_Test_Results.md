# StudyHub Test Results

## Executed evidence

| Test | Result | Evidence |
|---|---|---|
| `npm.cmd run build` | PASS | Build completed with 0 TypeScript errors. |
| MySQL connection | PASS | Nest TypeORM module initialized successfully. |
| `GET /` | PASS | HTTP 200 and `Hello World!`. |
| `POST /auth/register` | PASS | Returned a JWT and student user. |
| `POST /auth/login` | PASS | Returned a JWT. |
| `GET /auth/profile` with JWT | PASS | Returned the authenticated student profile without password. |
| Route mapping | PASS | Nest startup mapped the required auth, subject, category, material, and download routes. |
| `GET /subjects` with JWT | PASS | Returned an empty list before seed data. |
| `GET /categories` with JWT | PASS | Returned an empty list before seed data. |
| `GET /materials` with JWT | PASS | Returned an empty list before uploads. |
| `GET /downloads` with JWT | PASS | Returned an empty list before downloads. |
| `GET /auth/profile` without JWT | PASS | Returned HTTP 401 Unauthorized. |
| Postman collection JSON parsing | PASS | Collection contains 20 request items. |

## Pending evidence

- Full Postman collection run.
- Teacher seed/login evidence.
- Material upload and download evidence.
- Download-history evidence.
- SQL export verification.
- Demo teacher seed execution after a local `DEMO_TEACHER_PASSWORD` is supplied.
- Representative screenshots.

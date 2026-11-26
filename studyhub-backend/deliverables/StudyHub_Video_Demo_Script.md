# StudyHub Video Demonstration Script (5–10 minutes)

1. **Start (30 seconds):** Open the backend folder, run `npm.cmd run start:dev`, and show `Found 0 errors` and `Nest application successfully started`.
2. **Login (60 seconds):** In Postman, run `POST /auth/login`. Explain that the response contains a JWT token.
3. **CRUD demonstration (3 minutes):** Use teacher authentication to create a subject or category, retrieve it, update it with PATCH, and delete it. Show the status codes and response bodies.
4. **Code walkthrough (90 seconds):** Open the controller, service, entity, and module. Explain how the request moves from Postman to the controller, guards, service, TypeORM repository, MySQL, and back.
5. **Security test (30 seconds):** Remove the Authorization header and call `/auth/profile`. Show the 401 rejection.
6. **Database check (60 seconds):** Open MySQL and show that the Postman CRUD operations are reflected in the tables.
7. **Closing (30 seconds):** Summarize the working features and mention limitations honestly.

Do not claim an action was successful unless it is visible in the recording.

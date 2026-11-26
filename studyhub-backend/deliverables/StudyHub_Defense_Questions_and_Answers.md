# StudyHub Defense Questions and Simple Answers

1. **What is StudyHub?** A backend system for managing and sharing learning materials.
2. **Who uses it?** Teachers and students.
3. **Why NestJS?** It provides organized modules, dependency injection, guards, and controllers.
4. **Why TypeScript?** Types make the code easier to maintain and explain.
5. **Why MySQL?** It is a relational database suitable for structured academic records.
6. **What is TypeORM?** An ORM that maps TypeScript entities to database tables.
7. **What is REST?** An approach that exposes resources through HTTP methods and URLs.
8. **What is CRUD?** Create, Read, Update, and Delete.
9. **What does JWT do?** It proves that a request has an authenticated user.
10. **Where is the password stored?** Only as a bcrypt hash.
11. **Why hash passwords?** A hash prevents the original password from being stored directly.
12. **What is authentication?** Checking who the user is.
13. **What is authorization?** Checking what the authenticated user may do.
14. **What is a guard?** NestJS code that can allow or reject a request before the controller.
15. **Why are routes protected?** Learning materials and user data should not be publicly changed.
16. **What is a DTO?** A class that defines and validates expected input.
17. **What is a primary key?** A unique identifier for a row.
18. **What is a foreign key?** A column that references a row in another table.
19. **Why separate Subjects and Categories?** They are reusable normalized reference data.
20. **What is the Material owner rule?** A teacher can modify only materials that teacher owns.
21. **Can students upload files?** No. Teacher-only roles protect upload, update, and delete routes.
22. **How are files validated?** The upload filter checks allowed extensions, MIME types, and size.
23. **How is downloading recorded?** A Download row is saved after the file path is verified.
24. **What happens without a JWT?** The protected route returns 401 Unauthorized.
25. **What happens with the wrong role?** The route returns 403 Forbidden.
26. **What does HTTP 404 mean?** The requested record or file was not found.
27. **What does HTTP 409 mean?** A conflict, such as a duplicate unique value.
28. **What is the repository layer?** The TypeORM data-access layer used by services.
29. **What is a limitation?** The current prototype has no frontend and requires local configuration.
30. **What would you improve?** Add a frontend, cloud storage, refresh tokens, and stronger audit logging.

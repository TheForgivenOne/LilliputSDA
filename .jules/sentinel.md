## 2025-05-15 - [Privilege Escalation via Default Admin Role]
**Vulnerability:** Every newly registered user was automatically assigned the 'admin' role, granting full administrative access to the application.
**Learning:** This occurred because the Prisma schema default for the `role` field was set to "admin", and the registration API route explicitly set the role to "admin" during user creation.
**Prevention:** Always default new users to the least privileged role ("user"). Ensure that administrative roles can only be granted by existing administrators through a controlled process, rather than being the default for self-registration.

## 2025-05-15 - [Insecure Middleware and Missing RBAC]
**Vulnerability:** The application had an authentication check in middleware but lacked Role-Based Access Control (RBAC). Any authenticated user could access `/admin` routes.
**Learning:** Authentication (who are you?) is not Authorization (what can you do?). Middleware was only checking for a valid session, not the user's role. Additionally, the role was not being persisted in the session cookie, making it inaccessible to the middleware.
**Prevention:** Implement RBAC by checking both authentication and user roles in middleware for sensitive routes. Ensure the user's role is persisted in the session (JWT/Session callbacks in NextAuth) to enable efficient authorization checks at the edge.

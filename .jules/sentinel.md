## 2025-05-22 - Default Admin Privilege Escalation
**Vulnerability:** Every new user registered via the `/api/auth/register` endpoint was automatically assigned the "admin" role, and the database schema default for the "role" field was also set to "admin". Additionally, the application lacked active middleware to enforce role-based access control (RBAC).

**Learning:** Authentication is not authorization. Even if a route is "protected" by requiring a session, failing to check the user's role allows any authenticated user to perform administrative actions. Relying on default values for sensitive fields like "role" can lead to accidental privilege escalation if the application logic doesn't explicitly override them.

Next.js Middleware must be correctly named `middleware.ts` in the `src/` directory (or root) to be recognized by the framework. Furthermore, ensuring that the `role` property is correctly propagated from the database to the JWT token and session object in NextAuth.js is essential for implementing RBAC in middleware and throughout the application.

**Prevention:**
1. Always use "least privilege" by default (e.g., default role should be "user" or "guest").
2. Explicitly set roles during user creation rather than relying on database defaults for security-critical fields.
3. Use correctly named framework-standard middleware (`middleware.ts`) to enforce routing protection.
4. Implement role-based access control (RBAC) by verifying the user's role in the session object.
5. Configure authentication providers to include necessary authorization metadata (like roles) in the session.

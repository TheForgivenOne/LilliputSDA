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

## 2025-05-23 - Staff API PII Leak and Broken Access Control
**Vulnerability:** The `/api/staff/[id]` endpoint was publicly accessible and leaked sensitive PII (phone numbers) and inactive staff records. Conversely, the `/api/staff` list endpoint was overly restricted (admin only), preventing the public "About" page from displaying the staff directory.

**Learning:** Publicly accessible endpoints for models containing sensitive data (like PII) must implement field-level authorization. Relying on simple path-based middleware protection is insufficient if the endpoint itself doesn't differentiate responses based on the user's role. Field whitelisting (using Prisma's `select`) is a robust "secure by default" approach to prevent accidental data exposure.

**Prevention:**
1. Implement role-based field filtering (whitelisting) for all public-facing API endpoints that return models with sensitive fields.
2. Ensure that "soft-deleted" or "inactive" records are explicitly filtered out for non-administrative users.
3. Align API access control with the intended visibility of the frontend (e.g., if a page is public, its supporting list API should also be public but secured).

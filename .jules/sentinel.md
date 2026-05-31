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

## 2025-05-23 - Password Complexity Enforcement Gap
**Vulnerability:** The application's registration endpoint (`/api/auth/register`) only enforced a minimum password length of 6 characters, despite project documentation suggesting much stricter requirements (8-100 characters with mixed case and numbers). This allowed users to create weak accounts susceptible to brute-force attacks.

**Learning:** Documentation and memory can diverge from reality. Security-critical validation must be centralized and unit-tested independently to ensure consistency across the application. Relying on manual length checks in route handlers is error-prone and leads to inconsistent security postures.

**Prevention:**
1. Centralize all validation logic in a dedicated utility (e.g., `src/lib/validation.ts`).
2. Implement and enforce a comprehensive `validatePassword` function that checks for length, casing, and numeric requirements.
3. Add unit tests specifically for validation utilities to prevent regressions.
4. Always verify that actual implementation matches security specifications recorded in project documentation.

## 2025-05-24 - RBAC for Inactive Records and IDOR Prevention
**Vulnerability:** The SiteContent and Testimonials APIs allowed unauthenticated users to access "inactive" records. While the collection routes (GET /api/site-content) leaked all records, the item routes (GET /api/site-content/[id]) allowed users to view hidden content if they knew or guessed the ID (a form of IDOR/Information Exposure).

**Learning:** "Inactive" or "Draft" flags must be enforced at the API level for all read operations, not just the primary listing. Furthermore, Prisma 7's `findUnique` does not support filtering by non-unique fields (like `isActive`). To enforce RBAC while fetching by ID, `findFirst` must be used instead to allow combining the unique ID with the `isActive` status check for non-admin users.

**Prevention:**
1. Always apply `isActive: true` (or equivalent) filters in both collection and item GET handlers for non-privileged users.
2. Ensure administrators have a way to see inactive content for preview/management purposes by making the filter conditional on the user's role.
3. Use `prisma.findFirst` when you need to query by a unique ID AND an additional non-unique property (like a visibility flag) to avoid TypeScript errors in Prisma 7.
4. Add security tests that specifically attempt to access inactive records as an unauthenticated user via both collection and item routes.

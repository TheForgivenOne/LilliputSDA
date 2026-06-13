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

## 2025-05-24 - API Information Leak via Missing Visibility Filters
**Vulnerability:** Several API routes (Testimonials, SiteContent, and Announcements) lacked consistent role-based visibility filtering. While some collection routes filtered for `isActive: true`, their corresponding detail routes (`/api/.../[id]`) did not, allowing unauthenticated users to access hidden or expired records if they knew the ID (IDOR). Additionally, some collection routes (SiteContent) were leaking inactive records entirely.

**Learning:** IDOR vulnerabilities often exist in detail routes even when collection routes are properly filtered. Security filters must be applied consistently across all access patterns (lists and direct lookups). In Prisma, `findUnique` cannot be used with non-unique filters like `isActive`; `findFirst` is required to combine unique IDs with visibility constraints.

**Prevention:**
1. Always apply the same visibility and authorization filters to both collection and detail routes.
2. For direct object references, use `findFirst` (or equivalent) to include status checks (e.g., `isActive: true`, `expiresAt` checks) in the query itself.
3. Implement automated tests that specifically attempt to access inactive or restricted records via direct IDs to detect IDOR/Visibility gaps.
4. Ensure that administrators retain full access by using conditional query parameters based on the authenticated user's role.

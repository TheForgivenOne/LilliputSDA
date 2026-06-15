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

## 2025-06-12 - Announcements Information Disclosure and Rate Limiting Gap
**Vulnerability:** The Announcements API lacked both Role-Based Access Control (RBAC) for expired records and rate limiting. Non-admin users could access expired announcements via direct ID lookups or the collection endpoint, and the API was susceptible to DoS or scraping due to missing rate limits.

**Learning:** Securing some resources (like Staff or Testimonials) doesn't guarantee others are safe. Each new public-facing entity must be audited for both visibility logic (least privilege) and resource protection (rate limiting). "Expired" or "Inactive" flags are security boundaries, not just UI filters.

**Prevention:**
1. Apply a "Security Checklist" for every new API route: Auth, RBAC, Input Validation, Rate Limiting, and PII Filtering.
2. Ensure that "Detail" routes (`/[id]`) implement the same visibility filters as "List" routes to prevent IDOR/Information Disclosure.
3. Centralize rate-limiting definitions to make them easy to apply to new endpoints.
4. Use dedicated security tests to verify visibility boundaries for different user roles.

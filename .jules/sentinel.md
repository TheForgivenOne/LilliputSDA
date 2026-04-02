## 2025-05-15 - Default Admin Role Privilege Escalation
**Vulnerability:** New users were automatically assigned the 'admin' role upon registration.
**Learning:** This occurred because the default value for the `role` field in the Prisma schema was set to 'admin', and the registration route explicitly assigned 'admin' to all new users. This bypasses the intended Role-Based Access Control (RBAC) and exposes administrative functionalities to anyone who creates an account.
**Prevention:** Always default to the least privileged role (e.g., 'user') in the database schema and in registration logic. Administrative privileges should be granted manually by existing administrators or through a secure, verified process.

## 2025-05-15 - Missing Rate Limiting on Authentication Endpoints
**Vulnerability:** The login and registration API endpoints lacked rate limiting, making them susceptible to brute-force and credential stuffing attacks.
**Learning:** Sensitive endpoints like authentication require dedicated protection layers to mitigate automated attacks, even when using modern frameworks like Next.js.
**Prevention:** Implement sliding-window rate limiting on all authentication and other high-sensitivity endpoints using reliable utilities like `@upstash/ratelimit`.

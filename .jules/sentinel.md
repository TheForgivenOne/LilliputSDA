## 2025-05-22 - [Privilege Escalation via Default Admin Role]
**Vulnerability:** New users were automatically assigned the "admin" role upon registration.
**Learning:** The Prisma schema and registration API route both defaulted the `role` field to "admin", allowing any new user to gain administrative privileges.
**Prevention:** Always default user roles to the least privileged level ("user") in both the database schema and application logic.

## 2025-05-22 - [Missing Rate Limiting on Sensitive Endpoints]
**Vulnerability:** Login, registration, and contact form endpoints lacked rate limiting, making them susceptible to brute-force and spam attacks.
**Learning:** Critical entry points were exposed without any mechanism to throttle excessive requests from a single source.
**Prevention:** Implement rate limiting using a centralized utility (like `@upstash/ratelimit`) on all sensitive public-facing endpoints.

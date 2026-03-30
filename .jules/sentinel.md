## 2025-05-22 - [Privilege Escalation via Default Roles]
**Vulnerability:** New users were automatically assigned the "admin" role upon registration.
**Learning:** Defaulting to the highest privilege level is a common but dangerous pattern, especially during rapid development or transitions between auth providers.
**Prevention:** Always follow the principle of least privilege. Default roles should be the most restrictive possible.

## 2025-05-22 - [Inactive Middleware Protection]
**Vulnerability:** A route protection file named `src/proxy.ts` existed but was not being executed because Next.js expects `src/middleware.ts`.
**Learning:** Misnaming core configuration files can lead to a false sense of security where protection logic exists in the codebase but is not actually applied at runtime.
**Prevention:** Verify that security middleware is actually intercepting requests (e.g., via logging or automated tests). Stick to framework-standard naming conventions.

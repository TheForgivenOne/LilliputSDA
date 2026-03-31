## 2025-05-15 - [Privilege Escalation and Missing RBAC in NextAuth v5]
**Vulnerability:** New users were assigned the 'admin' role by default, and there was no Role-Based Access Control (RBAC) enforced in the middleware, allowing any authenticated user to access administrative routes.
**Learning:** Defaulting roles to 'admin' and failing to persist those roles in the NextAuth session object created a major security gap. NextAuth v5 requires explicit `jwt` and `session` callbacks to propagate custom user fields like `role`.
**Prevention:** Always default to the least privileged role ('user') and strictly enforce RBAC in the middleware by checking the session user's role against protected route patterns.

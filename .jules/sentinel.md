## 2025-05-15 - [Privilege Escalation via Default Admin Role]
**Vulnerability:** Every newly registered user was automatically assigned the 'admin' role, granting full administrative access to the application.
**Learning:** This occurred because the Prisma schema default for the `role` field was set to "admin", and the registration API route explicitly set the role to "admin" during user creation.
**Prevention:** Always default new users to the least privileged role ("user"). Ensure that administrative roles can only be granted by existing administrators through a controlled process, rather than being the default for self-registration.

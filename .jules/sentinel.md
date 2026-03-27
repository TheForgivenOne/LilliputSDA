## 2024-05-22 - [Fixed Default Privilege Escalation]
**Vulnerability:** Default admin role for new users.
**Learning:** Both the Prisma schema and the registration API logic were hardcoded to grant "admin" privileges to every new user by default. This allowed any user who registered to access the entire administrative dashboard and manage church resources (events, announcements, staff, etc.) without any authorization check or invitation system.
**Prevention:** Always follow the Principle of Least Privilege. Default roles for user registration should be "user" or "pending," and administrative access should only be granted explicitly by an existing administrator or through a controlled configuration.

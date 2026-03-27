## 2025-05-14 - [Critical] Unprotected Public Registration Endpoint
**Vulnerability:** A public registration endpoint (`/api/auth/register`) was active and automatically assigned the "admin" role to any newly created user. This allowed anyone to create an administrative account and gain full access to the CMS.
**Learning:** Legacy or boilerplate registration code can leave backdoors if not explicitly disabled or secured with invitation codes/manual approval. Defaulting to "admin" role in a public endpoint is a high-risk pattern.
**Prevention:** Disable public registration in production unless specifically required. Always use the principle of least privilege for default roles.

## 2025-05-14 - [Defense in Depth] Brute-force Protection for Login
**Vulnerability:** The login endpoint (`/api/auth/login`) lacked rate limiting, making it susceptible to brute-force and credential stuffing attacks.
**Learning:** Authentication endpoints are primary targets. Even with strong passwords, lack of rate limiting allows for high-velocity automated attacks.
**Prevention:** Implement sliding-window rate limiting on all authentication and sensitive endpoints (email, password reset, etc.) using a reliable store like Redis.

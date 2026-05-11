# Security Policy

## Reporting a Vulnerability

To report a security vulnerability, please use the **Private vulnerability reporting** feature on GitHub:

1. Go to https://github.com/TheForgivenOne/LilliputSDA/security/advisories
2. Click **New draft security advisory**
3. Provide a detailed description of the vulnerability

You can expect an acknowledgment within 48 hours.

## Supported Versions

Only the latest deployed version on `main` is supported with security updates.

## Scope

- Authentication bypass
- SQL injection
- XSS vulnerabilities
- Privilege escalation
- Data exposure

## Out of Scope

- Dependencies with known CVEs that are not exploitable in our deployment context
- Rate limiting concerns on public forms (these are addressed by Upstash Redis)
- Missing security headers (these are set in `next.config.ts`)
# Lilliput SDA Church Website — Documentation

Welcome to the developer documentation for the Lilliput Seventh-day Adventist Church website.

## Quick Links

- [Getting Started](./getting-started/installation.md) — Clone, install, and run the project
- [Architecture Overview](./architecture/overview.md) — System design and component relationships
- [Tech Stack](./architecture/tech-stack.md) — Deep-dive into each technology
- [Project Structure](./architecture/project-structure.md) — File and folder organization
- [Public Pages](./features/public-pages.md) — Public-facing site features
- [Admin CMS](./features/admin-cms.md) — Content management system guide
- [Inline Editing](./features/inline-editing.md) — How inline CMS editing works
- [Authentication](./features/authentication.md) — Clerk auth setup and flows
- [Database Schema](./backend/schema.md) — Convex database tables and indexes
- [Queries & Mutations](./backend/queries-mutations.md) — Backend API reference
- [Backend Auth](./backend/auth.md) — Convex authentication configuration
- [Scripture API](./api/scripture.md) — Bible verse search endpoint
- [YouTube API](./api/youtube.md) — Sermon video integration
- [Testing](./guides/testing.md) — Playwright E2E testing guide
- [Deployment](./guides/deployment.md) — Vercel and Convex deployment
- [Contributing](./guides/contributing.md) — Development workflow and standards
- [Design System](./design/design-system.md) — Color palette, typography, components

## Project Summary

The Lilliput SDA Church website is a Next.js 16 application with:

- **Public site**: Home, About, Ministries, Events, Media, Contact, Decision Card pages
- **Admin dashboard**: Manage events, announcements, staff, ministries, media, and pages
- **Inline CMS**: Editable text and images directly on public pages
- **Convex backend**: Real-time database with TypeScript queries and mutations
- **Clerk authentication**: Secure admin access with role-based permissions
- **YouTube integration**: Sermon videos streamed from the Lilliput SDA Media channel
- **Automated testing**: Playwright cross-browser E2E tests in CI/CD

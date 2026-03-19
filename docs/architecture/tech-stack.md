# Technology Stack

## Frontend

### Next.js 16

The React framework powering the entire application.

- **App Router**: File-based routing in `src/app/`
- **Server Components**: Default for pages; reduce client-side JavaScript
- **Server Actions**: Not used; all mutations go through Convex
- **Middleware**: `src/proxy.ts` handles Clerk auth routing
- **Image Optimization**: Built-in `<Image>` component with remote pattern support

### React 19

UI library with concurrent features. Used for both Server and Client components.

### Tailwind CSS 4

Utility-first CSS framework. Design tokens defined in `src/styles/tokens.css`.

### Framer Motion 12

Animation library for micro-interactions, page transitions, and scroll animations.

### Lucide React

Icon library. Consistent stroke-based icons across the UI.

## Backend

### Convex

The backend-as-a-service database and API layer.

- **Database**: TypeScript-defined schema in `convex/schema.ts`
- **Queries**: Read functions with automatic caching and real-time subscriptions
- **Mutations**: Write functions with ACID transactions
- **Storage**: File uploads via Convex storage
- **Auth**: Clerk integration via `convex/auth.config.ts`
- **Indexes**: Defined per table for efficient queries

### Convex Tables

| Table | Purpose |
|-------|---------|
| `events` | Church calendar events |
| `sermons` | Sermon metadata (YouTube-linked) |
| `announcements` | News and announcements |
| `prayerRequests` | Prayer request submissions |
| `staff` | Church leadership and pastoral staff |
| `ministries` | Ministry listings with leaders |
| `contactSubmissions` | Contact form entries |
| `pageSections` | CMS editable content blocks |
| `siteSettings` | CMS key-value settings |
| `media` | CMS media library |
| `cmsUsers` | CMS role-based user access |

## Authentication

### Clerk

Managed authentication service.

- **Sign-in/Sign-up**: Pre-built React components from `@clerk/nextjs`
- **Middleware protection**: `src/proxy.ts` with `clerkMiddleware`
- **User roles**: Stored in Convex `cmsUsers` table (viewer, editor, admin)
- **Organizations**: Not currently used
- **Convex integration**: Clerk token validated in Convex via `auth.config.ts`

## External Integrations

### YouTube Data API v3

Sermon video integration on the Media page.

- Channel: [@lilliputsdamedia](https://www.youtube.com/@lilliputsdamedia)
- Channel ID: `UC5PpTmwN_ZUyM1xgwQR-_8w`
- Endpoint: `GET /api/youtube/videos`
- Caching: 5-minute server-side cache

### Scripture Search

Local Bible search using a bundled JSON file (`public/scriptures.json`).

- Endpoint: `GET /api/scripture?q=<query>`
- Caching: 1-hour in-memory cache
- Data source: KJV translation

## Deployment

### Vercel

Primary deployment platform.

- Framework: Next.js with Turbopack
- Environment variables: Set in Vercel dashboard
- Automatic deployments: GitHub integration on push to main
- Preview deployments: One per pull request

### GitHub Actions

CI/CD pipelines in `.github/workflows/`:

- `ci.yml` — Lint, typecheck, build
- `browser-test.yml` — Playwright cross-browser tests
- `performance.yml` — Lighthouse CI (optional)
- `release.yml` — Automated releases (optional)
- `security.yml` — Security scanning (optional)

## Development Tools

### Playwright

End-to-end testing framework.

- Tests in `tests/` directory
- Cross-browser: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Configuration in `playwright.config.ts`

### TypeScript

Strict mode enabled. No `any` types allowed (use `unknown` instead).

### ESLint

Linting via `eslint-config-next`. Custom rules can be added to `eslint.config.mjs`.

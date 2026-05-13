# Agent Guidelines — Lilliput SDA

## Stack

Next.js 16 (App Router) / TypeScript / Tailwind CSS 4 / Prisma (Neon PostgreSQL) / NextAuth.js v5

## Commands

```bash
npm run dev            # next dev --webpack (port 3000)
npm run build          # prisma generate && next build --webpack
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run test           # vitest run
npm run test:coverage  # vitest run --coverage
npx playwright test                  # E2E tests (requires npm run start)
npx playwright test tests/e2e/foo    # Single E2E test file
```

- Pre-commit hook (husky): `npm run lint -- --fix && npm run typecheck`
- Run `npm run prepare` after clone: `husky && prisma generate`

## Architecture

- **Middleware**: `src/proxy.ts` (NOT `src/middleware.ts`). Run on all routes except `/api`, `/_next/static`, etc.
- **Styling**: Tailwind v4 CSS-based config via `@theme inline` in `src/app/globals.css`. No `tailwind.config.ts`.
  - Standard Tailwind colors are **remapped** to Vesper hues (e.g. `bg-orange-500` = indigo `#5B4FA0`). Dark mode uses `prefers-color-scheme` (not class-based).
  - Design tokens in both `globals.css` (`@theme inline`) and `src/styles/tokens.css` (standalone CSS vars). Both resolve to same values.
- **Auth**: NextAuth.js v5, Credentials provider, JWT strategy. Roles (`user`/`admin`) propagated via JWT callbacks in `src/auth.ts`.
- **Admin**: Dashboard at `/dashboard`. Protected by middleware and `adminGuard()` in `src/lib/auth.ts`.
- **Rate limiting**: Upstash Redis via `@upstash/ratelimit`. Limiters in `src/lib/rate-limit/limiters.ts`. Optional — skipped when Redis is not configured.

## Testing

- **Unit tests**: Vitest with jsdom. Files in `src/__tests__/*.test.{ts,tsx}` or alongside source.
- **E2E tests**: Playwright in `tests/e2e/`. Require a running production build (`npm run start`), not dev server.
- Playwright config and fixtures likely in `playwright.config.ts`.

## Environment

```
DATABASE_URL           # Neon PostgreSQL
AUTH_SECRET            # NextAuth
YOUTUBE_API_KEY        # Media/sermons page
RESEND_API_KEY         # Email (contact/prayer forms)
UPSTASH_REDIS_REST_URL # Rate limiting (optional)
UPSTASH_REDIS_REST_TOKEN
```

Build succeeds without `DATABASE_URL` (falls back gracefully), but full build requires all secrets.

## CI/CD

4 sequential gates in CI: `lint+typecheck` → `unit tests` → `build` → `cross-browser tests` (each rebuilds independently). Deploys to Vercel on `main` push. Failed workflows auto-create issues with label `opencode-fix` — opencode auto-fixes them.

## Git Workflow

- Branch from `develop`, PR into `develop`. `main` is production (protected).
- Branch naming: `feature/<name>`, `bugfix/<name>`, `hotfix/<name>`.
- PRs target `develop`, never `main`. Merged feature branches should be deleted.

### Commit style

Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `test:`.

## Gemini Code Assist

Auto-reviews every PR at MEDIUM threshold. Tag `@gemini-code-assist` or comment `/gemini review` for re-review. Config in `.gemini/config.yaml`.

## Style Guide

`.gemini/styleguide.md` defines code review priorities (security, maintainability, performance, accessibility) and conventions — follow these when writing code.

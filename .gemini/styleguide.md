# Lilliput SDA — Code Review Style Guide

This style guide instructs Gemini Code Assist how to review pull requests for the Lilliput SDA church website.

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Prisma/Neon PostgreSQL, NextAuth.js v5, Resend, Upstash Redis.

## Code Review Priorities

### Correctness
- Code functions as intended; handles edge cases
- No logic errors, race conditions, or incorrect API usage
- Form validation and error handling are present

### Security
- No hardcoded secrets, API keys, or credentials
- Input validation on all public forms (contact, prayer, decision)
- Environment variables used for all secrets
- No `any` types — use `unknown` or proper types

### Maintainability
- Follow existing import order: React → external → `@/*` → types
- Component files: default export for pages, named for utilities
- No unnecessary comments — code should be self-documenting
- Consistent naming: camelCase for vars/functions, PascalCase for components

### Performance
- Avoid barrel imports from large libraries
- Lazy load heavy components with `next/dynamic`
- Use `React.cache()` for server-side deduplication
- Minimize serialization across RSC boundaries

### Accessibility
- Semantic HTML elements
- aria labels where appropriate
- Keyboard navigation works
- Color contrast meets WCAG standards

## Styling Conventions

- Colors: `amber` (primary), `stone` (neutral), `orange` (terracotta)
- Dark mode: `dark:text-stone-100`, `dark:bg-stone-800`
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Tailwind only — no inline styles

## Git Workflow

- `main` — production (protected, no direct commits)
- `develop` — integration branch
- `feature/<name>` — branch from `develop`
- `bugfix/<name>` — branch from `develop`
- PRs target `develop`, never `main`

## Commit Message Format

```
feat: add prayer request form
fix: correct date formatting on events page
docs: update README
style: adjust card spacing in media grid
refactor: extract email utility into lib/email
chore: add husky pre-commit hook
test: add Playwright tests for contact form
```

## Severity Levels for Review Comments

- **Critical**: Security vulnerability, data loss risk, broken production
- **High**: Bug, incorrect behavior, violated conventions
- **Medium**: Minor issues, maintainability, style violations (default threshold)
- **Low**: Suggestions, refactoring ideas, nice-to-haves

## Commands

```bash
npm run dev       # Dev server (port 3000)
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # TypeScript check (tsc --noEmit)
npx playwright test  # E2E tests
```

## File Organization

```
src/
├── app/           # Pages (App Router route groups)
├── components/    # UI, navigation, forms, admin
├── lib/           # Utilities (auth, youtube, utils)
├── hooks/         # Custom hooks
└── types/         # TypeScript types
prisma/
├── schema.prisma  # DB schema
└── seed.ts        # Seed data
```
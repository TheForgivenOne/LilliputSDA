# Agent Guidelines for Lilliput SDA

This file provides guidelines for AI agents working in this repository.

## Project Overview

- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- **Purpose**: Church website for Lilliput Seventh-day Adventist Church
- **Note**: Convex and Clerk were previously used but have been removed

---

## Commands

### Development
```bash
npm run dev           # Start Next.js dev server (port 3000)
npx convex dev        # Run Convex backend dev server
```

### Build & Lint
```bash
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck   # TypeScript type checking (tsc --noEmit)
```

### Testing (Playwright)
```bash
npx playwright test                 # Run all tests
npx playwright test --grep "query" # Run tests matching pattern
npx playwright test path/to/test.spec.ts  # Run single test file
```

---

## Code Style

### TypeScript
- Use strict mode enabled (tsconfig.json)
- Avoid `any` - use `unknown` or proper types
- Prefer explicit return types for functions
- Use `interface` for object shapes, `type` for unions/aliases

### Imports
- Use path aliases: `@/*` for `src/*`
- Order: React imports → external libs → internal imports → types

```typescript
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import Button from "@/components/ui/Button"
import type { FormErrors } from "@/types"
```

### Components
- Use `"use client"` for client components
- Use `forwardRef` for components that need ref forwarding
- Export default for page components, named exports for utilities
- Add `displayName` for forwardRef components

### Styling (Tailwind)
- Use dark mode: `dark:text-stone-100`, `dark:bg-stone-800`
- Colors: amber (primary), stone (neutral), orange (terracotta)
- Consistent spacing, rounded corners (rounded-xl, rounded-2xl)

### Error Handling
- Use try-catch for async operations
- Provide user-friendly error messages
- Use error boundaries for component failures

---

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   └── api/         # API routes
├── components/      # React components
│   ├── ui/          # Reusable UI components (Button, Input, Card)
│   ├── forms/       # Form components
│   ├── admin/       # Admin dashboard components
│   └── ...
├── lib/             # Utilities (utils.ts, auth.ts, youtube.ts)
└── types/           # TypeScript types
tests/              # Playwright tests
```

---

## Best Practices

### Performance
- Use `Suspense` boundaries for async data
- Lazy load heavy components with `next/dynamic`
- Use `React.cache()` for server-side deduplication
- Avoid barrel imports from large libraries

### React/Next.js
- Follow Vercel React best practices (see below)
- Use Server Components by default, client only when needed
- Pass minimal props through RSC boundary

### Accessibility
- Use semantic HTML elements
- Include aria labels where appropriate
- Ensure keyboard navigation works
- Test color contrast for accessibility

---

## Vercel React Best Practices

This project includes the Vercel React best practices skill. Reference:
- `.agents/skills/vercel-react-best-practices/AGENTS.md`

Key priorities:
1. **Eliminate waterfalls** - Parallelize independent async operations
2. **Optimize bundle size** - Avoid barrel imports, lazy load
3. **Minimize serialization** - Pass only needed fields through RSC boundary
4. **Use Server Components** - Default to server, client only when needed

---

## Useful Skills

The project has installed skills for common tasks:

| Task | Skill |
|------|-------|
| UI Design | `frontend-design` |
| Convex Setup | `convex-quickstart` |
| Convex Auth | `convex-setup-auth` |
| Convex Performance | `convex-performance-audit` |
| Convex Migration | `convex-migration-helper` |
| Library Docs | `context7-mcp` |
| Web Accessibility | `web-design-guidelines` |

---

## Notes

- Environment variables needed: YouTube API key (see README.md)
- Uses Husky for git hooks
- ESLint config ignores `.next/`, `node_modules/`
- Playwright runs on `npm run start` (built app), not dev server
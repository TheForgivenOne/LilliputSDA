# Contributing to Lilliput SDA Website

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/TheForgivenOne/lilliputsda.git`
3. Install dependencies: `npm install`
4. Create a local `.env.local` from `.env.example`
5. Start the dev server: `npm run dev`

## Workflow

### Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code (protected) |
| `develop` | Integration branch for features |
| `feature/<name>` | New features (branch from `develop`) |
| `bugfix/<name>` | Bug fixes (branch from `develop`) |
| `hotfix/<name>` | Critical main fixes (branch from `main`) |

### Making Changes

```bash
# Sync your develop with main
git checkout develop
git merge main

# Create a feature branch
git checkout -b feature/my-feature develop

# Make your changes, commit regularly
git add .
git commit -m "feat: add my feature"

# Push and create a PR to develop
git push origin feature/my-feature
```

### Commit Messages

Use conventional commits:

```
feat: add prayer request form
fix: correct date formatting on events page
docs: update README
style: adjust card spacing in media grid
refactor: extract email utility into lib/email
chore: add husky pre-commit hook
test: add Playwright tests for contact form
```

### PR Checklist

- [ ] Runs `npm run lint` with no errors
- [ ] Passes `npm run typecheck`
- [ ] Tests pass (if applicable)
- [ ] PR targets `develop` (not `main`)
- [ ] Description explains *why*, not just *what*

## Code Standards

### TypeScript

- Strict mode enabled — avoid `any`, use `unknown` or proper types
- Prefer explicit return types for functions
- Use `interface` for object shapes, `type` for unions/aliases

### Components

- Use `"use client"` only when needed
- Export default for page components, named exports for utilities
- Use `forwardRef` for components that need ref forwarding

### Styling

- Follow existing Tailwind patterns (colors: `amber`, `stone`, `orange`)
- Consistent spacing and rounded corners (`rounded-xl`, `rounded-2xl`)
- Dark mode variants: `dark:text-stone-100`, `dark:bg-stone-800`

### Imports

Order: React → external libs → internal aliases (`@/*`) → types

```typescript
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import Button from "@/components/ui/Button"
import type { FormErrors } from "@/types"
```

## Reporting Issues

Bug reports and feature requests are welcome. Please include:

- Clear description of the issue or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## Questions

For questions, reach out via the church website contact form or open a discussion on GitHub.
# Contributing

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature
# or
git checkout -b fix/bug-description
```

Branch naming conventions:

| Type | Example |
|------|---------|
| Feature | `feature/events-calendar` |
| Bug fix | `fix/contact-form-validation` |
| Chore | `chore/update-dependencies` |
| Docs | `docs/api-documentation` |

### 2. Make Changes

Follow the code style guidelines:

- **TypeScript**: Strict mode enabled; avoid `any`
- **React**: Use functional components; `"use client"` for client-side components
- **Imports**: Follow the import order in `AGENTS.md`
- **Tailwind**: Use `cn()` utility for class merging

### 3. Run Quality Checks

Before committing, run:

```bash
npm run lint
npm run typecheck
```

Fix any errors. Warnings in source files should be addressed; warnings in auto-generated files can be ignored.

### 4. Run Tests

```bash
npx playwright test
```

Ensure existing tests pass. Add tests for new features.

### 5. Commit

```bash
git add path/to/changed/file
git commit -m 'feat: add events calendar with category filtering'
```

Commit message format:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code refactoring |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `chore` | Build, tooling, dependencies |
| `perf` | Performance improvements |

### 6. Push and Create PR

```bash
git push origin feature/your-feature
```

Open a Pull Request on GitHub with a clear description of changes.

## Code Standards

### TypeScript

```typescript
// Good: explicit types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Bad: no types
function greet(name) {
  return `Hello, ${name}`;
}

// Bad: any type
function greet(name: any) {
  return `Hello, ${name}`;
}
```

### React Components

```typescript
// Good
"use client";
import { useState } from "react";

interface Props {
  title: string;
  onSubmit: (value: string) => void;
}

export default function MyComponent({ title, onSubmit }: Props) {
  const [value, setValue] = useState("");

  return (
    <div>
      <h1>{title}</h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

// Bad: missing "use client"
import { useState } from "react";

export default function MyComponent() {
  // ...
}
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Page | `page.tsx` | `events/page.tsx` |
| Layout | `layout.tsx` | `events/layout.tsx` |
| Component | `PascalCase.tsx` | `EventCard.tsx` |
| Utility | `camelCase.ts` | `utils.ts` |
| Hook | `camelCase.ts` | `useAuth.ts` |
| Query/Mutation | `camelCase.ts` | `eventsQueries.ts` |

### Import Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Third-party
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

// 3. Internal imports
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 4. Convex imports
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// 5. Type imports
import type { Event } from "@/types";
```

## Component Guidelines

### Reusable UI Components

Place in `src/components/ui/`:

```typescript
// src/components/ui/Button.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg px-4 py-2 font-semibold",
          variant === "primary" && "bg-amber-600 text-white",
          variant === "secondary" && "bg-stone-200 text-stone-900",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
```

### Feature Components

Place in `src/components/features/`:

```typescript
// src/components/features/HeroSection.tsx
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen"
    >
      {/* ... */}
    </motion.section>
  );
}
```

## Adding New Features

### 1. Database Changes

1. Add table definition to `convex/schema.ts`
2. Create query functions in `convex/{table}Queries.ts`
3. Create mutation functions in `convex/{table}Mutations.ts`
4. Add seed data in `convex/seed.ts` if needed
5. Run `npx convex dev` to apply schema

### 2. New Page

1. Create route directory in `src/app/(public)/` or `src/app/(admin)/`
2. Add `page.tsx` with metadata export
3. Add `layout.tsx` if needed

### 3. New API Route

1. Create directory in `src/app/api/`
2. Add `route.ts` with GET/POST handlers

### 4. New Component

1. Choose appropriate directory (`ui/`, `features/`, `admin/`)
2. Follow component guidelines
3. Add tests if applicable

## Reporting Issues

Before opening an issue:

1. Check existing issues
2. Verify with latest version
3. Provide minimal reproduction
4. Include environment details

## Questions

For questions about the codebase, open a discussion on GitHub or reach out to the maintainers.

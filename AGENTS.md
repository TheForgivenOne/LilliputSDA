# AGENTS.md - Lilliput SDA Church Website

## Project Overview
Next.js 16 church website with Convex backend, Clerk auth, and inline CMS editing.

---

## Build Commands

### Development
```bash
npm run dev          # Start dev server at localhost:3000
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Quality Checks
```bash
npm run lint         # Run ESLint (eslint-config-next)
npm run typecheck    # Run TypeScript compiler check
```

### Testing
```bash
npx playwright test                    # Run all tests
npx playwright test --grep "home"      # Run tests matching "home"
npx playwright test tests/home.spec.ts # Run single test file
npx playwright show-report             # View test report
```

---

## Quality Check & Fix Workflow

When fixing lint/typecheck issues:

1. **Run both checks together**:
   ```bash
   npm run lint && npm run typecheck
   ```

2. **Categorize and prioritize**:
   - Errors first (always fix)
   - Warnings in source files (fix)
   - Warnings in auto-generated files (ignore)

3. **Read affected files** in parallel before editing

4. **Plan edits** with TodoWrite for multi-file changes

5. **Apply fixes** - be careful with batch edits on imports; do them one at a time

6. **Verify** - run both checks again after changes

---

## Code Style Guidelines

### TypeScript
- Strict mode enabled in tsconfig.json
- Use explicit types for props and return values
- Avoid `any` - use `unknown` when type is unclear
- Prefer interfaces for component props

### React Components
```
"use client"                                        # Required for client-side components
export default function ComponentName()              # Default export
export function NamedComponent()                      # Named export for utilities
forwardRef<HTMLButtonElement, ButtonProps>()         # Use forwardRef for ref-forwarding
displayName = "ComponentName"                        # Set displayName on forwarded refs
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Utils/Hooks: `camelCase.ts` (e.g., `utils.ts`)
- Convex: `camelCase.ts` (e.g., `eventsQueries.ts`)
- Pages: `page.tsx`
- Layouts: `layout.tsx`

### Import Order
1. React/Next.js imports
2. Third-party libraries (lucide-react, framer-motion, etc.)
3. Internal imports (@/components, @/lib)
4. Convex imports (api)
5. Type imports

### Path Aliases
- `@/*` → `./src/*` (use for all internal imports)

### Tailwind CSS
- Use `cn()` utility from `@/lib/utils` for class merging
- Dark mode: `dark:` prefix variants
- Color palette: amber (primary), stone (neutral), orange (accent)
- Spacing: Use Tailwind scale (p-4, gap-6, etc.)

### Convex Patterns
```typescript
// Schema validation
v.string(), v.number(), v.boolean()
v.optional(v.string())
v.union(v.literal("value1"), v.literal("value2"))
.defineTable({ ... }).index("by_field", ["field"])

// Queries
export const listAll = query({ args: {}, handler: async (ctx) => { ... } })

// Mutations  
export const create = mutation({ args: { ... }, handler: async (ctx) => { ... } })
```

---

## Error Handling
- Use try/catch with console.error for API calls
- Return empty arrays/objects on failure (don't throw)
- Display user-friendly error messages
- Use ErrorBoundary for component-level errors

---

## Rate Limiting

API routes are protected with rate limiting via **Upstash Redis**:

| Route | Limit | Window |
|-------|-------|--------|
| `/api/email` | 5 requests | 1 minute |
| `/api/youtube/videos` | 30 requests | 1 minute |
| `/api/scripture` | 20 requests | 1 minute |

Returns `429 Too Many Requests` with `Retry-After` header.

**Configuration:**
- Module: `src/lib/rate-limit/`
- Redis client: `src/lib/rate-limit/redis.ts`
- Limiters: `src/lib/rate-limit/limiters.ts`

---

## Security

### Clerk Organizations (RBAC)

Role-based access control via **Clerk Organizations**. Users must:
1. Sign in via Clerk
2. Join the "Lilliput SDA Church" organization
3. Have appropriate role (`admin` or `member`)

**JWT Claims Required:**
```json
{
  "org_role": "{{user.role}}",
  "org_id": "{{org.id}}"
}
```

Add these to Clerk Dashboard → Configure → Sessions → JWT Templates.

### Middleware (`src/proxy.ts`)

- Admin routes protected: `/admin(.*)` requires `org:admin` role
- Public routes: `/`, `/about`, `/ministries`, `/media`, `/events`, `/contact`, `/api/*`, `/visit`, `/decision`
- Non-public routes require authentication

### Database Auth (`convex/lib/auth.ts`)

```typescript
// Roles: "admin" | "member"
requireAuth()      // User must be logged in
requireAdmin()     // org:admin only
requireEditor()     // org:admin (members can also edit)
```

### Security Headers (`next.config.ts`)

All routes include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000`
- `Content-Security-Policy` (configured for YouTube, Clerk, Resend)

### Protected Mutations

| Table | Create/Update | Delete |
|-------|---------------|--------|
| events | editor+ | admin only |
| announcements | editor+ | admin only |
| contactSubmissions | public | admin only |
| prayerRequests | public | editor+ |

---

## Environment Variables

### Required
```bash
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_FRONTEND_API_URL=
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-instance.clerk.accounts.dev

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=

# APIs
YOUTUBE_API_KEY=
RESEND_API_KEY=

# Church emails
ADMIN_EMAIL=
PRAYER_TEAM_EMAIL=
```

### Convex Dashboard
Set these via `npx convex env set`:
```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://your-clerk-instance.clerk.accounts.dev"
```

---

## Convex Backend

### Setup
1. Enable Organizations in Clerk Dashboard
2. Activate Convex integration in Clerk
3. Customize JWT template with `org_role` and `org_id`
4. Create "Lilliput SDA Church" organization
5. Invite members with roles

### Auth Config (`convex/auth.config.ts`)
```typescript
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
    applicationID: "convex",
  }],
};
```

---

## Important Notes
- Church content editable via inline CMS (EditableText/EditableImage)
- Page IDs: "home", "about", "contact", "events", "ministries", "media", "decision-card"
- CMS mutations require editor/admin role via Clerk organization
- YouTube API requires YOUTUBE_API_KEY env variable
- Rate limiting via Upstash Redis (`src/lib/rate-limit/`)
- Database auth via Clerk org roles (`convex/lib/auth.ts`)

---

## MCP Tools & Workflow

### Available MCP Tools

| Category | Tools | Purpose |
|----------|-------|---------|
| **Research** | `exa_web_search`, `codesearch`, `context7_query-docs`, `deepwiki_ask_question` | Find solutions, patterns, documentation |
| **Project Management** | `linear_*` | Issues, tasks, sprint planning |
| **Code Review** | `github_pull_request_*`, `github_request_copilot_review` | PR creation, review, merge |
| **Backend** | `convex_*` | Database queries, mutations, logs, debugging |
| **Deployment** | `vercel_*` | Deploy, monitor, debug production |
| **AI/ML** | `huggingface_*` | Find models, datasets, generate images |

### Development Workflow with MCPs

#### 1. Research Phase
```
exa_web_search          → Find best practices & solutions
codesearch              → Get code patterns from docs/Stack Overflow
context7_query-docs     → Official library/framework API reference
deepwiki_ask_question   → Understand unfamiliar codebases
```

#### 2. Planning Phase
```
linear_list_issues      → Review backlog
linear_save_issue       → Create/break down tasks
github_search_issues    → Research similar problems
```

#### 3. Development Phase
```
deepwiki_ask_question   → Understand legacy code
context7_query-docs     → API specifics while coding
convex_data             → Inspect data during development
convex_run              → Test backend functions directly
```

#### 4. Testing Phase
```
vercel_get_runtime_logs  → Debug frontend runtime errors
convex_logs             → Debug backend function errors
convex_insights         → Find OCC conflicts, performance issues
```

#### 5. Deployment Phase
```
vercel_deploy_to_vercel  → Trigger deployment
vercel_get_deployment_build_logs → Debug build failures
vercel_get_runtime_logs  → Post-deploy monitoring
vercel_list_toolbar_threads → Check team feedback on preview
```

#### 6. Code Review Phase
```
github_create_pull_request → Create PR
github_request_copilot_review → Get AI review feedback
github_pull_request_review_write → Submit review
```

### Pro Tips

1. **Chain research tools**: `context7_query-docs` → `codesearch` for docs then examples
2. **Batch independent calls**: Tools like `linear_list_issues`, `vercel_get_runtime_logs` can run in parallel
3. **Use Linear as source of truth**: Create issues for all tasks, link PRs to them
4. **Test Convex locally**: Use `convex_run` to test queries/mutations without UI
5. **Vercel previews**: Use `vercel_get_access_to_vercel_url` to access password-protected previews

---

## Skills & Workflow

### Available Skills

| Skill | Purpose |
|-------|---------|
| **frontend-design** | Create distinctive, production-grade frontend interfaces |
| **audit** | Comprehensive audit (accessibility, performance, theming, responsive) |
| **critique** | UX evaluation (visual hierarchy, information architecture) |
| **normalize** | Normalize design to match design system consistency |
| **polish** | Final quality pass (alignment, spacing, consistency) |
| **optimize** | Performance optimization (loading, rendering, animations) |
| **harden** | Error handling, i18n, text overflow, edge cases |
| **adapt** | Responsive design across screen sizes/devices |
| **animate** | Add animations, micro-interactions, motion effects |
| **colorize** | Add strategic color to monochromatic designs |
| **distill** | Strip unnecessary complexity, simplify |
| **bolder** | Amplify safe/boring designs for more impact |
| **quieter** | Tone down overly bold/aggressive designs |
| **delight** | Add personality, moments of joy, unexpected touches |
| **clarify** | Improve UX copy, error messages, microcopy |
| **onboard** | Onboarding flows, empty states, first-time UX |
| **extract** | Extract reusable components, design tokens, patterns |
| **teach-impeccable** | One-time setup for persistent design guidelines |
| **find-skills** | Discover/install new skills when needed |

### Skill Workflow by Phase

#### 1. Discovery & Setup
```
find-skills       → When you need functionality that might exist as an installable skill
teach-impeccable  → One-time project setup—establishes persistent design guidelines
```

#### 2. Design Phase
```
frontend-design  → Build new web components, pages, artifacts, applications
critique        → Evaluate existing design effectiveness
onboard         → Design first-time user experiences, empty states
```

#### 3. Refinement Phase
```
normalize  → Align designs to design system consistency
colorize  → Add visual interest when too monochromatic
bolder    → Amplify when design is too safe/muted
quieter   → Tone down when design is too aggressive
distill   → Remove unnecessary complexity
animate   → Add motion, micro-interactions
delight   → Elevate functional to memorable
```

#### 4. Quality Assurance
```
audit     → Comprehensive review before release (a11y, perf, responsive)
polish    → Final pass for alignment, spacing, consistency
harden   → Error handling, i18n, edge cases
adapt    → Ensure responsive across devices
clarify  → Fix unclear copy, labels, instructions
```

#### 5. Maintenance
```
optimize  → Performance improvements (bundle, loading, rendering)
extract   → Identify opportunities to consolidate reusable patterns
```

### Skill Selection Quick Guide

```
Need something built?          → frontend-design
Need to evaluate it?          → critique
Need to fix/improve it?       → audit
Need it more refined?         → polish
Need it to work everywhere?   → adapt
Need it faster?               → optimize
Need it simpler?               → distill
Need it more colorful?         → colorize
Need it more impactful?        → bolder
Need it more subtle?           → quieter
Need it delightful?             → delight
Need better copy?              → clarify
Need reusable components?      → extract
```

---

## Agents - Delegation Strategy

**Principle**: Agents are for delegating **specific, scoped tasks**—not for handling long/complex workflows. Use agents to parallelize independent work or leverage specialized expertise on focused tasks.

### When to Delegate to Agents

| Scenario | Agent | Why |
|----------|-------|-----|
| Explore codebase quickly | `explore` | Fast file/pattern finding |
| Code review feedback | `code-reviewer` | Security, correctness focus |
| Design system questions | `ui-designer` | Component library expertise |
| Security assessment | `security-engineer` | Threat modeling |
| Accessibility audit | `accessibility-auditor` | WCAG compliance |
| Database optimization | `database-optimizer` | Schema/query tuning |
| Performance analysis | `performance-benchmarker` | Load testing |
| Research unfamiliar code | `general` | Multi-step investigation |

### When NOT to Use Agents

- **Long, complex tasks**: Keep these in the main session for control
- **Multi-file refactors**: Do directly to maintain consistency
- **Architecture decisions**: Handle personally for context
- **Customer-facing code**: Review personally before shipping
- **Novel features**: Build directly when understanding context is critical

### Agent Delegation Best Practices

1. **Scope tightly**: Give agents specific, bounded tasks (< 30 min expected work)
2. **Provide context**: Include relevant file paths, constraints, examples
3. **Parallelize**: Run independent agents simultaneously
4. **Review outputs**: Always verify agent work before merging
5. **Chain results**: Use agent outputs as input to next steps

### Example Delegation Patterns

```
# Parallel exploration
Agent 1: explore src/components → Find all buttons
Agent 2: explore src/hooks → Find state patterns

# Parallel review
Agent 1: code-reviewer (security focus)
Agent 2: accessibility-auditor (a11y focus)

# Research + Build
Agent: explore legacy code → Understand patterns
Me: Implement based on findings
```

### Available Agents Reference

| Agent | Best For |
|-------|----------|
| `explore` | Codebase navigation, finding files |
| `code-reviewer` | Correctness, security, maintainability |
| `frontend-developer` | React/Next.js implementation |
| `backend-architect` | API design, scalable systems |
| `database-optimizer` | Queries, indexes, schema |
| `devops-automator` | CI/CD, infrastructure |
| `security-engineer` | Threat modeling, vulnerabilities |
| `accessibility-auditor` | WCAG, assistive tech |
| `performance-benchmarker` | Load testing, profiling |
| `evidence-collector` | Visual QA with screenshots |
| `general` | Research, complex investigation |
| `rapid-prototyper` | Fast POC, MVP |
| `database-optimizer` | Query tuning |

### Decision Tree: Should I Use an Agent?

```
Is the task complex with many dependencies?
  → NO: Consider delegation
  → YES: Do it directly

Is the task customer-facing or mission-critical?
  → YES: Do it directly, use agents for review only
  → NO: Consider delegation

Can it be parallelized with other work?
  → YES: Delegate to agents in parallel
  → NO: Consider if agent still fits

Does it require deep project context?
  → YES: Do it directly
  → NO: Agent may be appropriate
```

---

## Auto-Commit Policy

**Enabled**: Changes are automatically committed after passing lint + typecheck.

---

## Post-Agent Git Workflow

When an agent completes work, follow this staging workflow:

### 1. Review Changes
```bash
git status           # See all changes
git diff            # Review unstaged changes
git diff --staged   # Review staged changes
```

### 2. Stage Intentionally
```bash
git add <file>      # Stage specific files
git add -p          # Stage patches (cherry-pick changes)
```
**Rule**: Never `git add .` — stage only intentional changes.

### 3. Verify Before Commit
- Run lint + typecheck: `npm run lint && npm run typecheck`
- Run relevant tests: `npx playwright test --grep "<feature-name>"`
- Review staged diff one more time

### 4. Commit
```bash
git commit -m "<type>: <description>"
```
Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### 5. Push (if ready)
```bash
git push
```

### Decision Point: Create PR?

| Agent Work Type | Action |
|-----------------|--------|
| Small fix, single file | Direct commit to branch |
| Feature with multiple files | Create PR for review |
| Security/customer-facing | Create PR, get human review |
| Prototype/exploration | Create PR, may squash later |

### Pro Tips

1. **Always verify agent output** — review code before staging
2. **Small, focused commits** — don't batch agent work into mega-commits
3. **Descriptive commit messages** — include "Agent: " prefix if relevant
4. **Test before push** — especially for agent-generated code
5. **PR for visibility** — let team see what agents are contributing

---

## Testing Workflow

### When to Create Tests

| Scenario | Create Tests? | Why |
|----------|---------------|-----|
| New feature/component | **Yes** | Establish behavior contract, prevent regressions |
| Bug fix | **Yes** | Ensure fix works, prevent recurrence |
| Refactor | **Yes** | Verify existing behavior preserved |
| UI changes | **Consider** | Visual regression if critical user flows |
| Documentation | **No** | No testable behavior |
| Config/env changes | **Consider** | If affecting runtime behavior |
| One-off scripts | **No** | Unless reused |

### Test Types

| Type | Use For | Location |
|------|---------|----------|
| **E2E** | Critical user journeys (navigation, forms, auth) | `tests/e2e/` |
| **Component** | Reusable UI components | `tests/components/` |
| **API** | Convex queries/mutations | `tests/api/` |

### When E2E Tests Are Required

```
✅ Create E2E test when:
- User can complete a meaningful workflow
- Form submission with side effects
- Authentication flows
- Navigation-dependent state
- Data display from CMS

❌ Skip E2E test when:
- Pure presentational component
- Utility function with no UI
- Static content display
- Internal implementation detail
```

---

## Agent Fix + No Existing Test File

### Decision Tree

```
Agent completes fix/feature
         │
         ▼
Is there existing test coverage?
         │
    ┌────┴────┐
    │         │
   Yes        No
    │         │
    ▼         ▼
Add tests  Create new
to exist  test file?
    │         │
    │    ┌────┴────┐
    │    │         │
    │   Yes       No (skip)
    │    │         │
    │    ▼         ▼
    │  Create    Document
    │  test      why skip
    │    │         │
    └────┴─────────┘
         │
         ▼
   Verify & stage
```

### When to Create Tests for Agent Fix

```
✅ Create test when:
- Fix implements new user-facing behavior
- Bug could recur without test coverage
- Feature is part of critical path
- Fix changes existing behavior

❌ Skip test when:
- Quick hotfix with low regression risk
- Trivial one-liner fix
- Config/environment change
- No user-facing impact
```

### Quick Decision Checklist

```
Before writing a test, ask:

1. Is this user-facing behavior?      → Yes: test it
2. Could this break silently?         → Yes: test it
3. Is this covered by existing tests? → Yes: skip
4. Would a failing test catch a real bug? → Yes: test it
5. Is this edge case handling?        → Consider: add for critical paths
```

---

## Creating New Test Files

### Quick Decision: New vs. Existing

```
Feature: "Events calendar display"
Existing: tests/e2e/home.spec.ts
→ Check if events are tested there
→ If yes: add to existing file
→ If no: consider new file OR extend existing
```

### Test File Organization

```
tests/
├── e2e/
│   ├── home.spec.ts          # Page-level tests
│   ├── events.spec.ts
│   └── contact.spec.ts
├── components/
│   ├── HeroSection.spec.ts
│   └── EventCard.spec.ts
└── api/
    └── eventsQueries.spec.ts
```

### Basic Test File Structure

```typescript
// tests/e2e/events.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
  });

  test('should display upcoming events', async ({ page }) => {
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
  });

  test('should filter events by category', async ({ page }) => {
    await page.click('[data-testid="category-filter"]');
    // ...
  });
});
```

---

## Running Tests

```bash
# All tests
npx playwright test

# Specific feature
npx playwright test --grep "events"

# Single file
npx playwright test tests/home.spec.ts

# Single new file
npx playwright test tests/e2e/new-feature.spec.ts

# View report
npx playwright show-report
```

### Git Staging with Tests

```bash
# If creating new test file:
git add src/           # The fix
git add tests/         # The new test

# Commit message includes both
git commit -m "fix: resolve events filter bug with test"
```

---

## Documentation Guidelines

### When to Create Documentation

```
✅ Document when:
- New feature with complex behavior
- API endpoint with usage details
- Component with specific props/API
- Architecture decision (ADRs)
- Setup/installation steps changed
- New workflow or process

❌ Skip documentation when:
- Obvious/self-explanatory code
- Internal implementation details
- Temporary/hack code
- Already documented elsewhere
```

### Documentation Types

| Type | Location | When |
|------|----------|------|
| **Code comments** | Inline in source | Complex logic, non-obvious decisions |
| **README** | Project root | Setup, overview, quick start |
| **API docs** | `docs/api/` | Endpoint specs, request/response |
| **ADRs** | `docs/adr/` | Architecture decisions |
| **Inline types** | `.tsx`, `.ts` files | Props, interfaces, utilities |
| **CHANGELOG** | Root | Breaking changes, features, fixes |

### Code Comment Guidelines

```typescript
// ✅ DO: Explain WHY, not WHAT
// Retry with exponential backoff to handle transient network errors
await retryWithBackoff(() => api.fetch());

// ❌ DON'T: State the obvious
// Loop through items
for (const item of items) { }

// ✅ DO: Document non-obvious edge cases
// Handle case where user has no events (empty array, not null)
const events = user.events ?? [];
```

### README Updates

```
When to update README:
├── New setup requirement (.env var, tool)
├── New command/script added
├── Changed default behavior
├── New feature users should know about
└── Breaking change

Keep README:
├── Concise (tl;dr at top)
├── Examples for common tasks
├── Links to detailed docs
└── Current (remove outdated)
```

### Commit Messages for Docs

```bash
# Documentation only
git commit -m "docs: add setup instructions for new environment"

# Code + docs
git commit -m "feat: add events filter with docs"
```

### Pro Tips

1. **Self-documenting code first** — Good naming > comments
2. **Document decisions, not implementation** — Why > What
3. **Link over duplicate** — Don't repeat docs in multiple places
4. **Keep docs near code** — Prop comments in component files
5. **Update docs with code** — Same commit, same PR

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

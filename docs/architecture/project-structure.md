# Project Structure

```
lilliputsda/
├── .env.example                  # Environment variable template
├── .env.local                    # Local env vars (gitignored)
├── .github/
│   ├── workflows/
│   │   ├── browser-test.yml      # Playwright E2E tests
│   │   ├── ci.yml                # Lint, typecheck, build
│   │   ├── performance.yml       # Lighthouse CI
│   │   ├── release.yml           # Auto releases
│   │   └── security.yml          # Security scans
│   ├── dependabot.yml            # Dependabot config
│   └── release-drafter.yml       # PR release notes
├── .opencode/                    # AI agent skills and config
├── convex/                       # Convex backend
│   ├── announcementsMutations.ts
│   ├── announcementsQueries.ts
│   ├── auth.config.ts            # Clerk auth configuration
│   ├── cms/                      # CMS-related queries/mutations
│   ├── contact.ts
│   ├── env.ts
│   ├── eventsMutations.ts
│   ├── eventsQueries.ts
│   ├── ministries.ts
│   ├── prayerRequests.ts
│   ├── schema.ts                 # Database schema definition
│   ├── seed.ts                   # Seed data for development
│   ├── staff.ts
│   └── tsconfig.json
├── docs/                         # Documentation
├── node_modules/
├── public/
│   ├── scriptures.json           # Bible text for search
│   └── ...                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (admin)/              # Admin route group (protected)
│   │   │   ├── layout.tsx        # Admin shell with sidebar
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── announcements/
│   │   │   ├── events/
│   │   │   ├── media/
│   │   │   ├── ministries/
│   │   │   ├── pages/
│   │   │   ├── settings/
│   │   │   ├── staff/
│   │   │   └── users/
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── sign-up/[[...sign-up]]/
│   │   ├── (public)/             # Public site route group
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── decision-card/
│   │   │   ├── events/
│   │   │   ├── media/
│   │   │   └── ministries/
│   │   ├── api/                  # API Routes
│   │   │   ├── scripture/
│   │   │   └── youtube/videos/
│   │   ├── globals.css
│   │   ├── layout.tsx            # Root layout (providers, header, footer)
│   │   └── page.tsx              # Home page (redirect to (public))
│   ├── components/
│   │   ├── admin/                # Admin-specific components
│   │   │   └── AdminTable.tsx
│   │   ├── cms/                  # CMS components
│   │   │   ├── CmsAdminBar.tsx
│   │   │   ├── CmsProvider.tsx
│   │   │   ├── EditableImage.tsx
│   │   │   ├── EditableText.tsx
│   │   │   └── EditModeIndicator.tsx
│   │   ├── features/             # Feature-specific components
│   │   │   ├── AboutSplit.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── DecisionCardModal.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── LeaderCard.tsx
│   │   │   ├── QuickInfo.tsx
│   │   │   ├── QuickMinistryCard.tsx
│   │   │   └── ScriptureSearch.tsx
│   │   ├── navigation/           # Navigation components
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileBottomBar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── providers/            # React context providers
│   │   │   ├── ConvexClientProvider.tsx
│   │   │   └── DirectionProvider.tsx
│   │   └── ui/                    # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       └── SectionHeader.tsx
│   ├── lib/
│   │   ├── ErrorBoundary.tsx      # Error boundary component
│   │   └── utils.ts               # cn() and other utilities
│   ├── proxy.ts                  # Clerk middleware configuration
│   └── styles/
│       └── tokens.css             # Design tokens (CSS custom properties)
├── tests/                         # Playwright E2E tests
│   ├── e2e/
│   │   ├── home.spec.ts
│   │   ├── events.spec.ts
│   │   └── contact.spec.ts
│   └── components/
├── AGENTS.md                      # AI agent instructions
├── eslint.config.mjs
├── lighthouserc.json
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Route Groups

| Group | Path | Access | Description |
|-------|------|--------|-------------|
| `(admin)` | `/admin/*` | Authenticated | CMS admin dashboard |
| `(auth)` | `/sign-in`, `/sign-up` | Public | Clerk auth pages |
| `(public)` | `/`, `/about`, `/contact`, etc. | Public | Public-facing site |

## Path Aliases

All imports use the `@/*` alias which maps to `src/*`:

```typescript
import { Header } from "@/components/navigation/Header";
import { cn } from "@/lib/utils";
import { eventsQueries } from "@/convex/eventsQueries";
```

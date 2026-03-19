# Architecture Overview

## System Design

The Lilliput SDA Church website follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js 16 (App Router)                             │    │
│  │  ├── Public Pages (Server Components)               │    │
│  │  ├── Admin Dashboard (Client Components)            │    │
│  │  ├── Inline CMS Editing (Client Components)          │    │
│  │  └── API Routes                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│         │                    │                │             │
│         ▼                    ▼                ▼             │
│  ┌────────────┐    ┌──────────────┐   ┌────────────┐      │
│  │   Clerk    │    │   Convex     │   │  YouTube   │      │
│  │  (Auth)    │    │  (Database)   │   │   (API)    │      │
│  └────────────┘    └──────────────┘   └────────────┘      │
│                            │                                 │
│                            ▼                                 │
│                   ┌──────────────┐                          │
│                   │   Vercel     │                          │
│                   │ (Deployment) │                          │
│                   └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. Separation of Concerns

- **Frontend**: Next.js App Router with React Server Components for static content, Client Components for interactive features
- **Backend**: Convex functions (queries, mutations, actions) for all data operations
- **Auth**: Clerk handles authentication; Convex validates Clerk tokens via middleware
- **CMS**: Data stored in Convex; inline editing via React state + Convex mutations

### 2. Real-Time by Default

Convex provides real-time subscriptions out of the box. All lists (events, announcements, staff) update automatically when data changes without page refresh.

### 3. Security Through Middleware

All routes except public ones require Clerk authentication. The `src/proxy.ts` middleware defines public routes; everything else redirects to sign-in.

### 4. Inline Editing

The CMS allows editing page content directly on public pages without a separate admin interface. This is achieved through:

- `CmsProvider` — React context for edit mode state
- `EditableText` / `EditableImage` — Wrapped components that become editable when in edit mode
- `CmsAdminBar` — Top bar with save/cancel controls
- Convex mutations — Persist changes to the `pageSections` table

## Data Flow

### Public Pages (Read)

```
Browser → Next.js (Server Component)
       → Convex Query (cached, real-time)
       → Convex Database
       → Rendered HTML
```

### Admin Mutations (Write)

```
Browser → Next.js (Client Component)
       → Convex Mutation
       → Convex Database
       → Real-time update via subscription
       → UI re-renders
```

### Inline CMS Edit

```
Click editable element → CmsProvider.setEditMode(true)
                       → EditableText shows input overlay
                       → On blur/save → Convex mutation
                       → Data persisted to pageSections
                       → UI updates reactively
```

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js App Router | Server Components for SEO, streaming, and performance |
| Convex over alternatives | Type-safe, real-time, zero-config backend |
| Clerk for auth | Managed auth with React components, org support |
| Inline CMS over headless CMS | Simpler workflow for church staff; no external dependency |
| Tailwind CSS | Utility-first, design-system-friendly, small bundle |
| Framer Motion | Declarative animations for micro-interactions |
| Path aliases (`@/*`) | Clean imports across the codebase |

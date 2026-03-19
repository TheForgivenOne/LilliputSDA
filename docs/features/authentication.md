# Authentication

Authentication is handled by Clerk and enforced at multiple layers.

## Clerk Integration

### Middleware Protection (`src/proxy.ts`)

The Next.js middleware (`proxy.ts`) uses Clerk's `clerkMiddleware` to protect routes:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/ministries',
  '/media',
  '/events',
  '/contact',
  '/decision-card',
  '/api/scripture',
  '/api/youtube/videos',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

### Route Protection

| Route | Protection |
|-------|------------|
| `/` | Public |
| `/about` | Public |
| `/contact` | Public |
| `/events` | Public |
| `/media` | Public |
| `/ministries` | Public |
| `/decision-card` | Public |
| `/api/scripture` | Public |
| `/api/youtube/videos` | Public |
| `/sign-in/*` | Public |
| `/sign-up/*` | Public |
| `/admin/*` | Authenticated |
| All other routes | Authenticated |

### Sign-In and Sign-Up Pages

Located in `src/app/(auth)/`:

- `/sign-in/[[...sign-in]]/` — Clerk's sign-in component
- `/sign-up/[[...sign-up]]/` — Clerk's sign-up component

Configured in `src/app/(auth)/layout.tsx` with `<SignIn>` and `<SignUp>` components from `@clerk/nextjs`.

## Convex Authentication

### Clerk as Convex Auth Provider (`convex/auth.config.ts`)

Clerk tokens are validated in Convex:

```typescript
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};
```

This allows Convex queries and mutations to access the authenticated user's Clerk ID via `ctx.auth`.

### Accessing Auth in Convex Functions

```typescript
export const listEvents = query({
  handler: async (ctx) => {
    const identity = ctx.auth;
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject; // Clerk user ID
    // ...
  },
});
```

### CMS Role Check

CMS access is controlled by the `cmsUsers` Convex table:

```typescript
export const isEditor = query({
  handler: async (ctx) => {
    const identity = ctx.auth;
    if (!identity) return false;
    
    const cmsUser = await ctx.db
      .query("cmsUsers")
      .withIndex("by_clerk_user", (q) => 
        q.eq("clerkUserId", identity.subject)
      )
      .first();
    
    return cmsUser?.role === "editor" || cmsUser?.role === "admin";
  },
});
```

## User Roles

Roles are stored in the `cmsUsers` table and checked client-side by `CmsProvider`:

| Role | Value | Capabilities |
|------|-------|-------------|
| Viewer | `viewer` | Read-only CMS preview |
| Editor | `editor` | Create, edit, delete content |
| Admin | `admin` | Full access + user management |

## Clerk Dashboard Configuration

### Redirect URLs

Configure these in Clerk Dashboard → Settings → URLs:

- **Sign-in URL**: `http://localhost:3000/sign-in` (local)
- **Sign-up URL**: `http://localhost:3000/sign-up` (local)
- Add production URLs for deployment

### API Keys

- **Publishable key** (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) — Safe for browsers
- **Secret key** (CLERK_SECRET_KEY) — Server-side only, never expose to client

### Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API_URL=https://...clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

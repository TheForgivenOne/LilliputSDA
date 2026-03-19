# Environment Variables

All environment variables are defined in `.env.example` at the project root. Copy this to `.env.local` and fill in values.

## Required Variables

### Convex

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `CONVEX_DEPLOYMENT` | Convex deployment identifier | Set automatically by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_URL` | Public Convex backend URL | Set automatically by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Public site URL for Convex | Convex dashboard → Settings |

### Clerk Authentication

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | Clerk Dashboard → Settings → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret API key | Clerk Dashboard → Settings → API Keys |
| `CLERK_FRONTEND_API_URL` | Clerk frontend API URL | Clerk Dashboard → Settings → API Keys |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path | Customizable (default: `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path | Customizable (default: `/sign-up`) |

## Optional Variables

### YouTube API

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `YOUTUBE_API_KEY` | Google YouTube Data API v3 key | Google Cloud Console → APIs & Services → Credentials |

Without this key, the Media page displays fallback placeholder videos.

## Variable Prefixes

- `NEXT_PUBLIC_` — Exposed to the browser. These are safe because they use publishable keys, not secret keys.
- No prefix — Server-side only (e.g., `CONVEX_DEPLOYMENT`, `CLERK_SECRET_KEY`, `YOUTUBE_API_KEY`). Never commit these to version control.

## Local Development

For local development, use `.env.local` (gitignored). For production, set these in Vercel's Environment Variables dashboard or your deployment platform.

## Environment-Specific URLs

| Environment | `NEXT_PUBLIC_CONVEX_URL` | `CLERK_FRONTEND_API_URL` |
|-------------|--------------------------|---------------------------|
| Local dev | Set by `npx convex dev` | Set by Clerk dashboard |
| Production | Set by Convex dashboard | Set by Clerk dashboard |

## Verifying Your Setup

```bash
npm run typecheck && npm run build
```

If the build succeeds, all environment variables are configured correctly.

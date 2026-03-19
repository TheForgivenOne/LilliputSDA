# Installation

## Prerequisites

- **Node.js** 18 or later
- **npm**, yarn, pnpm, or bun (this project uses npm)
- **Git** for version control
- **Convex account** — [convex.dev](https://convex.dev) (free tier available)
- **Clerk account** — [clerk.com](https://clerk.com) (free tier available)

## 1. Clone the Repository

```bash
git clone https://github.com/lilliputsda/lilliputsda.git
cd lilliputsda
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See [Environment Variables](./environment-variables.md) for the full reference.

## 4. Set Up Convex

```bash
npx convex dev
```

This will:

- Create a Convex project in your account
- Generate a `CONVEX_DEPLOYMENT` value
- Generate a `NEXT_PUBLIC_CONVEX_URL` value
- Start the Convex backend locally

Add the generated values to `.env.local`:

```env
CONVEX_DEPLOYMENT=<your-deployment>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CONVEX_SITE_URL=<your-site-url>
```

## 5. Set Up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Go to **Settings → API Keys** and copy the publishable key and secret key
3. Add to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API_URL=https://your-frontend-api.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 6. (Optional) Set Up YouTube API

To display sermon videos on the Media page:

1. Get a YouTube Data API key from [Google Cloud Console](https://console.cloud.google.com)
2. Add to `.env.local`:

```env
YOUTUBE_API_KEY=your-youtube-api-key
```

The Media page works without this key (uses fallback placeholder videos).

## 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Troubleshooting

### `Module not found` errors

Make sure all dependencies are installed:

```bash
npm install
```

### Convex connection errors

Verify your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` are set correctly in `.env.local`. Restart the dev server after changing them.

### Clerk auth errors

Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` matches the key from your Clerk dashboard exactly (including `pk_test_` or `pk_live_` prefix).

### TypeScript errors

Run the type checker to see all errors:

```bash
npm run typecheck
```

# Deployment

The Lilliput SDA Church website is deployed on Vercel with Convex as the backend.

## Vercel Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository (`lilliputsda/lilliputsda`)
4. Vercel auto-detects Next.js framework

### 2. Configure Environment Variables

In Vercel dashboard → Project → Settings → Environment Variables:

| Name | Value | Environments |
|------|-------|--------------|
| `CONVEX_DEPLOYMENT` | `<from Convex dashboard>` | All |
| `NEXT_PUBLIC_CONVEX_URL` | `<from Convex dashboard>` | All |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | `https://your-site.vercel.app` | All |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | All |
| `CLERK_SECRET_KEY` | `sk_live_...` | Production, Preview |
| `CLERK_FRONTEND_API_URL` | `https://...clerk.app` | All |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | All |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | All |
| `YOUTUBE_API_KEY` | `...` | All (optional) |

### 3. Deploy

Click **Deploy**. Vercel will:

1. Install dependencies
2. Run `npm run build`
3. Deploy to a preview URL
4. Run CI checks (lint, typecheck, tests)

For production, merge to the `main` branch or promote a preview deployment.

### 4. Custom Domain (Optional)

1. Go to Project → Settings → Domains
2. Add your custom domain (e.g., `lilliputsda.org`)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_CONVEX_SITE_URL` to your domain

## Convex Deployment

### Development vs Production

- **Development**: `npx convex dev` creates a dev deployment
- **Production**: Deploy via Convex dashboard or `npx convex deploy`

### Promoting Dev to Production

```bash
# In your project directory
npx convex deploy
```

This deploys all Convex functions to production.

### Convex Dashboard

Manage your database, view logs, and monitor usage at [dashboard.convex.dev](https://dashboard.convex.dev).

## Clerk Configuration for Production

### Update Redirect URLs

In Clerk Dashboard → Settings → URLs:

- **Sign-in URL**: `https://your-domain/sign-in`
- **Sign-up URL**: `https://your-domain/sign-up`
- **Add production domain** to allowed origins

### Update Environment Variables

Replace test (`pk_test_`, `sk_test_`) keys with production (`pk_live_`, `sk_live_`) keys.

## Environment Setup Summary

### Local Development

```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

### Production

```bash
# Deploy Convex backend
npx convex deploy

# Vercel handles Next.js deployment
# Connect GitHub repo in Vercel dashboard
```

## Automatic Deployments

### Vercel Git Integration

Once connected, Vercel automatically:

- Builds on every push to `main`
- Creates preview deployments for PRs
- Runs CI checks before deploying

### CI/CD Pipeline

The `.github/workflows/ci.yml` runs:

1. ESLint (`npm run lint`)
2. TypeScript check (`npx tsc --noEmit`)
3. Build (`npm run build`)

Tests run separately in `.github/workflows/browser-test.yml`.

## Rollback

### Vercel

1. Go to Deployments in Vercel dashboard
2. Find the working deployment
3. Click **... → Promote to Production**

### Convex

1. Go to Convex Dashboard → Functions
2. Find the previous working version
3. Click **Rollback**

## Monitoring

### Vercel

- **Runtime logs**: Vercel Dashboard → Runtime Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Function metrics**: Vercel Dashboard → Functions

### Convex

- **Logs**: Convex Dashboard → Logs
- **Insights**: Convex Dashboard → Insights (OCC conflicts, slow queries)
- **Metrics**: Convex Dashboard → Metrics

## Troubleshooting

### Build Fails

1. Check Vercel build logs for errors
2. Ensure all environment variables are set
3. Verify `npm run build` works locally

### Convex Connection Issues

1. Verify `NEXT_PUBLIC_CONVEX_URL` matches Convex dashboard
2. Check `CONVEX_DEPLOYMENT` is set
3. Restart dev server after env changes

### Clerk Auth Not Working

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
2. Check `CLERK_FRONTEND_API_URL` matches Clerk dashboard
3. Ensure redirect URLs are configured in Clerk dashboard

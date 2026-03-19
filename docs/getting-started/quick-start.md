# Quick Start

## TL;DR

```bash
git clone https://github.com/lilliputsda/lilliputsda.git
cd lilliputsda
npm install
cp .env.example .env.local
# Edit .env.local with Convex and Clerk keys
npx convex dev
npm run dev
```

## Development Workflow

### Daily Development

1. **Start Convex backend** (in one terminal):
   ```bash
   npx convex dev
   ```

2. **Start Next.js frontend** (in another terminal):
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes

3. Run quality checks:
   ```bash
   npm run lint && npm run typecheck
   ```

4. Run tests:
   ```bash
   npx playwright test
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m 'feat: add your feature'
   git push origin feature/your-feature
   ```

### Inline CMS Editing

1. Sign in as an admin user at `/sign-in`
2. Navigate to any public page
3. A CMS admin bar appears at the top
4. Click any text or image to edit it inline
5. Changes save automatically to Convex

### Admin Dashboard

Navigate to `/admin` to manage:

- **Events** — Calendar events with categories, recurrence, and images
- **Announcements** — News items with priority and expiration
- **Ministries** — Ministry listings with leaders and meeting times
- **Staff** — Church leadership and pastoral staff
- **Media** — Media library for images and uploads
- **Pages** — CMS page sections and site settings
- **Users** — CMS user roles (viewer, editor, admin)

### Building for Production

```bash
npm run build
npm run start
```

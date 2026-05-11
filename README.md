# Lilliput Seventh-day Adventist Church Website

Official website for the Lilliput SDA Church, part of the West Jamaica Conference of Seventh-day Adventists.

## About

The Lilliput Seventh-day Adventist Church was founded in 1974 in the Lilliput District of St. James, Jamaica. Today, the church serves the community and oversees five daughter churches in the district.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL via [Prisma](https://prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) v5 (Credentials)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter (body), Fraunces (display)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/TheForgivenOne/LilliputSDA.git
cd LilliputSDA

npm install
cp .env.example .env.local
# Edit .env.local with your values

npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

```env
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=

# YouTube (for media/sermons page)
YOUTUBE_API_KEY=

# Email (Resend)
RESEND_API_KEY=

# Rate limiting (Upstash Redis - optional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   └── api/          # REST API routes
├── components/       # React components
│   ├── ui/          # Reusable UI (Button, Input, Card, etc.)
│   ├── admin/       # Dashboard components
│   └── ...
├── lib/             # Utilities (db, auth, youtube, rate-limit)
├── hooks/           # Custom React hooks
└── types/           # TypeScript types

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Seed data

tests/
└── e2e/             # Playwright end-to-end tests
```

## Features

- Responsive, mobile-first church website with dark mode
- Dashboard admin panel for content management
- Events calendar with recurring events
- YouTube media integration with live/upcoming/past video states
- Contact form with admin inbox
- Prayer request system
- Decision card modal
- Ministry and staff listings
- Announcements system
- Testimonials with member stories
- About page with church history (1974-present)
- Rate limiting via Upstash Redis
- SEO metadata, sitemap, robots.txt

## Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
npx playwright test # E2E tests
```

## Design System — Vesper

The site uses a custom design system called **Vesper** built on liturgical jewel-tones:

- **Primary**: Deep indigo (`#3B3A8F`) — CTAs, links, navigation
- **Accent**: Antique brass (`#C8A24A`) — decorative elements, gold buttons
- **Wine**: Mulberry (`#6E2A3E`) — urgent badges, destructive actions
- **Lilac** (`#A39CD8`) — subtle highlights in dark mode

## Deployment

The site is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments on push to main.

```bash
npm run build
npm start
```

## Contact

**Lilliput SDA Church**
- Location: Lilliput District, Montego Bay, St. James, Jamaica
- Website: https://lilliputsda.interamerica.org

**West Jamaica Conference**
- Website: https://www.westjamaica.org

## License

This project is private property of the Lilliput Seventh-day Adventist Church.

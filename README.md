# Lilliput Seventh-day Adventist Church Website

Official website for the Lilliput SDA Church, part of the West Jamaica Conference of Seventh-day Adventists.

## About

The Lilliput Seventh-day Adventist Church was founded in 1974 in the Lilliput District of St. James, Jamaica. Today, the church serves over 700 members and oversees five daughter churches in the district.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/lilliputsda/lilliputsda.git
cd lilliputsda

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# YouTube API (for media page)
YOUTUBE_API_KEY=
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   └── navigation/ # Header, Footer, MobileNav
│   └── lib/            # Utilities and helpers
├── convex/             # Convex backend (database schema)
└── .github/workflows/ # CI/CD pipelines
```

## Features

- Responsive church website with mobile-first design
- Events calendar with Convex backend
- YouTube media integration for sermons
- Contact form
- Ministry listings
- About page with church history (1974-present)
- Dark mode support

## Deployment

The site is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments on push to production.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

**Lilliput SDA Church**
- Location: Lilliput District, Montego Bay, St. James, Jamaica
- Website: https://lilliputsda.interamerica.org

**West Jamaica Conference**
- Website: https://www.westjamaica.org
- Phone: (876) 656-7800

## License

This project is private property of the Lilliput Seventh-day Adventist Church.

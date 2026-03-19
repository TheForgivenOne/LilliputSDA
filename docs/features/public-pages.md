# Public Pages

Public pages are accessible without authentication. They are Server Components by default for optimal performance and SEO.

## Available Pages

### Home (`/`)

The landing page featuring:

- **Hero Section** — Full-width banner with church welcome message, CTA buttons
- **Quick Info** — Service times, location, and contact quick links
- **Upcoming Events** — Latest events from the Convex `events` table
- **Quick Ministry Cards** — Featured ministries with links
- **CTA Section** — Call-to-action for first-time visitors and decision cards
- **Editable Content** — Hero text, intro, and footer sections via inline CMS

### About (`/about`)

Church history and leadership page:

- **History Section** — Church founding in 1974, daughter churches
- **Leadership Grid** — Staff cards with photo, name, role, and contact info
- **Connection Info** — West Jamaica Conference details
- **Editable Content** — All text sections are CMS-editable

### Ministries (`/ministries`)

Ministry listings page:

- **Ministry Cards** — Category-filtered (youth, adult, family, music)
- **Ministry Details** — Name, description, leader, meeting time, location
- **Leader Links** — Clicking a leader navigates to their bio on the About page

### Events (`/events`)

Church calendar with event listings:

- **Event List** — Upcoming events sorted by date
- **Category Filter** — Filter by: service, special, youth, community
- **Event Cards** — Title, date, time, location, description, image
- **Recurring Events** — Visual indicator for weekly/monthly events
- **Admin CRUD** — Full create, read, update, delete via `/admin/events`

### Media (`/media`)

Sermon video library:

- **Video Grid** — YouTube videos from @lilliputsdamedia channel
- **Video Cards** — Thumbnail, title, date, duration, view count
- **YouTube Integration** — Fetched via `/api/youtube/videos` endpoint
- **Fallback** — Placeholder videos shown when API key is not configured

### Contact (`/contact`)

Contact page with form:

- **Contact Form** — Name, email, message fields
- **Form Submission** — Stored in Convex `contactSubmissions` table
- **Church Info** — Address, phone, email, map location
- **Prayer Requests** — Link to prayer request submission

### Decision Card (`/decision-card`)

Salvation response page:

- **Prayer of Salvation** — Interactive prayer button
- **Next Steps** — baptism, church membership, Bible study prompts
- **Contact Options** — Form to request pastoral contact
- **Scripture Search** — Search Bible verses by keyword

## Shared Components

All public pages include:

- **Header** — Logo, navigation links, mobile menu toggle
- **Footer** — Church info, quick links, social links
- **Mobile Bottom Bar** — Mobile-only navigation (Home, Events, About, Contact)
- **CMS Admin Bar** — Visible only to logged-in editors/admins
- **Edit Mode Indicator** — Shows when inline editing is active

## Redirects

Old URLs are redirected via `next.config.ts`:

| Old Path | New Path | Type |
|----------|----------|------|
| `/leadership` | `/about#leadership` | 301 |
| `/services` | `/events` | 301 |
| `/news` | `/events` | 301 |

## SEO

Each page exports metadata:

```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description for search engines",
  keywords: ["relevant", "keywords"],
  openGraph: {
    title: "OG Title",
    description: "OG Description",
    type: "website",
  },
};
```

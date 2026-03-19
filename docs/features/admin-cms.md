# Admin CMS

The admin dashboard at `/admin` provides a full content management interface for church staff.

## Access Control

Access requires:

1. **Clerk authentication** — Must be signed in via `/sign-in`
2. **CMS role** — User must exist in the Convex `cmsUsers` table with role `editor` or `admin`

### Roles

| Role | Permissions |
|------|-------------|
| `viewer` | Read-only access to admin dashboard |
| `editor` | Can create, edit, and delete events, announcements, staff, ministries, media |
| `admin` | Full access including user management and site settings |

## Admin Pages

### Dashboard (`/admin`)

Overview of the site:

- Quick stats (upcoming events, active announcements, staff count)
- Recent contact submissions
- Quick links to each admin section

### Events (`/admin/events`)

Full CRUD for calendar events:

- **List view** — All events with category badges, date, and status
- **Create** — Form with title, description, dates, location, category, recurrence, image
- **Edit** — Update any event field
- **Delete** — Remove events with confirmation
- **Publish toggle** — Draft vs. published state

Event fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Event title |
| `description` | string | Yes | Event details |
| `startDate` | string (ISO 8601) | Yes | Start date and time |
| `endDate` | string (ISO 8601) | No | End date and time |
| `location` | string | Yes | Venue name |
| `category` | enum | Yes | service, special, youth, community |
| `imageUrl` | string | No | Event image URL |
| `isRecurring` | boolean | No | Recurring event flag |
| `recurrencePattern` | enum | No | weekly, monthly |
| `isPublished` | boolean | No | Draft or published |

### Announcements (`/admin/announcements`)

News and announcement management:

- **List view** — All announcements with priority badges, pinned indicator
- **Create/Edit/Delete** — Full CRUD with rich text content
- **Priority levels** — low, normal, high
- **Categories** — general, youth, ministry, community
- **Expiration** — Optional `expiresAt` date
- **Pin toggle** — Pin important announcements to top

### Staff (`/admin/staff`)

Church leadership directory:

- **List view** — Staff cards with photo, name, role
- **Create/Edit/Delete** — Full CRUD with all fields
- **Reorder** — Drag-and-drop or order number field
- **Department filter** — Group by department
- **Active toggle** — Show/hide retired staff

Staff fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `role` | string | Yes | Job title (Pastor, Elder, etc.) |
| `title` | string | Yes | Formal title |
| `bio` | string | No | Biography |
| `photoUrl` | string | No | Photo URL |
| `email` | string | No | Contact email |
| `phone` | string | No | Contact phone |
| `department` | string | No | Department name |
| `order` | number | No | Display order |
| `isActive` | boolean | No | Active status |
| `isPublished` | boolean | No | Published status |

### Ministries (`/admin/ministries`)

Ministry program listings:

- **List view** — Ministry cards with category and leader
- **Create/Edit/Delete** — Full CRUD
- **Leader assignment** — Link to staff member
- **Category filter** — youth, adult, family, music

Ministry fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Ministry name |
| `description` | string | Yes | Ministry description |
| `leaderId` | id (staff) | No | Reference to staff leader |
| `meetingTime` | string | No | Day and time |
| `meetingLocation` | string | No | Venue |
| `imageUrl` | string | No | Ministry photo |
| `category` | enum | No | youth, adult, family, music |
| `order` | number | No | Display order |
| `isPublished` | boolean | No | Published status |

### Media (`/admin/media`)

Media library management:

- **Grid view** — All uploaded images with thumbnails
- **Upload** — Drag-and-drop or file picker (stored in Convex)
- **Delete** — Remove media with confirmation
- **Metadata edit** — Alt text, filename, publish status

### Pages (`/admin/pages`)

Manage CMS page sections:

- **Page list** — All pages with section counts
- **Section editor** — Edit individual content blocks
- **Section keys** — Organized by pageId and sectionKey (e.g., `home.hero.title`)

### Settings (`/admin/settings`)

Site-wide configuration:

- **Key-value pairs** — Church address, phone, email, social links
- **Grouping** — Organized by group (contact, social, service_times)
- **JSON values** — Some settings store JSON-serialized values

### Users (`/admin/users`)

CMS user management (admin only):

- **List view** — All CMS users with roles
- **Invite** — Add new users by Clerk user ID
- **Role change** — Promote/demote roles
- **Remove** — Revoke CMS access

## Shared Admin Features

- **Table component** — `AdminTable.tsx` provides sortable, paginated data tables
- **Error boundaries** — Graceful error handling per section
- **Loading states** — Skeleton loading during data fetch
- **Empty states** — Helpful messages when no data exists
- **Confirmation dialogs** — Destructive actions require confirmation

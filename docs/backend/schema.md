# Database Schema

The Convex database schema defines all tables used by the application.

## Schema Location

`convex/schema.ts` — defines all tables with validation, indexes, and relationships.

## Tables Overview

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `events` | Church calendar events | by_date, by_category |
| `sermons` | Sermon metadata (YouTube) | by_date, by_speaker, by_series |
| `announcements` | News and announcements | by_date, by_priority, by_category |
| `prayerRequests` | Prayer request submissions | by_date, by_public |
| `staff` | Church leadership and staff | by_order, by_department |
| `ministries` | Ministry listings | by_order, by_category |
| `contactSubmissions` | Contact form entries | by_date |
| `pageSections` | CMS editable content blocks | by_page, by_page_section |
| `siteSettings` | CMS key-value settings | by_key |
| `media` | CMS media library | by_created |
| `cmsUsers` | CMS user roles | by_clerk_user |

## Table Definitions

### Events

```typescript
events: defineTable({
  title: v.string(),
  description: v.string(),
  startDate: v.string(),           // ISO 8601
  endDate: v.optional(v.string()),
  location: v.string(),
  category: v.union(
    v.literal("service"),
    v.literal("special"),
    v.literal("youth"),
    v.literal("community")
  ),
  imageUrl: v.optional(v.string()),
  isRecurring: v.boolean(),
  recurrencePattern: v.optional(
    v.union(v.literal("weekly"), v.literal("monthly"))
  ),
  isPublished: v.boolean(),
})
.index("by_date", ["startDate"])
.index("by_category", ["category"])
```

### Announcements

```typescript
announcements: defineTable({
  title: v.string(),
  content: v.string(),
  date: v.string(),                 // ISO 8601
  priority: v.union(
    v.literal("low"),
    v.literal("normal"),
    v.literal("high")
  ),
  category: v.union(
    v.literal("general"),
    v.literal("youth"),
    v.literal("ministry"),
    v.literal("community")
  ),
  imageUrl: v.optional(v.string()),
  expiresAt: v.optional(v.string()),
  isPinned: v.boolean(),
  isPublished: v.boolean(),
})
.index("by_date", ["date"])
.index("by_priority", ["priority"])
.index("by_category", ["category"])
```

### Staff

```typescript
staff: defineTable({
  name: v.string(),
  role: v.string(),
  title: v.string(),
  bio: v.string(),
  photoUrl: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  department: v.optional(v.string()),
  order: v.number(),
  isActive: v.boolean(),
  isPublished: v.boolean(),
})
.index("by_order", ["order"])
.index("by_department", ["department"])
```

### Ministries

```typescript
ministries: defineTable({
  name: v.string(),
  description: v.string(),
  leaderId: v.optional(v.id("staff")),  // Foreign key reference
  meetingTime: v.optional(v.string()),
  meetingLocation: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  category: v.union(
    v.literal("youth"),
    v.literal("adult"),
    v.literal("family"),
    v.literal("music")
  ),
  order: v.number(),
  isPublished: v.boolean(),
})
.index("by_order", ["order"])
.index("by_category", ["category"])
```

### Page Sections (CMS)

```typescript
pageSections: defineTable({
  pageId: v.string(),               // e.g. "home", "about"
  sectionKey: v.string(),          // e.g. "hero.title"
  title: v.optional(v.string()),
  content: v.string(),             // Text, HTML, or image URL
  contentType: v.union(
    v.literal("text"),
    v.literal("html"),
    v.literal("image"),
    v.literal("link")
  ),
  imageUrl: v.optional(v.string()),
  imageAlt: v.optional(v.string()),
  order: v.number(),
  isPublished: v.boolean(),
  metadata: v.optional(v.string()), // JSON string for extra data
})
.index("by_page", ["pageId"])
.index("by_page_section", ["pageId", "sectionKey"])
```

### Site Settings (CMS)

```typescript
siteSettings: defineTable({
  key: v.string(),                 // e.g. "church_address"
  value: v.string(),               // JSON stringified value
  label: v.optional(v.string()),   // Human-readable label
  group: v.optional(v.string()),   // Grouping category
})
.index("by_key", ["key"])
```

### CMS Users

```typescript
cmsUsers: defineTable({
  clerkUserId: v.string(),         // Clerk user ID
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  role: v.union(
    v.literal("viewer"),
    v.literal("editor"),
    v.literal("admin")
  ),
  createdAt: v.string(),
  updatedAt: v.string(),
})
.index("by_clerk_user", ["clerkUserId"])
```

## Validation

Convex uses `v` (validator) from `convex/values`:

- `v.string()` — String value
- `v.number()` — Numeric value
- `v.boolean()` — True/false
- `v.optional(v.string())` — Optional string
- `v.union(v.literal("a"), v.literal("b"))` — Enum values
- `v.id("tableName")` — Reference to another table

## Indexes

Indexes optimize query performance. Always use indexed fields in `.withIndex()` queries:

```typescript
// Good: Uses index
const events = await ctx.db
  .query("events")
  .withIndex("by_date", (q) => q.gte("startDate", today))
  .collect();

// Avoid: Full table scan (only for small tables)
const all = await ctx.db.query("events").collect();
```

## Adding a New Table

1. Add the table definition to `convex/schema.ts`
2. Create query functions in `convex/{table}Queries.ts`
3. Create mutation functions in `convex/{table}Mutations.ts`
4. Add to `convex/seed.ts` for development seed data if needed
5. Run `npx convex dev` to apply schema changes

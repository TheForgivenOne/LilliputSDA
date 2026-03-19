# Queries & Mutations

Convex queries read data; mutations write data. All are defined in the `convex/` directory.

## Query Functions

Queries are read-only functions that can subscribe to real-time updates.

### Location Pattern

| Table | Query File | Mutation File |
|-------|-----------|---------------|
| events | `convex/eventsQueries.ts` | `convex/eventsMutations.ts` |
| announcements | `convex/announcementsQueries.ts` | `convex/announcementsMutations.ts` |
| staff | `convex/staff.ts` | `convex/staff.ts` |
| ministries | `convex/ministries.ts` | `convex/ministries.ts` |
| prayer requests | `convex/prayerRequests.ts` | `convex/prayerRequests.ts` |
| contact | `convex/contact.ts` | `convex/contact.ts` |

## Query Pattern

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString();
    
    const events = await ctx.db
      .query("events")
      .withIndex("by_date", (q) => q.gte("startDate", today))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("asc")
      .take(10);
    
    return events;
  },
});
```

### Query Arguments

Use the `args` object to define required and optional parameters:

```typescript
export const listByCategory = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let eventsQuery = ctx.db.query("events");
    
    if (args.category) {
      eventsQuery = eventsQuery
        .withIndex("by_category", (q) => 
          q.eq("category", args.category)
        );
    }
    
    return eventsQuery.take(args.limit ?? 50);
  },
});
```

### Query Return Types

Queries return data directly. Use TypeScript for type safety:

```typescript
export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

// Return type is inferred: Promise<Event[]>
```

## Mutation Pattern

Mutations are write functions with ACID transaction guarantees.

### Basic Mutation

```typescript
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startDate: v.string(),
    location: v.string(),
    category: v.union(
      v.literal("service"),
      v.literal("special"),
      v.literal("youth"),
      v.literal("community")
    ),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", {
      ...args,
      isRecurring: false,
      isPublished: true,
    });
    return eventId;
  },
});
```

### Mutation with Auth Check

```typescript
export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = ctx.auth;
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    
    await ctx.db.delete(args.eventId);
  },
});
```

### Upsert Pattern

For CMS content that may or may not exist:

```typescript
export const upsertSection = mutation({
  args: {
    pageId: v.string(),
    sectionKey: v.string(),
    content: v.string(),
    contentType: v.union(
      v.literal("text"),
      v.literal("html"),
      v.literal("image"),
      v.literal("link")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pageSections")
      .withIndex("by_page_section", (q) =>
        q.eq("pageId", args.pageId).eq("sectionKey", args.sectionKey)
      )
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        contentType: args.contentType,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("pageSections", {
        ...args,
        isPublished: true,
        order: 0,
      });
    }
  },
});
```

## Calling from Client

Use the generated Convex client to call queries and mutations:

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query
const events = useQuery(api.eventsQueries.listUpcoming);

// Mutation
const createEvent = useMutation(api.eventsMutations.create);
await createEvent({ title: "VBS", description: "...", ... });
```

## Real-Time Subscriptions

Queries automatically subscribe to real-time updates. When data changes, the component re-renders:

```typescript
function EventsList() {
  // Automatically updates when events are added/edited/deleted
  const events = useQuery(api.eventsQueries.listUpcoming);
  
  if (!events) return <Skeleton />;
  
  return (
    <ul>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </ul>
  );
}
```

## Error Handling

Convex mutations throw errors that can be caught client-side:

```typescript
try {
  await createEvent({ title: "VBS", ... });
} catch (error) {
  console.error("Failed to create event:", error);
  // Show error toast to user
}
```

Best practice: mutations return errors as values rather than throwing:

```typescript
export const create = mutation({
  args: { ... },
  handler: async (ctx, args) => {
    // Return null on error instead of throwing
    if (!args.title) {
      return null;
    }
    return await ctx.db.insert("events", { ... });
  },
});
```

# Backend Authentication

Convex uses Clerk as the authentication provider. This document covers the integration details.

## Setup

### 1. Clerk Dashboard Configuration

In your Clerk dashboard:

1. Go to **Settings → Providers → Add custom provider**
2. Select **Convex** as the provider type
3. Note the **Domain** (e.g., `your-org.clerk.app`)
4. Note the **Application ID** (should be `convex`)

### 2. Environment Variables

```env
CLERK_FRONTEND_API_URL=https://your-org.clerk.app
```

### 3. Convex Auth Config (`convex/auth.config.ts`)

```typescript
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
```

### 4. Restart Convex

```bash
# Restart the convex dev server to apply auth config
npx convex dev
```

## Accessing Auth in Functions

### Server-Side (Convex)

```typescript
import { query, mutation } from "../_generated/server";

export const myQuery = query({
  args: {},
  handler: async (ctx) => {
    const identity = ctx.auth;
    
    if (!identity) {
      // Not authenticated
      return null;
    }
    
    // Get Clerk user ID
    const userId = identity.subject;
    
    // Check if user has a specific email
    const email = identity.email;
    
    // Get user's full name if available
    const name = identity.name;
    
    return { userId, email, name };
  },
});
```

### Auth Identity Properties

| Property | Type | Description |
|----------|------|-------------|
| `identity.subject` | string | Clerk user ID |
| `identity.email` | string | Primary email |
| `identity.name` | string | Full name |
| `identity.pictureUrl` | string | Profile picture URL |
| `identity.externalId` | string | External identifier |

## Protecting Mutations

Always check authentication in mutations that write data:

```typescript
export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = ctx.auth;
    
    // For public forms, auth may be null (unauthenticated users can submit)
    // For admin mutations, throw if not authenticated
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("contactSubmissions", {
      ...args,
      date: new Date().toISOString(),
      isRead: false,
    });
  },
});
```

## Role-Based Access Control

CMS roles are stored in the `cmsUsers` table:

### Checking Editor Role

```typescript
export const isEditor = query({
  args: {},
  handler: async (ctx) => {
    const identity = ctx.auth;
    if (!identity) return false;
    
    const cmsUser = await ctx.db
      .query("cmsUsers")
      .withIndex("by_clerk_user", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .first();
    
    return cmsUser?.role === "editor" || cmsUser?.role === "admin";
  },
});
```

### Protecting Admin Mutations

```typescript
export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = ctx.auth;
    if (!identity) throw new Error("Not authenticated");
    
    const cmsUser = await ctx.db
      .query("cmsUsers")
      .withIndex("by_clerk_user", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .first();
    
    if (cmsUser?.role !== "editor" && cmsUser?.role !== "admin") {
      throw new Error("Insufficient permissions");
    }
    
    await ctx.db.delete(args.eventId);
  },
});
```

## Adding CMS Users

CMS users must be added to the `cmsUsers` table manually (no self-registration):

```typescript
export const addCmsUser = mutation({
  args: {
    clerkUserId: v.string(),
    role: v.union(
      v.literal("viewer"),
      v.literal("editor"),
      v.literal("admin")
    ),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth;
    if (!identity) throw new Error("Not authenticated");
    
    // Only admins can add users
    const currentUser = await ctx.db
      .query("cmsUsers")
      .withIndex("by_clerk_user", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .first();
    
    if (currentUser?.role !== "admin") {
      throw new Error("Only admins can add CMS users");
    }
    
    const now = new Date().toISOString();
    return await ctx.db.insert("cmsUsers", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});
```

## Client-Side Auth State

### Using Clerk

```typescript
import { useUser, useClerk } from "@clerk/nextjs";

function UserProfile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  
  if (!user) return null;
  
  return (
    <div>
      <p>{user.fullName}</p>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Using Convex Auth

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function EditButton() {
  const isEditor = useQuery(api.cmsQueries.isEditor);
  
  if (!isEditor) return null;
  
  return <button>Edit Page</button>;
}
```

## Development vs Production

| Environment | Clerk Frontend API |
|-------------|-------------------|
| Local | `https://local-dev.clerk.app` or custom domain |
| Production | `https://your-org.clerk.app` |

Ensure the `CLERK_FRONTEND_API_URL` matches the environment.

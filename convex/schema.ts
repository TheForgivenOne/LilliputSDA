import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Events collection for church calendar
  events: defineTable({
    title: v.string(),
    description: v.string(),
    startDate: v.string(), // ISO 8601
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
    recurrencePattern: v.optional(v.union(v.literal("weekly"), v.literal("monthly"))),
  })
    .index("by_date", ["startDate"])
    .index("by_category", ["category"]),

  // Sermons collection with YouTube integration
  sermons: defineTable({
    title: v.string(),
    speaker: v.string(),
    date: v.string(), // ISO 8601
    youtubeUrl: v.string(),
    youtubeId: v.string(),
    scripture: v.string(),
    description: v.string(),
    series: v.optional(v.string()),
    thumbnailUrl: v.string(),
    duration: v.optional(v.string()),
  })
    .index("by_date", ["date"])
    .index("by_speaker", ["speaker"])
    .index("by_series", ["series"]),

  // Announcements/News collection
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    date: v.string(), // ISO 8601
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high")),
    category: v.union(
      v.literal("general"),
      v.literal("youth"),
      v.literal("ministry"),
      v.literal("community")
    ),
    imageUrl: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    isPinned: v.boolean(),
  })
    .index("by_date", ["date"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"]),

  // Prayer requests collection
  prayerRequests: defineTable({
    name: v.string(),
    email: v.string(),
    request: v.string(),
    isPublic: v.boolean(),
    isAnswered: v.boolean(),
    date: v.string(), // ISO 8601
  })
    .index("by_date", ["date"])
    .index("by_public", ["isPublic"]),

  // Staff/Leadership collection
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
  })
    .index("by_order", ["order"])
    .index("by_department", ["department"]),

  // Ministries collection
  ministries: defineTable({
    name: v.string(),
    description: v.string(),
    leaderId: v.optional(v.id("staff")),
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
  })
    .index("by_order", ["order"])
    .index("by_category", ["category"]),

  // Contact form submissions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    date: v.string(), // ISO 8601
    isRead: v.boolean(),
  })
    .index("by_date", ["date"]),
});

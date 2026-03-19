import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startDate: v.string(),
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("events", {
      ...args,
    });
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("service"),
      v.literal("special"),
      v.literal("youth"),
      v.literal("community")
    )),
    imageUrl: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.union(v.literal("weekly"), v.literal("monthly"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

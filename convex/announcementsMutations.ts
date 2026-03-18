import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("announcements", {
      ...args,
      date: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"))),
    category: v.optional(v.union(
      v.literal("general"),
      v.literal("youth"),
      v.literal("ministry"),
      v.literal("community")
    )),
    imageUrl: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const togglePin = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.get(args.id);
    if (announcement) {
      await ctx.db.patch(args.id, { isPinned: !announcement.isPinned });
    }
  },
});

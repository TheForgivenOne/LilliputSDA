import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireEditor, requireAdmin } from "../lib/auth";

export const create = mutation({
  args: {
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
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireEditor(ctx);
    const id = await ctx.db.insert("ministries", {
      ...args,
      order: args.order ?? 0,
    });
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("ministries"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    leaderId: v.optional(v.id("staff")),
    meetingTime: v.optional(v.string()),
    meetingLocation: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("youth"),
      v.literal("adult"),
      v.literal("family"),
      v.literal("music")
    )),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireEditor(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteMinistry = mutation({
  args: { id: v.id("ministries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireEditor, requireAdmin } from "../lib/auth";

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    title: v.string(),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireEditor(ctx);
    const id = await ctx.db.insert("staff", {
      name: args.name,
      role: args.role,
      title: args.title,
      bio: args.bio ?? "",
      photoUrl: args.photoUrl,
      email: args.email,
      phone: args.phone,
      department: args.department,
      order: args.order ?? 0,
      isActive: args.isActive ?? true,
    });
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("staff"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireEditor(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

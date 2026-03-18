import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    request: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("prayerRequests", {
      name: args.name,
      email: args.email,
      request: args.request,
      isPublic: args.isPublic,
      isAnswered: false,
      date: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const markAnswered = mutation({
  args: { id: v.id("prayerRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isAnswered: true });
  },
});

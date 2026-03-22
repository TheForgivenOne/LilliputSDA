import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteMedia = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.storage.delete(args.storageId);
  },
});

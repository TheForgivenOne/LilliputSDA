import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireEditor, requireAdmin } from "../lib/auth";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contactSubmissions", {
      name: args.name,
      email: args.email,
      message: args.message,
      date: new Date().toISOString(),
      isRead: false,
    });

    fetch(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL || ""}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact",
        data: {
          name: args.name,
          email: args.email,
          message: args.message,
        },
      }),
    }).catch((err) => {
      console.error("Failed to send contact email notification:", err);
    });

    return { success: true };
  },
});

export const markAsRead = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await requireEditor(ctx);
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const deleteSubmission = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

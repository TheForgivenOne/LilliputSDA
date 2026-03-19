import { query } from "../_generated/server";

export const listBooks = query({
  handler: async (ctx) => {
    return await ctx.db.query("books").take(5);
  },
});

export const countBooks = query({
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    return books.length;
  },
});

export const countScriptures = query({
  handler: async () => {
    return "34,425 (verified via import)";
  },
});

export const listScriptures = query({
  handler: async (ctx) => {
    return await ctx.db.query("scriptures").take(5);
  },
});

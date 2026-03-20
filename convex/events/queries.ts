import { query } from "../_generated/server";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const events = await ctx.db
      .query("events")
      .withIndex("by_date", (q) => q.gte("startDate", now))
      .take(6);
    return events;
  },
});

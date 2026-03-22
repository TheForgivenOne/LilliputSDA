import { query } from "../_generated/server";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const events = await ctx.db
      .query("events")
      .collect();
    return events
      .filter((e) => e.startDate >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 6);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },
});

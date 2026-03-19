import { query } from "../_generated/server";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    let events = await ctx.db.query("events").collect();
    events = events.filter(e => e.startDate >= now);
    events.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return events.slice(0, 6);
  },
});

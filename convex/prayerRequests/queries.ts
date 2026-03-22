import { query } from "../_generated/server";

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const prayers = await ctx.db.query("prayerRequests").collect();
    return prayers.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
});

import { query } from "./_generated/server";

interface Ministry {
  order: number;
}

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const ministries = await ctx.db.query("ministries").collect();
    return ministries.sort((a: Ministry, b: Ministry) => a.order - b.order);
  },
});

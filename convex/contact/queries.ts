import { query } from "../_generated/server";
import { requireAdmin } from "../lib/auth";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const submissions = await ctx.db.query("contactSubmissions").collect();
    return submissions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
});

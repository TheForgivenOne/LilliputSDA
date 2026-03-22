import { query } from "../_generated/server";
import { requireAdmin } from "../lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return [];
  },
});

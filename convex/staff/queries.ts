import { query } from "../_generated/server";

interface StaffMember {
  isActive: boolean;
  order: number;
}

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const staff = await ctx.db.query("staff").collect();
    return staff.sort((a: StaffMember, b: StaffMember) => a.order - b.order);
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const staff = await ctx.db.query("staff").collect();
    return staff
      .filter((s: StaffMember) => s.isActive)
      .sort((a: StaffMember, b: StaffMember) => a.order - b.order);
  },
});

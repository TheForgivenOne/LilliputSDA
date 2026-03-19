import { query } from "../_generated/server";

interface Announcement {
  expiresAt?: string;
  isPinned?: boolean;
  date: string;
}

export const listLatest = query({
  args: {},
  handler: async (ctx) => {
    let announcements = await ctx.db.query("announcements").collect();
    const now = new Date().toISOString();
    announcements = announcements.filter((a: Announcement) => 
      !a.expiresAt || a.expiresAt > now
    );
    const pinned = announcements.filter((a: Announcement) => a.isPinned);
    const nonPinned = announcements.filter((a: Announcement) => !a.isPinned);
    const sorted = [...pinned, ...nonPinned].sort((a: Announcement, b: Announcement) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    return sorted.slice(0, 10);
  },
});

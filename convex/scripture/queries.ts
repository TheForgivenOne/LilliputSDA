import { query } from "../_generated/server";
import { v } from "convex/values";

type ScriptureResult = {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
};

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const scriptures = await ctx.db.query("scriptures").take(1000);
    const searchLower = args.query.toLowerCase();
    
    const results: ScriptureResult[] = [];
    for (const s of scriptures) {
      if (s.heading) continue;
      
      const textLower = s.text.toLowerCase();
      const refLower = s.reference.toLowerCase();
      
      if (!textLower.includes(searchLower) && !refLower.includes(searchLower)) continue;
      
      const parts = s.reference.split(':');
      if (parts.length < 4) continue;
      
      const book = parts[1];
      const chapter = parseInt(parts[2], 10);
      const verse = parseInt(parts[3], 10);
      
      if (isNaN(chapter) || isNaN(verse)) continue;
      
      results.push({
        reference: `${book} ${chapter}:${verse}`,
        text: s.text.replace(/\*[pln]/g, ''),
        book,
        chapter,
        verse
      });
      
      if (results.length >= limit) break;
    }
    
    return results;
  },
});

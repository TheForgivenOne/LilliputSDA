import { query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allScriptures = await ctx.db.query("scriptures").take(1000);
    
    const results: {
      reference: string;
      text: string;
      book: string;
      chapter: number;
      verse: number;
    }[] = [];
    
    const searchLower = (args.query as string).toLowerCase();
    
    for (const s of allScriptures) {
      if (s.heading) continue;
      
      const textLower = s.text.toLowerCase();
      const refLower = s.reference.toLowerCase();
      
      if (textLower.includes(searchLower) || refLower.includes(searchLower)) {
        const parts = s.reference.split(':');
        if (parts.length >= 4) {
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
          
          if (results.length >= (args.limit || 5)) break;
        }
      }
    }
    
    return results;
  },
});

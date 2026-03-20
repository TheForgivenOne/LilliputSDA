import { query } from "../_generated/server";
import { v } from "convex/values";

type ScriptureResult = {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
};

const scriptureCache = new Map<string, { data: ScriptureResult[]; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function parseScripture(s: { reference: string; text: string; heading?: string }, searchLower: string): ScriptureResult | null {
  if (s.heading) return null;
  
  const textLower = s.text.toLowerCase();
  const refLower = s.reference.toLowerCase();
  
  if (!textLower.includes(searchLower) && !refLower.includes(searchLower)) return null;
  
  const parts = s.reference.split(':');
  if (parts.length < 4) return null;
  
  const book = parts[1];
  const chapter = parseInt(parts[2], 10);
  const verse = parseInt(parts[3], 10);
  
  if (isNaN(chapter) || isNaN(verse)) return null;
  
  return {
    reference: `${book} ${chapter}:${verse}`,
    text: s.text.replace(/\*[pln]/g, ''),
    book,
    chapter,
    verse
  };
}

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const cacheKey = `${args.query}:${limit}`;
    const cached = scriptureCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    const allScriptures = await ctx.db.query("scriptures").take(1000);
    const searchLower = args.query.toLowerCase();
    
    const results: ScriptureResult[] = [];
    for (const s of allScriptures) {
      const result = parseScripture(s, searchLower);
      if (result) {
        results.push(result);
        if (results.length >= limit) break;
      }
    }
    
    scriptureCache.set(cacheKey, {
      data: results,
      expiry: Date.now() + CACHE_TTL
    });
    
    return results;
  },
});

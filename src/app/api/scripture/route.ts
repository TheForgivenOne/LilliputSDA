import { NextRequest, NextResponse } from 'next/server';

const SCRIPTURE_CACHE_TIME = 60 * 60; // 1 hour

let scripturesCache: ScriptureItem[] | null = null;
let cacheTime = 0;

async function getScriptures() {
  const now = Date.now();
  if (scripturesCache && now - cacheTime < SCRIPTURE_CACHE_TIME * 1000) {
    return scripturesCache;
  }
  
  const scripturesModule = await import('../../../../public/scriptures.json');
  scripturesCache = scripturesModule.default as ScriptureItem[];
  cacheTime = now;
  return scripturesCache;
}

interface ScriptureItem {
  o: number;
  r: string;
  t: string;
  h?: number;
}

interface ScriptureResult {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>]/g, '')
    .substring(0, 100)
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const limitParam = searchParams.get('limit');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required', code: 'MISSING_QUERY' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeQuery(query);
    if (!sanitizedQuery) {
      return NextResponse.json(
        { error: 'Invalid query parameter', code: 'INVALID_QUERY' },
        { status: 400 }
      );
    }

    let limit = 5;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: 'Limit must be between 1 and 50', code: 'INVALID_LIMIT' },
          { status: 400 }
        );
      }
      limit = parsed;
    }

    const data = await getScriptures();
    const items = data as ScriptureItem[];
    
    const results: ScriptureResult[] = [];
    
    for (const item of items) {
      if (item.h) continue;
      
      const text = item.t.toLowerCase();
      const reference = item.r;
      
      if (text.includes(sanitizedQuery) || reference.toLowerCase().includes(sanitizedQuery)) {
        const parts = reference.split(':');
        if (parts.length >= 4) {
          const book = parts[1];
          const chapter = parseInt(parts[2], 10);
          const verse = parseInt(parts[3], 10);
          
          if (isNaN(chapter) || isNaN(verse)) continue;
          
          results.push({
            reference: `${book} ${chapter}:${verse}`,
            text: item.t.replace(/\*[pln]/g, ''),
            book,
            chapter,
            verse
          });
          
          if (results.length >= limit) break;
        }
      }
    }

    return NextResponse.json({
      query: sanitizedQuery,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Scripture API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }
    
    const query = body.q?.toString().toLowerCase().trim() || '';
    const limit = body.limit;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required', code: 'MISSING_QUERY' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeQuery(query);
    if (!sanitizedQuery) {
      return NextResponse.json(
        { error: 'Invalid query parameter', code: 'INVALID_QUERY' },
        { status: 400 }
      );
    }

    let limitValue = 5;
    if (limit !== undefined) {
      const parsed = parseInt(limit, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: 'Limit must be between 1 and 50', code: 'INVALID_LIMIT' },
          { status: 400 }
        );
      }
      limitValue = parsed;
    }

    const data = await getScriptures();
    const items = data as ScriptureItem[];
    const results: ScriptureResult[] = [];
    
    for (const item of items) {
      if (item.h) continue;
      
      const text = item.t.toLowerCase();
      const reference = item.r;
      
      if (text.includes(sanitizedQuery) || reference.toLowerCase().includes(sanitizedQuery)) {
        const parts = reference.split(':');
        if (parts.length >= 4) {
          const book = parts[1];
          const chapter = parseInt(parts[2], 10);
          const verse = parseInt(parts[3], 10);
          
          if (isNaN(chapter) || isNaN(verse)) continue;
          
          results.push({
            reference: `${book} ${chapter}:${verse}`,
            text: item.t.replace(/\*[pln]/g, ''),
            book,
            chapter,
            verse
          });
          
          if (results.length >= limitValue) break;
        }
      }
    }

    return NextResponse.json({
      query: sanitizedQuery,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Scripture API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import scriptures from '../../../data/scriptures.json';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const data = scriptures as ScriptureItem[];
  
  // Filter verses that match the query
  const results: ScriptureResult[] = [];
  
  for (const item of data) {
    // Skip headers (h property)
    if (item.h) continue;
    
    const text = item.t.toLowerCase();
    const reference = item.r; // format: "niv:Genesis:1:1"
    
    if (text.includes(query) || reference.toLowerCase().includes(query)) {
      // Parse reference
      const parts = reference.split(':');
      if (parts.length >= 4) {
        const book = parts[1];
        const chapter = parseInt(parts[2]);
        const verse = parseInt(parts[3]);
        
        results.push({
          reference: `${book} ${chapter}:${verse}`,
          text: item.t.replace(/\*[pln]/g, ''), // Remove formatting markers
          book,
          chapter,
          verse
        });
        
        if (results.length >= limit) break;
      }
    }
  }

  return NextResponse.json({
    query,
    count: results.length,
    results
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const query = body.q?.toLowerCase() || '';
  const limit = body.limit || 5;

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const data = scriptures as ScriptureItem[];
  const results: ScriptureResult[] = [];
  
  for (const item of data) {
    if (item.h) continue;
    
    const text = item.t.toLowerCase();
    const reference = item.r;
    
    if (text.includes(query) || reference.toLowerCase().includes(query)) {
      const parts = reference.split(':');
      if (parts.length >= 4) {
        const book = parts[1];
        const chapter = parseInt(parts[2]);
        const verse = parseInt(parts[3]);
        
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
    query,
    count: results.length,
    results
  });
}
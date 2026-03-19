import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from "../../../../convex/_generated/api";
import type { ScriptureResult } from "@/types";

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

    const scriptures = await fetchQuery(api.scripture.search, { 
      query: sanitizedQuery,
      limit 
    });
    
    return NextResponse.json({
      query: sanitizedQuery,
      count: scriptures.length,
      results: scriptures
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

    const scriptures = await fetchQuery(api.scripture.search, { 
      query: sanitizedQuery,
      limit: limitValue 
    });
    
    return NextResponse.json({
      query: sanitizedQuery,
      count: scriptures.length,
      results: scriptures
    });
  } catch (error) {
    console.error('Scripture API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

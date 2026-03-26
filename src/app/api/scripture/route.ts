import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, scriptureLimiter } from "@/lib/rate-limit";

const KNOWN_REFERENCES: Record<string, string> = {
  "genesis 1:1": "In the beginning God created the heaven and the earth.",
  "john 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  "psalm 23:1": "The LORD is my shepherd; I shall not want.",
  "psalm 23:4": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
  "proverbs 3:5": "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
  "proverbs 3:6": "In all thy ways acknowledge him, and he shall direct thy paths.",
  "isaiah 40:31": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as the eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  "matthew 28:19": "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
  "matthew 28:20": "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
  "romans 8:28": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
  "romans 12:1": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
  "1 corinthians 13:13": "And now these three remain: faith, hope, and love. But the greatest of these is love.",
  "ephesians 2:8": "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.",
  "philippians 4:13": "I can do all things through Christ which strengtheneth me.",
  "philippians 4:6": "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
  "hebrews 11:1": "Now faith is the substance of things hoped for, the evidence of things not seen.",
  "hebrews 12:1": "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.",
  "1 john 1:9": "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
  "1 john 4:8": "He that loveth not knoweth not God; for God is love.",
  "revelation 3:20": "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
  "revelation 21:4": "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
};

function getClientIP(request: Request): string {
  const headers = request.headers.get("x-forwarded-for");
  if (headers) {
    return headers.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "anonymous";
}

function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>]/g, "")
    .substring(0, 100)
    .trim()
    .toLowerCase();
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(scriptureLimiter, ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const limitParam = searchParams.get("limit");
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required', code: "MISSING_QUERY" },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeQuery(query);
    if (!sanitizedQuery) {
      return NextResponse.json(
        { error: "Invalid query parameter", code: "INVALID_QUERY" },
        { status: 400 }
      );
    }

    let limit = 5;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: "Limit must be between 1 and 50", code: "INVALID_LIMIT" },
          { status: 400 }
        );
      }
      limit = parsed;
    }

    const results: { reference: string; text: string }[] = [];

    for (const [reference, text] of Object.entries(KNOWN_REFERENCES)) {
      if (reference.includes(sanitizedQuery) || text.toLowerCase().includes(sanitizedQuery)) {
        results.push({ reference, text });
        if (results.length >= limit) break;
      }
    }

    if (results.length === 0 && !sanitizedQuery.includes(" ")) {
      for (const [reference, text] of Object.entries(KNOWN_REFERENCES)) {
        const refParts = reference.split(" ");
        if (refParts[0]?.startsWith(sanitizedQuery)) {
          results.push({ reference, text });
          if (results.length >= limit) break;
        }
      }
    }
    
    return NextResponse.json({
      query: sanitizedQuery,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Scripture API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

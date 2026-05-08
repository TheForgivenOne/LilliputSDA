import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, youtubeLimiter } from "@/lib/rate-limit";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC5PpTmwN_ZUyM1xgwQR-_8w";

const FETCH_TIMEOUT = 10000;

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
}

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

function decodeHtmlEntities(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function parseYouTubeDuration(duration: string | undefined): string {
  if (!duration) return "0:00";
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function sanitizeNumber(value: string | number | undefined, defaultValue: string = "0"): string {
  if (value === undefined || value === null) return defaultValue;
  const num = parseInt(String(value), 10);
  return isNaN(num) ? defaultValue : String(num);
}

function getYouTubeThumbnailFallback(videoId: string, quality: "default" | "medium" | "high" | "maxres" = "high"): string {
  const qualities: Record<string, string> = {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
  return qualities[quality];
}

async function fetchWithTimeout(url: string, timeout: number = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      next: { revalidate: 600 },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(youtubeLimiter, ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }
  
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key not configured");
    }

    const { searchParams } = new URL(request.url);
    const maxResultsParam = searchParams.get("maxResults");
    
    let maxResults = 12;
    if (maxResultsParam) {
      const parsed = parseInt(maxResultsParam, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: "maxResults must be between 1 and 50", code: "INVALID_PARAM" },
          { status: 400 }
        );
      }
      maxResults = parsed;
    }

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&type=video&order=date&maxResults=${maxResults}`;
    
    let searchResponse: Response;
    try {
      searchResponse = await fetchWithTimeout(searchUrl);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out", code: "TIMEOUT" },
          { status: 504 }
        );
      }
      throw error;
    }
    
    if (!searchResponse.ok) {
      console.error("YouTube Search API error:", searchResponse.status);
      
      if (searchResponse.status === 403) {
        return NextResponse.json(
          { error: "YouTube API quota exceeded", code: "QUOTA_EXCEEDED" },
          { status: 403 }
        );
      }
      if (searchResponse.status === 401) {
        return NextResponse.json(
          { error: "YouTube API key is invalid", code: "INVALID_KEY" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `YouTube API error: ${searchResponse.status}`, code: "API_ERROR" },
        { status: searchResponse.status }
      );
    }

    let searchData;
    try {
      searchData = await searchResponse.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid response from YouTube API", code: "INVALID_RESPONSE" },
        { status: 502 }
      );
    }
    
    if (!searchData.items || searchData.items.length === 0) {
      return NextResponse.json({ videos: [], count: 0 });
    }
    
    const videoIds = (searchData.items as YouTubeSearchItem[])
      .map((item) => item.id?.videoId)
      .filter((id: string | undefined): id is string => !!id && id.length === 11)
      .join(",");
    
    if (!videoIds) {
      return NextResponse.json({ videos: [], count: 0 });
    }
    
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`;
    
    let detailsResponse: Response;
    try {
      detailsResponse = await fetchWithTimeout(detailsUrl);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out", code: "TIMEOUT" },
          { status: 504 }
        );
      }
      throw error;
    }
    
    if (!detailsResponse.ok) {
      console.error("YouTube Videos API error:", detailsResponse.status);
      return NextResponse.json(
        { error: `YouTube API error: ${detailsResponse.status}`, code: "API_ERROR" },
        { status: detailsResponse.status }
      );
    }
    
    let detailsData;
    try {
      detailsData = await detailsResponse.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid response from YouTube API", code: "INVALID_RESPONSE" },
        { status: 502 }
      );
    }
    
    const videoDetails: Record<string, YouTubeVideoItem> = {};
    (detailsData.items as YouTubeVideoItem[])?.forEach((item) => {
      if (item.id) {
        videoDetails[item.id] = item;
      }
    });

    const videos: YouTubeVideo[] = (searchData.items as YouTubeSearchItem[])
      .filter((item) => item.id?.videoId)
      .map((item) => {
        const videoId = item.id.videoId;
        const details = videoDetails[videoId] || {};
        
        const thumbnails = item.snippet?.thumbnails || {};
        const thumbnailUrl = thumbnails.maxres?.url || 
                            thumbnails.standard?.url || 
                            thumbnails.high?.url || 
                            thumbnails.medium?.url || 
                            getYouTubeThumbnailFallback(videoId, "high");

        const title = decodeHtmlEntities(item.snippet?.title) || "Untitled Video";
        const description = decodeHtmlEntities(item.snippet?.description) || "";
        
        return {
          id: videoId,
          title: title.substring(0, 200),
          description: description.substring(0, 5000),
          publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
          thumbnailUrl,
          duration: parseYouTubeDuration(details.contentDetails?.duration),
          viewCount: sanitizeNumber(details.statistics?.viewCount),
        };
      });

    return NextResponse.json({ 
      videos,
      count: videos.length
    });

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    
    const fallbackVideos: YouTubeVideo[] = [
      {
        id: "dQw4w9WgXcQ",
        title: "Welcome to Lilliput SDA Church",
        description: "Join us for worship every Sabbath at 11:00 AM.",
        publishedAt: new Date().toISOString(),
        thumbnailUrl: getYouTubeThumbnailFallback("dQw4w9WgXcQ", "high"),
        duration: "3:45",
        viewCount: "0",
      },
      {
        id: "example1",
        title: "Sabbath School - Growing in Faith",
        description: "Our Sabbath School program helps us grow together in God's Word.",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        thumbnailUrl: getYouTubeThumbnailFallback("example1", "high"),
        duration: "45:00",
        viewCount: "0",
      },
      {
        id: "example2",
        title: "Youth Ministry Highlights",
        description: "See what our young people are doing in the community.",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        thumbnailUrl: getYouTubeThumbnailFallback("example2", "high"),
        duration: "12:30",
        viewCount: "0",
      },
    ];
    
    return NextResponse.json(
      { 
        error: "Using cached/fallback content", 
        code: "FALLBACK", 
        videos: fallbackVideos,
        count: fallbackVideos.length,
      },
      { status: 200 }
    );
  }
}

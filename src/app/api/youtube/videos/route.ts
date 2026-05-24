import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, youtubeLimiter, redis } from "@/lib/rate-limit";
import type { VideoStatus } from "@/types";

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
  status: VideoStatus;
  scheduledStartTime?: string;
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
    liveBroadcastContent?: string;
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
    liveBroadcastContent?: string;
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
  liveStreamingDetails?: {
    actualStartTime?: string;
    actualEndTime?: string;
    scheduledStartTime?: string;
    scheduledEndTime?: string;
    concurrentViewers?: string;
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

const CACHE_TTL_NORMAL = 600;    // 10 min — no live streams
const CACHE_TTL_LIVE = 60;       // 1 min — live stream active
const CACHE_TTL_UPCOMING = 300;  // 5 min — upcoming stream within range
const CACHE_TTL_STALE = 86400;   // 24 h — last-known-good backup
const CACHE_KEY_PREFIX = "youtube:videos";
const STALE_KEY_PREFIX = "youtube:videos:stale";

interface CachedResponse {
  videos: YouTubeVideo[];
  count: number;
  liveCount: number;
  upcomingCount: number;
  cachedAt: number;
}

async function getCache(key: string): Promise<CachedResponse | null> {
  if (!redis) return null;
  try {
    return await redis.get<CachedResponse>(key);
  } catch {
    return null;
  }
}

async function setCache(key: string, value: CachedResponse, ttl: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // Non-critical — log but don't fail the request
    console.warn("[YouTube] Failed to write cache");
  }
}

async function fetchWithTimeout(url: string, timeout: number = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchSearchResults(url: string): Promise<YouTubeSearchItem[]> {
  let response: Response;
  try {
    response = await fetchWithTimeout(url);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 403) throw new Error("QUOTA_EXCEEDED");
    if (response.status === 401) throw new Error("INVALID_KEY");
    throw new Error(`YouTube API error: ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("INVALID_RESPONSE");
  }

  return data.items || [];
}

function determineStatus(
  liveBroadcastContent: string | undefined,
  liveStreamingDetails: YouTubeVideoItem["liveStreamingDetails"]
): VideoStatus {
  if (liveStreamingDetails?.actualEndTime) return "past";
  if (liveStreamingDetails?.actualStartTime && !liveStreamingDetails.actualEndTime) return "live";
  if (liveStreamingDetails?.scheduledStartTime && !liveStreamingDetails.actualStartTime) return "upcoming";

  if (liveBroadcastContent === "live") return "live";
  if (liveBroadcastContent === "upcoming") return "upcoming";
  return "past";
}

function mapVideo(
  item: YouTubeSearchItem,
  details: YouTubeVideoItem | undefined
): YouTubeVideo {
  const videoId = item.id.videoId;
  // Prefer details thumbnails (stable) over search snippet thumbnails.
  // Skip maxres: the API returns the URL even when the image doesn't exist,
  // causing 404s for videos uploaded after YouTube changed their encoding pipeline.
  const dt = details?.snippet?.thumbnails || {};
  const st = item.snippet?.thumbnails || {};
  const thumbnailUrl =
    dt.standard?.url ||
    dt.high?.url ||
    st.standard?.url ||
    st.high?.url ||
    dt.medium?.url ||
    st.medium?.url ||
    getYouTubeThumbnailFallback(videoId, "high");

  const title = decodeHtmlEntities(item.snippet?.title) || "Untitled Video";
  const description = decodeHtmlEntities(item.snippet?.description) || "";

  const status = determineStatus(
    item.snippet?.liveBroadcastContent,
    details?.liveStreamingDetails
  );

  return {
    id: videoId,
    title: title.substring(0, 200),
    description: description.substring(0, 5000),
    publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
    thumbnailUrl,
    duration: parseYouTubeDuration(details?.contentDetails?.duration),
    viewCount: sanitizeNumber(details?.statistics?.viewCount),
    status,
    scheduledStartTime: details?.liveStreamingDetails?.scheduledStartTime || undefined,
  };
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

    const cacheKey = `${CACHE_KEY_PREFIX}:${maxResults}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const baseSearchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video`;
    const upcomingSearchUrl = `${baseSearchUrl}&eventType=upcoming&maxResults=5`;
    const regularSearchUrl = `${baseSearchUrl}&order=date&maxResults=${maxResults}`;

    let regularItems: YouTubeSearchItem[] = [];
    let upcomingItems: YouTubeSearchItem[] = [];

    try {
      [regularItems, upcomingItems] = await Promise.all([
        fetchSearchResults(regularSearchUrl),
        fetchSearchResults(upcomingSearchUrl),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "TIMEOUT") {
        return NextResponse.json(
          { error: "Request timed out", code: "TIMEOUT" },
          { status: 504 }
        );
      }
      if (message === "QUOTA_EXCEEDED") {
        const stale = await getCache(`${STALE_KEY_PREFIX}:${maxResults}`);
        if (stale) {
          return NextResponse.json(stale, {
            headers: { "X-Cache": "STALE" },
          });
        }
        return NextResponse.json(
          { error: "YouTube API quota exceeded", code: "QUOTA_EXCEEDED" },
          { status: 403 }
        );
      }
      if (message === "INVALID_KEY") {
        return NextResponse.json(
          { error: "YouTube API key is invalid", code: "INVALID_KEY" },
          { status: 401 }
        );
      }
      if (message.startsWith("YouTube API error:")) {
        const statusCode = parseInt(message.split(":").pop()?.trim() || "500", 10);
        return NextResponse.json(
          { error: message, code: "API_ERROR" },
          { status: statusCode }
        );
      }
      throw err;
    }

    const seenIds = new Set<string>();
    const allItems: { item: YouTubeSearchItem; priority: number }[] = [];

    for (const item of regularItems) {
      const id = item.id?.videoId;
      if (id && id.length === 11 && !seenIds.has(id)) {
        seenIds.add(id);
        allItems.push({ item, priority: 0 });
      }
    }

    for (const item of upcomingItems) {
      const id = item.id?.videoId;
      if (id && id.length === 11 && !seenIds.has(id)) {
        seenIds.add(id);
        allItems.push({ item, priority: 1 });
      }
    }

    if (allItems.length === 0) {
      return NextResponse.json({ videos: [], count: 0 });
    }

    const videoIds = allItems.map((e) => e.item.id.videoId).join(",");

    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics,liveStreamingDetails`;

    let detailsResponse: Response;
    try {
      detailsResponse = await fetch(detailsUrl, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
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

    const videos: YouTubeVideo[] = allItems.map(({ item }) => {
      const videoId = item.id.videoId;
      return mapVideo(item, videoDetails[videoId]);
    });

    videos.sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (a.status !== "live" && b.status === "live") return 1;
      if (a.status === "upcoming" && b.status === "upcoming") {
        if (a.scheduledStartTime && b.scheduledStartTime) {
          return new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime();
        }
        return 0;
      }
      if (a.status === "upcoming") return -1;
      if (b.status === "upcoming") return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    const limitedVideos = videos.slice(0, maxResults);
    const liveCount = videos.filter((v) => v.status === "live").length;
    const upcomingCount = videos.filter((v) => v.status === "upcoming").length;

    const payload: CachedResponse = {
      videos: limitedVideos,
      count: limitedVideos.length,
      liveCount,
      upcomingCount,
      cachedAt: Date.now(),
    };

    const ttl = liveCount > 0 ? CACHE_TTL_LIVE : upcomingCount > 0 ? CACHE_TTL_UPCOMING : CACHE_TTL_NORMAL;
    await Promise.all([
      setCache(cacheKey, payload, ttl),
      setCache(`${STALE_KEY_PREFIX}:${maxResults}`, payload, CACHE_TTL_STALE),
    ]);

    return NextResponse.json(payload, {
      headers: { "X-Cache": "MISS" },
    });

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);

    return NextResponse.json(
      {
        error: "Service temporarily unavailable",
        code: "SERVICE_UNAVAILABLE",
        videos: [],
        count: 0,
        liveCount: 0,
        upcomingCount: 0,
      },
      { status: 503 }
    );
  }
}

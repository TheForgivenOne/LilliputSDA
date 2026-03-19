import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { YouTubeVideo } from "@/types";

/**
 * Combines class names with Tailwind CSS merging support
 * Uses clsx for conditional class names and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function - delays execution until after wait milliseconds
 * of no new calls. Useful for search inputs, window resize, etc.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures func is called at most once per wait milliseconds.
 * Useful for scroll handlers, mouse movement, etc.
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    const later = () => {
      lastTime = Date.now();
      timeout = null;
      func(...args);
    };

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleDateString(userLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to short locale string
 */
export function formatDateShort(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleDateString(userLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time to locale string
 */
export function formatTime(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleTimeString(userLocale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format number with locale-aware separators
 */
export function formatNumber(num: number | string, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return String(num);
  return new Intl.NumberFormat(userLocale).format(value);
}

/**
 * Get user's locale from browser
 */
export function getUserLocale(): string {
  if (typeof navigator !== 'undefined') {
    return (navigator as Navigator & { userLanguage?: string }).language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'en-US';
  }
  return 'en-US';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate placeholder image URL
 */
export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const encodedText = text ? encodeURIComponent(text) : `${width}x${height}`;
  return `https://placehold.co/${width}x${height}/d97706/white?text=${encodedText}`;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: "default" | "medium" | "high" | "max" = "high"): string {
  const qualities = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    max: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}.jpg`;
}

/**
 * YouTube API integration for fetching channel videos
 */
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC5PpTmwN_ZUyM1xgwQR-_8w"; // Lilliput SDA Media channel ID (@lilliputsdamedia)

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
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
}

/**
 * Fetch videos from YouTube channel using Data API v3
 */
export async function fetchYouTubeVideos(maxResults: number = 12): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured. Returning empty array.");
    return [];
  }

  try {
    // First, search for videos from the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&type=video&order=date&maxResults=${maxResults}`;
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      throw new Error(`YouTube Search API error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      console.log("No videos found from channel");
      return [];
    }
    
    // Extract video IDs
    const videoIds = (searchData.items as YouTubeSearchItem[])
      .map((item) => item.id.videoId)
      .filter((id: string | undefined) => id)
      .join(",");
    
    if (!videoIds) {
      return [];
    }
    
    // Fetch video details for duration and view count
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`;
    
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      throw new Error(`YouTube Videos API error: ${detailsResponse.status} ${detailsResponse.statusText} - ${errorText}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    const videoDetails: Record<string, YouTubeVideoItem> = {};
    (detailsData.items as YouTubeVideoItem[])?.forEach((item) => {
      videoDetails[item.id] = item;
    });

    return (searchData.items as YouTubeSearchItem[])
      .filter((item) => item.id.videoId)
      .map((item) => {
        const details = videoDetails[item.id.videoId] || {};
        const duration = details.contentDetails?.duration || "PT0M";
        
        // Convert ISO 8601 duration to readable format (PT#M#S)
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        let readableDuration = "0:00";
        if (match) {
          const hours = match[1] ? parseInt(match[1]) : 0;
          const minutes = match[2] ? parseInt(match[2]) : 0;
          const seconds = match[3] ? parseInt(match[3]) : 0;
          
          if (hours > 0) {
            readableDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            readableDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
        }

        // Get the best available thumbnail from search results
        const thumbnails = item.snippet.thumbnails || {};
        const thumbnailUrl = thumbnails.maxres?.url || 
                            thumbnails.standard?.url || 
                            thumbnails.high?.url || 
                            thumbnails.medium?.url || 
                            thumbnails.default?.url ||
                            getYouTubeThumbnail(item.id.videoId, "high");
        
        return {
          id: item.id.videoId,
          title: decodeHtmlEntities(item.snippet.title),
          description: decodeHtmlEntities(item.snippet.description),
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl,
          duration: readableDuration,
          viewCount: details.statistics?.viewCount || "0",
        };
      });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

/**
 * Fetch a single video by ID
 */
export async function fetchYouTubeVideo(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet,contentDetails,statistics`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0];
    const duration = item.contentDetails?.duration || "PT0M";
    const match = duration.match(/PT(\d+M)?(\d+S)?/);
    let readableDuration = "0:00";
    if (match) {
      const minutes = match[1] ? parseInt(match[1]) : 0;
      const seconds = match[2] ? parseInt(match[2]) : 0;
      readableDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Get the best available thumbnail from video details
    const thumbnails = item.snippet.thumbnails || {};
    const thumbnailUrl = thumbnails.maxres?.url || 
                        thumbnails.standard?.url || 
                        thumbnails.high?.url || 
                        thumbnails.medium?.url || 
                        thumbnails.default?.url ||
                        getYouTubeThumbnail(videoId, "high");
    
    return {
      id: videoId,
      title: decodeHtmlEntities(item.snippet.title),
      description: decodeHtmlEntities(item.snippet.description),
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl,
      duration: readableDuration,
      viewCount: item.statistics?.viewCount || "0",
    };
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
}

/**
 * Decode HTML entities in a string
 * Uses DOMParser for accurate decoding of HTML entities
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === "undefined") {
    // Server-side fallback: replace common entities
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
  
  // Client-side: use DOMParser for accurate decoding
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Get text direction based on locale
 */
export function getDirection(locale?: string): "ltr" | "rtl" {
  const lang = locale || getUserLocale();
  const rtlLangs = ["ar", "he", "fa", "ur", "yi", "ps", "sd"];
  return rtlLangs.includes(lang.substring(0, 2)) ? "rtl" : "ltr";
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale?: string): boolean {
  return getDirection(locale) === "rtl";
}

/**
 * Format currency with locale
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const userLocale = locale || getUserLocale();
  return new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Pluralize text based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  zero?: string
): string {
  if (count === 0 && zero) return zero;
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Get initials from a name with proper emoji and Unicode handling
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name || !name.trim()) {
    return "?";
  }

  const cleaned = name.trim();

  if (cleaned.length === 0) {
    return "?";
  }

  // Extended emoji regex covering all Unicode emoji ranges
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{1FAB0}-\u{1FABF}]|[\u{1FAC0}-\u{1FAFF}]|[\u{1FAD0}-\u{1FAFF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
  
  const hasOnlyEmoji = emojiRegex.test(cleaned) && !cleaned.replace(emojiRegex, '').trim();

  if (hasOnlyEmoji) {
    return cleaned.charAt(0) || "?";
  }

  // Handle names with various Unicode spaces and separators
  const parts = cleaned.split(/[\s\u2000-\u206F\u2E00-\u2E7F]+/).filter(p => p.length > 0);
  
  if (parts.length >= 2) {
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    return (firstInitial + lastInitial).substring(0, maxLength).toUpperCase();
  }
  
  return cleaned.substring(0, maxLength).toUpperCase();
}

/**
 * Safely handle string input that may contain special characters
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  let sanitized = input.trim();
  
  // Remove null bytes and other control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

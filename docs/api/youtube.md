# YouTube API

Fetches sermon videos from the Lilliput SDA Media YouTube channel.

## Endpoint

```
GET /api/youtube/videos?maxResults=<count>
```

## Description

Fetches recent videos from the `@lilliputsdamedia` YouTube channel using the YouTube Data API v3. Results are cached on the server for 5 minutes.

## Requirements

A YouTube Data API v3 key is required. Set it in environment variables:

```env
YOUTUBE_API_KEY=your-youtube-api-key
```

Without this key, the endpoint returns fallback placeholder videos instead of real content.

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `maxResults` | number | No | 12 | Maximum videos to return (1–50) |

## Example

```
GET /api/youtube/videos?maxResults=24
```

## Response

### Success (200 OK)

```json
{
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Sabbath Sermon - March 15, 2025",
      "description": "Pastor John Smith delivers...",
      "publishedAt": "2025-03-15T14:30:00Z",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "duration": "45:23",
      "viewCount": "1250"
    }
  ],
  "count": 1
}
```

### Fallback Response (when API key missing)

```json
{
  "error": "Using cached/fallback content",
  "code": "FALLBACK",
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Welcome to Lilliput SDA Church",
      "description": "Join us for worship every Sabbath at 11:00 AM.",
      "publishedAt": "2025-03-19T00:00:00.000Z",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "duration": "3:45",
      "viewCount": "0"
    }
  ],
  "count": 3,
  "originalError": "YouTube API key not configured"
}
```

### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_PARAM` | maxResults must be between 1 and 50 |
| 401 | `INVALID_KEY` | YouTube API key is invalid |
| 403 | `QUOTA_EXCEEDED` | YouTube API quota exceeded |
| 500 | `CONFIG_ERROR` | YouTube API key not configured |
| 502 | `INVALID_RESPONSE` | Invalid response from YouTube API |
| 504 | `TIMEOUT` | Request timed out (10 second limit) |

## Video Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | YouTube video ID (11 characters) |
| `title` | string | Video title (max 200 chars) |
| `description` | string | Video description (max 5000 chars) |
| `publishedAt` | string | ISO 8601 publish date |
| `thumbnailUrl` | string | URL to high-quality thumbnail |
| `duration` | string | Video duration in mm:ss or h:mm:ss format |
| `viewCount` | string | Human-readable view count |

## Channel Configuration

The channel is configured in the route handler:

```typescript
const CHANNEL_ID = "UC5PpTmwN_ZUyM1xgwQR-_8w"; // @lilliputsdamedia
```

To change the channel, update `src/app/api/youtube/videos/route.ts`.

## Implementation Details

### Two-Step Fetch

1. **Search API** — Get video IDs from the channel (ordered by date)
2. **Videos API** — Get full details (title, description, duration, views) for each video ID

### Caching

```typescript
const response = await fetch(url, {
  signal: controller.signal,
  next: { revalidate: 300 } // 5-minute cache
});
```

### Timeout

```typescript
const FETCH_TIMEOUT = 10000; // 10 seconds
```

### Thumbnail Fallback

If YouTube doesn't provide thumbnails, falls back to standard YouTube thumbnail URLs:

```typescript
function getYouTubeThumbnailFallback(videoId: string, quality = "high") {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}
```

## Used By

- `src/app/(public)/media/page.tsx` — Media page fetches videos on the server

## Getting a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**
4. Go to **APIs & Services → Credentials**
5. Create **API Key**
6. Add key to environment: `YOUTUBE_API_KEY=your-key`

### Quota

YouTube Data API has a free quota:

- **Default**: 10,000 units/day
- **Search + videos list**: ~1-2 units per call
- **12 videos**: ~24-48 units per page load

Monitor usage at [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → YouTube Data API v3.

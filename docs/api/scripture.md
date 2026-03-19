# Scripture API

Search Bible verses using a locally bundled KJV scripture database.

## Endpoint

```
GET /api/scripture?q=<query>&limit=<limit>
POST /api/scripture
```

## Description

Searches the KJV Bible text bundled in `public/scriptures.json` for verses matching the query. Results are cached in memory for 1 hour.

## GET Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | — | Search query (book name, chapter, verse, or keyword) |
| `limit` | number | No | 5 | Maximum results (1–50) |

### Example

```
GET /api/scripture?q=love&limit=10
```

## POST Request

### Body Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | — | Search query |
| `limit` | number | No | 5 | Maximum results (1–50) |

### Example

```bash
curl -X POST http://localhost:3000/api/scripture \
  -H "Content-Type: application/json" \
  -d '{"q": "faith", "limit": 10}'
```

## Response

### Success (200 OK)

```json
{
  "query": "love",
  "count": 10,
  "results": [
    {
      "reference": "John 3:16",
      "text": "For God so loved the world...",
      "book": "John",
      "chapter": 3,
      "verse": 16
    }
  ]
}
```

### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `MISSING_QUERY` | Query parameter `q` is required |
| 400 | `INVALID_QUERY` | Query contains invalid characters or is empty |
| 400 | `INVALID_LIMIT` | Limit must be between 1 and 50 |
| 500 | `SERVER_ERROR` | Internal server error |

### Error Response Format

```json
{
  "error": "Query parameter \"q\" is required",
  "code": "MISSING_QUERY"
}
```

## Search Behavior

- **Keyword search**: Searches both verse text and reference (case-insensitive)
- **Reference search**: Searching "john 3:16" will find the exact verse
- **Text search**: Searching "for God so loved" will find John 3:16
- **Heading exclusion**: Verses marked as headings (hidden verses) are excluded
- **Limit enforcement**: Stops after reaching the limit

## Data Source

- **File**: `public/scriptures.json`
- **Translation**: King James Version (KJV)
- **Format**: Custom JSON with fields `o` (order), `r` (reference), `t` (text), `h` (heading flag)

## Implementation Details

```typescript
// src/app/api/scripture/route.ts
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
```

## Used By

- `src/components/features/ScriptureSearch.tsx` — Scripture search component on the Decision Card page

# Church Images Directory

This directory is for storing church-specific images when they become available.

## Directory Structure

```
public/images/
├── pastors/          # Pastor and staff headshots
├── ministries/       # Ministry group photos
├── events/          # Event-specific photos
├── congregation/   # Congregation and worship photos
└── historical/      # Historical church photos
```

## Current Image Strategy

The site currently uses high-quality Unsplash images as placeholders. These are free to use under the Unsplash License.

### When Church Photos Become Available

1. **Pastor/Staff Photos**: Add to `/pastors/` directory
   - Format: JPEG or WebP
   - Recommended size: 400x400px (headshots)
   - Naming: `pastor-hamilton.jpg`, `deacon-chairman.jpg`

2. **Ministry Photos**: Add to `/ministries/` directory
   - Format: JPEG or WebP
   - Recommended size: 600x400px (cards)
   - Naming: `youth-worship.jpg`, `choir-performance.jpg`

3. **Event Photos**: Add to `/events/` directory
   - Format: JPEG or WebP
   - Recommended size: 800x600px
   - Naming: `vbs-2026.jpg`, `camp-meeting.jpg`

4. **Congregation Photos**: Add to `/congregation/` directory
   - Format: JPEG or WebP
   - Recommended size: 1920x1080px (hero), 800x600px (general)
   - Naming: `sabbath-worship.jpg`, `fellowship-meal.jpg`

5. **Historical Photos**: Add to `/historical/` directory
   - Format: JPEG (scanned) or WebP
   - Recommended size: 800x600px
   - Naming: `founding-members.jpg`, `old-building.jpg`

## Updating Image URLs

When real images are added:

1. Update `src/lib/images.ts` with the new paths
2. Or if using CMS, upload via the admin interface

Example:
```typescript
// Before (placeholder)
churchBuilding: "https://images.unsplash.com/photo-xxx"

// After (real church photo)
churchBuilding: "/images/congregation/church-exterior.jpg"
```

## Image Guidelines

- **File Size**: Keep under 500KB for web optimization
- **Format**: Use WebP for best compression, JPEG as fallback
- **Alt Text**: Always include descriptive alt text for accessibility
- **Orientation**: Landscape for hero/card images, square for headshots

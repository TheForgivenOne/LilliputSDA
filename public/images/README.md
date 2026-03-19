# Church Images Directory

## Directory Structure

```
public/
├── images/
│   ├── logos/          # Church logo variants (dark, light, sized)
│   ├── history/        # Historical archive photos from old site
│   └── adventist-logo.svg
├── favicons/           # Browser favicons and app icons
├── books.json          # Church library data
└── scriptures.json     # Scripture references
```

## Organization

### `/images/logos/`
Church logo in various sizes and color variants:
- `logo-*.png` - Sized variants (48px, 56px, 64px, 128px)
- `logo-*-dark.png` - Dark background versions
- `logo-*-white.png` - White/transparent versions
- `logo-header*.png` - Header-optimized versions

### `/images/history/`
Historical archive photos from lilliputsda.interamerica.org:
- Pastors, congregation, worship, group photos
- Dates: 2016 (verified from filenames)
- Metadata: `metadata.json`

### `/images/adventist-logo.svg`
Official Seventh-day Adventist church logo.

### `/favicons/`
Browser and mobile app icons:
- `favicon.ico`, `favicon.svg`, `favicon-*.png`
- `android-chrome-*.png`
- `apple-touch-icon.png`

## Current Image Strategy

The site uses Unsplash placeholders in `src/lib/images.ts`. Real church photos should be added to the appropriate subfolder when available.

## Image Guidelines

- **File Size**: Keep under 500KB
- **Format**: WebP preferred, JPEG fallback
- **Alt Text**: Always include for accessibility
- **Hero images**: 1920x1080px (16:9)
- **Cards**: 600x400px (3:2)
- **Headshots**: 400x400px (1:1)

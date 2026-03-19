# Design System

The Lilliput SDA Church website uses a custom design system built on Tailwind CSS with design tokens defined in `src/styles/tokens.css`.

## Design Tokens

Design tokens are CSS custom properties that define the visual language of the site.

### Color Palette

The site uses a warm, welcoming palette centered on amber (gold) and stone (neutral):

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber-50` | `#fffbeb` | Lightest amber tint |
| `--color-amber-100` | `#fef3c7` | Light amber |
| `--color-amber-200` | `#fde68a` | Pale amber |
| `--color-amber-300` | `#fcd34d` | Light amber |
| `--color-amber-400` | `#fbbf24` | Bright amber |
| `--color-amber-500` | `#f59e0b` | Medium amber (primary) |
| `--color-amber-600` | `#d97706` | Dark amber (primary dark) |
| `--color-amber-700` | `#b45309` | Dark amber |
| `--color-amber-800` | `#92400e` | Darker amber |
| `--color-amber-900` | `#78350f` | Darkest amber |

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-stone-50` | `#fafaf9` | Lightest stone (light mode bg) |
| `--color-stone-100` | `#f5f5f4` | Light stone |
| `--color-stone-200` | `#e7e5e4` | Light stone border |
| `--color-stone-300` | `#d6d3d1` | Stone border |
| `--color-stone-400` | `#a8a29e` | Muted text |
| `--color-stone-500` | `#78716c` | Secondary text |
| `--color-stone-600` | `#57534e` | Dark text |
| `--color-stone-700` | `#44403c` | Darker text |
| `--color-stone-800` | `#292524` | Dark mode text |
| `--color-stone-900` | `#1c1917` | Darkest stone (dark mode bg) |

### Dark Mode

Dark mode inverts the stone palette:

```css
.dark {
  --color-bg: var(--color-stone-900);
  --color-text: var(--color-stone-100);
}
```

Applied via `dark:` Tailwind variants.

### Typography

Fonts loaded in `src/app/layout.tsx`:

| Variable | Font | Weights | Usage |
|----------|------|---------|-------|
| `--font-dm-sans` | DM Sans | 400–800 | Body text, UI |
| `--font-playfair` | Playfair Display | 400–900 | Headings, display |
| `--font-geist-mono` | Geist Mono | — | Code, monospace |

Font classes applied to `html` element:

```html
<body class="font-sans antialiased">
  <!-- Use font-sans for body -->
  <!-- Use font-serif for headings (via Playfair Display) -->
</body>
```

### Spacing

Uses Tailwind's spacing scale (0–96, plus arbitrary values):

| Class | Value | Usage |
|-------|-------|-------|
| `p-4` | 1rem | Default padding |
| `gap-6` | 1.5rem | Default gap |
| `space-y-8` | 2rem | Section spacing |
| `max-w-7xl` | 80rem | Max content width |

### Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded` | 0.25rem | Small elements |
| `rounded-lg` | 0.5rem | Cards, buttons |
| `rounded-xl` | 0.75rem | Large cards |
| `rounded-full` | 9999px | Pills, avatars |

## Component Patterns

### Button Variants

```tsx
// Primary
<button className="bg-amber-600 text-white hover:bg-amber-700 ...">

// Secondary
<button className="bg-stone-200 text-stone-900 hover:bg-stone-300 ...">

// Ghost
<button className="text-amber-600 hover:bg-amber-50 ...">

// Outline
<button className="border-2 border-amber-600 text-amber-600 ...">
```

### Card

```tsx
<div className="bg-white dark:bg-stone-800 rounded-xl shadow-md p-6 border border-stone-200 dark:border-stone-700">
  {/* Card content */}
</div>
```

### Section Layout

```tsx
<section className="py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

### Form Input

```tsx
<input
  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
/>
```

## Icon System

Icons from **Lucide React** (`lucide-react`):

```tsx
import { Calendar, MapPin, Phone, Mail } from "lucide-react";

// Usage
<Calendar className="h-5 w-5" />
```

Stroke width: `h-5 w-5` (default), `h-4 w-4` (small), `h-6 w-6` (large).

## Animation

Animations via **Framer Motion**:

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Animated content */}
</motion.div>
```

Common patterns:

| Pattern | Config | Usage |
|---------|--------|-------|
| Fade in | `{ opacity: 0 } → { opacity: 1 }` | Page loads |
| Slide up | `{ y: 20 } → { y: 0 }` | Cards, sections |
| Scale | `{ scale: 0.95 } → { scale: 1 }` | Modals, tooltips |
| Stagger | `transition: { staggerChildren: 0.1 }` | Lists |

## Responsive Design

### Breakpoints

| Breakpoint | Prefix | Width |
|------------|--------|-------|
| Mobile | (default) | < 640px |
| Tablet | `sm:` | 640px+ |
| Desktop | `md:` | 768px+ |
| Large | `lg:` | 1024px+ |
| XL | `xl:` | 1280px+ |
| 2XL | `2xl:` | 1536px+ |

### Navigation

| Device | Navigation |
|--------|------------|
| Mobile | `MobileMenu.tsx` (hamburger) + `MobileBottomBar.tsx` (4 icons) |
| Desktop | `Header.tsx` (horizontal nav) |

## Accessibility

- **Color contrast**: All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Focus states**: `focus:ring-2 focus:ring-amber-400 focus:outline-none`
- **Skip link**: Skip to main content link in `layout.tsx`
- **Screen reader**: `sr-only` classes for visually hidden text
- **Reduced motion**: Respect `prefers-reduced-motion` media query

## Tailwind Configuration

Tailwind v4 uses CSS-first configuration in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-amber: var(--color-amber-500);
  --color-amber-dark: var(--color-amber-600);
}
```

---
name: Lilliput SDA Church — Vesper
description: Liturgical jewel-tones for a Jamaican Adventist congregation
colors:
  warm-brass: "#EAB308"
  sacramental-wine: "#6E2A3E"
  old-parchment: "#F6F1E7"
  vesper-ink: "#1B1A2E"
  altar-cream: "#FDFBF5"
  chancel-slate: "#6F6883"
  sky-lilac: "#B8A8D4"
  midnight-bg: "#0F0E1C"
  dark-surface: "#181729"
  success-teal: "#3F7A6E"
  error-crimson: "#A23545"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  '2xl': "1.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  '2xl': "3rem"
  '3xl': "4rem"
  '4xl': "6rem"
---

# Design System: The Candlelit Sanctuary

## 1. Overview

**Creative North Star: "The Candlelit Sanctuary"**

This system is a sanctuary rendered in light. Warm brass glows against cool parchment and ink, like afternoon sun through amber glass falling on an old hymnbook. Every surface is tonal — depth comes from light washing across layers, not from hard shadows. The palette is liturgical jewel-tones: brass, mulberry wine, lilac, and slate-mauve over a warm cream ground.

The system explicitly rejects generic mega-church templates. There are no stock-photo hero sections, no corporate blues, no soulless gradients. The warmth is specific, local, and unmistakably Jamaican — felt in the brass light, the mulberry accents, and the unhurried typography.

**Key Characteristics:**
- Tonal depth over shadow depth. Elevation is expressed through color washes and layer contrast, not drop shadows.
- Refined interactions. Elements respond with subtlety: a gentle glow, a quiet lift, a slow underline draw. Nothing jumps.
- Serif-forward identity. Fraunces carries all headings with its SOFT axis engaged, giving headlines a warm, almost handset character. Inter provides clean, neutral body text.
- Texture as atmosphere. Subtle grain overlays and radial gradient meshes suggest candlelight, never decoration.
- Dark mode is night-sky indigo: the same brass warmth on a deeper, cooler ground.

## 2. Colors

The Vesper palette is restrained in range, committed in presence. Brass carries navigation chrome, primary buttons, badges, and focus rings — roughly 30% of interactive surfaces. Wine and lilac play supporting roles for urgency and atmosphere.

### Primary
- **Warm Brass** (#EAB308 / oklch(0.78 0.16 85)): The defining accent. Primary buttons, navigation active states, focus rings, category badges, link underlines, decorative glows. Never used for body text or large background fills.

### Tertiary
- **Sacramental Wine** (#6E2A3E / oklch(0.36 0.08 10)): Reserved for urgency — live badges, destructive buttons, high-priority announcements, the "Featured" pulse indicator. Replaces red to avoid alarm while still signaling importance.

### Neutral
- **Old Parchment** (#F6F1E7 / oklch(0.94 0.01 80)): Page background in light mode. The warmest ground layer.
- **Altar Cream** (#FDFBF5 / oklch(0.98 0.005 80)): Elevated surface (cards, dialogs). One step lighter and cooler than parchment.
- **Vesper Ink** (#1B1A2E / oklch(0.16 0.02 280)): Primary text color. A near-black with cool indigo undertone.
- **Chancel Slate** (#6F6883 / oklch(0.46 0.03 290)): Muted text, secondary labels, placeholder content.
- **Sky Lilac** (#B8A8D4 / oklch(0.72 0.06 300)): Dark-mode highlight color for brass-equivalent accents and decorative washes. Never used for text.

### Semantic
- **Success Teal** (#3F7A6E): Positive states. A desaturated teal that avoids green political signaling.
- **Error Crimson** (#A23545): Destructive states and validation errors.

### Dark Mode
- **Midnight** (#0F0E1C): Dark mode page background. Cool, deep indigo-black.
- **Dark Surface** (#181729): Elevated surfaces in dark mode.
- Brass brightens to #FCD34D. Wine lifts to #B86A82.

### Named Rules
**The Candlelight Rule.** Every color is chosen relative to its ground. Brass on cream is radiant; brass on midnight is ember-glow. No color is absolute — its character shifts with its container. Design across both modes; never check only one.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** Fraunces brings warmth and weight to headings — its SOFT axis gives titles a gentle, almost letterpress quality at display sizes. Inter stays neutral and efficient for body text, letting the serif voice carry the personality.

### Hierarchy
- **Display** (700, clamp(2.5rem, 7vw, 4.5rem), 1.1, -0.01em): Hero titles only. Powerful and rare. Fraunces with SOFT axis at 100%.
- **Headline** (600, clamp(1.5rem, 4vw, 2.5rem), 1.2): Section headings. The workhorse serif role.
- **Title** (600, clamp(1.125rem, 2.5vw, 1.5rem), 1.25): Card titles, subsection heads, modal headers.
- **Body** (400, 1rem / 1.125rem, 1.625): All continuous text. Cap line length at 65–75ch. Inter regular.
- **Label** (600, 0.75rem / 0.875rem, 1, 0.05em): Uppercase section markers, metadata, timestamps, badge text. Small, dense, semantic.

### Named Rules
**The One-Size-Down Rule.** When in doubt about hierarchy, use the smaller size and let weight or color do the work. Bold body copy at 1rem beats regular at 1.125rem in every case.

## 4. Elevation

Depth is tonal, not shadow-based. Surfaces sit at different layers of light: the page is the darkest ground (Old Parchment), cards lift one step (Altar Cream), modals float above a scrim. The separation comes from lightness contrast, not from drop shadows. Shadows are restricted to hover-state feedback (a quiet lift) and are never used for resting elevation.

### Elevation Layers
- **Ground** (page background): Old Parchment / Midnight
- **Surface** (cards, sheets): Altar Cream / Dark Surface — one lightness step up
- **Overlay** (modals, dialogs): Altar Cream / Dark Surface — same as surface but above a backdrop scrim
- **Scrim** (modal backdrop): — rgba(0, 0, 0, 0.5) / rgba(0, 0, 0, 0.7)

## 5. Components

### Buttons
- **Shape:** Gently curved (1rem / rounded-xl). No sharp corners.
- **Primary (Brass):** Warm Brass background, white text, 1rem horizontal / 0.75rem vertical padding (md). Full glow shadow on hover.
- **Hover:** Quiet lift (translateY(-2px)), intensified glow. No bounce. 200ms ease-out.
- **Focus:** Brass ring with offset (3px outline, 2px offset).
- **Loading:** Spinner replaces icon slot. Text changes to loading indicator.
- **Secondary (Slate):** Dark surface (stone-800), white text, same shape. For less prominent actions.
- **Wine (Destructive):** Sacramental Wine background, white text. For destructive or urgent actions only.
- **Outline:** Brass border, transparent background, brass text hover fills brass. For ghost/tertiary actions.
- **Ghost:** No background or border. Minimal text color. For inline actions.
- **Disabled:** 50% opacity on all variants. No cursor.

### Cards / Containers
- **Corner Style:** 1.5rem (rounded-2xl). Deliberately generous.
- **Background:** Altar Cream / Dark Surface — one step above page ground.
- **Border:** Subtle stroke (1px, border-subtle / dark counterpart).
- **Hover:** Brass-edge glow on the border (35% opacity brass). No shadow lift.
- **Internal Padding:** 1.5rem (p-6) default; 2rem (p-8) for featured cards.
- **Variants:** Staff card (horizontal, photo + details), Sermon card (vertical, thumbnail + meta), Event card (date column + content area), Announcement card (section header + body).

### Inputs / Fields
- **Style:** Full border (1px, border-subtle), transparent or cream background, 1rem (xl) radius.
- **Focus:** Solid brass border, no glow. Clean and specific.
- **Padding:** 0.75rem vertical, 1rem horizontal. Generous touch targets.
- **Error:** Crimson border + crimson label text.
- **Disabled:** Muted background, reduced opacity.

### Navigation
- **Desktop:** Horizontal pill-style links in the header. Active state: brass text on brass-tinted background. Non-active: slate text, no background. Hover: subtle slate background tint.
- **Mobile:** Slide-in drawer from right. 80vw width, full-height, backdrop scrim. Active state treated same as desktop.
- **Header transition:** Transparent at top of page (white text on hero), transitions to cream/dark background with shadow on scroll. Logo inverts from white to dark.

### Hero Section
- **Style:** Full-bleed background image with brass-tinted gradient overlay and grain texture. Title and CTA centered or left-aligned depending on context.
- **Quick info bar:** 3-column grid below hero text for key facts (service time, location, livestream).

### Signature Component — Decision Card
- A modal form for making a faith decision. Triggered from a header button or standalone CTA.
- Uses the standard modal pattern (centered, scrimmed, surface-colored).
- Content: category selector (5-6 options), name and contact fields, optional prayer request.
- No nested cards. No side-stripe borders.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Brass as the primary interactive accent. It drives CTAs, navigation active states, and focus rings.
- **Do** lead headings with Fraunces. Every section title and card heading should be in the display serif.
- **Do** cap body text at 65–75 characters per line.
- **Do** use tonal layering for depth: page → card → modal as increasingly light surfaces.
- **Do** let the brass glow intensify on interactive hover states — it signals clickability.
- **Do** show loading, empty, and error states for every data-driven section.
- **Do** use Old Parchment as the background ground and Altar Cream for elevated surfaces.

### Don't:
- **Don't** use gradient text (background-clip: text with gradient). Single solid color only.
- **Don't** use side-stripe borders (border-left > 1px as colored accent). Use full borders, background tints, or nothing.
- **Don't** use glassmorphism (backdrop blur on decorative surfaces).
- **Don't** use hero-metric templates (big number, small label, gradient accent). 
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** default to modals. Exhaust inline and progressive disclosure first.
- **Don't** use generic mega-church template patterns — stock photography, corporate gradients, soulless layouts.
- **Don't** use #000 or #fff. All neutrals are tinted toward the brand hue.
- **Don't** nest cards. A card inside a card is always wrong.
- **Don't** over-animate. Refined, restrained interactions: a quiet lift, a slow glow. No bounce, no elastic.

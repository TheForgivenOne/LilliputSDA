# Inline Editing

The inline CMS editing system allows authenticated users to edit page content directly on public pages without navigating to a separate admin interface.

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│              CmsProvider                 │
│  (React Context - edit mode state)       │
│  ├── isEditMode: boolean                 │
│  ├── isEditor: boolean (role check)      │
│  ├── setEditMode(enabled: boolean)      │
│  └── pageId: string                      │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
CmsAdminBar         EditableText / EditableImage
(Control bar)       (Inline editors)
```

### Components

#### `CmsProvider` (`components/cms/CmsProvider.tsx`)

React context that wraps the app in `src/app/layout.tsx`. Provides:

- `isEditMode` — Boolean flag for edit mode on/off
- `isEditor` — Whether the current user has editor or admin role
- `pageId` — Current page identifier for section lookups

#### `CmsAdminBar` (`components/cms/CmsAdminBar.tsx`)

Fixed top bar visible only to logged-in editors/admins:

- Shows page title and CMS controls
- Edit mode toggle button
- Save/Cancel buttons when editing
- User info and sign-out

#### `EditableText` (`components/cms/EditableText.tsx`)

Wrapper component for editable text:

```tsx
<EditableText
  pageId="home"
  sectionKey="hero.title"
  contentType="text"
  className="text-4xl font-bold"
  tag="h1"
>
  Welcome to Lilliput SDA Church
</EditableText>
```

When `isEditMode` is true, the text becomes:

- Visually highlighted (border, background)
- Clickable to reveal an input overlay
- Editable inline with auto-save on blur

#### `EditableImage` (`components/cms/EditableImage.tsx`)

Wrapper for editable images:

```tsx
<EditableImage
  pageId="home"
  sectionKey="hero.image"
  src="/hero.jpg"
  alt="Church building"
  className="w-full h-96 object-cover"
/>
```

When `isEditMode` is true:

- Image shows an overlay with edit icon
- Click opens image URL editor
- Changes persist to `pageSections` table

#### `EditModeIndicator` (`components/cms/EditModeIndicator.tsx`)

Small floating badge showing "Edit Mode" status when active.

## Data Model

Inline CMS content is stored in the `pageSections` Convex table:

| Field | Type | Description |
|-------|------|-------------|
| `pageId` | string | Page identifier (e.g., `home`, `about`, `contact`) |
| `sectionKey` | string | Section key (e.g., `hero.title`, `about.intro`) |
| `title` | string | Optional title |
| `content` | string | Text or HTML content |
| `contentType` | enum | text, html, image, link |
| `imageUrl` | string | Image URL (for image type) |
| `imageAlt` | string | Image alt text |
| `order` | number | Display order |
| `isPublished` | boolean | Published status |
| `metadata` | string | JSON for extra data (button labels, links) |

### Section Key Naming Convention

Keys follow a dot-notation pattern:

```
{pageId}.{sectionName}.{fieldName}

home.hero.title       → Home page, Hero section, Title text
home.hero.subtitle    → Home page, Hero section, Subtitle text
home.cta.button       → Home page, CTA section, Button text
about.intro.text      → About page, Intro section, Body text
footer.address        → Footer section, Address text
```

## Editing Flow

1. **Sign in** as an editor or admin user
2. **Navigate** to any public page
3. **Click "Edit"** in the CMS admin bar — edit mode activates
4. **Click any editable element** — a popover/inline editor appears
5. **Make changes** — text edits or image URL changes
6. **Click "Save"** in the admin bar — changes persist to Convex
7. **Click "Cancel"** to discard unsaved changes

## CMS Mutations

The following Convex mutations handle CMS updates:

- `cmsMutations.upsertSection` — Create or update a section
- `cmsMutations.deleteSection` — Remove a section
- `cmsMutations.updateSiteSetting` — Update a key-value setting

## Requirements for Editable Components

To make a component editable:

1. Wrap text content in `<EditableText>` with `pageId` and `sectionKey`
2. Wrap images in `<EditableImage>` with `pageId` and `sectionKey`
3. Ensure the pageId matches the route (e.g., `home` for `/`, `about` for `/about`)
4. Section keys should be unique per page

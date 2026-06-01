# Design System

The design system is built in three layers: CSS tokens → Tailwind utilities → CVA components.

```
styles/globals.css (entry point)
  └── styles/tokens/colors.css     — semantic color tokens (:root / .dark) + @theme color mappings
  └── styles/tokens/typography.css — @theme type scale + letter-spacing
  └── styles/tokens/base.css       — @theme font stack + radius scale
      └── Tailwind utility classes (text-h1, tracking-tight, etc.)
          └── typography.variants.ts (CVA maps props → classes)
              └── typography.tsx (Text, H1–H5, P, Small, Label, Prose)
                  └── portable-text.tsx (Sanity PortableText renderer)
```

---

## Token layer — `styles/tokens/`

Design tokens are split across three files, each imported by `styles/globals.css`. Tokens are the single source of truth. Never hardcode color values or font sizes in component files.

| File | Contents |
|---|---|
| `styles/tokens/colors.css` | `:root` / `.dark` semantic color tokens (OKLCH) + `@theme` color mappings |
| `styles/tokens/typography.css` | `@theme` type scale (`--text-*`) and letter-spacing (`--tracking-*`) |
| `styles/tokens/base.css` | `@theme` font stack and computed radius scale |

- **`:root` / `.dark`** — semantic color tokens (OKLCH values), defined in `styles/tokens/colors.css`
- **`@theme inline`** — maps tokens to Tailwind theme keys; spread across all three token files

### Color tokens

Semantic aliases that automatically switch in dark mode via the `.dark` class.

| CSS variable | Usage |
|---|---|
| `--background` / `--foreground` | Page background and primary text |
| `--muted` / `--muted-foreground` | Subdued surfaces and secondary text |
| `--primary` / `--primary-foreground` | Brand-primary interactive elements |
| `--secondary` / `--secondary-foreground` | Secondary interactive elements |
| `--accent` / `--accent-foreground` | Hover/focus accent surfaces |
| `--destructive` | Error, delete, and danger states |
| `--border` | Dividers, input borders, card outlines |
| `--ring` | Focus ring |
| `--radius` | Base border radius (`0.625rem`) |

Tailwind class equivalents: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.

### Typography scale tokens

Base: `1rem = 16px` (browser default — never override `font-size` on `:root`).

| Token | Size | Line height | Usage |
|---|---|---|---|
| `--text-h1` | 2.25rem / 36px | 1.15 | Page titles |
| `--text-h2` | 1.875rem / 30px | 1.2 | Section headings |
| `--text-h3` | 1.5rem / 24px | 1.25 | Sub-section headings |
| `--text-h4` | 1.25rem / 20px | 1.3 | Card / list headings |
| `--text-h5` | 1.125rem / 18px | 1.35 | Inline headings |
| `--text-body-lg` | 1.125rem / 18px | 1.75 | Intro / featured copy |
| `--text-body-md` | 1rem / 16px | 1.65 | Default body copy |
| `--text-body-sm` | 0.875rem / 14px | 1.6 | Secondary copy |
| `--text-small` | 0.75rem / 12px | 1.5 | Fine print, captions, metadata |

Line height is colocated with font-size using Tailwind v4's `--text-*--line-height` syntax, so `text-h1` sets both automatically. All type scale tokens live in `styles/tokens/typography.css`.

### Letter-spacing tokens

| Token | Value | Tailwind class | Usage |
|---|---|---|---|
| `--tracking-tight` | `-0.025em` | `tracking-tight` | Headings, hero text |
| `--tracking-comfortable` | `0em` | `tracking-comfortable` | Neutral default |
| `--tracking-relaxed` | `0.025em` | `tracking-relaxed` | Body copy |
| `--tracking-wide` | `0.075em` | `tracking-wide` | Labels, eyebrows (uppercase) |

---

## Typography components — `components/ui/typography/`

### Architecture

The system has a **polymorphic base** (`<Text>`) and **named semantic wrappers** (`<H1>`–`<H5>`, `<P>`, `<Small>`, `<Label>`, `<Prose>`). Visual size is always decoupled from the HTML element.

```
typography.variants.ts   CVA variant definitions
typography.tsx           All components
index.ts                 Barrel exports
typography.stories.tsx   Storybook stories
```

### Base component — `<Text>`

All props are optional. The `as` prop controls the HTML element; all other props control visual presentation independently.

```tsx
import { Text } from '@/components/ui/typography'

// h3 element rendered at h2 visual size
<Text as="h3" size="h2" weight="semibold" tracking="tight">
  Section title
</Text>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `React.ElementType` | `'p'` | HTML element to render |
| `size` | `'h1'–'h5' \| 'body-lg' \| 'body-md' \| 'body-sm' \| 'small'` | `'body-md'` | Visual size (from token scale) |
| `weight` | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'normal'` | Font weight |
| `tracking` | `'tight' \| 'comfortable' \| 'relaxed' \| 'wide'` | `'comfortable'` | Letter spacing |
| `color` | `'default' \| 'muted' \| 'subtle'` | `'default'` | Semantic text color |
| `uppercase` | `boolean` | — | Uppercase transform |
| `truncate` | `boolean` | — | Single-line truncation with ellipsis |
| `lines` | `1 \| 2 \| 3 \| 4` | — | Multi-line clamp |

### Named wrappers

Prefer named wrappers over `<Text>` for all standard usage. They lock in semantic defaults while keeping every prop overridable.

#### Headings — `<H1>` through `<H5>`

`H1`–`H3` include step-based responsive scaling. `H4`–`H5` are fixed size (appropriate for card/inline context).

| Component | Element | Default weight | Responsive scale |
|---|---|---|---|
| `<H1>` | `h1` | semibold | `text-h3` → `md:text-h2` → `lg:text-h1` |
| `<H2>` | `h2` | semibold | `text-h4` → `md:text-h3` → `lg:text-h2` |
| `<H3>` | `h3` | semibold | `text-h5` → `md:text-h4` → `lg:text-h3` |
| `<H4>` | `h4` | semibold | fixed `text-h4` |
| `<H5>` | `h5` | medium | fixed `text-h5` |

Override `size` to decouple visual scale from semantic level:

```tsx
// Semantically h2, but rendered at h3 visual size
<H2 size="h3">Releases</H2>
```

#### Body — `<P>`

Renders a `<p>` element. Defaults to `body-md` with `relaxed` tracking.

```tsx
<P>Default body copy.</P>
<P size="body-lg">Intro paragraph or featured copy.</P>
<P size="body-sm" color="muted">Supporting secondary information.</P>
```

`size` is constrained to `'body-lg' | 'body-md' | 'body-sm'`. For `small`-size body text use `<Small>` or `<Text>`.

#### Fine print — `<Small>`

Renders a `<small>` element. Defaults to `small` size and `muted` color. Use for metadata, captions, and fine print.

```tsx
<Small>Last updated 3 days ago · Discogs ID 12345</Small>
```

#### Label / eyebrow — `<Label>`

Renders a `<span>` by default. Always uppercase with wide letter-spacing and muted color. Use for section eyebrows, category tags, and UI labels.

```tsx
<Label>New Arrivals</Label>

// Override element when semantic context requires a heading
<Label as="h3">Disc 1</Label>
```

#### Long-form content — `<Prose>`

A `<div>` wrapper that styles raw/unstyled HTML children (from CMS, markdown, etc.) using child selectors. Use this when you can't control the markup that's being rendered.

```tsx
<Prose>
  <div dangerouslySetInnerHTML={{__html: richTextHtml}} />
</Prose>
```

---

## CVA component pattern

All UI primitives follow the same file structure:

```
components/ui/<primitive>/
├── index.ts                 re-exports
├── <primitive>.variants.ts  cva() definitions — all Tailwind classes live here
├── <primitive>.tsx          component(s) — imports variants, no inline class strings
└── <primitive>.stories.tsx  Storybook stories
```

**Rules:**
- All Tailwind class strings go in `*.variants.ts`. Components never contain raw class strings except via `cn()` composition.
- Use `cn()` from `@/lib/utils` for conditional/merged classes.
- Client components get a `.client.tsx` suffix and a `'use client'` directive.
- Server components have no suffix and no directive.

Adding a new primitive:

1. Create the folder and four files above.
2. Define variants with `cva()` in `*.variants.ts`.
3. Build the component using `VariantProps<typeof yourVariants>` for the type.
4. Export from `index.ts`.

---

## Portable Text renderer — `components/portable-text/portable-text.tsx`

Renders Sanity Portable Text using the typography system. Backed by `@portabletext/react`.

```tsx
import { PortableText } from '@/components/portable-text/portable-text'

// Inline — spacing managed by parent layout
<PortableText value={release.description} />

// Long-form with Prose wrapper for reading layout
<PortableText value={page.body} prose />

// Override a single block style
<PortableText
  value={content}
  components={{ block: { h1: ({children}) => <H1 size="h2">{children}</H1> } }}
/>
```

The `components` prop merges shallowly with the defaults — supply only the keys you want to override.

---

## Fonts

Geist Sans and Geist Mono are loaded via `next/font/google` in `app/layout.tsx`. They inject `--font-geist-sans` and `--font-geist-mono` CSS variables onto `<html>`, which `styles/tokens/base.css` picks up via the `--font-sans` and `--font-mono` theme tokens.

The `<body>` carries `font-sans` so all text defaults to Geist Sans without any per-component font class.

---
name: vinyl schema best-practices refactor
overview: Apply the Sanity plugin's `sanity-best-practices` and `content-modeling-best-practices` skills to the vinyl-market schemas to add slugs, image alt text, a reusable gallery object, orderings, and field groups on `release` — all uncontroversial wins for a marketplace.
todos:
  - id: image-object
    content: Add reusable imageWithAlt object and register in schemaTypes index
    status: completed
  - id: swap-images
    content: Swap cover/gallery in release, artist, label to use imageWithAlt
    status: completed
  - id: slugs
    content: Add required slug field to all three document types
    status: completed
  - id: orderings
    content: Add orderings to release, artist, and label
    status: completed
  - id: release-groups
    content: Replace release fieldsets with groups (identity, media, tracklist, release-info)
    status: completed
  - id: release-preview
    content: Enrich release preview subtitle with format and year
    status: completed
isProject: false
---

## Why this demo

Your repo is a fresh Sanity Studio with three documents (`artist`, `label`, `release`). Reading the two relevant skills against the actual files surfaces five concrete gaps that any vinyl marketplace will hit on day one:

- No `alt` on images (blocks accessible/SEO-friendly frontends)
- No `slug` (no stable URLs for `/releases/...`, `/artists/...`, `/labels/...`)
- The `gallery` field is duplicated verbatim in all three schemas (content-modeling: extract reusable object)
- No `orderings` (Studio sorts alphabetically by hidden ID — bad editor UX)
- `release` has 11 fields with only partial fieldsets — `groups` give a cleaner edit form

None of these require product decisions; they're straight best-practice wins. More opinionated changes (e.g. removing the `dateUnknown`/`noLabel` boolean toggles, adding catalog number / country / condition / barcode for marketplace search) are listed as optional follow-ups.

## Proposed changes

### 1. Reusable image object — new file

Create `[schemaTypes/objects/imageWithAlt.ts](schemaTypes/objects/imageWithAlt.ts)` exporting an object type with a hotspot-enabled image plus required `alt` and optional `caption`. Register it in `[schemaTypes/index.ts](schemaTypes/index.ts)` so it can be referenced by name.

```ts
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Add alt text for accessibility & SEO'),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
})
```

### 2. Replace duplicated `cover` + `gallery` in all three doc types

In [schemaTypes/release.ts](schemaTypes/release.ts), [schemaTypes/artist.ts](schemaTypes/artist.ts), [schemaTypes/label.ts](schemaTypes/label.ts), change `cover` from `type: 'image'` to `type: 'imageWithAlt'` and change each `gallery` array member from inline `{type: 'image', options: {hotspot: true}}` to `{type: 'imageWithAlt'}`. Removes ~30 lines of duplication and gives every image alt text in one place.

### 3. Add `slug` to all three documents

Each gets:

```ts
defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: {source: 'name', maxLength: 96}, // 'releaseName' for release
  validation: (Rule) => Rule.required(),
})
```

Required for any marketplace frontend (Next.js, Astro, etc.) to build clean URLs.

### 4. Add `orderings` for editor UX

- `release`: by `releaseDate desc`, by `artist.name asc`, by `releaseName asc`
- `artist` and `label`: by `name asc`

### 5. Group `release` fields

Replace the two `fieldsets` on [schemaTypes/release.ts](schemaTypes/release.ts) with `groups` so the editor form has tabs: `identity` (artist, releaseName, slug, format, speed), `media` (cover, gallery), `tracklist` (discs), `release-info` (date + label fields). Cleaner than today's flat list of 11 fields.

### 6. Polish `release.preview`

Extend the existing preview to include format and year in the subtitle (e.g. `Artist · LP · 1978`) — the data is already on the doc.

## Out of scope (offer as follow-ups, don't do now)

- Replacing `dateUnknown` / `noLabel` boolean toggles with simpler optional fields (UX call — your current pattern is intentional and explicit, just verbose)
- Marketplace-domain fields: catalog number, country, pressing/variant, condition grade, barcode, genres
- Wiring `/typegen` for a frontend (needs to know what framework you'll use)
- Running `/deploy-schema` — the Sanity MCP server is currently in an errored state in Cursor Settings; one of the two MCP instances also needs `mcp_auth`. Worth fixing if you want me to deploy or query Content Lake from chat.

## Skills used

- `sanity-best-practices` — image alt text, slugs, orderings, groups, preview enrichment
- `content-modeling-best-practices` — extracting the duplicated gallery into a reusable object (single source of truth)
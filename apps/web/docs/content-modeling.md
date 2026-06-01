# Content Modeling

## Schema types

### Document types

| Type           | Description                                               | Singleton                |
| -------------- | --------------------------------------------------------- | ------------------------ |
| `release`      | Vinyl record — artist, tracklist, cover, Discogs metadata | No                       |
| `artist`       | Artist with cover image and linked releases               | No                       |
| `label`        | Record label with cover image and linked releases         | No                       |
| `page`         | CMS-driven page with `pageBuilder`                        | No                       |
| `releasesPage` | `/releases` index page                                    | Yes (`RELEASES_PAGE_ID`) |
| `siteSettings` | Global header navigation                                  | Yes (`SITE_SETTINGS_ID`) |

### Object types

| Type           | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `buttonBlock`  | Page-builder block — label, variant, size, internal/external link  |
| `imageWithAlt` | `image` + required `alt`, optional `caption`; hotspot/crop enabled |
| `seo`          | `metaTitle`, `metaDescription`, `ogImage`, `noIndex`               |
| `navItem`      | Nav link — label, `internal`/`external` linkType, resolved target  |

### Singleton ID constants

Use exported constants — never hardcode the `_id` string:

```ts
import { SITE_SETTINGS_ID } from 'apps/studio/schemaTypes/siteSettings'
import { RELEASES_PAGE_ID } from 'apps/studio/schemaTypes/releasesPage'
```

---

## Shared option constants — `packages/release-constants`

Option arrays used in both the Studio (as `list` values) and the web (as display labels) live in `packages/release-constants/index.ts`. This is the SSoT — never duplicate them in either app.

```ts
import { releaseFormatOptions, releaseSpeedOptions } from '@vinyl-market/release-constants'
```

- **Studio** (`apps/studio/schemaTypes/constants/release.ts`) re-exports from the package.
- **Web** derives label maps at module scope using `Object.fromEntries`:

```ts
const SPEED_LABEL = Object.fromEntries(
  releaseSpeedOptions.map(({ value, title }) => [value, title]),
)
```

When adding a new schema field whose values need a human-readable label in the web UI, add the options array to `packages/release-constants/index.ts` and follow this pattern.

---

## ButtonBlock → CVA type pipeline

`buttonBlock.ts` is the **SSoT** for button variant/size options. The web derives its CVA vocabulary from the generated type:

`buttonBlock.ts` → `yarn typegen` → `ButtonBlock` in `sanity/types.generated.ts` → `ColorVariant`/`SizeVariant` in `components/ui/variants.ts` → `button.variants.ts` (`satisfies Record<ColorVariant, string>`)

After changing variant/size options, run `yarn typegen` — mismatched CVA keys surface as TypeScript errors.

---

## pageBuilder pattern

`page.pageBuilder[]` is a union of block types (`buttonBlock`, `imageWithAlt`). GROQ uses a flat-union projection (all block fields listed; absent fields return `null`). The renderer (`components/page-builder/page-builder.tsx`) switches on `_type`.

Adding a new block: (1) define schema object, (2) add to `page.pageBuilder`, (3) add fields to `PAGE_QUERY`, (4) add case to renderer.

---

## SEO schema

`seo` object is embedded in `releasesPage` and `page`. Convert with `toNextMetadata()` from `apps/web/sanity/metadata.ts`. See [routing.md](routing.md) for usage in `generateMetadata`.

---

## Image conventions

- `alt` is required (Studio validation warning)
- Use GROQ fragments from `sanity/fragments/image.ts` — never write raw image projections inline
- Mock `next/image` in tests — see [testing.md](testing.md)

---

## Slug and route constants — `apps/web/lib/routes.ts`

SSoT for all content-type URL paths (`SLUG_PATH_BY_TYPE`, `FIXED_PATH_BY_TYPE`). Never hardcode `/releases`, `/artists`, etc. See [routing.md](routing.md) for usage.

---

## Discogs metadata

`release.discogs.releaseId` and `release.discogs.masterId` are read-only fields populated by `DiscogsSearchInput` (`apps/studio/components/inputs/`). Do not add free-text editing.

---

## TypeGen

See [data-fetching.md](data-fetching.md) for the full TypeGen workflow. Short version: run `yarn typegen` after any schema change.

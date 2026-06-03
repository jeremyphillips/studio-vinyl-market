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

| Type             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `buttonBlock`    | Page-builder block — label, variant, size, internal/external link  |
| `imageWithAlt`   | `image` + required `alt`, optional `caption`; hotspot/crop enabled |
| `seo`            | `metaTitle`, `metaDescription`, `ogImage`, `noIndex`               |
| `navItem`        | Nav link — label, `internal`/`external` linkType, resolved target  |
| `artistLocation` | Place tied to an artist — city/state/country, `geopoint`, note     |

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
import {
  releaseClassificationOptions,
  releaseChannelsOptions,
  releaseDescriptionOptions,
  releaseMediaTypeOptions,
  releaseSizeOptions,
  releaseSpeedOptions,
} from '@vinyl-market/release-constants'
```

Current exports:

| Constant                       | Field            | Values                                      |
| ------------------------------ | ---------------- | ------------------------------------------- |
| `releaseClassificationOptions` | `classification` | LP, EP, Single                              |
| `releaseMediaTypeOptions`      | `mediaType`      | vinyl, shellac, cd, cassette                |
| `releaseSpeedOptions`          | `speed`          | 33, 45, 78                                  |
| `releaseSizeOptions`           | `size`           | 7", 10", 12"                                |
| `releaseChannelsOptions`       | `channels`       | mono, stereo                                |
| `releaseDescriptionOptions`    | `descriptions`   | reissue, repress, promo, unofficial-release |

- **Studio** (`apps/studio/schemaTypes/constants/release.ts`) re-exports from the package.
- **Web** derives label maps at module scope using `Object.fromEntries`:

```ts
const CLASSIFICATION_LABEL = Object.fromEntries(
  releaseClassificationOptions.map(({ value, title }) => [value, title]),
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

`release.discogs.releaseId` and `release.discogs.masterId` are the only Discogs values stored on the document. They are read-only fields populated by `DiscogsSearchInput` (`apps/studio/components/inputs/`). Do not add free-text editing.

### Importing (tracklist)

Linking a release and importing its data are separate steps. Once a release is linked, `DiscogsImportPanel` renders inside `DiscogsSearchInput`. It fetches the release detail (via `GET /api/discogs/releases/[id]`) and lets the editor import the **tracklist** into the document's own `discs` field. Importing pre-fills typed fields — no raw Discogs blob is ever stored, so document size is unaffected and the data is freely editable afterwards.

- Tracklist headings (`type_: "heading"`) are skipped; index tracks (`type_: "index"`) are flattened into their `sub_tracks`.
- All tracks map onto a single disc (`discNumber: 1`). Multi-disc structure is not split yet.
- Importing **replaces** the existing `discs` array; the panel warns when tracks are already present.
- The cross-field write uses `useDocumentOperation(...).patch.execute(...)` because the input is scoped to the `discogs` object and cannot patch the sibling `discs` field directly.

Format, release date, speed, and credits import are deferred (see the import-panel plan).

### Shared types — `@vinyl-market/discogs`

Discogs API shapes (`DiscogsResult`, `DiscogsSearchResponse`, `DiscogsTrack`, `DiscogsReleaseDetail`) live in the `@vinyl-market/discogs` workspace package — the SSoT consumed by both the web API normalizers and the Studio. Studio-only helpers (URL builders) stay in `apps/studio/components/types/discogs.ts`.

## Artist locations

`artist.locations[]` is an array of `artistLocation` objects, capturing one or more places tied to an artist. All fields are optional:

- `city` / `state` / `country` — free-text place names.
- `coordinates` — Sanity built-in `geopoint` (`lat`/`lng`), used to plot the artist on a future interactive map.
- `note` — optional context, e.g. a former name or a place that no longer exists.

### Hybrid entry — `LocationSearchInput`

`artistLocation` uses a custom input (`apps/studio/components/inputs/LocationSearchInput.tsx`) that renders an OpenStreetMap / Nominatim search above the standard editable fields:

- Selecting a result patches `city`, `state`, `country`, and `coordinates` via relative `set` patches.
- The default fields stay editable (`props.renderDefault(props)`), so editors can correct values or enter defunct/renamed places and coordinates by hand.
- Nominatim is called **directly from the browser** (it supports CORS, needs no API key). No web proxy route exists yet; add one under `apps/web/app/api/` only if rate limits become an issue.

Result → field mapping lives in `apps/studio/lib/nominatim-adapter.ts` (`adaptNominatimResult`), with `city` falling back to `town`/`village`/`municipality`/`hamlet` and `state` to `province`/`region`. Nominatim response shapes and the search-URL builder are in `apps/studio/components/types/location.ts`.

---

## TypeGen

See [data-fetching.md](data-fetching.md) for the full TypeGen workflow. Short version: run `yarn typegen` after any schema change.

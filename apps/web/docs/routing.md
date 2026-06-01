# Routing

## App Router segment map

```
app/
├── layout.tsx              Root layout (fonts, providers, header, SanityLive)
├── page.tsx                Home — latest releases grid
├── error.tsx               Root error boundary
├── not-found.tsx           Root 404
├── releases/
│   ├── page.tsx            /releases index
│   └── [slug]/page.tsx     /releases/[slug] detail
├── artists/[slug]/page.tsx
├── labels/[slug]/page.tsx
├── pages/[slug]/page.tsx   CMS pages
└── api/
    ├── draft-mode/enable|disable/
    └── discogs/search/     Discogs API proxy (Studio input)
```

Each `[slug]` segment has a co-located `not-found.tsx`.

---

## `generateStaticParams`

Every `[slug]` route pre-renders known slugs at build time. Use the raw `client` with `useCdn: false, stega: false` — not `sanityFetch`:

```ts
export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, perspective: 'published', stega: false })
    .fetch(RELEASE_SLUGS_QUERY)
  return slugs.map((slug) => ({ slug }))
}
```

The `*_SLUGS_QUERY` for each route lives in `sanity/queries.ts` alongside its detail query.

---

## `generateMetadata`

Pages with a Sanity `seo` object use `toNextMetadata()` from `sanity/seo.ts`:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: RELEASES_PAGE_QUERY })
  return toNextMetadata(data?.seo)
}
```

For detail pages without a `seo` object, return a plain metadata object. Always pass `stega: false` — stega strings must not appear in `<head>`.

---

## Error boundary pattern

When a Sanity query returns `null`, call `notFound()` immediately. `error.tsx` handles unexpected runtime errors. Co-locate both with the route segment that owns them.

---

## pageBuilder pattern

`PAGE_QUERY` uses a flat-union projection so one fetch returns all block types. The renderer (`components/page-builder/page-builder.tsx`) switches on `_type`. Updating requires changing the query and renderer together — see [content-modeling.md](content-modeling.md).

---

## Route constants

All content-type URL paths live in `apps/web/lib/routes.ts`. Never hardcode path strings in components:

```ts
import { SLUG_PATH_BY_TYPE, FIXED_PATH_BY_TYPE } from '@/lib/routes'
```

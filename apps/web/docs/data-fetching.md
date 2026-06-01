# Data Fetching

## Sanity client — `apps/web/sanity/client.ts`

`createClient` with `useCdn: true` (safe — Live Content API handles invalidation) and `perspective: 'published'`. Stega is off by default; `defineLive` enables it only in draft mode. Config from `sanity/env.ts`.

---

## `sanityFetch` and `<SanityLive />` — `apps/web/sanity/live.ts`

`sanityFetch` is the **only** fetch helper to use from React Server Components:

| Behaviour   | Published   | Draft mode |
| ----------- | ----------- | ---------- |
| Perspective | `published` | `drafts`   |
| Stega       | off         | on         |
| Cache tags  | registered  | registered |

`<SanityLive />` is mounted once in the root layout and revalidates cache tags in real time.

Use the raw `client` only in `generateStaticParams` (with `useCdn: false, stega: false`).

---

## GROQ query conventions — `apps/web/sanity/queries.ts`

All queries use `defineQuery` in a single file:

- One file only — do not scatter `defineQuery` calls across page files
- Name: `SCREAMING_SNAKE_CASE` ending `_QUERY`; slug queries end `_SLUGS_QUERY`
- Run `yarn typegen` after adding or modifying any query

---

## Fragment pattern — `apps/web/sanity/fragments/`

| File         | Key exports                                                |
| ------------ | ---------------------------------------------------------- |
| `link.ts`    | `internalLinkResolved`                                     |
| `image.ts`   | `imageWithAlt`, `imageWithAltCaption`, `galleryProjection` |
| `seo.ts`     | `seoProjection`                                            |
| `release.ts` | `releaseCardListFields`, `releasesOrder`                   |

Compose via template literals: `cover${imageWithAltCaption}`. Never write raw image or SEO projections inline.

---

## Live / draft preview

Enable: `GET /api/draft-mode/enable`. Disable: `/api/draft-mode/disable`.

When active: `sanityFetch` switches to `drafts` + stega; `<VisualEditing />` is injected from the root layout.

---

## TypeGen

```bash
yarn typegen   # run from repo root
```

Runs `sanity schema extract` + `sanity typegen generate` in `apps/studio`. Output: `apps/web/sanity/types.ts`.

**Run after:** any schema field change, adding/modifying a `defineQuery`, or changing `buttonBlock` variant/size options (see [content-modeling.md](content-modeling.md)).

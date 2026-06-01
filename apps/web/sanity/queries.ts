import {defineQuery} from 'next-sanity'

import {galleryProjection, imageWithAltCaption} from './fragments/image'
import {internalLinkResolved} from './fragments/link'
import {
  releaseCardListFields,
  releaseCardNestedFields,
  releaseCardNestedWithArtistFields,
  releasesOrder,
} from './fragments/release'
import {seoProjection} from './fragments/seo'

/**
 * Header navigation, read from the site-settings singleton.
 *
 * The internal link is resolved through to `_type` and `slug.current` so the
 * Header component can build the right URL (`/releases/[slug]`, etc.) without
 * a second fetch.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    title,
    "navigation": coalesce(navigation, [])[]{
      _key,
      label,
      linkType,
      externalUrl,
      "internal": internalLink->{${internalLinkResolved}}
    }
  }
`)

/** Releases index page singleton (/releases). */
export const RELEASES_PAGE_QUERY = defineQuery(`
  *[_id == "releasesPage"][0]{
    title,
    intro,
    ${seoProjection}
  }
`)

/** Most recent releases, used on the home page. */
export const HOME_RELEASES_QUERY = defineQuery(`
  *[_type == "release" && defined(slug.current)]
    | ${releasesOrder}
    [0...12]{
      ${releaseCardListFields}
    }
`)

/** Full release list page. */
export const RELEASES_QUERY = defineQuery(`
  *[_type == "release" && defined(slug.current)]
    | ${releasesOrder}{
      ${releaseCardListFields}
    }
`)

/** Slugs for `generateStaticParams` on the release detail route. */
export const RELEASE_SLUGS_QUERY = defineQuery(`
  *[_type == "release" && defined(slug.current)][].slug.current
`)

/** Single release detail. */
export const RELEASE_QUERY = defineQuery(`
  *[_type == "release" && slug.current == $slug][0]{
    _id,
    _type,
    releaseName,
    "slug": slug.current,
    format,
    speed,
    releaseDate,
    dateUnknown,
    noLabel,
    "artist": artist->{name, "slug": slug.current},
    "label": label->{name, "slug": slug.current},
    cover${imageWithAltCaption},
    gallery${galleryProjection},
    discs[]{
      _key,
      discNumber,
      name,
      tracks[]{_key, position, title}
    },
    discogs{releaseId, masterId}
  }
`)

/** Artist slugs for `generateStaticParams`. */
export const ARTIST_SLUGS_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)][].slug.current
`)

/**
 * Artist detail + their releases.
 * `^._id` is intentional: it refers to the current artist document being
 * queried (the parent scope), not the matched release.
 */
export const ARTIST_QUERY = defineQuery(`
  *[_type == "artist" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    cover${imageWithAltCaption},
    gallery${galleryProjection},
    "releases": *[_type == "release" && artist._ref == ^._id && defined(slug.current)]
      | ${releasesOrder}{
        ${releaseCardNestedFields}
      }
  }
`)

/** Label slugs for `generateStaticParams`. */
export const LABEL_SLUGS_QUERY = defineQuery(`
  *[_type == "label" && defined(slug.current)][].slug.current
`)

/** Page slugs for `generateStaticParams` on the /pages/[slug] route. */
export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)][].slug.current
`)

/**
 * Single page with pageBuilder blocks.
 *
 * The pageBuilder projection uses a flat union: every known field for all block
 * types is listed and GROQ returns null for fields not present on a given block.
 * `internalLink` is resolved to `_type` + `slug.current` so the web app can
 * build the correct URL without a second fetch.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    pageBuilder[]{
      _key,
      _type,
      label,
      variant,
      size,
      linkType,
      externalUrl,
      "internalLink": internalLink->{${internalLinkResolved}},
      asset,
      hotspot,
      crop,
      alt,
      caption
    },
    ${seoProjection}
  }
`)

/** Label detail + its releases. */
export const LABEL_QUERY = defineQuery(`
  *[_type == "label" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    cover${imageWithAltCaption},
    gallery${galleryProjection},
    "releases": *[_type == "release" && label._ref == ^._id && defined(slug.current)]
      | ${releasesOrder}{
        ${releaseCardNestedWithArtistFields}
      }
  }
`)

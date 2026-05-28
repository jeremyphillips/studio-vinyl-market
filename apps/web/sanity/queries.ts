import {defineQuery} from 'next-sanity'

/**
 * Reusable projection for a single image with alt text. Returned shape:
 *   {asset, hotspot, crop, alt, caption}
 *
 * Inlined into the parent projections rather than referenced as a fragment
 * because TypeGen doesn't follow GROQ functions across constants — keeping
 * this comment as the source of truth for the field list.
 */

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
      "internal": internalLink->{
        _type,
        "slug": slug.current
      }
    }
  }
`)

/** Releases index page singleton (/releases). */
export const RELEASES_PAGE_QUERY = defineQuery(`
  *[_id == "releasesPage"][0]{
    title,
    intro,
    seo{
      metaTitle,
      metaDescription,
      noIndex,
      ogImage{
        asset,
        hotspot,
        crop,
        alt
      }
    }
  }
`)

/** Most recent releases, used on the home page. */
export const HOME_RELEASES_QUERY = defineQuery(`
  *[_type == "release" && defined(slug.current)]
    | order(coalesce(releaseDate, _createdAt) desc)
    [0...12]{
      _id,
      releaseName,
      "slug": slug.current,
      format,
      releaseDate,
      dateUnknown,
      "artist": artist->{name, "slug": slug.current},
      cover{asset, hotspot, crop, alt}
    }
`)

/** Full release list page. */
export const RELEASES_QUERY = defineQuery(`
  *[_type == "release" && defined(slug.current)]
    | order(coalesce(releaseDate, _createdAt) desc){
      _id,
      releaseName,
      "slug": slug.current,
      format,
      releaseDate,
      dateUnknown,
      "artist": artist->{name, "slug": slug.current},
      cover{asset, hotspot, crop, alt}
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
    releaseName,
    "slug": slug.current,
    format,
    speed,
    releaseDate,
    dateUnknown,
    noLabel,
    "artist": artist->{name, "slug": slug.current},
    "label": label->{name, "slug": slug.current},
    cover{asset, hotspot, crop, alt, caption},
    gallery[]{_key, asset, hotspot, crop, alt, caption},
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
    name,
    "slug": slug.current,
    cover{asset, hotspot, crop, alt, caption},
    gallery[]{_key, asset, hotspot, crop, alt, caption},
    "releases": *[_type == "release" && artist._ref == ^._id && defined(slug.current)]
      | order(coalesce(releaseDate, _createdAt) desc){
        _id,
        releaseName,
        "slug": slug.current,
        format,
        releaseDate,
        dateUnknown,
        cover{asset, hotspot, crop, alt}
      }
  }
`)

/** Label slugs for `generateStaticParams`. */
export const LABEL_SLUGS_QUERY = defineQuery(`
  *[_type == "label" && defined(slug.current)][].slug.current
`)

/** Label detail + its releases. */
export const LABEL_QUERY = defineQuery(`
  *[_type == "label" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    cover{asset, hotspot, crop, alt, caption},
    gallery[]{_key, asset, hotspot, crop, alt, caption},
    "releases": *[_type == "release" && label._ref == ^._id && defined(slug.current)]
      | order(coalesce(releaseDate, _createdAt) desc){
        _id,
        releaseName,
        "slug": slug.current,
        format,
        releaseDate,
        dateUnknown,
        "artist": artist->{name, "slug": slug.current},
        cover{asset, hotspot, crop, alt}
      }
  }
`)

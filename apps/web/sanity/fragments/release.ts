import { imageWithAltFields } from './image'

/** Shared release ordering for list and nested queries. */
export const releasesOrder = /* groq */ `order(coalesce(releaseDate, _createdAt) desc)`

const releaseCardCore = /* groq */ `
  releaseName,
  "slug": slug.current,
  format,
  releaseDate,
  dateUnknown,
  cover{${imageWithAltFields}}
`

export const releaseArtistRef = /* groq */ `
  "artist": artist->{name, "slug": slug.current}
`

/** Release card fields for index/list pages (includes _type and artist). */
export const releaseCardListFields = /* groq */ `
  _id,
  _type,
  ${releaseCardCore},
  ${releaseArtistRef}
`

/** Nested release fields on artist detail (no redundant artist). */
export const releaseCardNestedFields = /* groq */ `
  _id,
  ${releaseCardCore}
`

/** Nested release fields on label detail (includes artist). */
export const releaseCardNestedWithArtistFields = /* groq */ `
  _id,
  ${releaseCardCore},
  ${releaseArtistRef}
`

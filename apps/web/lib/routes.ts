/** Base path for each slug-based content type. */
export const SLUG_PATH_BY_TYPE = {
  release: '/releases',
  artist: '/artists',
  label: '/labels',
  page: '/pages',
} as const satisfies Record<string, string>

/** Full path for singleton content types that have no slug. */
export const FIXED_PATH_BY_TYPE = {
  releasesPage: '/releases',
} as const

export type SlugContentType = keyof typeof SLUG_PATH_BY_TYPE
export type FixedContentType = keyof typeof FIXED_PATH_BY_TYPE

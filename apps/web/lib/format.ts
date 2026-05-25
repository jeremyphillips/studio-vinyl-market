/**
 * Returns the 4-digit year of an ISO date string, "Year unknown" if the
 * editor flagged the release date as unknown, or null when there's nothing
 * useful to show.
 */
export function formatYear(
  releaseDate: string | null | undefined,
  dateUnknown: boolean | null | undefined,
): string | null {
  if (dateUnknown) return 'Year unknown'
  if (typeof releaseDate === 'string' && releaseDate.length >= 4) {
    return releaseDate.slice(0, 4)
  }
  return null
}

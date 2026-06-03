/**
 * Returns the year as a string, "Year unknown" if the editor flagged the
 * release date as unknown, or null when there's nothing useful to show.
 */
export function formatYear(
  releaseYear: number | null | undefined,
  dateUnknown: boolean | null | undefined,
): string | null {
  if (dateUnknown) return 'Year unknown'
  if (typeof releaseYear === 'number') return String(releaseYear)
  return null
}

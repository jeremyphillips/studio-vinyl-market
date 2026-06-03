import type { DiscogsReleaseDetail } from '@vinyl-market/discogs'
import { releaseDescriptionOptions } from '@vinyl-market/release-constants'

export interface DiscogsReleasePatch {
  mediaType?: string
  classification?: string
  speed?: string
  size?: string
  channels?: string
  descriptions?: string[]
}

/** Discogs format `name` values that map to our `mediaType` schema values. */
const MEDIA_TYPE_MAP: Record<string, string> = {
  Vinyl: 'vinyl',
  Shellac: 'shellac',
  CD: 'cd',
  Cassette: 'cassette',
}

/** Classification values recognised in both `name` and `descriptions`. */
const CLASSIFICATION_VALUES = new Set(['LP', 'EP', 'Single'])

/**
 * Map Discogs format description titles → Sanity `descriptions` values.
 * Built from `releaseDescriptionOptions` so adding/removing options here
 * is automatically reflected. `unofficial-release` is excluded because
 * Discogs doesn't reliably tag bootlegs with a matching description string.
 */
const DESCRIPTION_TITLE_TO_VALUE: Record<string, string> = Object.fromEntries(
  releaseDescriptionOptions
    .filter((opt) => opt.value !== 'unofficial-release')
    .map((opt) => [opt.title, opt.value]),
)

function parseMediaType(name: string): string | undefined {
  return MEDIA_TYPE_MAP[name]
}

function parseClassification(name: string, descriptions: string[]): string | undefined {
  if (CLASSIFICATION_VALUES.has(name)) return name
  return descriptions.find((d) => CLASSIFICATION_VALUES.has(d))
}

function parseSpeed(descriptions: string[]): string | undefined {
  for (const d of descriptions) {
    if (/33[\s\u00a0]*⅓|33\s*1\/3\s*RPM/i.test(d)) return '33'
    if (/45\s*RPM/i.test(d)) return '45'
    if (/78\s*RPM/i.test(d)) return '78'
  }
  return undefined
}

function parseSize(descriptions: string[]): string | undefined {
  for (const d of descriptions) {
    const match = d.trim().match(/^(7|10|12)(?:\D|$)/)
    if (match) return `${match[1]}"`
  }
  return undefined
}

function parseChannels(descriptions: string[]): string | undefined {
  if (descriptions.includes('Stereo')) return 'stereo'
  if (descriptions.includes('Mono')) return 'mono'
  return undefined
}

function parseDescriptions(descriptions: string[]): string[] | undefined {
  const matched = descriptions
    .map((d) => DESCRIPTION_TITLE_TO_VALUE[d])
    .filter((v): v is string => v !== undefined)
  return matched.length > 0 ? matched : undefined
}

/**
 * Maps the first Discogs format entry to a partial Sanity release patch.
 * Fields not found in the Discogs data are `undefined` and must not be written.
 */
export function adaptDiscogsFormat(detail: DiscogsReleaseDetail): DiscogsReleasePatch {
  const format = (detail.formats ?? [])[0]
  if (!format) return {}

  const { name, descriptions } = format

  return {
    mediaType: parseMediaType(name),
    classification: parseClassification(name, descriptions),
    speed: parseSpeed(descriptions),
    size: parseSize(descriptions),
    channels: parseChannels(descriptions),
    descriptions: parseDescriptions(descriptions),
  }
}

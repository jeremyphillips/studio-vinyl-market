import type { LinkedIdItem } from '../ui'
import type { DiscogsValue } from '../types/discogs'

/**
 * Joins a referenced artist's name and the release name into the default
 * Discogs search query. Falsy parts are dropped so a missing artist or release
 * name never produces stray whitespace.
 */
export function buildInitialQuery(artistName?: string, releaseName?: string): string {
  return [artistName, releaseName].filter(Boolean).join(' ')
}

/**
 * Derives the external Discogs links shown on the linked-release card. Returns
 * an empty list when nothing is linked, the release link alone, or the release
 * plus master link when a master id is present.
 */
export function buildLinkedDiscogsItems(value: DiscogsValue | undefined): LinkedIdItem[] {
  if (value?.releaseId == null) return []

  const items: LinkedIdItem[] = [
    {
      label: 'Release',
      id: value.releaseId,
      href: `https://www.discogs.com/release/${value.releaseId}`,
    },
  ]

  if (value.masterId != null) {
    items.push({
      label: 'Master',
      id: value.masterId,
      href: `https://www.discogs.com/master/${value.masterId}`,
    })
  }

  return items
}

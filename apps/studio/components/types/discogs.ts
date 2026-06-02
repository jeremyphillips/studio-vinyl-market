import type { DiscogsResult } from '@vinyl-market/discogs'

export type {
  DiscogsResult,
  DiscogsSearchResponse,
  DiscogsTrack,
  DiscogsReleaseDetail,
} from '@vinyl-market/discogs'

export interface DiscogsValue {
  _type?: string
  releaseId?: number
  masterId?: number | null
}

function getPreviewUrl(): string {
  return typeof process !== 'undefined' ? (process.env.SANITY_STUDIO_PREVIEW_URL ?? '') : ''
}

export function buildDiscogsSearchUrl(query: string, page = 1): string {
  const base = getPreviewUrl().replace(/\/$/, '')
  const params = new URLSearchParams({ q: query, page: String(page), per_page: '20' })
  return `${base}/api/discogs/search?${params.toString()}`
}

export function buildDiscogsReleaseUrl(id: number): string {
  const base = getPreviewUrl().replace(/\/$/, '')
  return `${base}/api/discogs/releases/${id}`
}

export function buildDiscogsResultDetail(result: DiscogsResult): string {
  const parts: string[] = []
  if (result.year) parts.push(result.year)
  if (result.country) parts.push(result.country)
  if (result.format.length > 0) parts.push(result.format.join(', '))
  if (result.label.length > 0) parts.push(result.label[0])
  if (result.catno) parts.push(result.catno)
  return parts.join(' · ')
}

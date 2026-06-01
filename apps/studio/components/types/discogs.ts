export interface DiscogsResult {
  id: number
  masterId: number | null
  title: string
  year: string | null
  country: string | null
  format: string[]
  label: string[]
  catno: string | null
  thumb: string | null
  coverImage: string | null
  resourceUrl: string
}

export interface DiscogsApiResponse {
  results: DiscogsResult[]
  pagination: {
    page: number
    pages: number
    items: number
    perPage: number
  }
}

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

export function buildDiscogsResultDetail(result: DiscogsResult): string {
  const parts: string[] = []
  if (result.year) parts.push(result.year)
  if (result.country) parts.push(result.country)
  if (result.format.length > 0) parts.push(result.format.join(', '))
  if (result.label.length > 0) parts.push(result.label[0])
  if (result.catno) parts.push(result.catno)
  return parts.join(' · ')
}

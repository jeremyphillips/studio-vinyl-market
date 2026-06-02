import type { DiscogsResult, DiscogsSearchResponse } from '@vinyl-market/discogs'

export type { DiscogsResult, DiscogsSearchResponse }

export function mapDiscogsSearchResult(raw: Record<string, unknown>): DiscogsResult {
  return {
    id: raw.id as number,
    masterId: (raw.master_id as number | undefined) ?? null,
    title: raw.title as string,
    year: (raw.year as string | undefined) ?? null,
    country: (raw.country as string | undefined) ?? null,
    format: Array.isArray(raw.format) ? (raw.format as string[]) : [],
    label: Array.isArray(raw.label) ? (raw.label as string[]) : [],
    catno: (raw.catno as string | undefined) ?? null,
    thumb: (raw.thumb as string | undefined) ?? null,
    coverImage: (raw.cover_image as string | undefined) ?? null,
    resourceUrl: raw.resource_url as string,
  }
}

export function mapDiscogsSearchResponse(raw: {
  results?: Record<string, unknown>[]
  pagination?: {
    page?: number
    pages?: number
    items?: number
    per_page?: number
  }
}): DiscogsSearchResponse {
  const results = (raw.results ?? []).map(mapDiscogsSearchResult)
  const pagination = raw.pagination ?? {}

  return {
    results,
    pagination: {
      page: pagination.page ?? 1,
      pages: pagination.pages ?? 1,
      items: pagination.items ?? results.length,
      perPage: pagination.per_page ?? results.length,
    },
  }
}

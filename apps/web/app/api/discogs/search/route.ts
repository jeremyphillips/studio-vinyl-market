import { NextRequest } from 'next/server'

import { corsJson, fetchDiscogs } from '../_lib/discogs'

import { mapDiscogsSearchResponse } from './map-discogs-result'

export type { DiscogsResult, DiscogsSearchResponse } from './map-discogs-result'

export { OPTIONS } from '../_lib/discogs'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')
  const artist = searchParams.get('artist')
  const title = searchParams.get('title')
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('per_page') ?? '20'

  if (!q && !artist && !title) {
    return corsJson({ error: 'At least one of q, artist, or title is required' }, { status: 400 })
  }

  const params = new URLSearchParams({ type: 'release', page, per_page: perPage })
  if (q) params.set('q', q)
  if (artist) params.set('artist', artist)
  if (title) params.set('release_title', title)

  const result = await fetchDiscogs(`/database/search?${params.toString()}`)
  if (!result.ok) return result.response

  return corsJson(
    mapDiscogsSearchResponse(result.data as Parameters<typeof mapDiscogsSearchResponse>[0]),
  )
}

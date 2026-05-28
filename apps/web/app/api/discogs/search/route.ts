import {NextRequest, NextResponse} from 'next/server'
import {mapDiscogsSearchResponse} from './map-discogs-result'

export type {DiscogsSearchResult, DiscogsSearchResponse} from './map-discogs-result'

const DISCOGS_API_BASE = 'https://api.discogs.com'
const USER_AGENT = 'VinylMarket/1.0 +https://github.com/vinyl-market'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, {status: 204, headers: CORS_HEADERS})
}

export async function GET(request: NextRequest) {
  const token = process.env.DISCOGS_API_TOKEN
  if (!token) {
    return NextResponse.json(
      {error: 'DISCOGS_API_TOKEN is not configured'},
      {status: 500, headers: CORS_HEADERS},
    )
  }

  const {searchParams} = request.nextUrl
  const q = searchParams.get('q')
  const artist = searchParams.get('artist')
  const title = searchParams.get('title')
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('per_page') ?? '20'

  if (!q && !artist && !title) {
    return NextResponse.json(
      {error: 'At least one of q, artist, or title is required'},
      {status: 400, headers: CORS_HEADERS},
    )
  }

  const params = new URLSearchParams({type: 'release', page, per_page: perPage})
  if (q) params.set('q', q)
  if (artist) params.set('artist', artist)
  if (title) params.set('release_title', title)

  const url = `${DISCOGS_API_BASE}/database/search?${params.toString()}`

  const discogsRes = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${token}`,
      'User-Agent': USER_AGENT,
      Accept: 'application/vnd.discogs.v2.plaintext+json',
    },
    next: {revalidate: 60},
  })

  if (!discogsRes.ok) {
    const text = await discogsRes.text()
    return NextResponse.json(
      {error: `Discogs API error ${discogsRes.status}: ${text}`},
      {status: discogsRes.status, headers: CORS_HEADERS},
    )
  }

  const raw = await discogsRes.json()
  const response = mapDiscogsSearchResponse(raw)

  return NextResponse.json(response, {headers: CORS_HEADERS})
}

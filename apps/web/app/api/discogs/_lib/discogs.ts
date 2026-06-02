import { NextResponse } from 'next/server'

const DISCOGS_API_BASE = 'https://api.discogs.com'
const USER_AGENT = 'VinylMarket/1.0 +https://github.com/vinyl-market'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function corsJson(body: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(body, { ...init, headers: { ...CORS_HEADERS, ...init?.headers } })
}

export function OPTIONS(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export type DiscogsFetchResult = { ok: true; data: unknown } | { ok: false; response: NextResponse }

/**
 * Proxies an authenticated GET to the Discogs API. On failure (missing token or
 * upstream error) it returns a ready-to-send, CORS-wrapped error response so the
 * caller can `return result.response` directly.
 */
export async function fetchDiscogs(path: string): Promise<DiscogsFetchResult> {
  const token = process.env.DISCOGS_API_TOKEN
  if (!token) {
    return {
      ok: false,
      response: corsJson({ error: 'DISCOGS_API_TOKEN is not configured' }, { status: 500 }),
    }
  }

  const res = await fetch(`${DISCOGS_API_BASE}${path}`, {
    headers: {
      Authorization: `Discogs token=${token}`,
      'User-Agent': USER_AGENT,
      Accept: 'application/vnd.discogs.v2.plaintext+json',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const text = await res.text()
    return {
      ok: false,
      response: corsJson(
        { error: `Discogs API error ${res.status}: ${text}` },
        {
          status: res.status,
        },
      ),
    }
  }

  return { ok: true, data: await res.json() }
}

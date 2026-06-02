import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { corsJson, fetchDiscogs, OPTIONS } from './discogs'

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
}

describe('OPTIONS', () => {
  it('returns 204 with CORS headers', () => {
    const response = OPTIONS()

    expect(response.status).toBe(204)
    expect(Object.fromEntries(response.headers.entries())).toMatchObject(CORS_HEADERS)
  })
})

describe('corsJson', () => {
  it('wraps a body with CORS headers and the given status', async () => {
    const response = corsJson({ error: 'nope' }, { status: 400 })

    expect(response.status).toBe(400)
    expect(Object.fromEntries(response.headers.entries())).toMatchObject(CORS_HEADERS)
    expect(await response.json()).toEqual({ error: 'nope' })
  })
})

describe('fetchDiscogs', () => {
  beforeEach(() => {
    vi.stubEnv('DISCOGS_API_TOKEN', 'test-token')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns a 500 error response when DISCOGS_API_TOKEN is missing', async () => {
    vi.stubEnv('DISCOGS_API_TOKEN', '')

    const result = await fetchDiscogs('/releases/1')

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.response.status).toBe(500)
    expect(await result.response.json()).toEqual({ error: 'DISCOGS_API_TOKEN is not configured' })
  })

  it('calls the Discogs API with auth headers and revalidation, returning parsed data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchDiscogs('/releases/42')

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('expected success')
    expect(result.data).toEqual({ id: 42 })

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit & { next?: unknown }]
    expect(url).toBe('https://api.discogs.com/releases/42')
    expect(options.headers).toMatchObject({
      Authorization: 'Discogs token=test-token',
      'User-Agent': 'VinylMarket/1.0 +https://github.com/vinyl-market',
      Accept: 'application/vnd.discogs.v2.plaintext+json',
    })
    expect(options.next).toEqual({ revalidate: 60 })
  })

  it('forwards Discogs API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Rate limit exceeded', { status: 429 })),
    )

    const result = await fetchDiscogs('/releases/1')

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.response.status).toBe(429)
    expect(await result.response.json()).toEqual({
      error: 'Discogs API error 429: Rate limit exceeded',
    })
  })
})

import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import rawFixture from './fixtures/raw-search-response.json'
import { GET, OPTIONS } from './route'

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
}

function createRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('OPTIONS /api/discogs/search', () => {
  it('returns 204 with CORS headers', () => {
    const response = OPTIONS()

    expect(response.status).toBe(204)
    expect(Object.fromEntries(response.headers.entries())).toMatchObject(CORS_HEADERS)
  })
})

describe('GET /api/discogs/search', () => {
  beforeEach(() => {
    vi.stubEnv('DISCOGS_API_TOKEN', 'test-token')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns 500 when DISCOGS_API_TOKEN is missing', async () => {
    vi.stubEnv('DISCOGS_API_TOKEN', '')

    const response = await GET(createRequest('/api/discogs/search?q=radiohead'))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('DISCOGS_API_TOKEN is not configured')
  })

  it('returns 400 when no search params are provided', async () => {
    const response = await GET(createRequest('/api/discogs/search'))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('At least one of q, artist, or title is required')
  })

  it('proxies q searches to Discogs and returns normalized results', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(rawFixture), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET(createRequest('/api/discogs/search?q=radiohead+ok+computer&page=2'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Object.fromEntries(response.headers.entries())).toMatchObject(CORS_HEADERS)
    expect(fetchMock).toHaveBeenCalledOnce()

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      'https://api.discogs.com/database/search?type=release&page=2&per_page=20&q=radiohead+ok+computer',
    )
    expect(options.headers).toMatchObject({
      Authorization: 'Discogs token=test-token',
      Accept: 'application/vnd.discogs.v2.plaintext+json',
    })
    expect(body.results[0].masterId).toBe(67890)
    expect(body.pagination.perPage).toBe(20)
  })

  it('maps artist and title params to Discogs release_title', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ results: [], pagination: {} }), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await GET(createRequest('/api/discogs/search?artist=Radiohead&title=OK+Computer'))

    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toContain('artist=Radiohead')
    expect(url).toContain('release_title=OK+Computer')
  })

  it('forwards Discogs API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Rate limit exceeded', { status: 429 })),
    )

    const response = await GET(createRequest('/api/discogs/search?q=radiohead'))
    const body = await response.json()

    expect(response.status).toBe(429)
    expect(body.error).toBe('Discogs API error 429: Rate limit exceeded')
  })
})

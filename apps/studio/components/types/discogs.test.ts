import { describe, expect, it, vi } from 'vitest'
import { buildDiscogsResultDetail, buildDiscogsSearchUrl, type DiscogsResult } from './discogs'

describe('buildDiscogsSearchUrl', () => {
  it('builds a search URL with encoded query params', () => {
    vi.stubEnv('SANITY_STUDIO_PREVIEW_URL', 'http://localhost:3000/')

    expect(buildDiscogsSearchUrl('radiohead ok computer', 2)).toBe(
      'http://localhost:3000/api/discogs/search?q=radiohead+ok+computer&page=2&per_page=20',
    )

    vi.unstubAllEnvs()
  })

  it('strips a trailing slash from the preview base URL', () => {
    vi.stubEnv('SANITY_STUDIO_PREVIEW_URL', 'http://localhost:3000')

    expect(buildDiscogsSearchUrl('test')).toBe(
      'http://localhost:3000/api/discogs/search?q=test&page=1&per_page=20',
    )

    vi.unstubAllEnvs()
  })
})

describe('buildDiscogsResultDetail', () => {
  const baseResult: DiscogsResult = {
    id: 1,
    masterId: null,
    title: 'Example',
    year: null,
    country: null,
    format: [],
    label: [],
    catno: null,
    thumb: null,
    coverImage: null,
    resourceUrl: 'https://api.discogs.com/releases/1',
  }

  it('joins available metadata with separators', () => {
    const detail = buildDiscogsResultDetail({
      ...baseResult,
      year: '1997',
      country: 'UK',
      format: ['Vinyl', 'LP'],
      label: ['Parlophone'],
      catno: 'PARLP 1',
    })

    expect(detail).toBe('1997 · UK · Vinyl, LP · Parlophone · PARLP 1')
  })

  it('returns an empty string when no metadata is present', () => {
    expect(buildDiscogsResultDetail(baseResult)).toBe('')
  })
})

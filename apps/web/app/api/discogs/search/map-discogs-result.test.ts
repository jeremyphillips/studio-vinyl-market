import {describe, expect, it} from 'vitest'

import rawFixture from './fixtures/raw-search-response.json'
import {mapDiscogsSearchResponse, mapDiscogsSearchResult} from './map-discogs-result'

describe('mapDiscogsSearchResult', () => {
  it('maps snake_case Discogs fields to camelCase', () => {
    const result = mapDiscogsSearchResult(rawFixture.results[0] as Record<string, unknown>)

    expect(result).toEqual({
      id: 12345,
      masterId: 67890,
      title: 'Radiohead - OK Computer',
      year: '1997',
      country: 'UK',
      format: ['Vinyl', 'LP'],
      label: ['Parlophone'],
      catno: 'PARLP 1',
      thumb: 'https://example.com/thumb.jpg',
      coverImage: 'https://example.com/cover.jpg',
      resourceUrl: 'https://api.discogs.com/releases/12345',
    })
  })

  it('defaults missing array fields and masterId', () => {
    const result = mapDiscogsSearchResult(rawFixture.results[1] as Record<string, unknown>)

    expect(result.masterId).toBeNull()
    expect(result.format).toEqual([])
    expect(result.label).toEqual([])
    expect(result.year).toBeNull()
    expect(result.country).toBeNull()
  })
})

describe('mapDiscogsSearchResponse', () => {
  it('maps pagination and all results', () => {
    const response = mapDiscogsSearchResponse(rawFixture)

    expect(response.results).toHaveLength(2)
    expect(response.pagination).toEqual({
      page: 2,
      pages: 5,
      items: 80,
      perPage: 20,
    })
  })

  it('falls back when pagination is missing', () => {
    const response = mapDiscogsSearchResponse({
      results: [rawFixture.results[0] as Record<string, unknown>],
    })

    expect(response.pagination).toEqual({
      page: 1,
      pages: 1,
      items: 1,
      perPage: 1,
    })
  })
})

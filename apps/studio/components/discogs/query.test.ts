import { describe, expect, it } from 'vitest'
import { buildInitialQuery, buildLinkedDiscogsItems } from './query'

describe('buildInitialQuery', () => {
  it('returns an empty string when both parts are missing', () => {
    expect(buildInitialQuery(undefined, undefined)).toBe('')
  })

  it('returns the artist alone when there is no release name', () => {
    expect(buildInitialQuery('Aphex Twin', undefined)).toBe('Aphex Twin')
  })

  it('returns the release name alone when there is no artist', () => {
    expect(buildInitialQuery(undefined, 'Selected Ambient Works')).toBe('Selected Ambient Works')
  })

  it('joins artist and release name with a single space', () => {
    expect(buildInitialQuery('Aphex Twin', 'Selected Ambient Works')).toBe(
      'Aphex Twin Selected Ambient Works',
    )
  })
})

describe('buildLinkedDiscogsItems', () => {
  it('returns no items when there is no value', () => {
    expect(buildLinkedDiscogsItems(undefined)).toEqual([])
  })

  it('returns no items when the release id is missing', () => {
    expect(buildLinkedDiscogsItems({ _type: 'discogs' })).toEqual([])
  })

  it('returns the release item alone when there is no master id', () => {
    expect(buildLinkedDiscogsItems({ _type: 'discogs', releaseId: 123 })).toEqual([
      { label: 'Release', id: 123, href: 'https://www.discogs.com/release/123' },
    ])
  })

  it('treats a null master id as absent', () => {
    expect(buildLinkedDiscogsItems({ _type: 'discogs', releaseId: 123, masterId: null })).toEqual([
      { label: 'Release', id: 123, href: 'https://www.discogs.com/release/123' },
    ])
  })

  it('returns both release and master items when a master id is present', () => {
    expect(buildLinkedDiscogsItems({ _type: 'discogs', releaseId: 123, masterId: 456 })).toEqual([
      { label: 'Release', id: 123, href: 'https://www.discogs.com/release/123' },
      { label: 'Master', id: 456, href: 'https://www.discogs.com/master/456' },
    ])
  })
})

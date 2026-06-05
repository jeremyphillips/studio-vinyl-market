import { describe, expect, it } from 'vitest'

import { resolveDiscPreview, resolveReleasePreview } from './release'

// ──────────────────────────────────────────────────────────────────────────────
// resolveDiscPreview
// ──────────────────────────────────────────────────────────────────────────────

describe('resolveDiscPreview', () => {
  it('shows "No tracks yet" when tracks array is empty', () => {
    expect(resolveDiscPreview({ discNumber: 1, tracks: [] })).toEqual({
      title: 'Disc 1',
      subtitle: 'No tracks yet',
    })
  })

  it('shows "No tracks yet" when tracks is undefined', () => {
    expect(resolveDiscPreview({ discNumber: 1 })).toEqual({
      title: 'Disc 1',
      subtitle: 'No tracks yet',
    })
  })

  it('uses singular "track" for exactly one track', () => {
    expect(resolveDiscPreview({ discNumber: 1, tracks: [{}] })).toEqual({
      title: 'Disc 1',
      subtitle: '1 track',
    })
  })

  it('uses plural "tracks" for more than one track', () => {
    expect(resolveDiscPreview({ discNumber: 1, tracks: [{}, {}, {}] })).toEqual({
      title: 'Disc 1',
      subtitle: '3 tracks',
    })
  })

  it('uses disc name when provided', () => {
    expect(resolveDiscPreview({ discNumber: 1, name: 'Bonus CD', tracks: [] })).toEqual({
      title: 'Bonus CD',
      subtitle: 'No tracks yet',
    })
  })

  it('trims whitespace from the name', () => {
    const result = resolveDiscPreview({ discNumber: 1, name: '  Live set  ', tracks: [] })
    expect(result.title).toBe('Live set')
  })

  it('falls back to "Disc N" when name is missing and discNumber is set', () => {
    expect(resolveDiscPreview({ discNumber: 2, tracks: [{}] })).toEqual({
      title: 'Disc 2',
      subtitle: '1 track',
    })
  })

  it('falls back to bare "Disc" when both name and discNumber are absent', () => {
    expect(resolveDiscPreview({ tracks: [] })).toEqual({
      title: 'Disc',
      subtitle: 'No tracks yet',
    })
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// resolveReleasePreview
// ──────────────────────────────────────────────────────────────────────────────

describe('resolveReleasePreview', () => {
  it('falls back to "Untitled release" when releaseName is missing', () => {
    const result = resolveReleasePreview({})
    expect(result.title).toBe('Untitled release')
  })

  it('uses releaseName as title', () => {
    const result = resolveReleasePreview({ releaseName: 'Music Has the Right to Children' })
    expect(result.title).toBe('Music Has the Right to Children')
  })

  it('builds subtitle from all available fields', () => {
    const result = resolveReleasePreview({
      releaseName: 'Geogaddi',
      artistName: 'Boards of Canada',
      mediaType: 'vinyl',
      classification: 'LP',
      releaseYear: 2002,
    })
    expect(result.subtitle).toBe('Boards of Canada · Vinyl · LP · 2002')
  })

  it('shows "Year unknown" when dateUnknown is true', () => {
    const result = resolveReleasePreview({ releaseName: 'Test', dateUnknown: true })
    expect(result.subtitle).toBe('Year unknown')
  })

  it('omits year when dateUnknown is false and releaseYear is absent', () => {
    const result = resolveReleasePreview({
      releaseName: 'Test',
      artistName: 'Artist',
      dateUnknown: false,
    })
    expect(result.subtitle).toBe('Artist')
  })

  it('omits subtitle entirely when no subtitle fields are present', () => {
    const result = resolveReleasePreview({ releaseName: 'Test' })
    expect(result).not.toHaveProperty('subtitle')
  })

  it('omits missing artist/classification/mediaType from subtitle', () => {
    const result = resolveReleasePreview({ releaseName: 'Test', releaseYear: 1999 })
    expect(result.subtitle).toBe('1999')
  })

  it('passes media through to the result', () => {
    const media = { _type: 'image', asset: { _ref: 'abc' } }
    const result = resolveReleasePreview({ releaseName: 'Test', media })
    expect(result.media).toBe(media)
  })

  it('returns undefined media when none is provided', () => {
    const result = resolveReleasePreview({ releaseName: 'Test' })
    expect(result.media).toBeUndefined()
  })
})

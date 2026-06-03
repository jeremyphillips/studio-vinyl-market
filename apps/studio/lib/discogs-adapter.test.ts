import { describe, expect, it } from 'vitest'
import type { DiscogsReleaseDetail } from '@vinyl-market/discogs'
import { adaptDiscogsFormat } from './discogs-adapter'

function makeDetail(
  formatOverrides: Partial<{ name: string; descriptions: string[]; qty: string }> = {},
): DiscogsReleaseDetail {
  return {
    id: 1,
    tracklist: [],
    formats: [
      {
        name: 'Vinyl',
        qty: '1',
        descriptions: [],
        ...formatOverrides,
      },
    ],
  }
}

describe('adaptDiscogsFormat', () => {
  it('returns empty object when formats is absent', () => {
    const detail = { id: 1, tracklist: [], formats: [] } as DiscogsReleaseDetail
    expect(adaptDiscogsFormat(detail)).toEqual({})
  })

  describe('mediaType', () => {
    it.each([
      ['Vinyl', 'vinyl'],
      ['Shellac', 'shellac'],
      ['CD', 'cd'],
      ['Cassette', 'cassette'],
    ])('maps %s → %s', (name, expected) => {
      expect(adaptDiscogsFormat(makeDetail({ name })).mediaType).toBe(expected)
    })

    it('returns undefined for LP (not a media type)', () => {
      expect(adaptDiscogsFormat(makeDetail({ name: 'LP' })).mediaType).toBeUndefined()
    })

    it('returns undefined for unrecognised names', () => {
      expect(adaptDiscogsFormat(makeDetail({ name: 'Unknown' })).mediaType).toBeUndefined()
    })
  })

  describe('classification', () => {
    it.each(['LP', 'EP', 'Single'])('maps format name %s → %s', (value) => {
      expect(adaptDiscogsFormat(makeDetail({ name: value })).classification).toBe(value)
    })

    it.each(['LP', 'EP', 'Single'])('maps description %s when name is Vinyl', (value) => {
      expect(
        adaptDiscogsFormat(makeDetail({ name: 'Vinyl', descriptions: [value] })).classification,
      ).toBe(value)
    })

    it('prefers name over descriptions', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ name: 'LP', descriptions: ['EP'] })).classification,
      ).toBe('LP')
    })

    it('returns undefined when neither name nor descriptions contain a classification', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['Reissue'] })).classification,
      ).toBeUndefined()
    })
  })

  describe('speed', () => {
    it('parses "33 ⅓ RPM" → "33"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['33 ⅓ RPM'] })).speed).toBe('33')
    })

    it('parses "33⅓ RPM" (no space) → "33"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['33⅓ RPM'] })).speed).toBe('33')
    })

    it('parses "33 1/3 RPM" → "33"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['33 1/3 RPM'] })).speed).toBe('33')
    })

    it('parses "45 RPM" → "45"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['45 RPM'] })).speed).toBe('45')
    })

    it('parses "78 RPM" → "78"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['78 RPM'] })).speed).toBe('78')
    })

    it('returns undefined when no RPM string present', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['LP', 'Reissue'] })).speed,
      ).toBeUndefined()
    })
  })

  describe('size', () => {
    it.each([
      ['7"', '7"'],
      ['10"', '10"'],
      ['12"', '12"'],
    ])('maps %s → %s', (description, expected) => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: [description] })).size).toBe(expected)
    })

    it('matches raw numeric string "7" → 7"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['7'] })).size).toBe('7"')
    })

    it('matches raw numeric string "12" → 12"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['12'] })).size).toBe('12"')
    })

    it('returns undefined when no size description present', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['LP'] })).size).toBeUndefined()
    })
  })

  describe('channels', () => {
    it('maps "Stereo" → "stereo"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['Stereo'] })).channels).toBe('stereo')
    })

    it('maps "Mono" → "mono"', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['Mono'] })).channels).toBe('mono')
    })

    it('returns undefined when neither Mono nor Stereo present', () => {
      expect(adaptDiscogsFormat(makeDetail({ descriptions: ['LP'] })).channels).toBeUndefined()
    })
  })

  describe('descriptions', () => {
    it('maps known description titles to values', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['Reissue', 'Compilation'] })).descriptions,
      ).toEqual(['reissue', 'compilation'])
    })

    it('excludes unofficial-release from Discogs sync', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['Unofficial Release'] })).descriptions,
      ).toBeUndefined()
    })

    it('silently drops unrecognised description strings', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['Album', 'Promo'] })).descriptions,
      ).toEqual(['promo'])
    })

    it('returns undefined when no descriptions match', () => {
      expect(
        adaptDiscogsFormat(makeDetail({ descriptions: ['LP', '33 ⅓ RPM'] })).descriptions,
      ).toBeUndefined()
    })
  })

  it('maps a real-world LP Reissue release correctly', () => {
    const result = adaptDiscogsFormat(
      makeDetail({
        name: 'Vinyl',
        descriptions: ['LP', 'Album', 'Reissue', 'Stereo', '33 ⅓ RPM', '12"'],
      }),
    )
    expect(result).toEqual({
      mediaType: 'vinyl',
      classification: 'LP',
      speed: '33',
      size: '12"',
      channels: 'stereo',
      descriptions: ['reissue'],
    })
  })

  it('maps a 45 RPM single correctly', () => {
    const result = adaptDiscogsFormat(
      makeDetail({
        name: 'Vinyl',
        descriptions: ['Single', '45 RPM', 'Stereo', '7"'],
      }),
    )
    expect(result).toEqual({
      mediaType: 'vinyl',
      classification: 'Single',
      speed: '45',
      size: '7"',
      channels: 'stereo',
      descriptions: undefined,
    })
  })
})

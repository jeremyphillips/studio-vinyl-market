import { describe, expect, it } from 'vitest'

import { resolveButtonBlockPreview } from './buttonBlock'

const base = {
  label: 'Shop now',
  variant: 'default',
  linkType: undefined,
  externalUrl: undefined,
  internalType: undefined,
  internalTitle: undefined,
  internalReleaseTitle: undefined,
  internalPageTitle: undefined,
}

describe('resolveButtonBlockPreview', () => {
  describe('external link', () => {
    it('uses the external URL in the subtitle', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'external',
        externalUrl: 'https://bandcamp.com',
      })
      expect(result).toEqual({
        title: 'Shop now',
        subtitle: 'default · https://bandcamp.com',
      })
    })

    it('falls back to "external link" when URL is missing', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'external',
        externalUrl: undefined,
      })
      expect(result.subtitle).toBe('default · external link')
    })
  })

  describe('internal link — releasesPage', () => {
    it('builds subtitle from internalType and internalPageTitle', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'internal',
        internalType: 'releasesPage',
        internalPageTitle: 'All Releases',
      })
      expect(result.subtitle).toBe('default · releasesPage: All Releases')
    })
  })

  describe('internal link — artist', () => {
    it('uses internalTitle for artist type', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'internal',
        internalType: 'artist',
        internalTitle: 'Boards of Canada',
      })
      expect(result.subtitle).toBe('default · artist: Boards of Canada')
    })
  })

  describe('internal link — release', () => {
    it('prefers internalReleaseTitle over internalTitle', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'internal',
        internalType: 'release',
        internalReleaseTitle: 'Geogaddi',
        internalTitle: 'should not appear',
      })
      expect(result.subtitle).toBe('default · release: Geogaddi')
    })
  })

  describe('unset internal reference', () => {
    it('shows "unset" when all title fields are missing', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'internal',
        internalType: 'artist',
      })
      expect(result.subtitle).toBe('default · artist: unset')
    })

    it('shows "internal: unset" when internalType is also missing', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        linkType: 'internal',
      })
      expect(result.subtitle).toBe('default · internal: unset')
    })
  })

  describe('label fallback', () => {
    it('shows "Untitled button" when label is missing', () => {
      const result = resolveButtonBlockPreview({ ...base, label: undefined })
      expect(result.title).toBe('Untitled button')
    })

    it('trims whitespace from label', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        label: '  Buy now  ',
        linkType: 'external',
        externalUrl: 'https://example.com',
      })
      expect(result.title).toBe('Buy now')
    })
  })

  describe('variant in subtitle', () => {
    it('includes the variant in the subtitle', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        variant: 'outline',
        linkType: 'external',
        externalUrl: 'https://example.com',
      })
      expect(result.subtitle).toMatch(/^outline ·/)
    })

    it('falls back to "default" when variant is missing', () => {
      const result = resolveButtonBlockPreview({
        ...base,
        variant: undefined,
        linkType: 'external',
        externalUrl: 'https://example.com',
      })
      expect(result.subtitle).toMatch(/^default ·/)
    })
  })
})

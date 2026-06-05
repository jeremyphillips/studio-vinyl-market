import { describe, expect, it } from 'vitest'

import { resolveNavItemPreview } from './navItem'

const base = {
  label: 'Releases',
  linkType: undefined,
  externalUrl: undefined,
  internalType: undefined,
  internalTitle: undefined,
  internalReleaseTitle: undefined,
  internalPageTitle: undefined,
  releasesPageTitle: undefined,
}

describe('resolveNavItemPreview', () => {
  describe('external link', () => {
    it('uses the external URL as subtitle', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'external',
        externalUrl: 'https://bandcamp.com',
      })
      expect(result).toEqual({
        title: 'Releases ↗',
        subtitle: 'https://bandcamp.com',
      })
    })

    it('falls back to "external link" subtitle when URL is missing', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'external',
        externalUrl: undefined,
      })
      expect(result).toEqual({
        title: 'Releases ↗',
        subtitle: 'external link',
      })
    })
  })

  describe('internal — releasesPage', () => {
    it('uses releasesPageTitle in subtitle', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: 'releasesPage',
        releasesPageTitle: 'All Releases',
      })
      expect(result).toEqual({
        title: 'Releases',
        subtitle: 'releases page: All Releases',
      })
    })

    it('falls back to "Releases" when releasesPageTitle is missing', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: 'releasesPage',
        releasesPageTitle: undefined,
      })
      expect(result.subtitle).toBe('releases page: Releases')
    })
  })

  describe('internal — artist (uses internalTitle)', () => {
    it('builds subtitle from internalType and internalTitle', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: 'artist',
        internalTitle: 'Boards of Canada',
      })
      expect(result).toEqual({
        title: 'Releases',
        subtitle: 'artist: Boards of Canada',
      })
    })
  })

  describe('internal — release (uses internalReleaseTitle)', () => {
    it('prefers internalReleaseTitle over internalTitle', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: 'release',
        internalReleaseTitle: 'Music Has the Right to Children',
        internalTitle: 'should not appear',
      })
      expect(result.subtitle).toBe('release: Music Has the Right to Children')
    })
  })

  describe('internal — unset reference', () => {
    it('shows "unset" when all title fields are missing', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: 'artist',
        internalTitle: undefined,
      })
      expect(result.subtitle).toBe('artist: unset')
    })

    it('shows "internal: unset" when internalType is also missing', () => {
      const result = resolveNavItemPreview({
        ...base,
        linkType: 'internal',
        internalType: undefined,
      })
      expect(result.subtitle).toBe('internal: unset')
    })
  })

  describe('label fallback', () => {
    it('shows "Untitled nav item" when label is missing', () => {
      const result = resolveNavItemPreview({ ...base, label: undefined })
      expect(result.title).toBe('Untitled nav item')
    })

    it('trims whitespace from the label', () => {
      const result = resolveNavItemPreview({
        ...base,
        label: '  Home  ',
        linkType: 'internal',
        internalType: 'releasesPage',
      })
      expect(result.title).toBe('Home')
    })
  })
})

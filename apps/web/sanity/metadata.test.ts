import { describe, expect, it, vi } from 'vitest'

const mockUrl = 'https://cdn.sanity.io/images/proj/dataset/image-abc-1200x630.jpg'
const mockUrlBuilder = { url: () => mockUrl }
const mockHeightBuilder = { height: () => mockUrlBuilder }
const mockWidthBuilder = { width: () => mockHeightBuilder }

vi.mock('@/sanity/image', () => ({
  urlFor: () => mockWidthBuilder,
}))

import { toNextMetadata } from './metadata'

const fallbacks = { title: 'Fallback Title', description: 'Fallback description' }

describe('toNextMetadata', () => {
  describe('null / undefined seo', () => {
    it('uses fallback title when seo is null', () => {
      const result = toNextMetadata(null, fallbacks)
      expect(result.title).toBe('Fallback Title')
    })

    it('uses fallback title when seo is undefined', () => {
      const result = toNextMetadata(undefined, fallbacks)
      expect(result.title).toBe('Fallback Title')
    })

    it('uses fallback description when seo is null', () => {
      const result = toNextMetadata(null, fallbacks)
      expect(result.description).toBe('Fallback description')
    })

    it('omits description when seo is null and no fallback description provided', () => {
      const result = toNextMetadata(null, { title: 'Title' })
      expect(result.description).toBeUndefined()
    })
  })

  describe('explicit metaTitle and metaDescription', () => {
    it('prefers metaTitle over fallback title', () => {
      const result = toNextMetadata({ metaTitle: 'CMS Title' }, fallbacks)
      expect(result.title).toBe('CMS Title')
    })

    it('trims whitespace from metaTitle', () => {
      const result = toNextMetadata({ metaTitle: '  Trimmed  ' }, fallbacks)
      expect(result.title).toBe('Trimmed')
    })

    it('falls back to fallback title when metaTitle is an empty string', () => {
      const result = toNextMetadata({ metaTitle: '' }, fallbacks)
      expect(result.title).toBe('Fallback Title')
    })

    it('prefers metaDescription over fallback description', () => {
      const result = toNextMetadata({ metaDescription: 'CMS description' }, fallbacks)
      expect(result.description).toBe('CMS description')
    })

    it('trims whitespace from metaDescription', () => {
      const result = toNextMetadata({ metaDescription: '  spaced  ' }, fallbacks)
      expect(result.description).toBe('spaced')
    })
  })

  describe('noIndex', () => {
    it('adds robots noindex when noIndex is true', () => {
      const result = toNextMetadata({ noIndex: true }, fallbacks)
      expect(result.robots).toEqual({ index: false, follow: true })
    })

    it('omits robots when noIndex is false', () => {
      const result = toNextMetadata({ noIndex: false }, fallbacks)
      expect(result.robots).toBeUndefined()
    })

    it('omits robots when noIndex is null', () => {
      const result = toNextMetadata({ noIndex: null }, fallbacks)
      expect(result.robots).toBeUndefined()
    })
  })

  describe('ogImage', () => {
    const assetRef = 'image-abc123-1200x630-jpg'

    it('includes openGraph images when ogImage has an asset ref', () => {
      const result = toNextMetadata(
        { ogImage: { asset: { _ref: assetRef, _type: 'reference' }, alt: 'A record cover' } },
        fallbacks,
      )
      expect(result.openGraph?.images).toEqual([{ url: mockUrl, alt: 'A record cover' }])
    })

    it('omits alt from openGraph image when ogImage.alt is not set', () => {
      const result = toNextMetadata(
        { ogImage: { asset: { _ref: assetRef, _type: 'reference' } } },
        fallbacks,
      )
      expect(result.openGraph?.images).toEqual([{ url: mockUrl }])
    })

    it('omits openGraph when ogImage has no asset ref', () => {
      const result = toNextMetadata({ ogImage: { asset: null } }, fallbacks)
      expect(result.openGraph).toBeUndefined()
    })

    it('omits openGraph when ogImage is undefined', () => {
      const result = toNextMetadata({}, fallbacks)
      expect(result.openGraph).toBeUndefined()
    })
  })
})

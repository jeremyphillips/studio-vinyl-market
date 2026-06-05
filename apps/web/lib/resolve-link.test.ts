import { describe, expect, it } from 'vitest'

import { resolveLink, resolveNavLink } from './resolve-link'

// ---------------------------------------------------------------------------
// resolveLink
// ---------------------------------------------------------------------------

describe('resolveLink', () => {
  describe('external links', () => {
    it('returns href and isExternal=true for a valid external URL', () => {
      expect(resolveLink('external', 'https://example.com', null)).toEqual({
        href: 'https://example.com',
        isExternal: true,
      })
    })

    it('returns null when external URL is missing', () => {
      expect(resolveLink('external', null, null)).toBeNull()
      expect(resolveLink('external', undefined, null)).toBeNull()
      expect(resolveLink('external', '', null)).toBeNull()
    })
  })

  describe('releasesPage (fixed path)', () => {
    it('returns the fixed /releases path', () => {
      expect(resolveLink('internal', null, { _type: 'releasesPage', slug: null })).toEqual({
        href: '/releases',
        isExternal: false,
      })
    })
  })

  describe('slug-based internal types', () => {
    it.each([
      ['release', '/releases/dark-side-of-the-moon'],
      ['artist', '/artists/pink-floyd'],
      ['label', '/labels/harvest'],
      ['page', '/pages/about'],
    ] as const)('%s → base path + slug', (type, expected) => {
      const slug = expected.split('/').at(-1)!
      expect(resolveLink('internal', null, { _type: type, slug })).toEqual({
        href: expected,
        isExternal: false,
      })
    })

    it('returns null when slug is missing', () => {
      expect(resolveLink('internal', null, { _type: 'release', slug: null })).toBeNull()
    })

    it('returns null for an unrecognised internal type', () => {
      expect(resolveLink('internal', null, { _type: 'unknownType', slug: 'foo' })).toBeNull()
    })
  })

  describe('null / missing inputs', () => {
    it('returns null when internalLink is null and linkType is not external', () => {
      expect(resolveLink('internal', null, null)).toBeNull()
    })

    it('returns null when linkType is null', () => {
      expect(resolveLink(null, 'https://example.com', null)).toBeNull()
    })

    it('returns null when linkType is undefined', () => {
      expect(resolveLink(undefined, 'https://example.com', null)).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// resolveNavLink
// ---------------------------------------------------------------------------

describe('resolveNavLink', () => {
  const base = { _key: 'k1', label: 'Home' }

  it('returns null when label is missing', () => {
    expect(
      resolveNavLink({
        ...base,
        label: '',
        linkType: 'external',
        externalUrl: 'https://x.com',
        internal: null,
      }),
    ).toBeNull()
  })

  it('returns null when the link cannot be resolved', () => {
    expect(
      resolveNavLink({ ...base, linkType: 'external', externalUrl: null, internal: null }),
    ).toBeNull()
  })

  it('returns a full NavLink for an external URL', () => {
    expect(
      resolveNavLink({
        ...base,
        linkType: 'external',
        externalUrl: 'https://bandcamp.com',
        internal: null,
      }),
    ).toEqual({ key: 'k1', label: 'Home', href: 'https://bandcamp.com', isExternal: true })
  })

  it('returns a full NavLink for releasesPage', () => {
    expect(
      resolveNavLink({
        ...base,
        linkType: 'internal',
        externalUrl: null,
        internal: { _type: 'releasesPage', slug: null },
      }),
    ).toEqual({ key: 'k1', label: 'Home', href: '/releases', isExternal: false })
  })

  it('returns a full NavLink for a slug-based internal link', () => {
    expect(
      resolveNavLink({
        ...base,
        linkType: 'internal',
        externalUrl: null,
        internal: { _type: 'artist', slug: 'boards-of-canada' },
      }),
    ).toEqual({ key: 'k1', label: 'Home', href: '/artists/boards-of-canada', isExternal: false })
  })
})

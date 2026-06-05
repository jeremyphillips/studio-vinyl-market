import { afterEach, describe, expect, it, vi } from 'vitest'

// vi.hoisted() runs before vi.mock() hoisting, making the ref available inside
// the mock factory without a temporal dead zone error.
const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('./client', () => ({
  client: {
    withConfig: vi.fn().mockReturnValue({ fetch: mockFetch }),
  },
}))

import { client } from './client'
import { fetchStaticSlugs } from './static-params'

describe('fetchStaticSlugs', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('maps raw slug strings to { slug } objects', async () => {
    mockFetch.mockResolvedValue(['london', 'paris', 'tokyo'])
    const result = await fetchStaticSlugs('*[_type == "city"].slug.current')
    expect(result).toEqual([{ slug: 'london' }, { slug: 'paris' }, { slug: 'tokyo' }])
  })

  it('passes the correct static-generation config to withConfig', async () => {
    mockFetch.mockResolvedValue([])
    await fetchStaticSlugs('some-query')
    expect(client.withConfig).toHaveBeenCalledWith({
      useCdn: false,
      perspective: 'published',
      stega: false,
    })
  })

  it('returns an empty array when no slugs exist', async () => {
    mockFetch.mockResolvedValue([])
    const result = await fetchStaticSlugs('*[_type == "missing"].slug.current')
    expect(result).toEqual([])
  })
})

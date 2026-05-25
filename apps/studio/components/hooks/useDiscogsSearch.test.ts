import {act, renderHook, waitFor} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {useDiscogsSearch} from './useDiscogsSearch'

vi.mock('../types/discogs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../types/discogs')>()
  return {
    ...actual,
    buildDiscogsSearchUrl: (query: string) => `http://test.local/search?q=${encodeURIComponent(query)}`,
  }
})

const mappedResponse = {
  results: [
    {
      id: 12345,
      masterId: 67890,
      title: 'Radiohead - OK Computer',
      year: '1997',
      country: 'UK',
      format: ['Vinyl'],
      label: ['Parlophone'],
      catno: 'PARLP 1',
      thumb: null,
      coverImage: null,
      resourceUrl: 'https://api.discogs.com/releases/12345',
    },
  ],
  pagination: {page: 1, pages: 1, items: 1, perPage: 20},
}

describe('useDiscogsSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not fetch for blank queries', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const {result} = renderHook(() => useDiscogsSearch())

    await act(async () => {
      await result.current.search('   ')
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.results).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('stores results on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mappedResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
      ),
    )

    const {result} = renderHook(() => useDiscogsSearch())

    await act(async () => {
      await result.current.search('radiohead')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.results).toEqual(mappedResponse.results)
    expect(result.current.error).toBeNull()
  })

  it('stores API error messages from JSON responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({error: 'DISCOGS_API_TOKEN is not configured'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        }),
      ),
    )

    const {result} = renderHook(() => useDiscogsSearch())

    await act(async () => {
      await result.current.search('radiohead')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('DISCOGS_API_TOKEN is not configured')
    expect(result.current.results).toBeNull()
  })

  it('reset clears results and errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mappedResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }),
      ),
    )

    const {result} = renderHook(() => useDiscogsSearch())

    await act(async () => {
      await result.current.search('radiohead')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.results).toBeNull()
    expect(result.current.error).toBeNull()
  })
})

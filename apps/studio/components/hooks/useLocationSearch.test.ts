import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLocationSearch } from './useLocationSearch'

const results = [
  {
    place_id: 1,
    lat: '51.5074',
    lon: '-0.1278',
    display_name: 'London, England, United Kingdom',
    address: { city: 'London', state: 'England', country: 'United Kingdom' },
  },
]

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('useLocationSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stores results on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(results)))

    const { result } = renderHook(() => useLocationSearch())

    await act(async () => {
      await result.current.search('London')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.results).toEqual(results)
    expect(result.current.error).toBeNull()
  })

  it('ignores blank queries', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useLocationSearch())

    await act(async () => {
      await result.current.search('   ')
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.results).toBeNull()
  })

  it('stores an error message when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([], 500)))

    const { result } = renderHook(() => useLocationSearch())

    await act(async () => {
      await result.current.search('London')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Request failed with status 500')
    expect(result.current.results).toBeNull()
  })

  it('reset clears results and errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(results)))

    const { result } = renderHook(() => useLocationSearch())

    await act(async () => {
      await result.current.search('London')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.results).toBeNull()
    expect(result.current.error).toBeNull()
  })
})

import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDiscogsRelease } from './useDiscogsRelease'

vi.mock('../types/discogs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../types/discogs')>()
  return {
    ...actual,
    buildDiscogsReleaseUrl: (id: number) => `http://test.local/releases/${id}`,
  }
})

const detail = {
  id: 123,
  tracklist: [
    { position: 'A1', title: 'One' },
    { position: 'B2', title: 'Two' },
  ],
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('useDiscogsRelease', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stores release detail on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(detail)))

    const { result } = renderHook(() => useDiscogsRelease())

    await act(async () => {
      await result.current.fetch(123)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(detail)
    expect(result.current.error).toBeNull()
  })

  it('stores API error messages from JSON responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'Discogs API error 404: Not Found' }, 404)),
    )

    const { result } = renderHook(() => useDiscogsRelease())

    await act(async () => {
      await result.current.fetch(999)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Discogs API error 404: Not Found')
    expect(result.current.data).toBeNull()
  })

  it('reset clears data and errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(detail)))

    const { result } = renderHook(() => useDiscogsRelease())

    await act(async () => {
      await result.current.fetch(123)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })
})

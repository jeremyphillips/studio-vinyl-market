import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncAction } from './useAsyncAction'

describe('useAsyncAction', () => {
  it('sets loading to true immediately and false after resolution', async () => {
    // Use a manually-controlled promise so we can assert the in-flight state.
    let resolve!: (v: string) => void
    const fetcher = vi.fn(() => new Promise<string>((r) => (resolve = r)))
    const { result } = renderHook(() => useAsyncAction(fetcher))

    act(() => {
      result.current.execute('arg')
    })
    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolve('done')
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it('stores data and clears error on success', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 })
    const { result } = renderHook(() => useAsyncAction(fetcher))

    await act(async () => {
      await result.current.execute('arg')
    })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ id: 1 })
    expect(result.current.error).toBeNull()
  })

  it('stores the error message and clears data when fetcher throws an Error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('something went wrong'))
    const { result } = renderHook(() => useAsyncAction(fetcher))

    await act(async () => {
      await result.current.execute('arg')
    })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('something went wrong')
    expect(result.current.data).toBeNull()
  })

  it('falls back to "Unknown error" for non-Error throws', async () => {
    const fetcher = vi.fn().mockRejectedValue('raw string rejection')
    const { result } = renderHook(() => useAsyncAction(fetcher))

    await act(async () => {
      await result.current.execute('arg')
    })

    expect(result.current.error).toBe('Unknown error')
  })

  it('reset clears data and error without re-fetching', async () => {
    const fetcher = vi.fn().mockResolvedValue('value')
    const { result } = renderHook(() => useAsyncAction(fetcher))

    await act(async () => {
      await result.current.execute('arg')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    // Ensure reset did not trigger another fetch.
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})

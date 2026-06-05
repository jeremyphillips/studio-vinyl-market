import { useCallback, useRef, useState } from 'react'

/**
 * Generic loading/error/data state machine for a single async operation.
 *
 * The `fetcher` is held in a ref so `execute` has a stable identity (empty dep
 * array) regardless of whether the caller recreates the fetcher on each render.
 * This lets wrapper hooks expose stable action callbacks without requiring
 * callers to memoize the fetcher themselves.
 */
export function useAsyncAction<TArg, TData>(fetcher: (arg: TArg) => Promise<TData>) {
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (arg: TArg) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await fetcherRef.current(arg)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}

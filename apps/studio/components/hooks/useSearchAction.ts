import { useCallback } from 'react'
import { useAsyncAction } from './useAsyncAction'

/**
 * Wraps {@link useAsyncAction} for query-driven searches: exposes a `search`
 * callback with a built-in blank-query guard so callers never need to check the
 * input themselves before searching. Shared by the Discogs and Location inputs.
 */
export function useSearchAction<TData>(fetcher: (query: string) => Promise<TData[]>) {
  const { data: results, loading, error, execute, reset } = useAsyncAction(fetcher)

  const search = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      await execute(trimmed)
    },
    [execute],
  )

  return { results, loading, error, search, reset }
}

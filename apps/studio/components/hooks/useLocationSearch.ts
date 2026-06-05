import { useCallback } from 'react'
import { buildNominatimSearchUrl, type NominatimResult } from '../types/location'
import { useAsyncAction } from './useAsyncAction'

/**
 * Module-level fetcher — stable reference, so useAsyncAction's execute callback
 * never changes identity between renders.
 */
async function fetchNominatimResults(query: string): Promise<NominatimResult[]> {
  const res = await fetch(buildNominatimSearchUrl(query))
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json() as Promise<NominatimResult[]>
}

export function useLocationSearch() {
  const { data: results, loading, error, execute, reset } = useAsyncAction(fetchNominatimResults)

  /**
   * Wraps execute with a blank-query guard so callers never need to check
   * themselves whether the input is empty before calling search.
   */
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

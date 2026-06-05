import { useCallback } from 'react'
import {
  buildDiscogsSearchUrl,
  type DiscogsResult,
  type DiscogsSearchResponse,
} from '../types/discogs'
import { useAsyncAction } from './useAsyncAction'

/**
 * Module-level fetcher — stable reference, so useAsyncAction's execute callback
 * never changes identity between renders.
 */
async function fetchDiscogsResults(query: string): Promise<DiscogsResult[]> {
  const res = await fetch(buildDiscogsSearchUrl(query))
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }
  const data: DiscogsSearchResponse = await res.json()
  return data.results
}

export function useDiscogsSearch() {
  const { data: results, loading, error, execute, reset } = useAsyncAction(fetchDiscogsResults)

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

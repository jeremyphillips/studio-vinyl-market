import {
  buildDiscogsSearchUrl,
  type DiscogsResult,
  type DiscogsSearchResponse,
} from '../types/discogs'
import { useSearchAction } from './useSearchAction'

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
  return useSearchAction(fetchDiscogsResults)
}

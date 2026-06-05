import { buildNominatimSearchUrl, type NominatimResult } from '../types/location'
import { useSearchAction } from './useSearchAction'

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
  return useSearchAction(fetchNominatimResults)
}

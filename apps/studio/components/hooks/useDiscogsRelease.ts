import { buildDiscogsReleaseUrl, type DiscogsReleaseDetail } from '../types/discogs'
import { useAsyncAction } from './useAsyncAction'

/**
 * Module-level fetcher — stable reference, so useAsyncAction's execute callback
 * never changes identity between renders.
 */
async function fetchDiscogsRelease(id: number): Promise<DiscogsReleaseDetail> {
  const res = await fetch(buildDiscogsReleaseUrl(id))
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }
  return res.json() as Promise<DiscogsReleaseDetail>
}

export function useDiscogsRelease() {
  const { data, loading, error, execute, reset } = useAsyncAction(fetchDiscogsRelease)

  return { data, loading, error, fetch: execute, reset }
}

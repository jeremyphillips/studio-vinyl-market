import { useCallback, useState } from 'react'
import {
  buildDiscogsSearchUrl,
  type DiscogsApiResponse,
  type DiscogsResult,
} from '../types/discogs'

export function useDiscogsSearch() {
  const [results, setResults] = useState<DiscogsResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch(buildDiscogsSearchUrl(trimmed))
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed with status ${res.status}`)
      }
      const data: DiscogsApiResponse = await res.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return { results, loading, error, search, reset }
}

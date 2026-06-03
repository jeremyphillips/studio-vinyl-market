import { useCallback, useState } from 'react'
import { buildNominatimSearchUrl, type NominatimResult } from '../types/location'

export function useLocationSearch() {
  const [results, setResults] = useState<NominatimResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch(buildNominatimSearchUrl(trimmed))
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      const data: NominatimResult[] = await res.json()
      setResults(data)
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

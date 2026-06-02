import { useCallback, useState } from 'react'
import { buildDiscogsReleaseUrl, type DiscogsReleaseDetail } from '../types/discogs'

export function useDiscogsRelease() {
  const [data, setData] = useState<DiscogsReleaseDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRelease = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(buildDiscogsReleaseUrl(id))
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed with status ${res.status}`)
      }
      const detail: DiscogsReleaseDetail = await res.json()
      setData(detail)
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

  return { data, loading, error, fetch: fetchRelease, reset }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { set, unset, useFormValue, type ObjectInputProps } from 'sanity'
import { useDiscogsSearch } from '../hooks/useDiscogsSearch'
import { useReferencedDocumentField } from '../hooks/useReferencedDocumentField'
import type { DiscogsResult, DiscogsValue } from '../types/discogs'
import { buildInitialQuery } from './query'

export interface UseDiscogsReleaseLinkArgs {
  value: DiscogsValue | undefined
  onChange: ObjectInputProps<DiscogsValue>['onChange']
}

/**
 * Owns every stateful concern of the Discogs release link: the seeded search
 * query, the linked/searching view toggle, selection, and the search wiring.
 * The component consuming this is left as a thin presentational shell.
 */
export function useDiscogsReleaseLink({ value, onChange }: UseDiscogsReleaseLinkArgs) {
  const releaseName = useFormValue(['releaseName']) as string | undefined
  const artistRef = useFormValue(['artist']) as { _ref?: string } | undefined
  const artistName = useReferencedDocumentField(artistRef?._ref, 'name')

  const queryInitialized = useRef(false)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(value?.releaseId ?? null)
  const [showSearch, setShowSearch] = useState(!value?.releaseId)

  const { results, loading, error, search, reset } = useDiscogsSearch()

  const hasValue = Boolean(value?.releaseId)

  useEffect(() => {
    if (queryInitialized.current) return
    // Hold off until a referenced artist's name resolves, otherwise the query
    // locks to the release name alone before the async lookup completes.
    if (artistRef?._ref && !artistName) return
    const initial = buildInitialQuery(artistName, releaseName)
    if (!initial) return
    setQuery(initial)
    queryInitialized.current = true
  }, [artistName, artistRef, releaseName])

  const onSearch = useCallback(() => {
    search(query)
  }, [query, search])

  const onSelect = useCallback(
    (result: DiscogsResult) => {
      setSelectedId(result.id)
      onChange(
        set({
          _type: 'discogs',
          releaseId: result.id,
          masterId: result.masterId ?? undefined,
        }),
      )
      setShowSearch(false)
      reset()
    },
    [onChange, reset],
  )

  const onClear = useCallback(() => {
    setSelectedId(null)
    reset()
    setShowSearch(true)
    queryInitialized.current = false
    setQuery(buildInitialQuery(artistName, releaseName))
    onChange(unset())
  }, [artistName, onChange, releaseName, reset])

  const onSearchAgain = useCallback(() => {
    setShowSearch(true)
  }, [])

  const onCancelSearch = useCallback(() => {
    setShowSearch(false)
  }, [])

  return {
    query,
    setQuery,
    showSearch,
    selectedId,
    hasValue,
    results,
    loading,
    error,
    onSearch,
    onSelect,
    onClear,
    onSearchAgain,
    onCancelSearch,
  }
}

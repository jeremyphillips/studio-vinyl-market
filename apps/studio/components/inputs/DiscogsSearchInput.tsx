import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Flex, Stack } from '@sanity/ui'
import { set, unset, useFormValue, type ObjectInputProps } from 'sanity'
import { useDiscogsSearch } from '../hooks/useDiscogsSearch'
import { useReferencedDocumentField } from '../hooks/useReferencedDocumentField'
import { buildDiscogsResultDetail, type DiscogsResult, type DiscogsValue } from '../types/discogs'
import { EmptyState, ErrorBanner, LinkedIdCard, SearchToolbar, SelectableResultList } from '../ui'

export function DiscogsSearchInput(props: ObjectInputProps<DiscogsValue>) {
  const { onChange, value } = props
  const storedValue = value

  const releaseName = useFormValue(['releaseName']) as string | undefined
  const artistRef = useFormValue(['artist']) as { _ref?: string } | undefined
  const artistName = useReferencedDocumentField(artistRef?._ref, 'name')

  const queryInitialized = useRef(false)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(storedValue?.releaseId ?? null)
  const [showSearch, setShowSearch] = useState(!storedValue?.releaseId)

  const { results, loading, error, search, reset } = useDiscogsSearch()

  const hasValue = Boolean(storedValue?.releaseId)

  useEffect(() => {
    if (queryInitialized.current) return
    const parts = [artistName, releaseName].filter(Boolean)
    if (parts.length === 0) return
    setQuery(parts.join(' '))
    queryInitialized.current = true
  }, [artistName, releaseName])

  const handleSearch = useCallback(() => {
    search(query)
  }, [query, search])

  const handleSelect = useCallback(
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

  const handleClear = useCallback(() => {
    setSelectedId(null)
    reset()
    setShowSearch(true)
    queryInitialized.current = false
    setQuery([artistName, releaseName].filter(Boolean).join(' '))
    onChange(unset())
  }, [artistName, onChange, releaseName, reset])

  const handleSearchAgain = useCallback(() => {
    setShowSearch(true)
  }, [])

  const linkedItems = [
    {
      label: 'Release',
      id: storedValue!.releaseId!,
      href: `https://www.discogs.com/release/${storedValue!.releaseId}`,
    },
    ...(storedValue?.masterId != null
      ? [
          {
            label: 'Master',
            id: storedValue.masterId,
            href: `https://www.discogs.com/master/${storedValue.masterId}`,
          },
        ]
      : []),
  ]

  return (
    <Stack gap={3}>
      {hasValue && !showSearch && (
        <>
          <LinkedIdCard title="Linked Discogs release" items={linkedItems} />
          <Flex gap={2}>
            <Button mode="ghost" text="Search again" onClick={handleSearchAgain} />
            <Button mode="ghost" tone="critical" text="Clear" onClick={handleClear} />
          </Flex>
        </>
      )}

      {showSearch && (
        <>
          <SearchToolbar
            query={query}
            loading={loading}
            searchLabel="Search Discogs"
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onCancel={hasValue ? () => setShowSearch(false) : undefined}
          />

          {error && <ErrorBanner message={error} />}

          {results !== null && results.length === 0 && (
            <EmptyState message="No results found. Try a different search." />
          )}

          {results !== null && results.length > 0 && (
            <SelectableResultList
              items={results}
              selectedKey={selectedId}
              getKey={(result) => result.id}
              renderItem={(result) => ({
                title: result.title,
                detail: buildDiscogsResultDetail(result),
                thumb: result.thumb,
              })}
              onSelect={handleSelect}
            />
          )}

          {results === null && !loading && !error && !hasValue && (
            <EmptyState message="Search to link a Discogs release." />
          )}
        </>
      )}
    </Stack>
  )
}

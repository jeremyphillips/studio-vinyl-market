import React, {useCallback, useEffect, useId, useRef, useState} from 'react'
import {set, unset, useClient} from 'sanity'
import type {ObjectInputProps} from 'sanity'
import {useFormValue} from 'sanity'
import styled from 'styled-components'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiscogsResult {
  id: number
  masterId: number | null
  title: string
  year: string | null
  country: string | null
  format: string[]
  label: string[]
  catno: string | null
  thumb: string | null
  coverImage: string | null
  resourceUrl: string
}

interface DiscogsApiResponse {
  results: DiscogsResult[]
  pagination: {
    page: number
    pages: number
    items: number
    perPage: number
  }
}

interface DiscogsValue {
  _type?: string
  releaseId?: number
  masterId?: number | null
}

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--card-border-color, #ddd);
  border-radius: 3px;
  background: var(--card-bg-color, #fff);
  color: var(--card-fg-color, #111);
  font-size: 14px;
  line-height: 1.4;
  &:focus {
    outline: none;
    border-color: var(--card-focus-ring-color, #0066cc);
    box-shadow: 0 0 0 2px var(--card-focus-ring-color, rgba(0, 102, 204, 0.2));
  }
`

const Button = styled.button<{$variant?: 'primary' | 'ghost' | 'danger'}>`
  padding: 8px 14px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: opacity 0.15s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${({$variant}) => {
    if ($variant === 'ghost') {
      return `
        background: transparent;
        border-color: var(--card-border-color, #ddd);
        color: var(--card-fg-color, #111);
      `
    }
    if ($variant === 'danger') {
      return `
        background: transparent;
        border-color: var(--card-border-color, #ddd);
        color: var(--card-muted-fg-color, #888);
      `
    }
    return `
      background: var(--card-focus-ring-color, #0066cc);
      color: #fff;
    `
  }}
`

const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 360px;
  overflow-y: auto;
  border: 1px solid var(--card-border-color, #ddd);
  border-radius: 3px;
`

const ResultItem = styled.li<{$selected: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  cursor: pointer;
  background: ${({$selected}) =>
    $selected ? 'var(--card-focus-ring-color, rgba(0,102,204,0.1))' : 'transparent'};
  border-left: 3px solid
    ${({$selected}) => ($selected ? 'var(--card-focus-ring-color, #0066cc)' : 'transparent')};
  &:hover {
    background: var(--card-hover-bg, rgba(0, 0, 0, 0.04));
  }
`

const Thumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  background: var(--card-border-color, #eee);
`

const ThumbPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 2px;
  background: var(--card-border-color, #eee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--card-muted-fg-color, #aaa);
`

const ResultMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const ResultTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--card-fg-color, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ResultDetail = styled.div`
  font-size: 12px;
  color: var(--card-muted-fg-color, #888);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SavedCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--card-border-color, #ddd);
  border-radius: 3px;
`

const SavedMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const SavedLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--card-muted-fg-color, #888);
  margin-bottom: 4px;
`

const SavedIds = styled.div`
  font-size: 13px;
  color: var(--card-fg-color, #111);
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const IdChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`

const IdChipLabel = styled.span`
  color: var(--card-muted-fg-color, #888);
`

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
`

const ErrorMsg = styled.div`
  font-size: 13px;
  color: var(--card-critical-fg-color, #c53030);
  padding: 8px 10px;
  border: 1px solid var(--card-critical-border-color, #fc8181);
  border-radius: 3px;
  background: var(--card-critical-bg-color, #fff5f5);
`

const EmptyMsg = styled.div`
  font-size: 13px;
  color: var(--card-muted-fg-color, #888);
  text-align: center;
  padding: 24px 0;
`

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PREVIEW_URL =
  typeof process !== 'undefined' ? (process.env.SANITY_STUDIO_PREVIEW_URL ?? '') : ''

function buildSearchUrl(query: string, page = 1): string {
  const base = PREVIEW_URL.replace(/\/$/, '')
  const params = new URLSearchParams({q: query, page: String(page), per_page: '20'})
  return `${base}/api/discogs/search?${params.toString()}`
}

function buildDetail(result: DiscogsResult): string {
  const parts: string[] = []
  if (result.year) parts.push(result.year)
  if (result.country) parts.push(result.country)
  if (result.format.length > 0) parts.push(result.format.join(', '))
  if (result.label.length > 0) parts.push(result.label[0])
  if (result.catno) parts.push(result.catno)
  return parts.join(' · ')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DiscogsSearchInput(props: ObjectInputProps) {
  const {onChange, value} = props
  const storedValue = value as DiscogsValue | undefined

  const client = useClient({apiVersion: '2026-01-01'})
  const releaseName = useFormValue(['releaseName']) as string | undefined
  const artistRef = useFormValue(['artist']) as {_ref?: string} | undefined

  const [artistName, setArtistName] = useState<string | undefined>()
  const queryInitialized = useRef(false)

  // Resolve the artist reference to its name string.
  useEffect(() => {
    if (!artistRef?._ref) return
    client
      .fetch<string | null>(`*[_id == $id][0].name`, {id: artistRef._ref})
      .then((name) => {
        if (name) setArtistName(name)
      })
      .catch(() => {})
  }, [client, artistRef?._ref])

  // Once we have both pieces (artist name + release name), seed the query box
  // a single time. Skip if the user has already typed something.
  useEffect(() => {
    if (queryInitialized.current) return
    const parts = [artistName, releaseName].filter(Boolean)
    if (parts.length === 0) return
    setQuery(parts.join(' '))
    queryInitialized.current = true
  }, [artistName, releaseName])

  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<DiscogsResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(storedValue?.releaseId ?? null)
  const [showSearch, setShowSearch] = useState(!storedValue?.releaseId)
  const searchInputId = useId()

  const hasValue = Boolean(storedValue?.releaseId)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await fetch(buildSearchUrl(query.trim()))
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
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSearch()
      }
    },
    [handleSearch],
  )

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
      setResults(null)
    },
    [onChange],
  )

  const handleClear = useCallback(() => {
    setSelectedId(null)
    setResults(null)
    setShowSearch(true)
    queryInitialized.current = false
    setQuery([artistName, releaseName].filter(Boolean).join(' '))
    onChange(unset())
  }, [onChange, artistName, releaseName])

  const handleSearchAgain = useCallback(() => {
    setShowSearch(true)
  }, [])

  return (
    <Root>
      {/* ── Saved value card ──────────────────────────────────────── */}
      {hasValue && !showSearch && (
        <>
          <SavedCard>
            <SavedMeta>
              <SavedLabel>Linked Discogs release</SavedLabel>
              <SavedIds>
                <IdChip>
                  <IdChipLabel>Release</IdChipLabel>
                  <a
                    href={`https://www.discogs.com/release/${storedValue!.releaseId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {storedValue!.releaseId}
                  </a>
                </IdChip>
                {storedValue!.masterId != null && (
                  <IdChip>
                    <IdChipLabel>Master</IdChipLabel>
                    <a
                      href={`https://www.discogs.com/master/${storedValue!.masterId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {storedValue!.masterId}
                    </a>
                  </IdChip>
                )}
              </SavedIds>
            </SavedMeta>
          </SavedCard>
          <ActionRow>
            <Button $variant="ghost" onClick={handleSearchAgain}>
              Search again
            </Button>
            <Button $variant="danger" onClick={handleClear}>
              Clear
            </Button>
          </ActionRow>
        </>
      )}

      {/* ── Search UI ─────────────────────────────────────────────── */}
      {showSearch && (
        <>
          <SearchRow>
            <label htmlFor={searchInputId} style={{display: 'none'}}>
              Search Discogs
            </label>
            <SearchInput
              id={searchInputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Artist – Title, barcode, cat. no…"
              disabled={loading}
            />
            <Button onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? 'Searching…' : 'Search Discogs'}
            </Button>
            {hasValue && (
              <Button $variant="ghost" onClick={() => setShowSearch(false)}>
                Cancel
              </Button>
            )}
          </SearchRow>

          {/* ── Error ──────────────────────────────────────────────── */}
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {/* ── Results ────────────────────────────────────────────── */}
          {results !== null && results.length === 0 && (
            <EmptyMsg>No results found. Try a different search.</EmptyMsg>
          )}

          {results !== null && results.length > 0 && (
            <ResultList>
              {results.map((result) => (
                <ResultItem
                  key={result.id}
                  $selected={selectedId === result.id}
                  onClick={() => handleSelect(result)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelect(result)
                    }
                  }}
                >
                  {result.thumb ? (
                    <Thumb src={result.thumb} alt="" loading="lazy" />
                  ) : (
                    <ThumbPlaceholder>♪</ThumbPlaceholder>
                  )}
                  <ResultMeta>
                    <ResultTitle>{result.title}</ResultTitle>
                    <ResultDetail>{buildDetail(result)}</ResultDetail>
                  </ResultMeta>
                </ResultItem>
              ))}
            </ResultList>
          )}

          {/* ── Empty state (no search yet) ────────────────────────── */}
          {results === null && !loading && !error && !hasValue && (
            <EmptyMsg>Search to link a Discogs release.</EmptyMsg>
          )}
        </>
      )}
    </Root>
  )
}

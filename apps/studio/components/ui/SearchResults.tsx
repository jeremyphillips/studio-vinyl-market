import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { SelectableResultList, type SelectableResultListItem } from './SelectableResultList'

export interface SearchResultsProps<T> {
  /** `null` before the first search, `[]` for a completed search with no hits. */
  results: T[] | null
  loading: boolean
  error: string | null
  getKey: (item: T) => string | number
  renderItem: (item: T) => SelectableResultListItem
  onSelect: (item: T) => void
  selectedKey?: string | number | null
  /** Shown when a search completes with zero results. */
  emptyMessage: string
  /** Shown before the first search while idle, when `showInitial` is true. */
  initialMessage?: string
  /** Gate for the idle/initial prompt — callers that always have results hide it. */
  showInitial?: boolean
}

/**
 * Shared result-state renderer for search inputs: error banner, no-results
 * empty state, the selectable list, and an optional idle prompt. Replaces the
 * block previously duplicated between the Discogs and Location search inputs.
 */
export function SearchResults<T>({
  results,
  loading,
  error,
  getKey,
  renderItem,
  onSelect,
  selectedKey,
  emptyMessage,
  initialMessage,
  showInitial = false,
}: SearchResultsProps<T>) {
  return (
    <>
      {error && <ErrorBanner message={error} />}

      {results !== null && results.length === 0 && <EmptyState message={emptyMessage} />}

      {results !== null && results.length > 0 && (
        <SelectableResultList
          items={results}
          selectedKey={selectedKey}
          getKey={getKey}
          renderItem={renderItem}
          onSelect={onSelect}
        />
      )}

      {results === null && !loading && !error && showInitial && initialMessage && (
        <EmptyState message={initialMessage} />
      )}
    </>
  )
}

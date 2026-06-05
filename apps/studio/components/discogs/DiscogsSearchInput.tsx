import { Stack } from '@sanity/ui'
import { type ObjectInputProps } from 'sanity'
import { buildDiscogsResultDetail, type DiscogsValue } from '../types/discogs'
import { SearchResults, SearchToolbar } from '../ui'
import { LinkedReleaseView } from './LinkedReleaseView'
import { buildLinkedDiscogsItems } from './query'
import { useDiscogsReleaseLink } from './useDiscogsReleaseLink'

export function DiscogsSearchInput(props: ObjectInputProps<DiscogsValue>) {
  const { onChange, value } = props
  const vm = useDiscogsReleaseLink({ value, onChange })

  return (
    <Stack gap={3}>
      {vm.hasValue && !vm.showSearch && (
        <LinkedReleaseView
          items={buildLinkedDiscogsItems(value)}
          releaseId={value!.releaseId!}
          onSearchAgain={vm.onSearchAgain}
          onClear={vm.onClear}
        />
      )}

      {vm.showSearch && (
        <>
          <SearchToolbar
            query={vm.query}
            loading={vm.loading}
            searchLabel="Search Discogs"
            onQueryChange={vm.setQuery}
            onSearch={vm.onSearch}
            onCancel={vm.hasValue ? vm.onCancelSearch : undefined}
          />

          <SearchResults
            results={vm.results}
            loading={vm.loading}
            error={vm.error}
            selectedKey={vm.selectedId}
            getKey={(result) => result.id}
            renderItem={(result) => ({
              title: result.title,
              detail: buildDiscogsResultDetail(result),
              thumb: result.thumb,
            })}
            onSelect={vm.onSelect}
            emptyMessage="No results found. Try a different search."
            initialMessage="Search to link a Discogs release."
            showInitial={!vm.hasValue}
          />
        </>
      )}
    </Stack>
  )
}

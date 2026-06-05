import { Card, Stack, Text } from '@sanity/ui'
import { useCallback, useState } from 'react'
import { set, type FormPatch, type ObjectInputProps } from 'sanity'
import { adaptNominatimResult } from '../../lib/nominatim-adapter'
import { useLocationSearch } from '../hooks/useLocationSearch'
import type { NominatimResult } from '../types/location'
import { SearchResults, SearchToolbar } from '../ui'

export function LocationSearchInput(props: ObjectInputProps) {
  const { onChange } = props

  const [query, setQuery] = useState('')
  const { results, loading, error, search, reset } = useLocationSearch()

  const handleSearch = useCallback(() => {
    search(query)
  }, [query, search])

  const handleSelect = useCallback(
    (result: NominatimResult) => {
      const { city, state, country, coordinates } = adaptNominatimResult(result)

      const patches: FormPatch[] = []
      if (city !== undefined) patches.push(set(city, ['city']))
      if (state !== undefined) patches.push(set(state, ['state']))
      if (country !== undefined) patches.push(set(country, ['country']))
      if (coordinates) {
        patches.push(
          set({ _type: 'geopoint', lat: coordinates.lat, lng: coordinates.lng }, ['coordinates']),
        )
      }

      if (patches.length > 0) onChange(patches)
      reset()
      setQuery('')
    },
    [onChange, reset],
  )

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Search for a place
          </Text>

          <SearchToolbar
            query={query}
            loading={loading}
            placeholder="City, region, country…"
            searchLabel="Search"
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />

          <SearchResults
            results={results}
            loading={loading}
            error={error}
            getKey={(result) => result.place_id}
            renderItem={(result) => ({
              title: result.name || result.display_name.split(',')[0],
              detail: result.display_name,
            })}
            onSelect={handleSelect}
            emptyMessage="No places found. Try a different search or fill in the fields manually below."
          />
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}

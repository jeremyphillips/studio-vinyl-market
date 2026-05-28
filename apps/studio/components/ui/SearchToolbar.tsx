import {SearchIcon} from '@sanity/icons'
import {Box, Button, Flex, TextInput} from '@sanity/ui'

export interface SearchToolbarProps {
  query: string
  loading: boolean
  placeholder?: string
  searchLabel?: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onCancel?: () => void
}

export function SearchToolbar({
  query,
  loading,
  placeholder = 'Artist – Title, barcode, cat. no…',
  searchLabel = 'Search',
  onQueryChange,
  onSearch,
  onCancel,
}: SearchToolbarProps) {
  return (
    <Flex gap={2} align="center">
      <Box flex={1}>
        <TextInput
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onSearch()
            }
          }}
          placeholder={placeholder}
          disabled={loading}
          icon={SearchIcon}
          aria-label="Search"
        />
      </Box>
      <Button
        text={loading ? 'Searching…' : searchLabel}
        onClick={onSearch}
        disabled={loading || !query.trim()}
      />
      {onCancel && <Button mode="ghost" text="Cancel" onClick={onCancel} />}
    </Flex>
  )
}

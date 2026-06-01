import { ImageIcon } from '@sanity/icons'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import type { KeyboardEvent } from 'react'

export interface SelectableResultListItem {
  title: string
  detail?: string
  thumb?: string | null
}

export interface SelectableResultListProps<T> {
  items: T[]
  selectedKey?: string | number | null
  getKey: (item: T) => string | number
  renderItem: (item: T) => SelectableResultListItem
  onSelect: (item: T) => void
}

function handleItemKeyDown(event: KeyboardEvent, onSelect: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelect()
  }
}

export function SelectableResultList<T>({
  items,
  selectedKey,
  getKey,
  renderItem,
  onSelect,
}: SelectableResultListProps<T>) {
  return (
    <Card border overflow="auto" style={{ maxHeight: 360 }}>
      <Stack space={1} padding={1}>
        {items.map((item) => {
          const key = getKey(item)
          const { title, detail, thumb } = renderItem(item)
          const selected = selectedKey === key

          return (
            <Card
              key={key}
              padding={2}
              radius={2}
              tone={selected ? 'primary' : 'default'}
              selected={selected}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => handleItemKeyDown(event, () => onSelect(item))}
              role="button"
              tabIndex={0}
            >
              <Flex align="center" gap={3}>
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  >
                    <Text muted size={2}>
                      <ImageIcon />
                    </Text>
                  </Flex>
                )}
                <Box flex={1} style={{ minWidth: 0 }}>
                  <Text
                    size={1}
                    weight="medium"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {title}
                  </Text>
                  {detail && (
                    <Text
                      size={1}
                      muted
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {detail}
                    </Text>
                  )}
                </Box>
              </Flex>
            </Card>
          )
        })}
      </Stack>
    </Card>
  )
}

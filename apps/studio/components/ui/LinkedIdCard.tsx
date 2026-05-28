import {Card, Flex, Text} from '@sanity/ui'

export interface LinkedIdItem {
  label: string
  id: number
  href: string
}

export interface LinkedIdCardProps {
  title: string
  items: LinkedIdItem[]
}

export function LinkedIdCard({title, items}: LinkedIdCardProps) {
  return (
    <Card padding={3} border>
      <Text size={1} weight="semibold" muted>
        {title}
      </Text>
      <Flex gap={4} wrap="wrap" marginTop={2}>
        {items.map((item) => (
          <Flex key={item.label} gap={1} align="center">
            <Text size={1} muted>
              {item.label}
            </Text>
            <Text size={1}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.id}
              </a>
            </Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  )
}

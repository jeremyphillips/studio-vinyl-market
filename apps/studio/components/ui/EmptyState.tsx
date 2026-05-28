import {Text} from '@sanity/ui'

export interface EmptyStateProps {
  message: string
}

export function EmptyState({message}: EmptyStateProps) {
  return (
    <Text size={1} muted align="center">
      {message}
    </Text>
  )
}

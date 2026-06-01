import { Card, Text } from '@sanity/ui'

export interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <Card tone="critical" padding={3} border>
      <Text size={1}>{message}</Text>
    </Card>
  )
}

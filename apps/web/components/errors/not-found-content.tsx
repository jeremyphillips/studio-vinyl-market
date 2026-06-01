import Link from 'next/link'

import {Button} from '@/components/ui/button'

type NotFoundContentProps = {
  title?: string
  description?: string
  browseHref?: '/' | '/releases'
  browseLabel?: string
}

export function NotFoundContent({
  title = 'Page not found',
  description = 'That record, artist, or page isn’t in the catalogue.',
  browseHref = '/releases',
  browseLabel = 'Browse releases',
}: NotFoundContentProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={browseHref}>{browseLabel}</Link>
        </Button>
      </div>
    </div>
  )
}

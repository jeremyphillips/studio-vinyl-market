import Link from 'next/link'

import {Button} from '@/components/ui/button'

type CatalogueEscapeLinksProps = {
  browseHref?: '/' | '/releases'
  browseLabel?: string
  homeVariant?: 'default' | 'outline'
}

export function CatalogueEscapeLinks({
  browseHref = '/releases',
  browseLabel = 'Browse releases',
  homeVariant = 'default',
}: CatalogueEscapeLinksProps) {
  return (
    <>
      <Button asChild variant={homeVariant}>
        <Link href="/">Back to home</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={browseHref}>{browseLabel}</Link>
      </Button>
    </>
  )
}

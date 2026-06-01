import type {NotFoundMessage} from './not-found-messages'

import {CatalogueEscapeLinks} from '@/components/errors/shared/catalogue-escape-links'
import {H1, P} from '@/components/ui/typography'


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
        <P size="body-sm" weight="medium" color="muted">404</P>
        <H1>{title}</H1>
        <P color="muted">{description}</P>
      </header>

      <div className="flex flex-wrap gap-3">
        <CatalogueEscapeLinks browseHref={browseHref} browseLabel={browseLabel} />
      </div>
    </div>
  )
}

type NotFoundViewProps = {
  message: NotFoundMessage
}

export function NotFoundView({message}: NotFoundViewProps) {
  return (
    <NotFoundContent
      title={message.title}
      description={message.description}
      browseHref={message.browseHref}
      browseLabel={message.browseLabel}
    />
  )
}

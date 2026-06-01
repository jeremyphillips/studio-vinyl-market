import {NotFoundContent} from './not-found-content'
import type {NotFoundMessage} from './not-found-messages'

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

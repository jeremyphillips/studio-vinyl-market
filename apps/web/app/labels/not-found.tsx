import type {Metadata} from 'next'

import {NotFoundView} from '@/components/errors/not-found-view'
import {notFoundMessages, notFoundMetadata} from '@/components/errors/not-found-messages'

const message = notFoundMessages.label

export const metadata: Metadata = notFoundMetadata(message)

export default function LabelNotFound() {
  return <NotFoundView message={message} />
}

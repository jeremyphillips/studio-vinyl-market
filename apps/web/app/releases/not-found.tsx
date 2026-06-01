import type {Metadata} from 'next'

import {NotFoundView} from '@/components/errors/not-found-view'
import {notFoundMessages, notFoundMetadata} from '@/components/errors/not-found-messages'

const message = notFoundMessages.release

export const metadata: Metadata = notFoundMetadata(message)

export default function ReleaseNotFound() {
  return <NotFoundView message={message} />
}

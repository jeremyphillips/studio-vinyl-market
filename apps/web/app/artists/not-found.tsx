import type {Metadata} from 'next'

import {NotFoundView} from '@/components/errors/not-found-view'
import {notFoundMessages, notFoundMetadata} from '@/components/errors/not-found-messages'

const message = notFoundMessages.artist

export const metadata: Metadata = notFoundMetadata(message)

export default function ArtistNotFound() {
  return <NotFoundView message={message} />
}

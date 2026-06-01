import type { Metadata } from 'next'

import { NotFoundView, notFoundMessages, notFoundMetadata } from '@/components/errors/not-found'

const message = notFoundMessages.artist

export const metadata: Metadata = notFoundMetadata(message)

export default function ArtistNotFound() {
  return <NotFoundView message={message} />
}

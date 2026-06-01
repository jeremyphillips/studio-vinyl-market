import type {Metadata} from 'next'

import {NotFoundView, notFoundMessages, notFoundMetadata} from '@/components/errors/not-found'

const message = notFoundMessages.release

export const metadata: Metadata = notFoundMetadata(message)

export default function ReleaseNotFound() {
  return <NotFoundView message={message} />
}

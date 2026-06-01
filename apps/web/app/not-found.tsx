import type { Metadata } from 'next'

import { NotFoundView, notFoundMessages, notFoundMetadata } from '@/components/errors/not-found'

const message = notFoundMessages.default

export const metadata: Metadata = notFoundMetadata(message)

export default function NotFound() {
  return <NotFoundView message={message} />
}

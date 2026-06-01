import type { Metadata } from 'next'

import { NotFoundView, notFoundMessages, notFoundMetadata } from '@/components/errors/not-found'

const message = notFoundMessages.label

export const metadata: Metadata = notFoundMetadata(message)

export default function LabelNotFound() {
  return <NotFoundView message={message} />
}

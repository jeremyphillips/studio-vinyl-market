import type { Metadata } from 'next'

import { NotFoundView, notFoundMessages, notFoundMetadata } from '@/components/errors/not-found'

const message = notFoundMessages.page

// fallow-ignore-next-line unused-export
export const metadata: Metadata = notFoundMetadata(message)

export default function CmsPageNotFound() {
  return <NotFoundView message={message} />
}

export type NotFoundMessage = {
  title: string
  description: string
  browseHref: '/' | '/releases'
  browseLabel: string
}

export const notFoundMessages = {
  release: {
    title: 'Release not found',
    description: 'This record isn’t in the catalogue, or it may have been removed.',
    browseHref: '/releases',
    browseLabel: 'Browse releases',
  },
  artist: {
    title: 'Artist not found',
    description: 'This artist isn’t in the catalogue.',
    browseHref: '/releases',
    browseLabel: 'Browse releases',
  },
  label: {
    title: 'Label not found',
    description: 'This label isn’t in the catalogue.',
    browseHref: '/releases',
    browseLabel: 'Browse releases',
  },
  page: {
    title: 'Page not found',
    description: 'This page doesn’t exist or hasn’t been published.',
    browseHref: '/releases',
    browseLabel: 'Browse releases',
  },
  default: {
    title: 'Page not found',
    description: 'That record, artist, or page isn’t in the catalogue.',
    browseHref: '/releases',
    browseLabel: 'Browse releases',
  },
} as const satisfies Record<string, NotFoundMessage>

export function notFoundMetadata(message: NotFoundMessage) {
  return {
    title: message.title,
    robots: { index: false, follow: true },
  } as const
}

import type { Meta, StoryObj } from '@storybook/react'

import { ReleaseCard } from './release-card.client'
import type { ReleaseData } from './release-card.client'

const meta: Meta<typeof ReleaseCard> = {
  title: 'Catalog/ReleaseCard',
  component: ReleaseCard,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ReleaseCard>

const baseRelease: ReleaseData = {
  releaseName: 'Kind of Blue',
  slug: 'kind-of-blue',
  format: 'LP',
  releaseDate: '1959-08-17',
  artist: { name: 'Miles Davis', slug: 'miles-davis' },
}

export const WithCover: Story = {
  args: {
    release: {
      ...baseRelease,
      cover: {
        asset: { _type: 'reference', _ref: 'image-abc123-400x400-jpg' },
        alt: 'Kind of Blue album cover',
      },
    },
  },
}

export const NoCover: Story = {
  args: {
    release: baseRelease,
  },
}

export const NoArtist: Story = {
  args: {
    release: {
      ...baseRelease,
      artist: null,
      cover: {
        asset: { _type: 'reference', _ref: 'image-abc123-400x400-jpg' },
        alt: 'Album cover',
      },
    },
  },
}

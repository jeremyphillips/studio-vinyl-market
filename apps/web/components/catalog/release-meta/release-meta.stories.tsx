import type { Meta, StoryObj } from '@storybook/react'

import { ReleaseMeta } from './release-meta'

const meta: Meta<typeof ReleaseMeta> = {
  title: 'Catalog/ReleaseMeta',
  component: ReleaseMeta,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ReleaseMeta>

export const FullData: Story = {
  args: {
    mediaType: 'vinyl',
    classification: 'LP',
    size: '12"',
    speed: '33',
    channels: 'stereo',
    descriptions: ['reissue'],
    releaseYear: 1969,
    dateUnknown: false,
    label: { name: 'Blue Note', slug: 'blue-note' },
    noLabel: false,
  },
}

export const NoLabel: Story = {
  args: {
    mediaType: 'vinyl',
    classification: 'LP',
    size: '12"',
    speed: '33',
    channels: 'stereo',
    descriptions: ['reissue'],
    releaseYear: 1969,
    label: null,
    noLabel: true,
  },
}

export const DateUnknown: Story = {
  args: {
    mediaType: 'vinyl',
    classification: 'Single',
    size: '7"',
    speed: '45',
    channels: 'mono',
    releaseYear: null,
    dateUnknown: true,
    label: { name: 'Parlophone', slug: 'parlophone' },
    noLabel: false,
  },
}

export const NoDescriptions: Story = {
  args: {
    mediaType: 'cd',
    classification: 'EP',
    descriptions: null,
    releaseYear: 2001,
    dateUnknown: false,
    label: { name: 'Warp Records', slug: 'warp-records' },
    noLabel: false,
  },
}

import type { Meta, StoryObj } from '@storybook/react'

import type { ReleaseData } from '@/components/catalog/release-card/release-card.client'

import { ReleaseGrid } from './release-grid'

const meta: Meta<typeof ReleaseGrid> = {
  title: 'Catalog/ReleaseGrid',
  component: ReleaseGrid,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ReleaseGrid>

const releases: Array<ReleaseData & { _id: string }> = [
  {
    _id: '1',
    releaseName: 'Kind of Blue',
    slug: 'kind-of-blue',
    classification: 'LP',
    releaseYear: 1959,
    artist: { name: 'Miles Davis', slug: 'miles-davis' },
  },
  {
    _id: '2',
    releaseName: 'Time Out',
    slug: 'time-out',
    classification: 'LP',
    releaseYear: 1959,
    artist: { name: 'Dave Brubeck Quartet', slug: 'dave-brubeck-quartet' },
  },
  {
    _id: '3',
    releaseName: 'A Love Supreme',
    slug: 'a-love-supreme',
    classification: 'LP',
    releaseYear: 1964,
    artist: { name: 'John Coltrane', slug: 'john-coltrane' },
  },
  {
    _id: '4',
    releaseName: 'Mingus Ah Um',
    slug: 'mingus-ah-um',
    classification: 'LP',
    releaseYear: 1959,
    artist: { name: 'Charles Mingus', slug: 'charles-mingus' },
  },
]

export const Default: Story = {
  args: { releases },
}

export const Empty: Story = {
  args: { releases: [] },
}

export const CustomEmptyMessage: Story = {
  args: {
    releases: [],
    emptyMessage: 'No releases published yet.',
  },
}

export const WithPriorityRow: Story = {
  name: 'Priority count 4 (homepage)',
  args: {
    releases,
    priorityCount: 4,
  },
}

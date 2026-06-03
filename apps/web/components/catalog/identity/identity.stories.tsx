import type { Meta, StoryObj } from '@storybook/react'

import { Identity } from './identity'

const meta: Meta<typeof Identity> = {
  title: 'Catalog/Identity',
  component: Identity,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Identity>

const cover = {
  asset: { _type: 'reference' as const, _ref: 'image-abc123-400x400-jpg' },
  alt: 'Cover',
}

export const Artist: Story = {
  args: {
    eyebrow: 'Artist',
    name: 'Miles Davis',
    cover,
    coverAlt: 'Miles Davis photo',
    releaseCount: 12,
    locations: [{ city: 'Alton', state: 'Illinois', country: 'United States' }],
  },
}

export const Label: Story = {
  args: {
    eyebrow: 'Label',
    name: 'Blue Note',
    cover,
    coverAlt: 'Blue Note logo',
    releaseCount: 1,
    locations: [{ city: 'New York City', state: 'New York', country: 'United States' }],
  },
}

export const NoCover: Story = {
  args: {
    eyebrow: 'Artist',
    name: 'Unknown Artist',
    coverAlt: 'Unknown Artist photo',
    releaseCount: 0,
    locations: null,
  },
}

export const MultipleLocations: Story = {
  args: {
    eyebrow: 'Artist',
    name: 'Kraftwerk',
    cover,
    coverAlt: 'Kraftwerk photo',
    releaseCount: 9,
    locations: [
      { city: 'Düsseldorf', state: null, country: 'Germany' },
      { city: null, state: null, country: 'West Germany' },
    ],
  },
}

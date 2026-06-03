import type { Meta, StoryObj } from '@storybook/react'

import { LocationList } from './location-list'

const meta: Meta<typeof LocationList> = {
  title: 'Catalog/LocationList',
  component: LocationList,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof LocationList>

export const Multiple: Story = {
  args: {
    locations: [
      { city: 'London', state: 'England', country: 'United Kingdom' },
      { city: 'Berlin', state: null, country: 'Germany' },
    ],
  },
}

export const Single: Story = {
  args: {
    locations: [{ city: 'New York', state: 'NY', country: 'United States' }],
  },
}

export const PartialFields: Story = {
  args: {
    locations: [
      { city: null, state: null, country: 'Japan' },
      { city: 'Manchester', state: null, country: null },
    ],
  },
}

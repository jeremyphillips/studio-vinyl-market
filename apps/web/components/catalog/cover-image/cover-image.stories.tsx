import type { Meta, StoryObj } from '@storybook/react'

import { CoverImage } from './cover-image'

const meta: Meta<typeof CoverImage> = {
  title: 'Catalog/CoverImage',
  component: CoverImage,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof CoverImage>

export const WithImage: Story = {
  args: {
    source: {
      asset: { _type: 'reference', _ref: 'image-abc123-480x480-jpg' },
      alt: 'Kind of Blue album cover',
    },
  },
}

export const NoSource: Story = {
  args: {
    source: { asset: null },
  },
}

export const CustomSize: Story = {
  args: {
    source: {
      asset: { _type: 'reference', _ref: 'image-abc123-240x240-jpg' },
      alt: 'Small cover',
    },
    size: 120,
  },
}

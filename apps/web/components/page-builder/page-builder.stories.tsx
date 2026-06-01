import type {Meta, StoryObj} from '@storybook/react'

import {PageBuilder} from './page-builder'

const meta: Meta<typeof PageBuilder> = {
  title: 'PageBuilder/PageBuilder',
  component: PageBuilder,
  parameters: {layout: 'padded'},
}

export default meta
type Story = StoryObj<typeof PageBuilder>

const buttonBlock = {
  _type: 'buttonBlock' as const,
  asset: null,
  hotspot: null,
  crop: null,
  alt: null,
  caption: null,
}

const imageBlock = {
  _type: 'imageWithAlt' as const,
  label: null,
  variant: null,
  size: null,
  linkType: null,
  externalUrl: null,
  internalLink: null,
}

export const WithButtonBlock: Story = {
  args: {
    blocks: [
      {
        ...buttonBlock,
        _key: 'btn-1',
        label: 'Browse Releases',
        variant: 'default',
        size: 'default',
        linkType: 'internal',
        externalUrl: null,
        internalLink: {_type: 'releasesPage', slug: null},
      },
    ],
  },
}

export const WithExternalButton: Story = {
  args: {
    blocks: [
      {
        ...buttonBlock,
        _key: 'btn-ext',
        label: 'Visit Discogs',
        variant: 'outline',
        size: 'default',
        linkType: 'external',
        externalUrl: 'https://www.discogs.com',
        internalLink: null,
      },
    ],
  },
}

export const WithImageBlock: Story = {
  args: {
    blocks: [
      {
        ...imageBlock,
        _key: 'img-1',
        asset: {_type: 'reference', _ref: 'image-abc123-1200x675-jpg'},
        hotspot: null,
        crop: null,
        alt: 'A vinyl record store',
        caption: 'Inside the shop',
      },
    ],
  },
}

export const Mixed: Story = {
  args: {
    blocks: [
      {
        ...imageBlock,
        _key: 'img-2',
        asset: {_type: 'reference', _ref: 'image-abc123-1200x675-jpg'},
        hotspot: null,
        crop: null,
        alt: 'Hero image',
        caption: null,
      },
      {
        ...buttonBlock,
        _key: 'btn-2',
        label: 'Shop Now',
        variant: 'default',
        size: 'lg',
        linkType: 'internal',
        externalUrl: null,
        internalLink: {_type: 'releasesPage', slug: null},
      },
    ],
  },
}

export const Empty: Story = {
  args: {blocks: []},
}

import type { Meta, StoryObj } from '@storybook/react'


import { HeaderNav } from './header-nav.client'
import type { HeaderNavLink } from './header-nav.client'

import { SLUG_PATH_BY_TYPE } from '@/lib/routes'

const meta: Meta<typeof HeaderNav> = {
  title: 'Layout/HeaderNav',
  component: HeaderNav,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof HeaderNav>

const internalLinks: HeaderNavLink[] = [
  { key: 'releases', label: 'Releases', href: SLUG_PATH_BY_TYPE.release, isExternal: false },
  { key: 'artists', label: 'Artists', href: SLUG_PATH_BY_TYPE.artist, isExternal: false },
  { key: 'labels', label: 'Labels', href: SLUG_PATH_BY_TYPE.label, isExternal: false },
]

export const Default: Story = {
  args: {
    links: [
      ...internalLinks,
      { key: 'discogs', label: 'Discogs', href: 'https://discogs.com', isExternal: true },
    ],
  },
}

export const InternalOnly: Story = {
  args: { links: internalLinks },
}

export const SingleLink: Story = {
  args: {
    links: [{ key: 'home', label: 'Home', href: '/', isExternal: false }],
  },
}

export const Empty: Story = {
  args: { links: [] },
}

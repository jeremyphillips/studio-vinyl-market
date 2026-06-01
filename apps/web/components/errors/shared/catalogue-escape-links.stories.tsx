import type {Meta, StoryObj} from '@storybook/react'

import {CatalogueEscapeLinks} from './catalogue-escape-links'

const meta: Meta<typeof CatalogueEscapeLinks> = {
  title: 'Errors/CatalogueEscapeLinks',
  component: CatalogueEscapeLinks,
  parameters: {layout: 'centered'},
}

export default meta
type Story = StoryObj<typeof CatalogueEscapeLinks>

export const Default: Story = {}

export const HomeAsOutline: Story = {
  args: {homeVariant: 'outline'},
}

export const CustomBrowseLabel: Story = {
  args: {
    browseHref: '/releases',
    browseLabel: 'Browse the catalogue',
  },
}

import type {Meta, StoryObj} from '@storybook/react'

import {NotFoundContent} from './not-found-content'
import {notFoundMessages} from './not-found-messages'

const meta: Meta<typeof NotFoundContent> = {
  title: 'Errors/NotFoundContent',
  component: NotFoundContent,
  parameters: {layout: 'padded'},
}

export default meta
type Story = StoryObj<typeof NotFoundContent>

export const Release: Story = {
  args: notFoundMessages.release,
}

export const Artist: Story = {
  args: notFoundMessages.artist,
}

export const Label: Story = {
  args: notFoundMessages.label,
}

export const Page: Story = {
  args: notFoundMessages.page,
}

export const Custom: Story = {
  args: {
    title: 'Nothing here',
    description: 'This content has moved or no longer exists.',
    browseHref: '/',
    browseLabel: 'Go home',
  },
}

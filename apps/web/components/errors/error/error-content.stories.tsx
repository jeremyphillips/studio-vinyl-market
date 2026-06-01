import type {Meta, StoryObj} from '@storybook/react'
import {fn} from 'storybook/test'

import {ErrorContent} from './error-content'

const meta: Meta<typeof ErrorContent> = {
  title: 'Errors/ErrorContent',
  component: ErrorContent,
  parameters: {layout: 'padded'},
  args: {reset: fn()},
}

export default meta
type Story = StoryObj<typeof ErrorContent>

export const Default: Story = {
  args: {
    error: new Error('An unexpected error occurred.'),
  },
}

export const WithCustomTitle: Story = {
  args: {
    error: new Error('Failed to fetch release data.'),
    title: 'Could not load release',
    description: 'There was a problem fetching this release. Please try again.',
  },
}

export const WithDigest: Story = {
  args: {
    error: Object.assign(new Error('Internal server error'), {digest: 'abc123xyz'}),
    title: 'Server error',
  },
}

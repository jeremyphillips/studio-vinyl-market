import type {Meta, StoryObj} from '@storybook/react'

import {DiscogsMeta} from './discogs-meta'

const meta: Meta<typeof DiscogsMeta> = {
  title: 'Preview/DiscogsMeta',
  component: DiscogsMeta,
  parameters: {layout: 'padded'},
}

export default meta
type Story = StoryObj<typeof DiscogsMeta>

export const BothIds: Story = {
  args: {releaseId: 249504, masterId: 10362},
}

export const ReleaseOnly: Story = {
  args: {releaseId: 249504, masterId: null},
}

export const MasterOnly: Story = {
  args: {releaseId: undefined, masterId: 10362},
}

export const NoIds: Story = {
  args: {releaseId: undefined, masterId: undefined},
}

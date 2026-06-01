import type { Meta, StoryObj } from '@storybook/react'

import { DisableDraftMode } from './disable-draft-mode.client'

import { P } from '@/components/ui/typography'


const meta: Meta<typeof DisableDraftMode> = {
  title: 'Preview/DisableDraftMode',
  component: DisableDraftMode,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof DisableDraftMode>

/** Default: mock returns false → "Exit preview" button is visible. */
export const Visible: Story = {}

/**
 * When inside the Presentation Tool, `useIsPresentationTool` returns true and
 * the component renders nothing. The render below simulates that null output.
 */
export const HiddenInPresentation: Story = {
  render: () => (
    <P size="body-sm" color="muted" className="p-4">
      (Component renders null — hidden when inside the Presentation Tool)
    </P>
  ),
}

import type {Meta, StoryObj} from '@storybook/react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from './index'
import {Button} from '@/components/ui/button'
import {P} from '@/components/ui/typography'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {layout: 'centered'},
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A brief description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <P size="body-sm" color="muted">
          Card body content goes here. This can contain any elements.
        </P>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Confirm</Button>
        <Button size="sm" variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card>
      <CardContent>
        <P size="body-sm">A minimal card with only content.</P>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <P size="body-sm" color="muted">You are on the free plan.</P>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
}

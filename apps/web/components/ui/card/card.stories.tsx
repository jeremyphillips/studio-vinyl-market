import type {Meta, StoryObj} from '@storybook/react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from './index'
import {Button} from '@/components/ui/button'

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
        <p className="text-sm text-muted-foreground">
          Card body content goes here. This can contain any elements.
        </p>
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
        <p className="text-sm">A minimal card with only content.</p>
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
        <p className="text-sm text-muted-foreground">You are on the free plan.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
}

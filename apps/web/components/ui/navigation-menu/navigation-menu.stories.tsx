import type { Meta, StoryObj } from '@storybook/react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu.client'
import { navigationMenuTriggerStyle } from './navigation-menu.variants'

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>Releases</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-48 gap-1 p-2">
              <li>
                <NavigationMenuLink className="hover:bg-accent block rounded-sm px-3 py-2 text-sm">
                  Artists
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className="hover:bg-accent block rounded-sm px-3 py-2 text-sm">
                  Labels
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>About ↗</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const SimpleLinks: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        {['Home', 'Releases', 'Artists', 'Labels'].map((label) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

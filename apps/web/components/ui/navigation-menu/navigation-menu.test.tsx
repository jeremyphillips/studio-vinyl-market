import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {axe} from 'vitest-axe'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './navigation-menu.client'

function BasicNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/catalogue">Catalogue</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/artists">Artists</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe('NavigationMenu', () => {
  it('renders a navigation landmark', () => {
    render(<BasicNav />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<BasicNav />)

    expect(screen.getByRole('link', {name: 'Catalogue'})).toHaveAttribute('href', '/catalogue')
    expect(screen.getByRole('link', {name: 'Artists'})).toHaveAttribute('href', '/artists')
  })

  it('nav links are keyboard-focusable', () => {
    render(<BasicNav />)

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('has no accessibility violations', async () => {
    const {container} = render(<BasicNav />)

    expect(await axe(container)).toHaveNoViolations()
  })
})

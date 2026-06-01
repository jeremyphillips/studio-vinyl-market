'use client'

import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export type HeaderNavLink = {
  key: string
  label: string
  href: string
  isExternal: boolean
}

type HeaderNavProps = {
  links: HeaderNavLink[]
}

export function HeaderNav({ links }: HeaderNavProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.key}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              {link.isExternal ? (
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <span aria-hidden> ↗</span>
                </a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

import Link from 'next/link'

import { DarkModeToggle } from '@/components/layout/dark-mode-toggle'
import { HeaderNav } from '@/components/layout/header-nav/header-nav.client'
import { P } from '@/components/ui/typography'
import { resolveNavLink, type NavLink } from '@/lib/resolve-link'
import { sanityFetch } from '@/sanity/live'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries'

type HeaderProps = {
  initialIsDark: boolean
}

export async function Header({ initialIsDark }: HeaderProps) {
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY })

  const title = settings?.title ?? 'Vinyl Market'
  const navigation = settings?.navigation ?? []
  const links = navigation.map(resolveNavLink).filter((link): link is NavLink => link !== null)

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight hover:underline">
          {title}
        </Link>

        <div className="flex items-center gap-4">
          {links.length > 0 ? (
            <HeaderNav links={links} />
          ) : (
            <P size="body-sm" color="muted">
              Add navigation in <span className="font-mono">Site settings</span> in the Studio.
            </P>
          )}
          <DarkModeToggle initialIsDark={initialIsDark} />
        </div>
      </div>
    </header>
  )
}

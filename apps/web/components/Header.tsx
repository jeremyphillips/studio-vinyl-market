import Link from 'next/link'

import {HeaderNav} from '@/components/HeaderNav'
import {sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import type {SITE_SETTINGS_QUERY_RESULT} from '@/sanity/types'

type NavLink = {
  key: string
  label: string
  href: string
  isExternal: boolean
}

const INTERNAL_PATH_BY_TYPE: Record<'release' | 'artist' | 'label', string> = {
  release: '/releases',
  artist: '/artists',
  label: '/labels',
}

const FIXED_INTERNAL_HREF = {
  releasesPage: '/releases',
} as const

type NavItem = Extract<
  SITE_SETTINGS_QUERY_RESULT,
  {navigation: ReadonlyArray<unknown>}
>['navigation'][number]

function resolveNavLink(item: NavItem): NavLink | null {
  if (!item || !item.label) return null

  if (item.linkType === 'external') {
    if (!item.externalUrl) return null
    return {
      key: item._key,
      label: item.label,
      href: item.externalUrl,
      isExternal: true,
    }
  }

  const internal = item.internal
  if (!internal?._type) return null

  if (internal._type === 'releasesPage') {
    return {
      key: item._key,
      label: item.label,
      href: FIXED_INTERNAL_HREF.releasesPage,
      isExternal: false,
    }
  }

  if (!internal.slug) return null
  const base = INTERNAL_PATH_BY_TYPE[internal._type]
  if (!base) return null

  return {
    key: item._key,
    label: item.label,
    href: `${base}/${internal.slug}`,
    isExternal: false,
  }
}

export async function Header() {
  const {data: settings} = await sanityFetch({query: SITE_SETTINGS_QUERY})

  const title = settings?.title ?? 'Vinyl Market'
  const navigation = settings?.navigation ?? []
  const links = navigation
    .map(resolveNavLink)
    .filter((link): link is NavLink => link !== null)

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:underline"
        >
          {title}
        </Link>

        {links.length > 0 ? (
          <HeaderNav links={links} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Add navigation in{' '}
            <span className="font-mono">Site settings</span> in the Studio.
          </p>
        )}
      </div>
    </header>
  )
}

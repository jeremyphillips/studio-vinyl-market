import { FIXED_PATH_BY_TYPE, SLUG_PATH_BY_TYPE } from '@/lib/routes'

type InternalLink = { _type: string; slug: string | null } | null

/**
 * Core CMS link resolver. Returns `{ href, isExternal }` or `null` when the
 * link cannot be resolved (missing URL, unset reference, unknown type).
 */
export function resolveLink(
  linkType: string | null | undefined,
  externalUrl: string | null | undefined,
  internalLink: InternalLink,
): { href: string; isExternal: boolean } | null {
  if (linkType === 'external') {
    if (!externalUrl) return null
    return { href: externalUrl, isExternal: true }
  }

  if (!internalLink?._type) return null

  if (internalLink._type === 'releasesPage') {
    return { href: FIXED_PATH_BY_TYPE.releasesPage, isExternal: false }
  }

  const base = SLUG_PATH_BY_TYPE[internalLink._type as keyof typeof SLUG_PATH_BY_TYPE]
  if (!base || !internalLink.slug) return null
  return { href: `${base}/${internalLink.slug}`, isExternal: false }
}

export type NavLink = {
  key: string
  label: string
  href: string
  isExternal: boolean
}

type NavItem = {
  _key: string
  label: string
  linkType: string
  externalUrl: string | null
  internal: InternalLink
}

/**
 * Resolves a navigation item from CMS settings into a typed NavLink.
 * Returns `null` for items that have no resolvable destination.
 */
export function resolveNavLink(item: NavItem): NavLink | null {
  if (!item?.label) return null
  const resolved = resolveLink(item.linkType, item.externalUrl, item.internal)
  if (!resolved) return null
  return { key: item._key, label: item.label, ...resolved }
}

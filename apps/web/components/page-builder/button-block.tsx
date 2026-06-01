import Link from 'next/link'

import {Button} from '@/components/ui/button'
import {FIXED_PATH_BY_TYPE, SLUG_PATH_BY_TYPE} from '@/lib/routes'
import type {PAGE_QUERY_RESULT} from '@/sanity/types'

type PageBuilderBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>
type ButtonBlockData = Extract<PageBuilderBlocks[number], {_type: 'buttonBlock'}>

function resolveHref(
  linkType: ButtonBlockData['linkType'],
  externalUrl: ButtonBlockData['externalUrl'],
  internalLink: ButtonBlockData['internalLink'],
): {href: string; isExternal: boolean} | null {
  if (linkType === 'external') {
    if (!externalUrl) return null
    return {href: externalUrl, isExternal: true}
  }

  if (!internalLink?._type) return null

  if (internalLink._type === 'releasesPage') {
    return {href: FIXED_PATH_BY_TYPE.releasesPage, isExternal: false}
  }

  const base = SLUG_PATH_BY_TYPE[internalLink._type as keyof typeof SLUG_PATH_BY_TYPE]
  if (!base || !internalLink.slug) return null
  return {href: `${base}/${internalLink.slug}`, isExternal: false}
}

type ButtonBlockProps = Pick<
  ButtonBlockData,
  'label' | 'variant' | 'size' | 'linkType' | 'externalUrl' | 'internalLink'
>

export function ButtonBlock({
  label,
  variant,
  size,
  linkType,
  externalUrl,
  internalLink,
}: ButtonBlockProps) {
  const text = label?.trim() || 'Button'
  const resolved = resolveHref(linkType, externalUrl, internalLink)

  if (!resolved) {
    return (
      <Button variant={variant ?? 'default'} size={size ?? 'default'} disabled>
        {text}
      </Button>
    )
  }

  if (resolved.isExternal) {
    return (
      <Button variant={variant ?? 'default'} size={size ?? 'default'} asChild>
        <a href={resolved.href} target="_blank" rel="noreferrer">
          {text}
        </a>
      </Button>
    )
  }

  return (
    <Button variant={variant ?? 'default'} size={size ?? 'default'} asChild>
      <Link href={resolved.href}>{text}</Link>
    </Button>
  )
}

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { resolveLink } from '@/lib/resolve-link'
import type { PAGE_QUERY_RESULT } from '@/sanity/types.generated'

type PageBuilderBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>
type ButtonBlockData = Extract<PageBuilderBlocks[number], { _type: 'buttonBlock' }>

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
  const resolved = resolveLink(linkType, externalUrl, internalLink)

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

import Image from 'next/image'

import {urlFor} from '@/sanity/image'
import type {PAGE_QUERY_RESULT} from '@/sanity/types'

type PageBuilderBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>
type ImageBlockData = Extract<PageBuilderBlocks[number], {_type: 'imageWithAlt'}>

type ImageBlockProps = Pick<ImageBlockData, 'asset' | 'hotspot' | 'crop' | 'alt' | 'caption'>

export function ImageBlock({asset, hotspot, crop, alt, caption}: ImageBlockProps) {
  if (!asset?._ref) return null

  const url = urlFor({asset, hotspot, crop}).width(1200).url()

  return (
    <figure className="space-y-2">
      <Image
        src={url}
        alt={alt ?? ''}
        width={1200}
        height={675}
        sizes="(min-width: 1200px) 1200px, 100vw"
        className="h-auto w-full rounded-md object-cover"
      />
      {caption ? (
        <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
